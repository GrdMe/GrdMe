import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
// import base64 from 'base64-arraybuffer';

// var bg = chrome.extension.getBackgroundPage();
// var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));
const start = '~~GrdMe!';
const end = '~~';

class KeyInfo extends Component {

  static toastMessage() {
    chrome.notifications.create('400', { type: 'basic',
      title: 'Code Copied!',
      message: 'Your contact code has been copied to your clipboard.',
      iconUrl: '../../../icons/icon48.png' },
    );
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
      if (result.longtermkey !== this.state.longtermkey) {
        this.setState({
          longtermkey: result.longtermkey,
        });
      }
    });

    // if key is in storage
    if (this.state.longtermkey !== null) {
      return (
        <div id='key-info'>
          <CopyToClipboard text={ start + this.state.longtermkey + end }>
            <button type='button' className='blue-button' onClick={ KeyInfo.toastMessage }>
              COPY MY CONTACT CODE
            </button>
          </CopyToClipboard>
        </div>
      );
    }

    return (
      <div id='key-info'>
        <button type='button' className='blue-button' onClick={ this.generateKey }>
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
