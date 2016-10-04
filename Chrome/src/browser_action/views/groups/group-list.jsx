var React = require('react');
var GroupEntry = require('./group-entry.jsx');

var GroupList = React.createClass({

  getInitialState : function() {
    return({
      selectedGroup : ""
    });
  },

  setSelectedGroup : function(name){
    this.setState({selectedGroup : name});
  },

  // TODO: implement logic for getting current user's groups
  getGroups: function(){
    // TODO: remove hardcoded example data
    var groups = {
      "Test Group 1": {
        "members": {
          "MY_LONG_TERM_KEY": true
        }
      },
      "MYFRIENDS" : {
        "members" : {
          "Arjun" : true,
          "Avi" : true
        }
      },
      "COMP523" : {
        "members" : {
          "Bob" : true,
          "Al" : true,
          "Rosie" : true,
          "Magneta" : true
        }
      },
      "FBI" : {
        "members" : {
          "Harvey" : true,
          "Batman" : true,
          "Joker" : true
        }
      },
      "GOOGLE" : {
        "members" : {
          "Youtube" : true,
          "Chrome" : true
        }
      },
      "FOOD" : {
        "members" : {
          "Biscuit" : true,
          "Bagel" : true,
          "Lox" : true,
          "Egg" : true
        }
      },
      "COMPLEX" : {
        "members" : {
          "NP" : true,
          "NP-Hard" : true,
          "NoSoln" : true
        }
      }
    };
    //Need to fix key attribute to be unique
    var groupEntries = Object.keys(groups).map(x => <GroupEntry key={x} selectedGroup={this.state.selectedGroup} updateGroup={this.setSelectedGroup} name={x} members={Object.keys(groups[x].members).join(", ")}/>);
    return(groupEntries);
  },

  render: function(){
    return(
      <div id = "group_list">
        {this.getGroups()}
      </div>
    );
  }
});

module.exports = GroupList;
