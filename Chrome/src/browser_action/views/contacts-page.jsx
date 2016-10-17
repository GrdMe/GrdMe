var React = require('react');
var HeadPanel = require('./head-panel.jsx');
var ContactList = require('./contact-list.jsx');
var KeyInfo = require('./key-info.jsx');
var DisplayNameInfo = require('./display-name-info.jsx');
var StorageManager = require('./storage_manager.js');

var ContactsPage = React.createClass({

  render: function(){
    return(
      <div>
        <HeadPanel>CONTACTS</HeadPanel>
        <ContactList/>

        <div id = "contact_footer">
          <p>To add a new contact, have someone send you their GrdMe ID</p>
        </div>
        <KeyInfo/>
        <DisplayNameInfo/>
      </div>
    );
  }
});

module.exports = ContactsPage;
