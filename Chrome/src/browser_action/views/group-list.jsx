var React = require('react');
var GroupEntry = require('./group-entry.jsx');

var GroupList = React.createClass({
  //Logic for getting groups for current user goes here
  getGroups: function(){
    //But for now I am hardwiring the  group
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
    var groupEntries = Object.keys(groups).map(x => <GroupEntry name={x} members={Object.keys(groups[x].members)}/>);
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
