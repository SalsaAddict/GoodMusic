/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
var GoodMusic;
(function (GoodMusic) {
    "option strict";
    GoodMusic.debugEnabled = true;
    GoodMusic.fbAppId = "1574477942882037";
    GoodMusic.googleApiKey = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    var Service = (function () {
        function Service($rootScope, $q, $http, $route, $log) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$http = $http;
            this.$route = $route;
            this.$log = $log;
            this.$fbAuthResponseChange = function (response) {
                _this.$log.debug("gm:fb:authResponseChange", response);
                try {
                    if (response.status === "connected") {
                        FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, function (response) {
                            _this.$rootScope.$user = { id: response.id };
                            _this.$execute("apiLogin", {
                                forename: { value: response.first_name },
                                surname: { value: response.last_name },
                                gender: { value: response.gender }
                            }).then(function (response) {
                                if (response.success) {
                                    _this.$rootScope.$user = { id: response.data.id, name: response.data.name };
                                    _this.$log.debug("gm:authenticate:true", _this.$rootScope.$user);
                                    _this.$route.reload();
                                }
                                else {
                                    _this.$deauthenticate();
                                }
                            });
                        });
                    }
                    else
                        _this.$deauthenticate(response.status);
                }
                catch (ex) {
                    _this.$deauthenticate(ex.message);
                }
            };
            this.$login = this.$rootScope.$login = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                try {
                    FB.login(angular.noop);
                }
                catch (ex) {
                    _this.$deauthenticate(ex.message);
                }
            };
            this.$logout = this.$rootScope.$logout = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                try {
                    FB.logout(angular.noop);
                }
                catch (ex) {
                    _this.$deauthenticate(ex.message);
                }
            };
            $log.debug("gm:service:init");
        }
        Service.prototype.$execute = function (name, parameters) {
            var _this = this;
            if (parameters === void 0) { parameters = {}; }
            var procedure = { name: name, parameters: parameters }, deferred = this.$q.defer();
            if (this.$rootScope.$user) {
                parameters.userId = { value: this.$rootScope.$user.id || null };
            }
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
        Service.prototype.$deauthenticate = function (reason) {
            delete this.$rootScope.$user;
            this.$log.debug("gm:authenticate:false", reason);
            this.$route.reload();
        };
        Service.$inject = ["$rootScope", "$q", "$http", "$route", "$log"];
        return Service;
    }());
    GoodMusic.Service = Service;
})(GoodMusic || (GoodMusic = {}));
var GoodMusic;
(function (GoodMusic) {
    "option strict";
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
    var Search;
    (function (Search) {
        var Controller = (function () {
            function Controller($rootScope, $gm) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$gm = $gm;
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
                return this.$gm.$execute("apiSearch").then(function (response) {
                    _this.genres = response.data.genres;
                    _this.genres[0].expanded = true;
                    return _this.genres;
                }, angular.noop);
            };
            Controller.$inject = ["$rootScope", "$gm"];
            return Controller;
        }());
        Search.Controller = Controller;
    })(Search = GoodMusic.Search || (GoodMusic.Search = {}));
    var Videos;
    (function (Videos) {
        var Controller = (function () {
            function Controller($rootScope, $routeParams, $gm, $anchorScroll) {
                this.$rootScope = $rootScope;
                this.$routeParams = $routeParams;
                this.$gm = $gm;
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
                this.$gm.$execute("apiVideos", {
                    period: { value: this.period },
                    genreUri: { value: this.genreUri },
                    styleUri: { value: this.styleUri }
                }).then(function (response) {
                    _this.$rootScope.$playlist = response.data.playlist;
                    _this.$rootScope.$videos = response.data.videos;
                }, angular.noop);
                var x = 1;
            };
            Controller.$inject = ["$rootScope", "$routeParams", "$gm", "$anchorScroll"];
            return Controller;
        }());
        Videos.Controller = Controller;
    })(Videos = GoodMusic.Videos || (GoodMusic.Videos = {}));
})(GoodMusic || (GoodMusic = {}));
var gm = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);
gm.service("$gm", GoodMusic.Service);
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
gm.run(["$log", "$window", "$rootScope", "$gm", function ($log, $window, $rootScope, $gm) {
        $window.fbAsyncInit = function () {
            FB.init({ appId: GoodMusic.fbAppId, cookie: true, status: true, version: "v2.8" });
            FB.Event.subscribe('auth.authResponseChange', $gm.$fbAuthResponseChange);
            $log.debug("gm:fbAsyncInit");
        };
        $rootScope.$authenticated = false;
        $log.debug("gm:run");
    }]);
