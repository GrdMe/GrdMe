var React = require('react');
var GroupPage = require('./groups/group-page.jsx');
var NewGroupPage = require('./new_group/new-group-page.jsx');
var ContactsPage = require('./contacts/contacts-page.jsx');

var PageContainer = React.createClass({
  getInitialState : function() {
    return({
      step : 0
    });
  },

  incrementStep : function(){
    this.setState({step : this.state.step + 1});
  },

  decrementStep : function(){
    this.setState({step : this.state.step - 1});
  },

  render : function(){
    switch (this.state.step) {
      case -1:
        return(<ContactsPage back={this.incrementStep}/>);
      case 0:
        return(<GroupPage contacts={this.decrementStep} newGroup={this.incrementStep}/>);
      case 1:
        return(<NewGroupPage back={this.decrementStep}/>);
      default:
        return(<GroupPage contacts={this.decrementStep} newGroup={this.incrementStep}/>);
    }
  }
});

module.exports = PageContainer;