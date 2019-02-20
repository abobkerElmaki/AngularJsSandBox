import angular from "angular";
import angularRoute from "angular-route";
angular
  .module("angularApp", [angularRoute, "mainController"])
  .config(function($routeProvider) {
    $routeProvider.when("/", {
      templateURL: "./index.html",
      controller: "mainController"
    });
  });
