'use strict';

import Reflux    from 'reflux';
import Api       from '../utils/api.react';
import Actions   from '../actions/actions.react';
import UserStore from '../stores/user.react';

const Store = Reflux.createStore({
  listenables: [Actions],

  init() {
    this.state = [];

    return this.state;
  },

  getState() {
    return this.state || [];
  },

  dataLoaded (list) {
    const state = this.state || [];
    state.length && state.splice(0, state.length);

    list.forEach(item => {
      state.push(this.mapExpense(item));
    });

    this.state = state;

    return state;
  },

  mapExpense(item) {
    return {
      id: item.id,
      description: item.description,
      date: (item.date && item.date.length > 10 && item.date.substring(0, 10)) || item.date,
      time: (item.time && item.time.length > 5 && item.time.substring(0, 5)) || item.time,
      amount: item.amount,
      comment: item.comment
    };
  },

  onExpensesLoad(filter) {
    const user = UserStore.getState();

    if(!user || !user.token) {
      Actions.expensesLoad.failed('user have no auth');
    }

    Actions.expensesLoad.progressed(filter);

    filter = filter || {};
    return Api.expenses.get(filter, user)
      .fail(res => {
        if(res.responseJSON) {
          return Actions.expensesLoad.failed(res.responseJSON);
        }
        try{
          var error = JSON.parse(res.responseText);
          Actions.expensesLoad.failed(error);
        }catch(e){
          Actions.expensesLoad.failed({error: res.responseText});
        }
      })
      .done(data => Actions.expensesLoad.completed(this.dataLoaded(data)));
  },

  sort (expenses) {

    expenses.sort((a, b) => {
      if(a.date > b.date){
          return 1;
      }
      if(a.date < b.date){
          return -1;
      }
      if(a.time > b.time){
          return 1;
      }
      if(a.time < b.time){
          return -1;
      }
      return 0;
    });

    return expenses;
  },

  del(expense) {
    const state = this.state;
    const index = this.findExpense(expense);

    if(index > -1 ) {
      state.splice(index, 1);
    }

    return state;
  },

  update(expense){
    const state = this.state;
    const item = this.mapExpense(expense);
    const index = this.findExpense(expense);

    if(index > -1 ) {
      state.splice(index, 1, item);
    }

    return state;
  },

  findExpense (expense) {
    const state = this.state;
    const o = state.filter((item) => item.id === expense.id).pop();

    return state.indexOf(o);
  },

  insert(expense){
    const state = this.state;
    const item = this.mapExpense(expense);

    state.push(item);

    this.state = this.sort(state);

    return state;
  },

  onExpenseUpdate(expense) {
    const user = UserStore.getState();

    if(!user || !user.token) {
      Actions.expenseUpdate.failed('user have no auth');
    }

    Actions.expenseUpdate.progressed(expense);

    return Api.expenses.update(expense, user)
      .fail(res => Actions.expenseUpdate.failed(res.responseJSON))
      .done(data => Actions.expenseUpdate.completed(this.update(data), expense));
  },

  onExpenseInsert(expense) {
    const user = UserStore.getState();

    if(!user || !user.token) {
      Actions.expenseInsert.failed('user have no auth');
    }

    Actions.expenseInsert.progressed(expense);
    return Api.expenses.insert(expense, user)
      .fail(res => Actions.expenseInsert.failed(res.responseJSON))
      .done(data => Actions.expenseInsert.completed(this.insert(data), expense));
  },

  onExpenseDelete(expense) {
    const user = UserStore.getState();

    if(!user || !user.token) {
      Actions.expenseDelete.failed('user have no auth');
    }

    Actions.expenseDelete.progressed(expense);

    return Api.expenses.del(expense, user)
      .fail(res => Actions.expenseDelete.failed(res.responseJSON))
      .done(() => Actions.expenseDelete.completed(this.del(expense), expense));
  }
});

export default Store;
