/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../typings/facebook-js-sdk/facebook-js-sdk.d.ts" />
/// <reference path="../typings/youtube/youtube.d.ts" />
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
            function Service($database, $window, $route, $log) {
                var _this = this;
                this.$database = $database;
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
                                    $database.$execute("apiLogin", {
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
            Service.$inject = ["$database", "$window", "$route", "$log"];
            return Service;
        }());
        Authentication.Service = Service;
    })(Authentication = GoodMusic.Authentication || (GoodMusic.Authentication = {}));
    var Playlist;
    (function (Playlist) {
        var Service = (function () {
            function Service($authentication, $database, $filter, $window) {
                this.$authentication = $authentication;
                this.$database = $database;
                this.$filter = $filter;
                this.$window = $window;
                this.$data = angular.fromJson(this.$window.localStorage.getItem("$data") || "{}");
            }
            Object.defineProperty(Service.prototype, "loaded", {
                get: function () { return angular.isDefined(this.$data.videos); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "title", {
                get: function () { return this.$data.title || "Good Music"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "parameters", {
                get: function () {
                    if (!this.$data) {
                        return {};
                    }
                    return this.$data.parameters || {};
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "videos", {
                get: function () {
                    if (!this.$data) {
                        return [];
                    }
                    if (!angular.isArray(this.$data.videos)) {
                        return [];
                    }
                    return this.$filter("orderBy")(this.$data.videos, function (item) {
                        return parseInt(item.rank, 10);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "count", {
                get: function () { return this.videos.length; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "index", {
                get: function () {
                    if (this.count === 0) {
                        return -1;
                    }
                    if (this.$data.index >= this.count) {
                        return this.count - 1;
                    }
                    return this.$data.index || 0;
                },
                set: function (value) { this.$data.index = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "video", {
                get: function () {
                    if (this.index < 0) {
                        return;
                    }
                    return this.videos[this.index];
                },
                enumerable: true,
                configurable: true
            });
            Service.prototype.load = function (parameters) {
                var _this = this;
                this.$data = {};
                return this.$database.$execute("apiPlaylist", {
                    period: { value: parameters.period || null },
                    genreUri: { value: parameters.genreUri || null },
                    styleUri: { value: parameters.styleUri || null },
                    userId: { value: (this.$authentication.user) ? this.$authentication.user.id || null : null }
                }).then(function (response) {
                    if (response.success) {
                        _this.$data = {
                            parameters: response.data.parameters,
                            title: response.data.title,
                            videos: response.data.videos
                        };
                        _this.$window.localStorage.setItem("$data", angular.toJson(_this.$data));
                    }
                    else {
                        _this.$data = {};
                    }
                    return _this.parameters;
                }, angular.noop);
            };
            Service.$inject = ["$authentication", "$database", "$filter", "$window"];
            return Service;
        }());
        Playlist.Service = Service;
    })(Playlist = GoodMusic.Playlist || (GoodMusic.Playlist = {}));
    var Menu;
    (function (Menu) {
        var Controller = (function () {
            function Controller($scope, $route, $authentication, $playlist) {
                var _this = this;
                this.$scope = $scope;
                this.$route = $route;
                this.$authentication = $authentication;
                this.$playlist = $playlist;
                this.collapsed = true;
                this.login = this.$authentication.login;
                this.logout = this.$authentication.logout;
                $scope.$on("$routeChangeSuccess", function () { _this.collapsed = true; });
            }
            Object.defineProperty(Controller.prototype, "title", {
                get: function () {
                    var defaultTitle = "Good Music";
                    if (!this.$route.current) {
                        return defaultTitle;
                    }
                    switch (this.$route.current.name) {
                        case "load":
                        case "list":
                        case "play": return this.$playlist.title;
                        default: return defaultTitle;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.toggle = function () { this.collapsed = !this.collapsed; };
            Object.defineProperty(Controller.prototype, "authenticated", {
                get: function () { return this.$authentication.authenticated; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "username", {
                get: function () {
                    if (!this.authenticated) {
                        return;
                    }
                    return this.$authentication.user.name;
                },
                enumerable: true,
                configurable: true
            });
            Controller.$inject = ["$scope", "$route", "$authentication", "$playlist"];
            return Controller;
        }());
        Menu.Controller = Controller;
    })(Menu = GoodMusic.Menu || (GoodMusic.Menu = {}));
    var Search;
    (function (Search) {
        var Controller = (function () {
            function Controller($database, $routeParams, $location) {
                this.$database = $database;
                this.$routeParams = $routeParams;
                this.$location = $location;
                this.loadGenres();
            }
            Controller.prototype.loadGenres = function () {
                var _this = this;
                this.$database.$execute("apiSearch").then(function (response) {
                    _this.genres = response.data.genres;
                    if (!_this.expand(_this.$routeParams.genreUri || _this.genres[0].uri)) {
                        _this.$location.path("/search");
                    }
                }, angular.noop);
            };
            Controller.prototype.expand = function (genreUri, $event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                var found = false;
                this.genres.forEach(function (item) {
                    if (item.uri === genreUri) {
                        item.expanded = found = true;
                    }
                    else {
                        item.expanded = false;
                    }
                });
                return found;
            };
            Controller.$inject = ["$database", "$routeParams", "$location"];
            return Controller;
        }());
        Search.Controller = Controller;
    })(Search = GoodMusic.Search || (GoodMusic.Search = {}));
    var Videos;
    (function (Videos) {
        var Controller = (function () {
            function Controller($location, $route, $routeParams, $playlist, $anchorScroll, $log) {
                this.$location = $location;
                this.$route = $route;
                this.$routeParams = $routeParams;
                this.$playlist = $playlist;
                this.$anchorScroll = $anchorScroll;
                this.$log = $log;
                this.page = 1;
                this.pageSize = 12;
                this.periods = ["all", "weekly", "monthly", "yearly"];
                switch (this.action) {
                    case "load":
                        this.load(this.$routeParams);
                        break;
                    case "list":
                        if (!$playlist.loaded) {
                            $log.warn("gm:playlist:nolist");
                            $location.path("/search");
                        }
                        else {
                            this.$route.updateParams(this.$playlist.parameters);
                        }
                        break;
                }
                //this.page = Math.floor($playlist.index / this.pageSize);
            }
            Controller.prototype.load = function (parameters) {
                var _this = this;
                this.$playlist.load(parameters)
                    .then(function (newParams) {
                    if (!angular.equals(parameters, newParams)) {
                        _this.$route.updateParams(newParams);
                    }
                }, angular.noop);
            };
            Object.defineProperty(Controller.prototype, "loaded", {
                get: function () { return this.$playlist.loaded; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "action", {
                get: function () { return this.$route.current.name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "title", {
                get: function () { return this.$playlist.title; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "videos", {
                get: function () { return this.$playlist.videos; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "count", {
                get: function () { return this.$playlist.count; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "index", {
                get: function () { return this.$playlist.index; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "period", {
                get: function () { return this.$playlist.parameters.period || "all"; },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.setPeriod = function (period) {
                var path = "/videos/" + period + "/" + this.$playlist.parameters.genreUri;
                if (this.$playlist.parameters.styleUri) {
                    path += "/" + this.$playlist.parameters.styleUri;
                }
                this.$location.path(path);
            };
            Controller.prototype.top = function () { this.$anchorScroll(); };
            Controller.prototype.open = function (video, $event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                this.$playlist.index = parseInt(video.rank) - 1;
                this.$location.path("/video");
            };
            Controller.$inject = ["$location", "$route", "$routeParams", "$playlist", "$anchorScroll", "$log"];
            return Controller;
        }());
        Videos.Controller = Controller;
    })(Videos = GoodMusic.Videos || (GoodMusic.Videos = {}));
    var Video;
    (function (Video) {
        var Controller = (function () {
            function Controller($scope, $playlist, $location, $log) {
                var _this = this;
                this.$scope = $scope;
                this.$playlist = $playlist;
                this.$location = $location;
                this.$log = $log;
                if (!$playlist.video) {
                    $log.warn("gm:video:novideo");
                    $location.path("/search");
                    return;
                }
                this.player = new YT.Player("player", {
                    width: "100%",
                    height: "100%",
                    events: {
                        onReady: function (event) {
                            _this.play();
                            _this.$scope.$apply();
                        },
                        onStateChange: function (event) {
                            if (event.data === YT.PlayerState.ENDED) {
                                _this.next();
                                _this.$scope.$apply();
                            }
                        }
                    }
                });
            }
            Object.defineProperty(Controller.prototype, "video", {
                get: function () { return this.$playlist.video; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "$first", {
                get: function () { return (this.$playlist.index === 0); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "$last", {
                get: function () { return (this.$playlist.index === this.$playlist.count - 1); },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.play = function () {
                if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
                    this.player.stopVideo();
                }
                this.player.loadVideoById(this.video.videoId);
            };
            Controller.prototype.previous = function ($event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                this.$playlist.index--;
                this.play();
            };
            Controller.prototype.next = function ($event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                this.$playlist.index++;
                this.play();
            };
            Controller.$inject = ["$scope", "$playlist", "$location", "$log"];
            return Controller;
        }());
        Video.Controller = Controller;
    })(Video = GoodMusic.Video || (GoodMusic.Video = {}));
})(GoodMusic || (GoodMusic = {}));
var gm = angular.module("gm", ["ngRoute", "ngAria", "ngAnimate", "ui.bootstrap"]);
gm.service("$database", GoodMusic.Database.Service);
gm.service("$authentication", GoodMusic.Authentication.Service);
gm.service("$playlist", GoodMusic.Playlist.Service);
gm.controller("menuController", GoodMusic.Menu.Controller);
gm.config(["$logProvider", "$routeProvider", function ($logProvider, $routeProvider) {
        $logProvider.debugEnabled(GoodMusic.debugEnabled);
        $routeProvider
            .when("/home", { name: "home", templateUrl: "Views/home.html" })
            .when("/search/:genreUri?", {
            name: "search",
            templateUrl: "Views/search.html",
            controller: GoodMusic.Search.Controller,
            controllerAs: "$ctrl"
        })
            .when("/videos/:period/:genreUri/:styleUri?", {
            name: "load",
            templateUrl: "Views/videos.html",
            controller: GoodMusic.Videos.Controller,
            controllerAs: "$ctrl"
        })
            .when("/videos", {
            name: "list",
            templateUrl: "Views/videos.html",
            controller: GoodMusic.Videos.Controller,
            controllerAs: "$ctrl"
        })
            .when("/video", {
            name: "play",
            templateUrl: "Views/video.html",
            controller: GoodMusic.Video.Controller,
            controllerAs: "$ctrl"
        })
            .otherwise({ redirectTo: "/home" })
            .caseInsensitiveMatch = true;
    }]);
gm.run(["$authentication", "$log", function ($authentication, $log) {
        $log.debug("gm:run");
    }]);
//# sourceMappingURL=goodmusic.js.map