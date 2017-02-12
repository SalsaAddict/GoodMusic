<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="GoodMusic.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en-gb" ng-app="gm">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Good Music for Dance</title>
    <link rel="stylesheet" type="text/css" href="Content/bootstrap.simplex.min.css">
    <link rel="stylesheet" type="text/css" href="Content/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="Content/goodmusic.min.css">
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
                <span class="navbar-brand ellipsis">
                    <b>{{$playlist || "Good Music"}}</b>
                </span>
            </div>
            <div class="navbar-collapse" uib-collapse="$menu.collapsed">
                <div class="navbar-right">
                    <div class="separator"></div>
                    <button type="button" class="btn btn-sm btn-default navbar-btn" ng-click="$login()" ng-if="!$authenticated">Login</button>
                    <p class="navbar-text" ng-if="$authenticated"><small>{{$username}}</small></p>
                    <button type="button" class="btn btn-sm btn-default navbar-btn" ng-click="$logout()" ng-if="$authenticated">Logout</button>
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
    <script type="text/javascript" src="Scripts/goodmusic/goodmusic.min.js?v=<%= RandomGuid %>"></script>
    <script type="text/javascript" src="//connect.facebook.net/en_US/sdk.js"></script>
</body>
</html>
