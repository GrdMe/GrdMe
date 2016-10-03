var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var AddedContacts = React.createClass({
  getContacts : function(){
      //Hardwiring contacts for now
      var contacts = ["Steve", "Frank", "Colin", "Katelyn"]
      var contactEntries = contacts.map(x => <ContactEntry name={x}/>);
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
