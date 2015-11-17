'use strict';

import Reflux from 'reflux';

const Actions = Reflux.createActions({
  signIn: { asyncResult: true, children: ['progressed'] },
  logOut: { },
  register: { asyncResult: true, children: ['progressed'] },
  apiError: { asyncResult: true, children: ['progressed'] },

  groupChanged: { asyncResult: true, children: ['progressed'] },
  copyToNewExpense: { },
  expenseFiltered: { asyncResult: true, children: ['progressed'] },

  expensesLoad: { asyncResult: true, children: ['progressed'] },
  expenseUpdate: { asyncResult: true, children: ['progressed'] },
  expenseInsert: { asyncResult: true, children: ['progressed'] },
  expenseDelete: { asyncResult: true, children: ['progressed'] }
});


export default Actions;
