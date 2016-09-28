var React = require('react');
var ReactDOM = require('react-dom');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    //Need a specific proptype check
    members: React.PropTypes.object.isRequired
  },



  render: function(){
    console.log(this.props.members);
    return(
      <div className="groupEntry">
      <p >{this.props.name}</p>
      <input type="radio"/>
      </div>
    )
  }
});

var GroupList = React.createClass({
  //Logic for getting groups for current user goes here
  getGroups: function(){
    //But for now I am hardwiring the  group names
    var groups = {
      "Test Group 1": {
        "members": {
          "MY_LONG_TERM_KEY": true
        }
      }
    };
    var groupEntries = Object.keys(groups).map(x => <GroupEntry name={x} members={groups[x].members}/>);

    return(groupEntries);
  },

  render: function(){
    return(
      <div>
        <p>GROUP LIST</p>
        {this.getGroups()}
      </div>
    );
  }
});

var GroupPage = React.createClass({
  propTypes: {
    selectedGroup: React.PropTypes.string.isRequired
  },

  getInitialState: function(){
    return(
      {selectedGroup:this.props.selectedGroup}
    );
  },

  renderSelected: function(){
    console.log(this.state.selectedGroup);
    if(this.state.selectedGroup != null){
      return(
        <GroupEntry name={this.state.selectedGroup}/>
      );
    } else {
      return(
        <p>NO GROUP SELECTED</p>
      );
    }
  },

  render: function(){
    return(
      <div className="no-padding">
        <Panel/>
        <Buttons/>
        {this.renderSelected()}
        <GroupList/>
        <Key/>
      </div>
    );
  }
});

var Panel = React.createClass({

  render: function(){
    return(
      <div id="blue-panel">
        <p>GROUPS</p>
      </div>
    )
  }
});

var Buttons = React.createClass({

  render: function(){
    return(
      <div id="top-buttons">
        <button type="button" className="gray-button">+ NEW GROUP</button>
        <button type="button" className="gray-button">MANAGE CONTACTS</button>
      </div>
    )
  }
});

var Key = React.createClass({

  render: function(){
    return(
      <div id="key-button">
        <button type="button" id="blue-button">COPY MY KEY</button>
        <input
          type="text"
          id="key-text"
          value="MYKEY1234567890A"  //hard coded right now, will add in front-end functionality to support backend later
          readOnly
        />
      </div>
    );
  }
});

function loadPage() {
  ReactDOM.render(
    <GroupPage selectedGroup="SelectedGroup"/>,
    document.getElementById('page')
  );
}
