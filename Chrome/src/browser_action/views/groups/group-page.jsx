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
        <button type="button" className="gray-button" id="new-group" onClick={this.props.navigate()}>+ NEW GROUP</button>
        <button type="button" className="gray-button" id="manage-contacts" onClick={this.props.navigate()}>MANAGE CONTACTS</button>
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
        <HeadPanel>GROUPS</HeadPanel>
        <Buttons navigate={this.navigate}/>
        <GroupList/>
        <KeyInfo/>
      </div>
    );
  }
});

module.exports = GroupPage;
