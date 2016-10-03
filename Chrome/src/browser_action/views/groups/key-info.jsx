var React = require('react');

var KeyInfo = React.createClass({

  // TODO: change hardcoded value to pull from backend
  render: function(){
    return(
      <div id="key-info">
        <button type="button" id="blue-button">COPY MY KEY</button>
        <input
          type="text"
          id="key-text"
          value="MYKEY1234567890A"
          readOnly
        />
      </div>
    );
  }
});

module.exports = KeyInfo;
