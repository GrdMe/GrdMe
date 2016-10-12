var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var ContactList = React.createClass({

  getContacts : function(){
    var contacts = ["Aubrey Graham","Dexter Robinson", "Edith Worth"]
    var contactEntries = contacts.map(x => <ContactEntry name={x}/>)
    return(contactEntries);
  },

  render: function(){
    return(
      <div id = "contact_list">
        {this.getContacts()}
      </div>
    );
  }
});

module.exports = ContactList;
