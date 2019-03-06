
var app =angular
  .module("ResturantController", []);
app.controller('ResturantController', function ($http, $scope) {

    $scope.foods = [{}];
    $scope.drinks = [{}];
    $http.get('../Foods.json').then(function (response) {
        var Foods = response.data;
         $scope.foods = Foods;
       //  console.log($scope.foods);
    }
        );

    $http.get('../Drinks.json').then(function (response) {
        var Foods = response.data;
        $scope.drinks = Foods;
     
    }
    );

}
  )
