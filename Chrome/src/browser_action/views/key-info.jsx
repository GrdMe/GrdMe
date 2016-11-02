var React = require('react');
var CopyToClipboard = require('react-copy-to-clipboard');
var base64 = require('base64-arraybuffer');

// var bg = chrome.extension.getBackgroundPage();
// var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));

var KeyInfo = React.createClass({

  getInitialState : function(){
    return {longtermkey : null};
  },

  showKey : function(){

    var self = this;
    chrome.storage.local.get('longtermkey', function(result){
        self.setState({longtermkey : result.longtermkey});
    });

    //if key is in storage
    if(this.state.longtermkey != null){
      return(
        <div id="key-info">
          <CopyToClipboard text={this.state.longtermkey}>
          <button type="button" id="blue-button" onClick={this.toastMessage}>COPY MY CONTACT CODE</button>
          </CopyToClipboard>
        </div>
      );
    }

    // <input
    //   type="text"
    //   id="key-text"
    //   value="*******************"
    //   readOnly
    // />

    else{
      return(
        <div id = "key-info">
          <button type = "button" id = "blue-button" onClick = {this.generateKey}>GENERATE KEY</button>
        </div>
      );
    }
  },

  toastMessage : function(){
      //idk
  },

  generateKey : function(){
    var bg = chrome.extension.getBackgroundPage();
    var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));
    chrome.storage.local.set({ 'longtermkey': key});
    //logic here to store in Chrome
    this.forceUpdate();
  },

  render: function(){
    return(
      <div>
        {this.showKey()}
      </div>
    );
  }
});

module.exports = KeyInfo;
