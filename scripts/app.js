
var app =angular
  .module("ResturantController", ['firebase']);
app.controller('ResturantController',['$scope', '$firebaseArray','$http', function ($scope, $firebaseArray,$http) {

    $scope.foods = [{}];
    $scope.drinks = [{}];
    $scope.order = [];
    $scope.itemOrder = [];
    $scope.totOrders = 0;
    $scope.InvoiceShow = false;
    $scope.InvoiceNo = 1;
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
        //console.log(item);
        $scope.selection = [];
        $scope.pick = true;
        $scope.itemSelect = item;
        $scope.itemOrder.Picks = $scope.selection;
        $scope.itemOrder.title = item.title;
        $scope.itemOrder.price = item.price;
        console.log($scope.itemOrder);
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


    $scope.getDate = function () {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
        var yyyy = today.getFullYear();

        var date = dd + "/" + mm + "/" + yyyy

        return date
    };

    $scope.addToOrder = function (item, qty) {
      //  console.log(item);
        item.picks = $scope.selection;
        var flag = 0;
        if ($scope.order.length > 0) {
          
            if (flag === 0) {
           
                item.qty = 1;
               
            }
            if (item.qty < 2) {
              
                $scope.order.push(item);
                $scope.totOrders++;
            }
        } else {
            item.qty = qty;
            $scope.order.push(item);
            $scope.totOrders++;
        }
        console.log($scope.order);
       // $scope.order = [];
    };

    $scope.removeOneEntity = function (item) {
        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {
                item.qty -= 1;
                if (item.qty === 0) {
                    $scope.order.splice(i, 1);
                }
            }
        }
    };

    $scope.removeItem = function (item) {
        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {
                $scope.order.splice(i, 1);
            }
        }
    };

    $scope.getTotal = function () {
        var tot = 0;
        for (var i = 0; i < $scope.order.length; i++) {
            tot += ($scope.order[i].price * $scope.order[i].qty)
        }
        return tot;
    };
    $scope.getVat = function () {
        var Vat = 0;
        var tot = $scope.getTotal();
        var Vat = tot * .05;
        return Vat;
    }
    $scope.getFinalPrice=function(){
        var tot =$scope.getTotal();
        var vat = $scope.getVat();
        return tot - vat;
    }

    $scope.clearOrder = function () {
        $scope.totOrders = 0;
        $scope.order = [];
    };

    $scope.checkout = function (index) {
      
        swal({
            title: "Are you sure?",
            text: "You will Confirm your Order",
            icon: "warning",
            buttons: [
              'No, cancel it!',
              'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(function(isConfirm) {
            if (isConfirm) {
               

                    var ref = firebase.database().ref().child('resturantBill');
                    $scope.reservations = $firebaseArray(ref);
                    $scope.InvoiceNo++;
                    var itemName="";
                    var itemPrice=0;
                    var itemPicks="";
                    var Date="";
                    angular.forEach($scope.order, function (value, key) {
                      //  console.log($scope.order);
                         //InvoiceNo=1;
                         itemName +=  value.title +",...";
                         console.log(itemName);
                         itemPrice = $scope.getTotal();
                         itemPicks += value.title+":"+value.picks + "...";
                         Date = $scope.getDate();
                    });
      
                    swal({
                        title: 'Now loading',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        icon:'loading',
                        timer: 2000,
                      
                    });

                    // alert(birth);
                   // console.log("name : " + name + "   " + email + "   0 " + tel + "  " + period + "  " + date);
                    $scope.reservations.$add({

                        InvoiceNo: $scope.InvoiceNo,
                        itemsName: itemName,
                        itemsPrice:itemPrice,
                        itemsPicks:itemPicks,
                        Date: Date

                    }

                  ).then(function (ref) {
                      swal({
                          title: 'Save Data!',
                          text: 'Data Was Saved',
                          icon: 'success'
                      }).then(function () {
                         // console.log("done")
             
                         
                          html2canvas(document.getElementById('orderPDF'), {
                              onrendered: function (canvas) {
                                  var data = canvas.toDataURL();
                                  var docDefinition = {
                                      content: [{
                                          image: data,
                                          width: 500
                                      }]
                                  };
                                  pdfMake.createPdf(docDefinition).download("Invoice.pdf");
                              }
                          });
                          $scope.InvoiceShow = true;
                      // $scope.order=[];
                       
                          $scope.$apply();
                      })
                      //form.submit();
                  });

                
                
            }
            else {
                swal("Cancelled", "you can configure another one :)", "error");
                $scope.order = [];
                $scope.$apply();
            }
        });
   





        
        $scope.totOrders += 1;
    };



}
 ] )
