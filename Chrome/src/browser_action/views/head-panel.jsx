var React = require('react');

var HeadPanel = React.createClass({
  render: function(){
    return(
      <div id="blue-panel">
        {this.props.children}
      </div>
    )
  }
});

module.exports = HeadPanel;
