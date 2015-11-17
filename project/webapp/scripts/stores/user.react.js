'use strict';

import Api       from '../utils/api.react';
import Reflux    from 'reflux';
import Actions   from '../actions/actions.react';

const Store = Reflux.createStore({
  listenables: [Actions],

  init() {
    this.state = this.getInitialState();

    return this.state;
  },

  getState() {
    return this.state;
  },

  getInitialState() {
    this.state = false;
    try{
      this.state = localStorage.user && JSON.parse(localStorage.user);
    }catch(e){ window.console && console.log && console.log(e); }

    this.state && Actions.signIn.completed(this.state);

    return this.state;
  },

  onLogOut() {
    delete localStorage.user;
    this.state = false;
  },

  setUser(user) {
    localStorage.user = JSON.stringify(user);
    this.state = user;
  },

  onSignIn(user) {

    Actions.signIn.progressed();

    return Api.user.signIn(user)
    .fail((res) => {
      Actions.signIn.failed(res.responseJSON);
    })//AppDispatcher.dispatch({actionType: actions.loginFailed, data: res.responseJSON}))
    .done((data) => {
      this.setUser(data);
      Actions.signIn.completed(data);

    });//AppDispatcher.dispatch({actionType: actions.signIn, data: data}));

  },

  onRegister(user) {

    Actions.register.progressed();

    return Api.user.register(user)
    .fail((res) => {
      Actions.register.failed(res.responseJSON);
    })
    .done((data) => {
      this.setUser(data);
      Actions.register.completed(data);

    });

  }
});

export default Store;
