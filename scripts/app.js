
angular
  .module("angularApp", ['ngRoute','mainController'])
  .config(function($routeProvider) {
    $routeProvider.when("/", {
      templateURL: "./index.html",
      controller: "mainController"
    });
  });
