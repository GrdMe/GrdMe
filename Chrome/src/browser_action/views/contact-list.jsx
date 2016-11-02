var React = require('react');
var ContactEntry = require('./contact-entry.jsx');

var ContactList = React.createClass({

  getInitialState : function(){
    return {contacts : null};
  },

  getContacts : function(){
    //StorageManager.getContacts(x => {this.setState({contacts : x})}, []);
    var self = this;
    chrome.storage.local.get({contact : {}}, function(result){
      console.log(result);
        self.setState({contacts : Object.keys(result.contact)});
    });
  },

  renderContacts : function(){
    if(this.state.contacts == null){
      this.getContacts();
      return null;
    }

    var contactEntries = this.state.contacts.map(x => <ContactEntry name={x} refresh={this.refreshContact}/>)
    //var contactEntries = contacts.map(x => <ContactEntry name={x} delete={this.deleteContact}/>)

    return(contactEntries);
  },

  refreshContact : function(){
      this.setState({contacts : null});
  },

  render: function(){
    return(
      <div id = "contact_list">
        {this.renderContacts()}
      </div>
    );
  }
});

module.exports = ContactList;
