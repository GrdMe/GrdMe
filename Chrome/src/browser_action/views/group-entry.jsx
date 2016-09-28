var React = require('react');
var ReactDOM = require('react-dom');

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    //Need a specific proptype check
    members: React.PropTypes.object.isRequired
  },

//TODO: Include a member view in this

  render: function(){
    console.log(this.props.members);
    return(
      <div className="groupEntry">
      <p >{this.props.name}</p>
      <input type="radio"/>
      </div>
    )
  }
});

export default GroupEntry;
