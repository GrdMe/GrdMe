var React = require('react');
var CopyToClipboard = require('react-copy-to-clipboard');

var KeyInfo = React.createClass({

  // TODO: change hardcoded value to pull from backend
  render: function(){
    return(
      <div id="key-info">
        <CopyToClipboard text="MYKEY1234567890A">
        <button type="button" id="blue-button">COPY MY KEY</button>
        </CopyToClipboard>
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
