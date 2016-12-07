import React, { Component } from 'react';
import base64 from 'base64-arraybuffer';
import CopyToClipboard from 'react-copy-to-clipboard';

const bg = chrome.extension.getBackgroundPage();

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
    this.setKey = this.setKey.bind(this);
  }

  componentDidMount() {
    this.setKey();
  }

  componentDidUpdate() {
    this.setKey();
  }

  setKey() {
    chrome.storage.local.get('longtermkey', (result) => {
      if (result.longtermkey !== this.state.longtermkey) {
        this.setState({
          longtermkey: result.longtermkey,
        });
      }
    });
  }

  generateKey() {
    const longtermkey = base64.encode(bg.axolotlCrypto.randomBytes(32));
    chrome.storage.local.set({ longtermkey });

    // logic here to store in Chrome
    this.setState({
      longtermkey,
    });
  }

  showKey() {
    const { longtermkey } = this.state;
    // if key is in storage
    if (longtermkey) {
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

  render() {
    return (
      <div>
        { this.showKey() }
      </div>
    );
  }
}

export default KeyInfo;
