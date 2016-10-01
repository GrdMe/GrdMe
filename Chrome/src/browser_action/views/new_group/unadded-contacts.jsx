var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var UnaddedContacts = React.createClass({
  getContacts : function(){
      //Hardwiring contacts for now
      var contacts = ["Monal", "Avi", "Karen", "Svend", "Frank the dog who likes peanut butter but is willing to give it up for lent"]
      var contactEntries = contacts.map(x => <ContactEntry name={x}/>);
      console.log(contactEntries);
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

module.exports = UnaddedContacts;
