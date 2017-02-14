/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

declare let FB: any, YT: any;

module GoodMusic {
    "option strict";
    export const debugEnabled: boolean = true;
    export const fbAppId: string = "1574477942882037";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
}

module GoodMusic {
    "option strict";
    export module Database {
        interface IHttpSuccess { data: IResponse }
        interface IHttpError { status: number; statusText: string; }
        export interface IParameter { value: any; isObject?: boolean; }
        export interface IParameters { [name: string]: IParameter; userId?: IParameter; }
        interface IProcedure { name: string; parameters?: IParameters; }
        export interface IResponse { success: boolean; data: any; }
        export class Service {
            static $inject: string[] = ["$q", "$http", "$log"];
            constructor(
                private $q: angular.IQService,
                private $http: angular.IHttpService,
                private $log: angular.ILogService) { }
            public $execute(name: string, parameters: IParameters = {}): angular.IPromise<IResponse> {
                let procedure: IProcedure = { name: name, parameters: parameters },
                    deferred: angular.IDeferred<IResponse> = this.$q.defer();
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
    export module Authentication {
        interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
        interface IFacebookAuthResponse {
            status: "connected" | "not_authorized" | "unknown";
            authResponse: {
                accessToken: string;
                expiresIn: string;
                signedRequest: string;
                userID: string;
            }
        }
        interface IFacebookUser { id: string; first_name: string; last_name: string; gender: "male" | "female"; }
        export interface IUser { id: string; name?: string; }
        export class Service {
            static $inject: string[] = ["$database", "$window", "$route", "$log"];
            constructor(
                private $database: Database.Service,
                private $window: IWindowService,
                private $route: angular.route.IRouteService,
                private $log: angular.ILogService) {
                $window.fbAsyncInit = (): void => {
                    FB.init({ appId: GoodMusic.fbAppId, cookie: true, status: true, version: "v2.8" });
                    FB.Event.subscribe('auth.authResponseChange', (authResponse: IFacebookAuthResponse): void => {
                        this.$log.debug("gm:fb:authResponse", authResponse);
                        try {
                            if (authResponse.status === "connected") {
                                FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, (response: IFacebookUser) => {
                                    $database.$execute("apiLogin", {
                                        userId: { value: response.id },
                                        forename: { value: response.first_name },
                                        surname: { value: response.last_name },
                                        gender: { value: response.gender }
                                    }).then((response: Database.IResponse) => {
                                        if (response.success) {
                                            this.user = { id: response.data.id, name: response.data.name };
                                            this.$log.debug("gm:authenticate", this.user);
                                            this.$route.reload();
                                        } else { this.deauthenticate(response.data); }
                                    });
                                });
                            } else { this.deauthenticate(authResponse); }
                        }
                        catch (ex) { this.deauthenticate(ex); }
                    });
                    $log.debug("gm:fb:init");
                };
                $log.debug("gm:auth:init");
            }
            public user: IUser;
            public get authenticated(): boolean { return (this.user) ? true : false; }
            public login: Function = ($event?: angular.IAngularEvent): void => {
                if ($event) { $event.preventDefault(); $event.stopPropagation(); }
                try { FB.login(angular.noop); } catch (ex) { this.deauthenticate(ex.message); }
            }
            public logout: Function = ($event?: angular.IAngularEvent): void => {
                if ($event) { $event.preventDefault(); $event.stopPropagation(); }
                try { FB.logout(angular.noop); } catch (ex) { this.deauthenticate(ex); }
            }
            private deauthenticate(data: any): void {
                delete this.user;
                this.$log.debug("gm:deauthenticate", data);
                this.$route.reload();
            }
        }
    }
    export module Playlist {
        export type Period = "all" | "weekly" | "monthly" | "yearly";
        export interface IParameters { period: Period; genreUri: string; styleUri?: string; }
        export interface IVideo { videoId: string; title: string; genre: string; }
        interface IData {
            parameters?: IParameters;
            title?: string;
            videos?: IVideo[];
            index?: number;
        }
        export class Service {
            static $inject: string[] = ["$authentication", "$database"];
            constructor(
                private $authentication: Authentication.Service,
                private $database: Database.Service) { }
            private $data: IData = {};
            public get title(): string { return this.$data.title || "Good Music"; }
            public get videos(): IVideo[] {
                if (!this.$data) { return []; }
                if (!angular.isArray(this.$data.videos)) { return []; }
                return this.$data.videos;
            }
            public get count(): number { return this.videos.length; }
            public set index(value: number) { this.$data.index = value; }
            public get index(): number {
                if (this.count === 0) { return -1; }
                if (this.$data.index >= this.count - 1) { return this.count; }
                return this.$data.index || 0;
            }
            public load(parameters: IParameters): void {
                this.$database.$execute("apiPlaylist", {
                    period: { value: parameters.period || null },
                    genreUri: { value: parameters.genreUri || null },
                    styleUri: { value: parameters.styleUri || null },
                    userId: { value: (this.$authentication.user) ? this.$authentication.user.id || null : null }
                }).then((response: Database.IResponse) => {
                    if (response.success) {
                        this.$data = {
                            parameters: response.data.parameters,
                            title: response.data.title,
                            videos: response.data.videos
                        };
                    } else { this.$data = {}; }
                }, angular.noop);
            }
        }
    }
}

module GoodMusic {
    "option strict";
    export module Menu {
        export class Controller {
            static $inject: string[] = ["$scope", "$route", "$authentication", "$playlist"];
            constructor(
                private $scope: angular.IScope,
                private $route: angular.route.IRouteService,
                public $authentication: Authentication.Service,
                private $playlist: Playlist.Service) {
                $scope.$on("$routeChangeSuccess", () => { this.collapsed = true; });
            }
            public get title(): string {
                let defaultTitle: string = "Good Music";
                if (!this.$route.current) { return defaultTitle; }
                switch (this.$route.current.name) {
                    case "videos": return this.$playlist.title;
                    default: return defaultTitle;
                }
            }
            public collapsed: boolean = true;
            public toggle(): void { this.collapsed = !this.collapsed; }
            public get authenticated(): boolean { return this.$authentication.authenticated; }
            public get username(): string {
                if (!this.authenticated) { return; }
                return this.$authentication.user.name;
            }
            public login: Function = this.$authentication.login;
            public logout: Function = this.$authentication.logout;
        }
    }
    export module Search {
        interface IPopularity { id: string; description: string; }
        interface IStyle { id: string; uri: string; name: string; count: string; }
        interface IGenre { id: string; uri: string; name: string; count: string; styles: IStyle[]; expanded: boolean; }
        export class Controller {
            static $inject: string[] = ["$database"];
            constructor(private $database: Database.Service) {
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
                return this.$database.$execute("apiSearch").then((response: Database.IResponse) => {
                    this.genres = response.data.genres;
                    this.genres[0].expanded = true;
                    return this.genres;
                }, angular.noop);
            }
        }
    }
    export module Videos {
        interface IRouteParams extends angular.route.IRouteParamsService, Playlist.IParameters { }
        export class Controller {
            static $inject: string[] = ["$routeParams", "$playlist", "$anchorScroll"];
            constructor(
                private $routeParams: IRouteParams,
                private $playlist: Playlist.Service,
                public $anchorScroll: angular.IAnchorScrollService) {
                $playlist.load(this.$routeParams);
            }
            public page: number = 1;
            public pageSize: number = 12;
            public get videos(): Playlist.IVideo[] { return this.$playlist.videos; }
            public get count(): number { return this.$playlist.count; }
        }
    }
}

let gm: angular.IModule = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);

gm.service("$database", GoodMusic.Database.Service);
gm.service("$authentication", GoodMusic.Authentication.Service);
gm.service("$playlist", GoodMusic.Playlist.Service);
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

gm.run(["$authentication", "$log", function (
    $authentication: GoodMusic.Authentication.Service,
    $log: angular.ILogService) {
    $log.debug("gm:run");
}]);