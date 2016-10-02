var React = require('react');
var GroupEntry = require('./group-entry.jsx');
var GroupList = require('./group-list.jsx');
var HeadPanel = require('./head-panel.jsx');
var KeyInfo = require('./key-info.jsx');

var Buttons = React.createClass({
  clickGroup: function(){
    ReactDOM.render(
      <GroupEntry/>,
      document.getElementById('page')
    );
  },

  render: function(){
    return(
      <div id="top-buttons">
        <button type="button" className="gray-button" id="new-group" >+ NEW GROUP</button>
        <button type="button" className="gray-button" id="manage-contacts" onClick={this.clickGroup}>MANAGE CONTACTS</button>
      </div>
    )
  }
});

var GroupPage = React.createClass({
  render: function(){
    return(
      <div className="no-padding">
        {/* <HeadPanel>GROUPS</HeadPanel>
        <Buttons/>
        <GroupList/>
        <KeyInfo/> */}
        <HeadPanel>NEW GROUP</HeadPanel>
      </div>
    );
  }
});

module.exports = GroupPage;
