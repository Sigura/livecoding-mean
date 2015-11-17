'use strict';

angular.module('expenseApp')
  .controller('MainCtrl', function ($scope, $http/*, socket*/) {
    $scope.expenses = [];

    $http.get('/api/expenses').success(function(expenses) {
      $scope.expenses = expenses;
      //socket.syncUpdates('expense', $scope.expenses);
    });

    $scope.addThing = function() {
      if(!$scope.newExpense) {
        return;
      }
      $http.post('/api/expenses', $scope.newExpense);
      $scope.newExpense;
    };

    $scope.deleteThing = function(expense) {
      $http.delete('/api/expenses/' + expense._id);
    };

    $scope.$on('$destroy', function () {
      //socket.unsyncUpdates('expense');
    });
  });
