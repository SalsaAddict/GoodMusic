/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

declare let FB: any, YT: any;

module GoodMusic {
    "option strict";
    export const debugEnabled: boolean = true;
    export const fbAppId: string = "1574477942882037";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IHttpSuccess { data: IDatabaseResponse }
    export interface IHttpError { status: number; statusText: string; }
    export interface IDatabaseParameter { value: any; isObject?: boolean; }
    export interface IDatabaseParameters { [name: string]: IDatabaseParameter; userId?: IDatabaseParameter; }
    export interface IDatabaseProcedure { name: string; parameters?: IDatabaseParameters; }
    export interface IDatabaseResponse { success: boolean; data: any; }
    export interface IFacebookAuthResponse {
        status: "connected" | "not_authorized" | "unknown";
        authResponse: {
            accessToken: string;
            expiresIn: string;
            signedRequest: string;
            userID: string;
        }
    }
    export interface IFacebookUser { id: string; first_name: string; last_name: string; gender: "male" | "female"; }
    export interface IUser { id: string; name?: string; }
    export interface IRootScope extends angular.IScope {
        $user: IUser;
        $authenticated: boolean;
        $login: Function;
        $logout: Function;
        $playlist: string;
        $videos: IVideo[];
        $current: number;
    }
    export interface IVideo { videoId: string; title: string; genre: string; }
    export class Service {
        static $inject: string[] = ["$rootScope", "$q", "$http", "$route", "$log"];
        constructor(
            private $rootScope: IRootScope,
            private $q: angular.IQService,
            private $http: angular.IHttpService,
            private $route: angular.route.IRouteService,
            private $log: angular.ILogService) {
            $log.debug("gm:service:init");
        }
        public $execute(name: string, parameters: IDatabaseParameters = {}): angular.IPromise<IDatabaseResponse> {
            let procedure: IDatabaseProcedure = { name: name, parameters: parameters },
                deferred: angular.IDeferred<IDatabaseResponse> = this.$q.defer();
            if (this.$rootScope.$user) { parameters.userId = { value: this.$rootScope.$user.id || null } }
            try {
                this.$http.post("execute.ashx", procedure).then(
                    (response: IHttpSuccess) => {
                        deferred.resolve(response.data);
                        if (!response.data.success) { this.$log.error(response.data.data); }
                        this.$log.debug("gm:execute", procedure.name, {
                            request: procedure,
                            response: response.data.data
                        });
                    },
                    (response: IHttpError) => {
                        deferred.resolve({ success: false, data: response.statusText });
                        this.$log.error(response.status, response.statusText);
                    });
            }
            catch (ex) {
                deferred.resolve({ success: false, data: ex });
                this.$log.error(ex.message);
            }
            return deferred.promise;
        }
        public $deauthenticate(reason?: string): void {
            delete this.$rootScope.$user;
            this.$log.debug("gm:authenticate:false", reason);
            this.$route.reload();
        }
        public $fbAuthResponseChange: Function = (response: IFacebookAuthResponse): void => {
            this.$log.debug("gm:fb:authResponseChange", response);
            try {
                if (response.status === "connected") {
                    FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, (response: IFacebookUser) => {
                        this.$rootScope.$user = { id: response.id };
                        this.$execute("apiLogin", {
                            forename: { value: response.first_name },
                            surname: { value: response.last_name },
                            gender: { value: response.gender }
                        }).then((response: IDatabaseResponse) => {
                            if (response.success) {
                                this.$rootScope.$user = { id: response.data.id, name: response.data.name };
                                this.$log.debug("gm:authenticate:true", this.$rootScope.$user);
                                this.$route.reload();
                            } else { this.$deauthenticate(); }
                        });
                    });
                } else this.$deauthenticate(response.status);
            }
            catch (ex) { this.$deauthenticate(ex.message); }
        }
        public $login: Function = this.$rootScope.$login = ($event: angular.IAngularEvent): void => {
            $event.preventDefault();
            $event.stopPropagation();
            try { FB.login(angular.noop); }
            catch (ex) { this.$deauthenticate(ex.message); }
        }
        public $logout: Function = this.$rootScope.$logout = ($event: angular.IAngularEvent): void => {
            $event.preventDefault();
            $event.stopPropagation();
            try { FB.logout(angular.noop); }
            catch (ex) { this.$deauthenticate(ex.message); }
        }
    }
}

