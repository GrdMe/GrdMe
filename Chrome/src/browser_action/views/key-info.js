import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
// import base64 from 'base64-arraybuffer';

// var bg = chrome.extension.getBackgroundPage();
// var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));

class KeyInfo extends Component {
  static toastMessage() {
    // NOTE: this function is static as it doesn't need the `this` var right now.
    // Feel free to change
  }

  constructor(props) {
    super(props);
    this.state = {
      longtermkey: null,
    };
    this.generateKey = this.generateKey.bind(this);
  }

  showKey() {
    chrome.storage.local.get('longtermkey', (result) => {
      this.setState({
        longtermkey: result.longtermkey,
      });
    });

    // if key is in storage
    if (this.state.longtermkey !== null) {
      return (
        <div id='key-info'>
          <CopyToClipboard text={ this.state.longtermkey }>
            <button type='button' id='blue-button' onClick={ this.toastMessage }>
              COPY MY CONTACT CODE
            </button>
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

    return (
      <div id='key-info'>
        <button type='button' id='blue-button' onClick={ this.generateKey }>
          GENERATE KEY
        </button>
      </div>
    );
  }

  generateKey() {
    const bg = chrome.extension.getBackgroundPage();
    const key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));
    chrome.storage.local.set({ longtermkey: key });
    // logic here to store in Chrome
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        { this.showKey() }
      </div>
    );
  }
}

export default KeyInfo;
