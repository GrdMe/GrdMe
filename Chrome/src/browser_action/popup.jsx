var React = require('react');
var ReactDOM = require('react-dom');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  render: function(){
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
    var groups = ["MYFRIENDS", "COMP523", "FBIFREEZE"];
    var groupEntries = groups.map(x => <GroupEntry name={x}/>);

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
    selectedGroup: React.PropTypes.number.isRequired
  },

  getInitialState: function(){
    return(
      {selectedGroup:this.props.selectedGroup}
    );
  },

  renderSelected: function(){
    console.log(this.state.selectedGroup);
    if(this.state.selectedGroup > 0){
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
      <div>
        {this.renderSelected()}
        <GroupList/>
      </div>
    );
  }
});

function loadPage() {
  ReactDOM.render(
    <GroupPage selectedGroup={2}/>,
    document.getElementById('page')
  );
}
