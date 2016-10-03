var React = require('react');

var ContactEntry = React.createClass({

  render : function(){
    return(
      <div id="contact-info">
        {this.props.name}
      </div>
    );
  }
});

module.exports = ContactEntry;
