var React = require('react');
var HeadPanel = require('../head-panel.jsx');
var ContactSelection = require('./contact-selection.jsx');

var NewGroupPage = React.createClass({

  render : function(){
    return(
      <div>
        <HeadPanel>NEW GROUP</HeadPanel>
        <div>
          GROUP NAME
          <input
            type="text"
            value="THIS IS A GREAT GROUP. THE BEST GROUP"  //hard coded right now, will add in front-end functionality to support backend
          />
        </div>
        <ContactSelection/>
        <button className="blue-button">Create Group</button>
        <button className="blue-button">Cancel</button>
      </div>
    );
  }

});

module.exports = NewGroupPage;
