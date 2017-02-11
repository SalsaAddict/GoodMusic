/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

declare let FB: any, YT: any;

module GoodMusic {
    "option strict";
    export const debugEnabled: boolean = true;
    export const fbAppId: string = "1574477942882037";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IRootScopeService extends angular.IRootScopeService {
        $authenticated: boolean;
        $login: Function;
        $logout: Function;
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
            static $inject: string[] = ["$rootScope", "$database", "$log"];
            constructor(
                private $rootScope: IRootScopeService,
                private $database: Database.Service,
                private $log: angular.ILogService) {
                $log.debug("gm:facebook:init");
            }
            public login: Function = this.$rootScope.$login = (): void => {
                let fail: Function = (): void => {
                    delete this.$database.userId;
                    this.$rootScope.$authenticated = false;
                    this.$log.debug("gm:login:fail");
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
                                        this.$database.userId = response.data.userId;
                                        this.$rootScope.$authenticated = true;
                                        this.$log.debug("gm:login:success", this.$database.userId);
                                    } else { fail(); }
                                });
                            });
                        } else fail();
                    });
                }
                catch (ex) { fail(); }
            }
            public logout: Function = this.$rootScope.$logout = (): void => {
                try {
                    FB.logout(angular.noop);
                }
                finally {
                    delete this.$database.userId;
                    this.$rootScope.$authenticated = false;
                    this.$log.debug("gm:logout");
                }
            }
        }
    }
}

let gm: angular.IModule = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);

gm.service("$database", GoodMusic.Database.Service);
gm.service("$facebook", GoodMusic.Facebook.Service);

gm.config(["$logProvider", function ($logProvider: angular.ILogProvider) {
    $logProvider.debugEnabled(GoodMusic.debugEnabled);
}]);

gm.run(["$log", "$window", "$rootScope", "$facebook", function (
    $log: angular.ILogService,
    $window: GoodMusic.IWindowService,
    $rootScope: GoodMusic.IRootScopeService,
    $facebook: GoodMusic.Facebook.Service) {
    $window.fbAsyncInit = function () {
        FB.init({ appId: GoodMusic.fbAppId, version: "v2.8" });
        $log.debug("gm:fbAsyncInit");
    };
    $rootScope.$authenticated = false;
    $log.debug("gm:run");
}]);