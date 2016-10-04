var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var AddedContacts = React.createClass({
  getContacts : function(){
      //Hardwiring contacts for now
      var contacts = ["Steve", "Frank", "Colin", "Katelyn"]
      //TODO: Fix key to be  unique
      var contactEntries = contacts.map(x => <ContactEntry key={x} name={x}/>);
      return(contactEntries);
  },

  render : function(){
    return(
      <div id="added-list">
        {this.getContacts()}
      </div>
    );
  }
});

module.exports = AddedContacts;
