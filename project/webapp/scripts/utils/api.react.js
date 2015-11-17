'use strict';

import lodash from 'lodash';

export default {
  user: {
    signIn (user) {
      return $.ajax('/api/users', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
          name: user.name,
          password: user.password
        })
      });
    },
    register (user) {
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          data: JSON.stringify({
          name: user.name,
          password: user.password
        })
        });
    }
  },
  expenses: {
    get: (filter, user) => {
      filter = filter || {};
      lodash.forOwn(filter, function(value, key) {
        if(!filter[key]) {
          delete filter[key];
        }
      });
      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        headers: {
          Authorization: user.token
        },
        data: filter
      });
    },
    insert: (expense, user) => {
      if(!expense.comment) {
        delete expense.comment;
      }

      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'PUT',
        headers: {
          Authorization: user.token
        },
        data: JSON.stringify(expense)
      });
    },
    update: (expense, user) => {
      if(!expense.comment) {
        delete expense.comment;
      }

      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        headers: {
        Authorization: user.token
        },
        data: JSON.stringify(expense)
      });
    },
    del: (expense, user) => {
      if(!expense.comment) {
        delete expense.comment;
      }

      return $.ajax('/api/expenses', {
        dataType: 'json',
        headers: {
          Authorization: user.token
        },
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify(expense)
      });
    }
  }
};
