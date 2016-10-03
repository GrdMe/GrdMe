var React = require('react');
var HeadPanel = require('../head-panel.jsx');
var ContactList = require('./contact-list.jsx');

var Buttons = React.createClass({
  render: function(){
    return(
      <div className="back-button">
        <button type="button" id="blue-button" onClick={()=>{this.props.navigate(-1)}}>&lt;</button>
      </div>
    )
  }
});



var ContactsPage = React.createClass({

  navigate: function(page){
    switch (page) {
      case -1:
        this.props.newGroup();
        break;
      case 1:
        this.props.contacts();
        break;
      default:
        break;
    }
  },

  render: function(){
    return(
      <div>
        <HeadPanel>
        <Buttons navigate={this.navigate}/>
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
