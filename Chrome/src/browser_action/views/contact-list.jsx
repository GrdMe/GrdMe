var React = require('react');
var ContactEntry = require('./contact-entry.jsx');
var StorageManager = require('./storage_manager.js');

var ContactList = React.createClass({

  getInitialState : function(){
    return {contacts : {}};
  },

  getContacts : function(){
    //StorageManager.getContacts(x => {this.setState({contacts : x})}, []);
    var contacts = ["Aubrey Graham","Dexter Robinson", "Edith Worth"]
    //var contactEntries = this.state.contacts.map(x => <ContactEntry name={x} delete={this.deleteContact}/>)
    var contactEntries = contacts.map(x => <ContactEntry name={x} delete={this.deleteContact}/>)
    return(contactEntries);
  },

  deleteContact : function(id){

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
