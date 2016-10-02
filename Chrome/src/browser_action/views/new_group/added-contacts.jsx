var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var AddedContacts = React.createClass({
  getContacts : function(){
      //Hardwiring contacts for now
      var contacts = ["Steve", "Frank", "Colin", "The guy who hearts Colin but it is afraid to show his feelings so he is waiting for the perfect moment to show and he HOPES that GrdMe will be the perfect opportunity"]
      var contactEntries = contacts.map(x => <ContactEntry name={x}/>);
      return(contactEntries);
  },

  render : function(){
    return(
      <div>
        {this.getContacts()}
      </div>
    );
  }
});

module.exports = AddedContacts;
