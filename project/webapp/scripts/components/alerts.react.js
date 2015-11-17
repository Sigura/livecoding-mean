'use strict';

import React           from 'react'
import context         from '../utils/context.react'
import lodash          from 'lodash'
import extensions      from '../utils/extensions.react'
import Actions         from '../actions/actions.react'

export default
//@context @extensions
class Alerts extends React.Component {
  constructor (props, context) {

    super(props, context);

    this.state = Alerts.getInitState();
    this.registerEvents();
  }

  static getInitState () {
    return {alerts: []};
  }

  componentDidMount () {

    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
  }

  registerEvents() {
    const error = this.addErrors.bind(this);

    this.unsubscribes = [
      Actions.expensesLoad.completed.listen(this.addAlert.bind(this, 'expensesLoaded', false)),
      Actions.expenseUpdate.completed.listen(this.addAlert.bind(this, 'expenseUpdated', false)),
      Actions.expenseInsert.completed.listen(this.addAlert.bind(this, 'expenseInserted', false)),
      Actions.expenseDelete.completed.listen(this.addAlert.bind(this, 'expenseDeleted', false)),
      Actions.expensesLoad.failed.listen(error),
      Actions.expenseUpdate.failed.listen(error),
      Actions.expenseInsert.failed.listen(error),
      Actions.expenseDelete.failed.listen(error)
    ];
  }

  setupRemoveTimer (error) {
    setTimeout(() => {
      let index = this.state.alerts.indexOf(error);

      if (index === -1) {
        return;
      }

      this.state.alerts.splice(index, 1);
      this.mounted && this.setState({alerts: this.state.alerts});
    }, 5000);
  }

  addErrors (data) {

    data && data.error && !data.error.errors && this.addAlert(data.error.message || data.error, true);

    data && data.error && lodash.uniq(data.error.errors || [], 'msg')
      .forEach((item) => {
        this.addAlert(/*item.param + ':' + */item.msg, true);
      });
  }

  addAlert (text, isError) {
    const alert = {
        text: this.l10n(text) || text,
        error: !!isError
      };
    this.state.alerts.push(alert);
    this.mounted && this.setState({alerts: this.state.alerts});
    this.setupRemoveTimer(alert);
  }

  render () {

    const _ = this;
    const cx = _.classSet;
    const state = this.state;

    return (<div className={cx({'col-sm-4': true, 'float-right': true, 'hidden-print': true, 'list-group': true, 'col-sm-6': true, 'hide-element': !state.alerts.length})}>
      {state.alerts.map(function(item, i){
        return <div key={'alert-item-' + i} className={cx({'list-group-item': true, 'list-group-item-success': !item.error, 'list-group-item-danger': item.error})} role="alert">{item.text}</div>;
      })}
      </div>);
  }

}

context(Alerts);
extensions(Alerts);

