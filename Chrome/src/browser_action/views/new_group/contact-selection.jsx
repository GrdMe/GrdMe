var React = require('react');
var UnaddedContacts = require('./unadded-contacts.jsx');
var AddedContacts = require('./added-contacts.jsx');

var ContactSelection = React.createClass({
  render : function(){
      return(
        <div>
          MEMBERS
          Filter
          <input
            type="text"
            value="IM LOOKING FOR BOB HAVE YOU SEEN HIM"  //hard coded right now, will add in front-end functionality to support backend
          />
          <UnaddedContacts/>
          Added
          <AddedContacts/>
        </div>
      );
  }
});

module.exports = ContactSelection;