module GoodMusic {
    "option strict";
    export module Menu {
        interface IScope extends IRootScope { }
        export class Controller {
            static $inject: string[] = ["$scope", "$route"];
            constructor(
                private $scope: IScope,
                private $route: angular.route.IRouteService) {
                $scope.$on("$routeChangeSuccess", () => {
                    this.collapsed = true;
                });
            }
            public get title(): string {
                let defaultTitle: string = "Good Music";
                if (!this.$route.current) { return defaultTitle; }
                switch (this.$route.current.name) {
                    case "videos": return this.$scope.$playlist || "All Genres";
                    default: return defaultTitle;
                }
            }
            public collapsed: boolean = true;
            public toggle(): void { this.collapsed = !this.collapsed; }
        }
    }
    export module Search {
        interface IPopularity { id: string; description: string; }
        interface IStyle { id: string; uri: string; name: string; count: string; }
        interface IGenre { id: string; uri: string; name: string; count: string; styles: IStyle[]; expanded: boolean; }
        export class Controller {
            static $inject: string[] = ["$rootScope", "$gm"];
            constructor(
                private $rootScope: IRootScope,
                private $gm: Service) {
                this.fetchGenres().then((genres: IGenre[]) => { this.expand(genres[0]); });
            }
            public periods: IPopularity[] = [
                { id: "weekly", description: "Week" },
                { id: "monthly", description: "Month" },
                { id: "yearly", description: "Year" },
                { id: "all", description: "Ever" }
            ];
            public period: string = this.periods[0].id;
            public genres: IGenre[];
            public expand(genre: IGenre) {
                this.genres.forEach(function (item: IGenre) { item.expanded = false; });
                genre.expanded = true;
            }
            public fetchGenres(): angular.IPromise<IGenre[]> {
                return this.$gm.$execute("apiSearch").then((response: IDatabaseResponse) => {
                    this.genres = response.data.genres;
                    this.genres[0].expanded = true;
                    return this.genres;
                }, angular.noop);
            }
        }
    }
    export module Videos {
        interface IRouteParams extends angular.route.IRouteParamsService {
            period: string;
            genreUri: string;
            styleUri: string;
        }
        export class Controller {
            static $inject: string[] = ["$rootScope", "$routeParams", "$gm", "$anchorScroll"];
            constructor(
                private $rootScope: IRootScope,
                private $routeParams: IRouteParams,
                private $gm: Service,
                public $anchorScroll: angular.IAnchorScrollService) {
                this.fetchVideos();
            }
            public page: number = 1;
            public pageSize: number = 10;
            public get period(): string { return this.$routeParams.period || "week"; }
            public get genreUri(): string { return this.$routeParams.genreUri || null; }
            public get styleUri(): string { return this.$routeParams.styleUri || null; }
            public fetchVideos(): void {
                this.$gm.$execute("apiVideos", {
                    period: { value: this.period },
                    genreUri: { value: this.genreUri },
                    styleUri: { value: this.styleUri }
                }).then((response: IDatabaseResponse) => {
                    this.$rootScope.$playlist = response.data.playlist;
                    this.$rootScope.$videos = response.data.videos;
                }, angular.noop);
                let x: number = 1;
            }
        }
    }
}

let gm: angular.IModule = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);

gm.service("$gm", GoodMusic.Service);
gm.controller("menuController", GoodMusic.Menu.Controller);

gm.config(["$logProvider", "$routeProvider", function (
    $logProvider: angular.ILogProvider,
    $routeProvider: angular.route.IRouteProvider) {
    $logProvider.debugEnabled(GoodMusic.debugEnabled);
    $routeProvider
        .when("/home", { name: "home", templateUrl: "Views/home.html" })
        .when("/search", {
            name: "search",
            templateUrl: "Views/search.html",
            controller: GoodMusic.Search.Controller,
            controllerAs: "$ctrl"
        })
        .when("/videos/:period/:genreUri/:styleUri?", {
            name: "videos",
            templateUrl: "Views/videos.html",
            controller: GoodMusic.Videos.Controller,
            controllerAs: "$ctrl"
        })
        .otherwise({ redirectTo: "/home" })
        .caseInsensitiveMatch = true;
}]);

gm.run(["$log", "$window", "$rootScope", "$gm", function (
    $log: angular.ILogService,
    $window: GoodMusic.IWindowService,
    $rootScope: GoodMusic.IRootScope,
    $gm: GoodMusic.Service) {
    $window.fbAsyncInit = function () {
        FB.init({ appId: GoodMusic.fbAppId, cookie: true, status: true, version: "v2.8" });
        FB.Event.subscribe('auth.authResponseChange', $gm.$fbAuthResponseChange);
        $log.debug("gm:fbAsyncInit");
    };
    $rootScope.$authenticated = false;
    $log.debug("gm:run");
}]);