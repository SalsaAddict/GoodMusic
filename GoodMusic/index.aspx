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
</head>
<body>
    {{$rootScope}}
    authenticated: {{$authenticated}}<br />
    <button type="button" ng-click="$login()">Login</button>
    <button type="button" ng-click="$logout()">Logout</button>
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
