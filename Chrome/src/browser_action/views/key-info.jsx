var React = require('react');
var CopyToClipboard = require('react-copy-to-clipboard');
var base64 = require('base64-arraybuffer');

var bg = chrome.extension.getBackgroundPage();
var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));

var KeyInfo = React.createClass({

  showKey : function(){
    //if key is in storage
    return(
      <div id="key-info">
        <CopyToClipboard text="MYKEY1234567890A">
        <button type="button" id="blue-button">COPY MY KEY</button>
        </CopyToClipboard>
        <input
          type="text"
          id="key-text"
          value={key}
          readOnly
        />
      </div>
    );

    //else
    //return(<button/>);
    // return(
    //   <div id = "key-info">
    //     <button type = "button" id = "blue-button" onClick = {this.generateKey}>GENERATE KEY</button>
    //   </div>
    // );
  },

  generateKey : function(){
    var bg = chrome.extension.getBackgroundPage();
    var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));
    //logic here to store in Chrome
    this.forceUpdate();
  },

  // TODO: change hardcoded value to pull from backend
  render: function(){
    return(
      <div>
        {this.showKey()}
      </div>
    );
  }
});

module.exports = KeyInfo;
