'use strict';

 angular.module('expenseApp', [
  'ngStorage',
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
   .config(function ($urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $localStorage, $location) {
    var $storage = $localStorage.$default({user: {}});

    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($storage.user.token) {
          config.headers.Authorization = $storage.user.token;
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $storage.user = {};
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
