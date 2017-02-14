/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
var GoodMusic;
(function (GoodMusic) {
    "option strict";
    GoodMusic.debugEnabled = true;
    GoodMusic.fbAppId = "1574477942882037";
    GoodMusic.googleApiKey = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
})(GoodMusic || (GoodMusic = {}));
var GoodMusic;
(function (GoodMusic) {
    "option strict";
    var Database;
    (function (Database) {
        var Service = (function () {
            function Service($q, $http, $log) {
                this.$q = $q;
                this.$http = $http;
                this.$log = $log;
            }
            Service.prototype.$execute = function (name, parameters) {
                var _this = this;
                if (parameters === void 0) { parameters = {}; }
                var procedure = { name: name, parameters: parameters }, deferred = this.$q.defer();
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
    var Authentication;
    (function (Authentication) {
        var Service = (function () {
            function Service($gmdb, $window, $route, $log) {
                var _this = this;
                this.$gmdb = $gmdb;
                this.$window = $window;
                this.$route = $route;
                this.$log = $log;
                this.login = function ($event) {
                    if ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }
                    try {
                        FB.login(angular.noop);
                    }
                    catch (ex) {
                        _this.deauthenticate(ex.message);
                    }
                };
                this.logout = function ($event) {
                    if ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }
                    try {
                        FB.logout(angular.noop);
                    }
                    catch (ex) {
                        _this.deauthenticate(ex);
                    }
                };
                $window.fbAsyncInit = function () {
                    FB.init({ appId: GoodMusic.fbAppId, cookie: true, status: true, version: "v2.8" });
                    FB.Event.subscribe('auth.authResponseChange', function (authResponse) {
                        _this.$log.debug("gm:fb:authResponse", authResponse);
                        try {
                            if (authResponse.status === "connected") {
                                FB.api("/me", { fields: ["id", "first_name", "last_name", "gender"] }, function (response) {
                                    $gmdb.$execute("apiLogin", {
                                        userId: { value: response.id },
                                        forename: { value: response.first_name },
                                        surname: { value: response.last_name },
                                        gender: { value: response.gender }
                                    }).then(function (response) {
                                        if (response.success) {
                                            _this.user = { id: response.data.id, name: response.data.name };
                                            _this.$log.debug("gm:authenticate", _this.user);
                                            _this.$route.reload();
                                        }
                                        else {
                                            _this.deauthenticate(response.data);
                                        }
                                    });
                                });
                            }
                            else {
                                _this.deauthenticate(authResponse);
                            }
                        }
                        catch (ex) {
                            _this.deauthenticate(ex);
                        }
                    });
                    $log.debug("gm:fb:init");
                };
                $log.debug("gm:auth:init");
            }
            Object.defineProperty(Service.prototype, "authenticated", {
                get: function () { return (this.user) ? true : false; },
                enumerable: true,
                configurable: true
            });
            Service.prototype.deauthenticate = function (data) {
                delete this.user;
                this.$log.debug("gm:deauthenticate", data);
                this.$route.reload();
            };
            Service.$inject = ["$gmdb", "$window", "$route", "$log"];
            return Service;
        }());
        Authentication.Service = Service;
    })(Authentication = GoodMusic.Authentication || (GoodMusic.Authentication = {}));
    var Playlist;
    (function (Playlist) {
        var Service = (function () {
            function Service($gmauth, $gmdb) {
                this.$gmauth = $gmauth;
                this.$gmdb = $gmdb;
            }
            Service.prototype.clear = function () { delete this.parameters, this.title, this.videos; };
            Service.prototype.load = function (parameters) {
                var _this = this;
                this.$gmdb.$execute("apiPlaylist", {
                    period: { value: parameters.period || null },
                    genreUri: { value: parameters.genreUri || null },
                    styleUri: { value: parameters.styleUri || null },
                    userId: { value: (this.$gmauth.user) ? this.$gmauth.user.id || null : null }
                }).then(function (response) {
                    if (response.success) {
                        _this.parameters = response.data.parameters;
                        _this.title = response.data.title;
                        _this.videos = response.data.videos;
                    }
                    else {
                        _this.clear();
                    }
                });
            };
            Service.$inject = ["$gmauth", "$gmdb"];
            return Service;
        }());
        Playlist.Service = Service;
    })(Playlist = GoodMusic.Playlist || (GoodMusic.Playlist = {}));
})(GoodMusic || (GoodMusic = {}));
var GoodMusic;
(function (GoodMusic) {
    "option strict";
    var Menu;
    (function (Menu) {
        var Controller = (function () {
            function Controller($scope, $route, $gmauth, $gmplaylist) {
                var _this = this;
                this.$scope = $scope;
                this.$route = $route;
                this.$gmauth = $gmauth;
                this.$gmplaylist = $gmplaylist;
                this.collapsed = true;
                this.login = this.$gmauth.login;
                this.logout = this.$gmauth.logout;
                $scope.$on("$routeChangeSuccess", function () { _this.collapsed = true; });
            }
            Object.defineProperty(Controller.prototype, "title", {
                get: function () {
                    var defaultTitle = "Good Music";
                    if (!this.$route.current) {
                        return defaultTitle;
                    }
                    switch (this.$route.current.name) {
                        case "videos": return this.$gmplaylist.title;
                        default: return defaultTitle;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.toggle = function () { this.collapsed = !this.collapsed; };
            Object.defineProperty(Controller.prototype, "authenticated", {
                get: function () { return this.$gmauth.authenticated; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "username", {
                get: function () {
                    if (!this.authenticated) {
                        return;
                    }
                    return this.$gmauth.user.name;
                },
                enumerable: true,
                configurable: true
            });
            Controller.$inject = ["$scope", "$route", "$gmauth", "$gmplaylist"];
            return Controller;
        }());
        Menu.Controller = Controller;
    })(Menu = GoodMusic.Menu || (GoodMusic.Menu = {}));
    var Search;
    (function (Search) {
        var Controller = (function () {
            function Controller($gmdb) {
                var _this = this;
                this.$gmdb = $gmdb;
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
                return this.$gmdb.$execute("apiSearch").then(function (response) {
                    _this.genres = response.data.genres;
                    _this.genres[0].expanded = true;
                    return _this.genres;
                }, angular.noop);
            };
            Controller.$inject = ["$gmdb"];
            return Controller;
        }());
        Search.Controller = Controller;
    })(Search = GoodMusic.Search || (GoodMusic.Search = {}));
    var Videos;
    (function (Videos) {
        var Controller = (function () {
            function Controller($routeParams, $gmplaylist, $anchorScroll) {
                this.$routeParams = $routeParams;
                this.$gmplaylist = $gmplaylist;
                this.$anchorScroll = $anchorScroll;
                this.page = 1;
                this.pageSize = 12;
                $gmplaylist.load(this.$routeParams);
            }
            Object.defineProperty(Controller.prototype, "videos", {
                get: function () { return this.$gmplaylist.videos; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "count", {
                get: function () { return this.videos.length; },
                enumerable: true,
                configurable: true
            });
            Controller.$inject = ["$routeParams", "$gmplaylist", "$anchorScroll"];
            return Controller;
        }());
        Videos.Controller = Controller;
    })(Videos = GoodMusic.Videos || (GoodMusic.Videos = {}));
})(GoodMusic || (GoodMusic = {}));
var gm = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);
gm.service("$gmdb", GoodMusic.Database.Service);
gm.service("$gmauth", GoodMusic.Authentication.Service);
gm.service("$gmplaylist", GoodMusic.Playlist.Service);
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
gm.run(["$gmauth", "$log", function ($gmauth, $log) {
        $log.debug("gm:run");
    }]);
