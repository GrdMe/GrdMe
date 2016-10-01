var React = require('react');

var ContactEntry = React.createClass({

  render : function(){
    return(
      <div>
        {this.props.name}
      </div>
    );
  }
});

module.exports = ContactEntry;
