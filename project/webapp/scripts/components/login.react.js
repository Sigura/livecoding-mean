'use strict';

import extensions      from '../utils/extensions.react'
import AppDispatcher   from '../dispatcher/dispatcher.react'
import constants       from '../constants/actions.react'
import React           from 'react'
import
  {FormattedMessage}   from 'react-intl'
import context         from '../utils/context.react'
import Reflux          from 'reflux'
import Actions         from '../actions/actions.react'
import UserStore       from '../stores/user.react'

export default
//@extensions @context
class Login extends React.Component {

  constructor(props, context){

    super(props, context);

    this.state = {};
  }

  componentDidMount () {
    this.registerEvents();
  }

  componentWillUnmount() {
    this.unsabscribe.signInFailed();
    this.unsabscribe.registerFailed();
  }

  registerEvents() {

    this.unsabscribe = {
    signInFailed: Actions.signIn.failed.listen(this.error),
    registerFailed: Actions.register.failed.listen(this.error)
    };

  }

  updateState(res) {

    const state = this.state;
    state.id = res.id;
    state.token = res.token;
    state.operationStart = false;

    this.setState(state);
  }

  error(res) {

    const _ = this;
    const error = res && (res.responseJSON || res).error;
    const nameError = _.errorMessageByField(res, 'name');
    const passwordError = _.errorMessageByField(res, 'password');

    if(nameError || passwordError){
      _.state.errors = {
        name: nameError,
        password: passwordError
      };
    }
    _.state.error = typeof error === 'string' ? error : null;

    _.state.operationStart = false;

    console.info(_.state);

    _.setState(_.state);
  }

  signInHandler(/*event*/) {

    this.clearState();

    Actions.signIn(this.state);
  }

  toggleButtons() {

    [this.refs.signInButton, this.refs.registerButton].each(
      (item) =>
        $(item.getDOMNode()).button(!this.state.operationStart  ? 'reset' : 'loading')
    );
  }

  errorMessageByField(res, name) {
    const errors = res && res.error && res.error.errors;

    if(!errors || !errors.length){
      //console.info(res);
      return '';
    }

    const message = errors.filter((item) => item.param === name).shift();

    return message && message.msg;
  }

  clearState() {
    const _ = this;

    _.state.error = null;
    _.state.errors = null;
    _.state.operationStart = true;

    _.setState(this.state);
  }

  registerHandler(/*event*/) {
    const _ = this;

    _.clearState();

    Actions.register(_.state);
  }

  handleChange(event){
    this.state[event.target.name] = event.target.value.trim();

    this.setState(this.state);
  }

  static renderError(error) {
    return error ? (
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span className="sr-only">Error:</span>{error}
      </div>
    ) : null;

  }

  render() {
    const _ = this;
    const state = _.state;
    const error = Login.renderError(state.error);
    const errorName = state.errors && Login.renderError(state.errors.name);
    const errorPassword = state.errors && Login.renderError(state.errors.password);
    const cx = _.classSet;

    return (
      <form className="form-signin">
        <div className="row"><h2 className="form-signin-heading col-md-12"><FormattedMessage message={_.l10n('LoginFormTitle')}/></h2></div>
        <div className="row">
          <div className={cx({'col-md-12': true, 'form-group': true, 'has-success': state.errors && !state.errors.name, 'has-error': state.errors && state.errors.name})}><label htmlFor="email" className="sr-only">Email address</label>
          <input type="text" name="email" className="form-control" placeholder="Name or email address" required autofocus valueLink={_.valueLinkBuilder('name')} /></div>
        </div>
        <div className="row"><div className={cx({'col-md-12': true, 'form-group': true, 'has-success': state.errors && !state.errors.password, 'has-error': state.errors && state.errors.password})}>
          <label htmlFor="password" className="sr-only">Password</label>
          <input type="password" name="password" className="form-control" placeholder="Password" required valueLink={_.valueLinkBuilder('password')} /></div></div>
        <div className="row">
          <div className="error-list col-md-5"><FormattedMessage message={_.l10n('Error')} error={error} errorName={errorName} errorPassword={errorPassword} /></div>
          <div className="col-md-7" role="group">
            <div className="pull-right btn-group">
              <button className="btn btn-lg btn-primary signIn-button" onClick={_.signInHandler.bind(_)} type="button" data-loading-text="Wait response..." ref="signInButton">Sign in</button>
              <button className="btn btn-lg pull-right register-button" type="button" onClick={_.registerHandler.bind(_)} data-loading-text="Wait response..." ref="registerButton">Register</button>
            </div></div>
        </div>
      </form>
    );
  }

}

Login.displayName = 'Login';

extensions(Login);
context(Login);
