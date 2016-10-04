var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var UnaddedContacts = React.createClass({
  getContacts : function(){
      //Hardwiring contacts for now
      var contacts = ["Monal", "Avi", "Karen", "Svend", "Frank", "Taylor", "Spencer"]
      //TODO: fix key to be unique
      var contactEntries = contacts.map(x => <ContactEntry key={x} name={x}/>);
      return(contactEntries);
  },

  render : function(){
    return(
      <div id="unadded-list">
        {this.getContacts()}
      </div>
    );
  }
});

module.exports = UnaddedContacts;
