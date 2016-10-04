var React = require('react');
var HeadPanel = require('../head-panel.jsx');
var ContactSelection = require('./contact-selection.jsx');

var NewGroupPage = React.createClass({

  render : function(){
    return(
      <div>
        <HeadPanel>NEW GROUP</HeadPanel>
        <div id="group-input">
          <span id="group-name">GROUP NAME</span>
          <input
            type="text"
            id="group-text"
            value="Sample Group"  //hard coded right now, will add in front-end functionality to support backend
          />
        </div>
        <ContactSelection/>
        <div className="bottom-buttons">
          <div id="left-col">
            <button id="cancel" onClick={this.props.back}>Cancel</button>
          </div>
          <div id="right-col">
            <button id="blue-button">CREATE GROUP</button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = NewGroupPage;
