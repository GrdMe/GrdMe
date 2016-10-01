var React = require('react');

var ContactEntry = React.createClass({
  propTypes : {
    name : React.PropTypes.string.isRequired
  },

  render : function(){
    return(
      <div>
        {this.props.name}
      </div>
    );
  }
});

module.exports = ContactEntry;
