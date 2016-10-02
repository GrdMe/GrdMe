var React = require('react');
var GroupEntry = require('./group-entry.jsx');
var GroupList = require('./group-list.jsx');
var HeadPanel = require('../head-panel.jsx');
var KeyInfo = require('./key-info.jsx');

var Buttons = React.createClass({
  clickGroup: function(){
    ReactDOM.render(
      <GroupEntry/>,
      document.getElementById('page')
    );
  },

  render: function(){
    console.log("Ho");
    return(
      <div id="top-buttons">
<<<<<<< HEAD:Chrome/src/browser_action/views/group-page.jsx
        <button type="button" className="gray-button" id="new-group" >+ NEW GROUP</button>
        <button type="button" className="gray-button" id="manage-contacts" onClick={this.clickGroup}>MANAGE CONTACTS</button>
=======
        <button type="button" className="gray-button" id="new-group" onClick={this.props.navigate()}>+ NEW GROUP</button>
        <button type="button" className="gray-button" id="manage-contacts" onClick={this.props.navigate()}>MANAGE CONTACTS</button>
>>>>>>> react:Chrome/src/browser_action/views/groups/group-page.jsx
      </div>
    )
  }
});

var GroupPage = React.createClass({

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
      <div className="no-padding">
<<<<<<< HEAD:Chrome/src/browser_action/views/group-page.jsx
        {/* <HeadPanel>GROUPS</HeadPanel>
        <Buttons/>
=======
        <HeadPanel>GROUPS</HeadPanel>
        <Buttons navigate={this.navigate}/>
>>>>>>> react:Chrome/src/browser_action/views/groups/group-page.jsx
        <GroupList/>
        <KeyInfo/> */}
        <HeadPanel>NEW GROUP</HeadPanel>
      </div>
    );
  }
});

module.exports = GroupPage;
