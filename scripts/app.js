
var app =angular
  .module("ResturantController", []);
app.controller('ResturantController', function ($http, $scope) {

    $scope.foods = [{}];
    $scope.drinks = [{}];
    $http.get('../Foods.json').then(function (response) {
        var Foods = response.data;
        $scope.foods = Foods;
        $scope.pick = false;
        $scope.itemOrder = [{}];
       //  console.log($scope.foods);
    }
        );

    $http.get('../Drinks.json').then(function (response) {
        var Foods = response.data;
        $scope.drinks = Foods;
     
    }
    );
    $scope.ShowPicks = function (item) {
        $scope.pick = true;
        $scope.itemOrder = item;
    }

    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(picks) {
        var idx = $scope.selection.indexOf(picks);
        if (idx > -1) {
    
            $scope.selection.splice(idx, 1);
        }
        else {
        
            $scope.selection.push(picks);
        }
    };







}
  )
