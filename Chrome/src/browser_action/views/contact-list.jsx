var React = require('react');
var ContactEntry = require('./contact-entry.jsx');
var StorageManager = require('./storage_manager.js');
var noContacts = "";

var ContactList = React.createClass({

  getInitialState : function(){
    return {contacts : null};
  },

  getContacts : function(){
    //StorageManager.getContacts(x => {this.setState({contacts : x})}, []);
    var self = this;
    chrome.storage.local.get({contact : {}}, function(result){
        //console.log("this is the result: " + result.contact);
        self.setState({contacts : Object.keys(result.contact)});
    });
  },

  renderContacts : function(){
    if(this.state.contacts == null){
      //noContacts = "You don't have any contacts yet!";
      this.getContacts();
      return null;
    }else{
    //noContacts = '';
    var contactEntries = this.state.contacts.map(x => <ContactEntry name={x} refresh={this.refreshContact}/>)
    //var contactEntries = contacts.map(x => <ContactEntry name={x} delete={this.deleteContact}/>)

    return(contactEntries);
    }
  },

  refreshContact : function(){
      //noContacts = "You don't have any contacts yet!";
      this.setState({contacts : null});
  },

  render: function(){
        return(
          <div id = "contact_list">
            {this.renderContacts()}
            {/* <p>{noContacts}</p> */}
          </div>
        );
  }
});

module.exports = ContactList;
