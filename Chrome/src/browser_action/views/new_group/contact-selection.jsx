var React = require('react');
var UnaddedContacts = require('./unadded-contacts.jsx');
var AddedContacts = require('./added-contacts.jsx');

var ContactSelection = React.createClass({
  render : function(){
      return(
        <div id="contact-selection">
          <p id="members">MEMBERS</p>
          <div className="table">
            <div className="left-col">
              <p id="filter">Filter</p>
              <input
                type="text"
                id="contact-search"
                defaultValue="Name"  //hard coded right now, will add in front-end functionality to support backend
              />
              <UnaddedContacts/>
            </div>
            <div className="right-col">
              <p id="added">Added</p>
              <AddedContacts/>
            </div>
          </div>
        </div>
      );
  }
});

module.exports = ContactSelection;
