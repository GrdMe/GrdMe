var React = require('react');
var GroupEntry = require('./group-entry.jsx');
var GroupList = require('./group-list.jsx');
var HeadPanel = require('../head-panel.jsx');
var KeyInfo = require('./key-info.jsx');
var DisplayNameInfo = require('./display-name-info.jsx');

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
        <button type="button" className="gray-button" id="new-group" onClick={()=>{this.props.navigate(-1)}}>+ NEW GROUP</button>
        <button type="button" className="gray-button" id="manage-contacts" onClick={()=>{this.props.navigate(1)}}>MANAGE CONTACTS</button>
      </div>
    )
  }
});

var GroupPage = React.createClass({

  propTypes : {
    storageManager : React.PropTypes.object.isRequired,
    contacts : React.PropTypes.func.isRequired,
    newGroup : React.PropTypes.func.isRequired
  },

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
        <div className="content-wrapper">
          <Buttons navigate={this.navigate}/>
          <GroupList {...this.props}/>
          <KeyInfo/>
          <DisplayNameInfo/>
        </div>
      </div>
    );
  }
});

module.exports = GroupPage;
