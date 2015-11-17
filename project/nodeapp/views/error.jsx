+(function(require) {

var React = require('react');
var DefaultLayout = require('./layout');

  // h1= message
  // h2= error.status
  // pre #{error.stack}

var ErrorMessage = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <h1>{this.props.message}</h1>
        <p>{this.props.error.status}</p>
        <div>{this.props.error.stack}</div>
      </DefaultLayout>
    );
  }
});

module.exports = ErrorMessage;

})(require);