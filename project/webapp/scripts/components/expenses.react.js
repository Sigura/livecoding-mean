'use strict';

import React         from 'react';
import objectAssign  from 'object-assign'
import
{FormattedMessage}   from 'react-intl'
import groupBy       from '../constants/groupBy.react'
import AppDispatcher from '../dispatcher/dispatcher.react'
import extensions    from '../utils/extensions.react'
import context       from '../utils/context.react'
import Actions       from '../actions/actions.react'
import UserStore     from '../stores/user.react'
import ExpenseStore  from '../stores/expenses.react'

/*eslint-disable no-unused-vars*/
import Alerts        from './alerts.react'
import GroupBy       from './groupByFilter.react'
import Filter        from './filter.react'
import ExpenseGroup  from './expenseGroup.react'
import NewExpense    from './newExpense.react'
/*eslint-enable no-unused-vars*/

export default
//@context @extensions
class Expenses extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = this.getInitState();
  }

  getInitState() {
    return {
      groupBy: (this.props.params && this.props.params.groupBy) || groupBy.All,
      newExpense: {},
      items: {[groupBy.All]: []},
      groups: [groupBy.All],
      format: '',
      loading: true
    };
  }

  componentWillReceiveProps(obj){
    let group = (obj.params && obj.params.groupBy) || groupBy.All;
    this.setState({groupBy: group});
    this.update(obj.list, group);
  }

  update(expenses, group) {
    group = group || this.state.groupBy;
    expenses = expenses || this.props.list;
    let grouped = this.groupDictionary(expenses, group);

    this.setState(grouped);
    this.setState({loading: false, groupBy: group});
  }

  // simulateChange(ev){
    // React.addons.TestUtils.simulateNativeEventOnNode('topInput', ev.target, {type:'input', target: ev.target});
    // ev.stopImmediatePropagation();
  // }

  static filterChanged (filter) {
    Actions.expensesLoad(filter);
  }

  static groupFormat(groupByLabel){
    var groupFormat = null;
    switch(groupByLabel){
      case groupBy.Week:
        groupFormat = 'YYYY-[W]ww';
        break;
      case groupBy.Month:
        groupFormat = 'YYYY-MM';
        break;
      case groupBy.Year:
        groupFormat = 'YYYY';
        break;
    }
    return groupFormat;
  }

  groupDictionary(expenses, group) {
    const state = this.state;
    var groupDictionary, groups = [], groupFormat = Expenses.groupFormat(group || state.groupBy);

    if(groupFormat) {
      groupDictionary = {};
      expenses.forEach((item) => {
        var key = moment(item.date).format(groupFormat);
        var groupExists = key in groupDictionary;
        groupDictionary[key] = groupDictionary[key] || [];
        groupDictionary[key].push(item);
        !groupExists && groups.push(key);
      });
    }
    return groupDictionary ? {items: groupDictionary, groups: groups, format: groupFormat} : {items: {'all': expenses}, groups: ['all'], format: ''};
  }

  static logOut(){
    Actions.logOut();
  }

  render() {
    const _ = this;
    const cx = _.classSet;
    const state = _.state;
    const len = this.props.list && this.props.list.length || 0;
    const maxDate = len && this.props.list[0].date;
    const minDate = len && this.props.list[len - 1].date;
    const sum = len && this.props.list.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
    const duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
    const days = (duration && duration.count('days')) || (len && 1) || 0;
    const avg = (len && sum/len) || 0;
    const dayAvg = (days && sum/days) || 0;
    const weeks = (duration && duration.count('weeks')) || (len && 1) || 0;
    const weekAvg = weeks && sum/weeks || dayAvg;
    const months = (duration && duration.count('months')) || (len && 1) || 0;
    const monthAvg = (months && sum/months) || weekAvg || dayAvg;
    const years = (duration && duration.count('years')) || (len && 1) || 0;
    const yearAvg = (years && sum/years) || monthAvg || weekAvg || dayAvg;
    const width100P = {width: '100%'};

    return (
      <div className="expenses-list panel panel-default">
        <div className="panel-heading">
          <div className="btn-toolbar pull-right hidden-print"><a className="btn btn-default logout" href="javascript:void(0);" onClick={Expenses.logOut.bind(_)}>Logout</a></div>
          <h2><FormattedMessage message={_.l10n('Expenses')}/></h2>
        </div>
        <div className={cx({'panel-body': true, 'hidden-print': true, 'hide-element': !state.loading})}>
          <div className="progress">
            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={width100P}>
            </div>
          </div>
        </div>
        <div className={cx({'panel-body': true, 'hide-element': state.loading})}>
          <Alerts />
          <div className="col-sm-8">
            <GroupBy />
            <Filter onFilterChanged={Expenses.filterChanged} />
          </div>
        </div>
        <table className={cx({'table': true, 'table-hover': true, 'table-condensed': true, 'hide-element': state.loading})}>
          <thead>
            <tr>
              <th></th><th><FormattedMessage message={_.l10n('Date')}/></th><th>Time</th><th>Description</th><th>Amount</th><th>Comment</th>
            </tr>
          </thead>
          <tfoot>
          <tr className="info total">
            <td>Total:</td>
            <td colSpan="5"><FormattedMessage message={_.l10n('Total')} avg={avg} length={len} sum={sum} dayAvg={dayAvg} days={days} weekAvg={weekAvg} weeks={weeks} monthAvg={monthAvg} months={months} yearAvg={yearAvg} years={years} /></td>
          </tr>
          </tfoot>
          <NewExpense />
          {state.groups.map(function(name, i) {
            return <ExpenseGroup key={state.groupBy + name + i} index={i} groupBy={state.groupBy} name={name} expenses={_.state.items[name]} format={state.format} />;
            })}
        </table>
      </div>
    );
  }

}

Expenses.displayName = 'Expenses';

extensions(Expenses);
context(Expenses);
