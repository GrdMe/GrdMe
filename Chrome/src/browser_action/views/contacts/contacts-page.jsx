var React = require('react');
var HeadPanel = require('../head-panel.jsx');
var ContactList = require('./contact-list.jsx');

var ContactsPage = React.createClass({
  render: function(){
    return(
      <div>
        <HeadPanel>CONTACTS</HeadPanel>
        <ContactList/>
        <p>To add a new contact, have someone send you their GrdMe ID</p>
      </div>
    );
  }
});

module.exports = ContactsPage;
