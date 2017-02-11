/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
var GoodMusic;
(function (GoodMusic) {
    "option strict";
    GoodMusic.debugEnabled = true;
    GoodMusic.fbAppId = "1574477942882037";
    GoodMusic.googleApiKey = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    var Database;
    (function (Database) {
        var Service = (function () {
            function Service($q, $http, $log) {
                this.$q = $q;
                this.$http = $http;
                this.$log = $log;
                $log.debug("gm:database:init");
            }
            Service.prototype.execute = function (name, parameters) {
                var _this = this;
                if (parameters === void 0) { parameters = {}; }
                var procedure = { name: name, parameters: parameters }, deferred = this.$q.defer();
                parameters.userId = { value: this.userId || null };
                try {
                    this.$http.post("execute.ashx", procedure).then(function (response) {
                        deferred.resolve(response.data);
                        if (!response.data.success) {
                            _this.$log.error(response.data.data);
                        }
                        _this.$log.debug("gm:execute", procedure.name, {
                            request: procedure,
                            response: response.data.data
                        });
                    }, function (response) {
                        deferred.resolve({ success: false, data: response.statusText });
                        _this.$log.error(response.status, response.statusText);
                    });
                }
                catch (ex) {
                    deferred.resolve({ success: false, data: ex });
                    this.$log.error(ex.message);
                }
                return deferred.promise;
            };
            Service.$inject = ["$q", "$http", "$log"];
            return Service;
        }());
        Database.Service = Service;
    })(Database = GoodMusic.Database || (GoodMusic.Database = {}));
    var Facebook;
    (function (Facebook) {
        var Service = (function () {
            function Service($rootScope, $database, $log) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$database = $database;
                this.$log = $log;
                this.login = this.$rootScope.$login = function () {
                    var fail = function () {
                        delete _this.$database.userId;
                        _this.$rootScope.$authenticated = false;
                        _this.$log.debug("gm:login:fail");
                    };
                    try {
                        FB.login(function (response) {
                            _this.$log.debug("gm:fb:authResponse", response);
                            if (response.status === "connected") {
                                FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, function (response) {
                                    _this.$database.userId = response.id;
                                    _this.$database.execute("apiLogin", {
                                        forename: { value: response.first_name },
                                        surname: { value: response.last_name },
                                        gender: { value: response.gender }
                                    }).then(function (response) {
                                        if (response.success) {
                                            _this.$database.userId = response.data.userId;
                                            _this.$rootScope.$authenticated = true;
                                            _this.$log.debug("gm:login:success", _this.$database.userId);
                                        }
                                        else {
                                            fail();
                                        }
                                    });
                                });
                            }
                            else
                                fail();
                        });
                    }
                    catch (ex) {
                        fail();
                    }
                };
                this.logout = this.$rootScope.$logout = function () {
                    try {
                        FB.logout(angular.noop);
                    }
                    finally {
                        delete _this.$database.userId;
                        _this.$rootScope.$authenticated = false;
                        _this.$log.debug("gm:logout");
                    }
                };
                $log.debug("gm:facebook:init");
            }
            Service.$inject = ["$rootScope", "$database", "$log"];
            return Service;
        }());
        Facebook.Service = Service;
    })(Facebook = GoodMusic.Facebook || (GoodMusic.Facebook = {}));
})(GoodMusic || (GoodMusic = {}));
var gm = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);
gm.service("$database", GoodMusic.Database.Service);
gm.service("$facebook", GoodMusic.Facebook.Service);
gm.config(["$logProvider", function ($logProvider) {
        $logProvider.debugEnabled(GoodMusic.debugEnabled);
    }]);
gm.run(["$log", "$window", "$rootScope", "$facebook", function ($log, $window, $rootScope, $facebook) {
        $window.fbAsyncInit = function () {
            FB.init({ appId: GoodMusic.fbAppId, version: "v2.8" });
            $log.debug("gm:fbAsyncInit");
        };
        $rootScope.$authenticated = false;
        $log.debug("gm:run");
    }]);
