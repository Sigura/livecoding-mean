'use strict';

import React         from 'react'
import {FormattedNumber} from 'react-intl'
import groupBy       from '../constants/groupBy.react'
/*eslint-disable no-unused-vars*/
import Expense       from './expense.react'
/*eslint-enable no-unused-vars*/

export default
class ExpenseGroup extends React.Component {

  constructor(props, context){

    super(props, context);

    this.state = {expenses: [], groupBy: 'all'};
  }

  render () {
    const _ = this;
    const expenses = _.props.expenses;
    const len = expenses.length;
    const sum = len && expenses.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
    const maxDate = len && expenses[0].date;
    const minDate = len && expenses[len - 1].date;
    const duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
    const days = (duration && duration.count('days')) || (len && 1) || 0;
    const dayAvg = (days && len && (sum/len)) || 0;
    const expenseList = (len && expenses.map(function(expense) {
      return <Expense key={'expense-' + expense.id} expense={expense} />;
    })) || '';

    const summary = (
      <tr key={'group-total-' + _.props.groupBy + '-' + _.props.name + '-' + _.props.index} className="info group-summary">
        <td colSpan="4">{moment(maxDate).format(_.props.format)}</td>
        <td colSpan="2">Sum: <FormattedNumber value={sum} format="USD" />, Avg: <FormattedNumber value={dayAvg} format="USD" /></td>
      </tr>
    );
    if(expenseList && _.props.groupBy !== groupBy.All) {
      expenseList.unshift(summary);
    }

    return <tbody>{expenseList}</tbody>;
  }
}

