/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

declare let FB: any, YT: any;

module GoodMusic {
    "option strict";
    export const debugEnabled: boolean = true;
    export const fbAppId: string = "1574477942882037";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    export interface IVideo { videoId: string; title: string; genre: string; }
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IRootScope extends angular.IScope {
        $authenticated: boolean;
        $username: string;
        $login: Function;
        $logout: Function;
        $playlist: string;
        $videos: IVideo[];
        $current: number;
    }
    export interface IResponse { success: boolean; data: any; }
    export module Database {
        export var userId: string;
        export interface IParameter { value: any; isObject?: boolean; }
        export interface IParameters { [name: string]: IParameter; userId?: IParameter; }
        export interface IProcedure { name: string; parameters?: IParameters; }
        interface IHttpSuccess { data: IResponse }
        interface IHttpError { status: number; statusText: string; }
        export class Service {
            static $inject: string[] = ["$q", "$http", "$log"];
            constructor(
                private $q: angular.IQService,
                private $http: angular.IHttpService,
                private $log: angular.ILogService) {
                $log.debug("gm:database:init");
            }
            public userId: string;
            public execute(name: string, parameters: IParameters = {}): angular.IPromise<IResponse> {
                let procedure: IProcedure = { name: name, parameters: parameters },
                    deferred: angular.IDeferred<IResponse> = this.$q.defer();
                parameters.userId = { value: this.userId || null };
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
        }
    }
    export module Facebook {
        interface IAuthResponse {
            status: "connected" | "not_authorized" | "unknown";
            authResponse: {
                accessToken: string;
                expiresIn: string;
                signedRequest: string;
                userID: string;
            }
        }
        interface IUser { id: string; first_name: string; last_name: string; gender: "male" | "female"; }
        export class Service {
            static $inject: string[] = ["$rootScope", "$route", "$database", "$log"];
            constructor(
                private $rootScope: IRootScope,
                private $route: angular.route.IRouteService,
                private $database: Database.Service,
                private $log: angular.ILogService) {
                $log.debug("gm:facebook:init");
            }
            public login: Function = this.$rootScope.$login = ($event: angular.IAngularEvent): void => {
                $event.preventDefault();
                $event.stopPropagation();
                let fail: Function = (): void => {
                    delete this.$database.userId;
                    this.$rootScope.$authenticated = false;
                    delete this.$rootScope.$username;
                    this.$log.debug("gm:login:error");
                }
                try {
                    FB.login((response: IAuthResponse) => {
                        this.$log.debug("gm:fb:authResponse", response);
                        if (response.status === "connected") {
                            FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, (response: IUser) => {
                                this.$database.userId = response.id;
                                this.$database.execute("apiLogin", {
                                    forename: { value: response.first_name },
                                    surname: { value: response.last_name },
                                    gender: { value: response.gender }
                                }).then((response: IResponse) => {
                                    if (response.success) {
                                        this.$database.userId = response.data.id;
                                        this.$rootScope.$authenticated = true;
                                        this.$rootScope.$username = response.data.name;
                                        this.$log.debug("gm:login", this.$database.userId);
                                        this.$route.reload();
                                    } else { fail(); }
                                });
                            });
                        } else fail();
                    });
                }
                catch (ex) { fail(); }
            }
            public logout: Function = this.$rootScope.$logout = ($event: angular.IAngularEvent): void => {
                $event.preventDefault();
                $event.stopPropagation();
                try {
                    FB.logout(angular.noop);
                }
                catch (ex) {
                    this.$log.error("gm:logout:error", ex.message);
                }
                finally {
                    delete this.$database.userId;
                    this.$rootScope.$authenticated = false;
                    delete this.$rootScope.$username;
                    this.$log.debug("gm:logout");
                    this.$route.reload();
                }
            }
        }
    }
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
    export module Videos {
        interface IRouteParams extends angular.route.IRouteParamsService {
            period: string;
            genreUri: string;
            styleUri: string;
        }
        export class Controller {
            static $inject: string[] = ["$rootScope", "$routeParams", "$database", "$anchorScroll"];
            constructor(
                private $rootScope: IRootScope,
                private $routeParams: IRouteParams,
                private $database: Database.Service,
                public $anchorScroll: angular.IAnchorScrollService) {
                this.fetchVideos();
            }
            public page: number = 1;
            public pageSize: number = 10;
            public get period(): string { return this.$routeParams.period || "week"; }
            public get genreUri(): string { return this.$routeParams.genreUri || null; }
            public get styleUri(): string { return this.$routeParams.styleUri || null; }
            public fetchVideos(): void {
                this.$database.execute("apiVideos", {
                    period: { value: this.period },
                    genreUri: { value: this.genreUri },
                    styleUri: { value: this.styleUri }
                }).then((response: IResponse) => {
                    this.$rootScope.$playlist = response.data.playlist;
                    this.$rootScope.$videos = response.data.videos;
                }, angular.noop);
                let x: number = 1;
            }
        }
    }
    export module Search {
        interface IPopularity { id: string; description: string; }
        interface IStyle { id: string; uri: string; name: string; count: string; }
        interface IGenre { id: string; uri: string; name: string; count: string; styles: IStyle[]; expanded: boolean; }
        export class Controller {
            static $inject: string[] = ["$rootScope", "$database"];
            constructor(
                private $rootScope: IRootScope,
                private $database: Database.Service) {
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
                return this.$database.execute("apiSearch").then((response: IResponse) => {
                    this.genres = response.data.genres;
                    this.genres[0].expanded = true;
                    return this.genres;
                }, angular.noop);
            }
        }
    }
}

let gm: angular.IModule = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);

gm.service("$database", GoodMusic.Database.Service);
gm.service("$facebook", GoodMusic.Facebook.Service);
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

gm.run(["$log", "$window", "$rootScope", "$facebook", function (
    $log: angular.ILogService,
    $window: GoodMusic.IWindowService,
    $rootScope: GoodMusic.IRootScope,
    $facebook: GoodMusic.Facebook.Service) {
    $window.fbAsyncInit = function () {
        FB.init({ appId: GoodMusic.fbAppId, version: "v2.8" });
        $log.debug("gm:fbAsyncInit");
    };
    $rootScope.$authenticated = false;
    $log.debug("gm:run");
}]);