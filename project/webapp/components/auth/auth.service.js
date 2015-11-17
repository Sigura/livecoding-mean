'use strict';

angular.module('expenseApp')
  .factory('Auth', function Auth($location, $rootScope, $http, $localStorage, $q) {
    var currentUser = {};
    var $storage = $localStorage.$default({user: {}});
    var user = $storage.user;

    if(user && user.token) {
      currentUser = user;
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/users', {
          name: user.email,
          password: user.password
        })
        .success(function(data) {
          currentUser = $storage.user = data;
          deferred.resolve(data);
          return cb();
        })
        .error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $storage.user = currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.put('/api/users', user)
        .success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = data;//User.get();
          deferred.resolve(data);
          return cb(data);
        })
        .error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(/*oldPassword, newPassword, callback*/) {
        //var cb = callback || angular.noop;

        throw 'not implemented';
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return !!currentUser.token;
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return false;
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token') || currentUser.token;
      }
    };
  });
