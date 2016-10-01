var React = require('react');

var HeadPanel = React.createClass({
  render: function(){
    return(
      <div id="blue-panel">
        <p>{this.props.children}</p>
      </div>
    )
  }
});

module.exports = HeadPanel;
