'use strict';

import React       from 'react'
import extensions  from '../utils/extensions.react'

export default
//@extensions
class Filter extends React.Component {

  constructor(props, context){

    super(props, context);

    this.state = {};
    this.refs = {};
  }

  onChange(e){
    const state = this.state;

    state[e.target.name] = e.target.value;

    this.setState(state);

    this.props.onFilterChanged && this.props.onFilterChanged(this.state);
  }

  componentDidMount() {

    this.buildComponents();
  }

  buildComponents() {

    if(this.refs.dateFrom) {
      $(this.refs.dateFrom.getDOMNode().parentNode)
        .datetimepicker({format: 'YYYY-MM-DD'})
        .on('dp.change', () => {
          this.onChange({target: this.refs.dateFrom.getDOMNode()});
        });
    }
    if(this.refs.dateTo) {
      $(this.refs.dateTo.getDOMNode().parentNode)
        .datetimepicker({format: 'YYYY-MM-DD'})
        .on('dp.change', () => {
          this.onChange({target: this.refs.dateTo.getDOMNode()});
        });
    }
  }

  clear () {
    const state = {dateFrom: '', dateTo: '', amountFrom: '', amountTo: ''};
    this.setState(state);
    this.props.onFilterChanged && this.props.onFilterChanged(state);
  }

  render () {
    const _ = this;
    const state = _.state;
    const cx = _.classSet;

    return (<div className={cx({'hidden-print': !(state.dateFrom || state.dateTo || state.amountFrom || state.amountTo)})}>
      <div className="panel panel-default">
        <div className="panel-heading hidden-print"><button className="btn btn-default btn-sm pull-right" onClick={_.clear.bind(_)}>Clear</button><span>Filter by</span></div>
        <div className="panel-body">
        <div className="row">
          <div className={cx({'hidden-print': !state.dateFrom, 'form-group': true, 'date-from': true, 'col-md-5': true})}>
            <label htmlFor="date-from">From date</label>
            <div className="input-group">
              <input type="text" className="form-control" name="dateFrom" ref="dateFrom" value={_.state.dateFrom} id="date-from" onChange={_.onChange.bind(_)} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
            </div>
          </div>
          <div className={cx({'hidden-print': !state.amountFrom, 'form-group': true, 'amount-from': true, 'col-md-4': true})}>
            <label htmlFor="amount-from">More then</label>
            <div className="input-group">
              <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
              <input type="text" className="form-control" name="amountFrom" ref="amountFrom" value={_.state.amountFrom} id="amount-from" onChange={_.onChange.bind(_)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className={cx({'hidden-print': !state.dateTo, 'form-group': true, 'date-to': true, 'col-md-5': true})}>
            <label htmlFor="date-to">To date</label>
            <div className="input-group">
              <input type="text" className="form-control" name="dateTo" ref="dateTo" id="date-to" value={_.state.dateTo} onChange={_.onChange.bind(_)} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
            </div>
          </div>
          <div className={cx({'hidden-print': !state.amountTo, 'form-group': true, 'amount-to': true, 'col-md-4': true})}>
            <label htmlFor="amount-to">Less then</label>
            <div className="input-group">
              <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
              <input type="text" className="form-control" name="amountTo" ref="amountTo" id="amount-to" value={_.state.amountTo} onChange={_.onChange.bind(_)} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>);
  }
}

extensions(Filter);
