var React = require('react');
var HeadPanel = require('../head-panel.jsx');
var ContactList = require('./contact-list.jsx');

var ContactsPage = React.createClass({

  render: function(){
    return(
      <div>
        <HeadPanel>
        <div className="back-button"><button type="button" id="blue-button" onClick={this.props.back}>&lt;</button></div>
            CONTACTS
        </HeadPanel>
        <ContactList/>

        <div id = "contact_footer">
          <h2>To add a new contact, have someone send you their GrdMe ID</h2>
        </div>

      </div>
    );
  }
});

module.exports = ContactsPage;
