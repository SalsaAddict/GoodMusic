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
            function Service($rootScope, $route, $database, $log) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$route = $route;
                this.$database = $database;
                this.$log = $log;
                this.login = this.$rootScope.$login = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    var fail = function () {
                        delete _this.$database.userId;
                        _this.$rootScope.$authenticated = false;
                        delete _this.$rootScope.$username;
                        _this.$log.debug("gm:login:error");
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
                                            _this.$database.userId = response.data.id;
                                            _this.$rootScope.$authenticated = true;
                                            _this.$rootScope.$username = response.data.name;
                                            _this.$log.debug("gm:login", _this.$database.userId);
                                            _this.$route.reload();
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
                this.logout = this.$rootScope.$logout = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    try {
                        FB.logout(angular.noop);
                    }
                    catch (ex) {
                        _this.$log.error("gm:logout:error", ex.message);
                    }
                    finally {
                        delete _this.$database.userId;
                        _this.$rootScope.$authenticated = false;
                        delete _this.$rootScope.$username;
                        _this.$log.debug("gm:logout");
                        _this.$route.reload();
                    }
                };
                $log.debug("gm:facebook:init");
            }
            Service.$inject = ["$rootScope", "$route", "$database", "$log"];
            return Service;
        }());
        Facebook.Service = Service;
    })(Facebook = GoodMusic.Facebook || (GoodMusic.Facebook = {}));
    var Menu;
    (function (Menu) {
        var Controller = (function () {
            function Controller($scope, $route) {
                var _this = this;
                this.$scope = $scope;
                this.$route = $route;
                this.collapsed = true;
                $scope.$on("$routeChangeSuccess", function () {
                    _this.collapsed = true;
                });
            }
            Object.defineProperty(Controller.prototype, "title", {
                get: function () {
                    var defaultTitle = "Good Music";
                    if (!this.$route.current) {
                        return defaultTitle;
                    }
                    switch (this.$route.current.name) {
                        case "videos": return this.$scope.$playlist || "All Genres";
                        default: return defaultTitle;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.toggle = function () { this.collapsed = !this.collapsed; };
            Controller.$inject = ["$scope", "$route"];
            return Controller;
        }());
        Menu.Controller = Controller;
    })(Menu = GoodMusic.Menu || (GoodMusic.Menu = {}));
    var Videos;
    (function (Videos) {
        var Controller = (function () {
            function Controller($rootScope, $routeParams, $database, $anchorScroll) {
                this.$rootScope = $rootScope;
                this.$routeParams = $routeParams;
                this.$database = $database;
                this.$anchorScroll = $anchorScroll;
                this.page = 1;
                this.pageSize = 10;
                this.fetchVideos();
            }
            Object.defineProperty(Controller.prototype, "period", {
                get: function () { return this.$routeParams.period || "week"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "genreUri", {
                get: function () { return this.$routeParams.genreUri || null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "styleUri", {
                get: function () { return this.$routeParams.styleUri || null; },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.fetchVideos = function () {
                var _this = this;
                this.$database.execute("apiVideos", {
                    period: { value: this.period },
                    genreUri: { value: this.genreUri },
                    styleUri: { value: this.styleUri }
                }).then(function (response) {
                    _this.$rootScope.$playlist = response.data.playlist;
                    _this.$rootScope.$videos = response.data.videos;
                }, angular.noop);
                var x = 1;
            };
            Controller.$inject = ["$rootScope", "$routeParams", "$database", "$anchorScroll"];
            return Controller;
        }());
        Videos.Controller = Controller;
    })(Videos = GoodMusic.Videos || (GoodMusic.Videos = {}));
    var Search;
    (function (Search) {
        var Controller = (function () {
            function Controller($rootScope, $database) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$database = $database;
                this.periods = [
                    { id: "weekly", description: "Week" },
                    { id: "monthly", description: "Month" },
                    { id: "yearly", description: "Year" },
                    { id: "all", description: "Ever" }
                ];
                this.period = this.periods[0].id;
                this.fetchGenres().then(function (genres) { _this.expand(genres[0]); });
            }
            Controller.prototype.expand = function (genre) {
                this.genres.forEach(function (item) { item.expanded = false; });
                genre.expanded = true;
            };
            Controller.prototype.fetchGenres = function () {
                var _this = this;
                return this.$database.execute("apiSearch").then(function (response) {
                    _this.genres = response.data.genres;
                    _this.genres[0].expanded = true;
                    return _this.genres;
                }, angular.noop);
            };
            Controller.$inject = ["$rootScope", "$database"];
            return Controller;
        }());
        Search.Controller = Controller;
    })(Search = GoodMusic.Search || (GoodMusic.Search = {}));
})(GoodMusic || (GoodMusic = {}));
var gm = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);
gm.service("$database", GoodMusic.Database.Service);
gm.service("$facebook", GoodMusic.Facebook.Service);
gm.controller("menuController", GoodMusic.Menu.Controller);
gm.config(["$logProvider", "$routeProvider", function ($logProvider, $routeProvider) {
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
gm.run(["$log", "$window", "$rootScope", "$facebook", function ($log, $window, $rootScope, $facebook) {
        $window.fbAsyncInit = function () {
            FB.init({ appId: GoodMusic.fbAppId, version: "v2.8" });
            $log.debug("gm:fbAsyncInit");
        };
        $rootScope.$authenticated = false;
        $log.debug("gm:run");
    }]);
