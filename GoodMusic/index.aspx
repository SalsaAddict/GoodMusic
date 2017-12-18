<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="GoodMusic.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en-gb" ng-app="gm">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Good Music for Dance</title>
    <link rel="icon" type="image/x-icon" href="Content/favicon.ico">
    <link rel="stylesheet" type="text/css" href="Content/bootstrap.cerulean.min.css?v=<%= RandomGuid %>">
    <link rel="stylesheet" type="text/css" href="Content/font-awesome.min.css?v=<%= RandomGuid %>">
    <link rel="stylesheet" type="text/css" href="Content/goodmusic.min.css?v=<%= RandomGuid %>">
</head>
<body spellcheck="false" ng-cloak>
    <nav class="navbar navbar-inverse navbar-fixed-top" ng-controller="menuController as $menu">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" ng-click="$menu.toggle()"
                    ng-class="{ collapsed: $menu.collapsed, active: !$menu.collapsed }">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="" class="navbar-brand ellipsis">
                    <b>{{$menu.title}}</b>
                </a>
            </div>
            <div class="navbar-collapse" uib-collapse="$menu.collapsed">
                <ul class="nav navbar-nav navbar-left">
                    <li>
                        <a href="#!/home">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#!/search">
                            <i class="fa fa-search"></i>
                            <span>Search</span>
                        </a>
                    </li>
                    <li>
                        <a href="#!/add">
                            <i class="fa fa-plus-circle"></i>
                            <span>Add</span>
                        </a>
                    </li>
                </ul>
                <div class="navbar-right">
                    <p class="navbar-text" ng-if="$menu.authenticated">
                        <i class="fa fa-user"></i>
                        <small>{{$menu.username}}</small>
                    </p>
                    <ul class="nav navbar-nav">
                        <li>
                            <a href="#" ng-if="!$menu.authenticated" ng-click="$menu.login($event)">
                                <i class="fa fa-facebook-official"></i>
                                <span>Login</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" ng-if="$menu.authenticated" ng-click="$menu.logout($event)">
                                <i class="fa fa-facebook-official"></i>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <ng-view></ng-view>
    <script type="text/javascript" src="Scripts/angular.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="Scripts/angular-aria.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="Scripts/angular-animate.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="Scripts/angular-route.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="Scripts/angular-ui/ui-bootstrap-tpls.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>
    <script type="text/javascript" src="Scripts/goodmusic/goodmusic.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="https://connect.facebook.net/en_US/sdk.js"></script>
</body>
</html>
