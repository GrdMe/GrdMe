var React = require('react');

var KeyInfo = React.createClass({
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

module.exports = KeyInfo;
