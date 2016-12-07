import base64 from 'base64-arraybuffer';
import ioClient from 'socket.io-client';
import { ab2str, keypairDecode, keypairEncode, str2ab } from './base64-helper';

// TODO: Remove this once we go to production
/* eslint-disable no-console */

// libaxolotl set dressing for webpack
process.platform = 'Grd Me';
process.stderr = {
  write: (t) => {
    console.error(t);
  },
};

// NOTE: these need to be required rather than imported in order to let them read the process
// global defined above
const axolotl = require('axolotl');
const axolotlCrypto = require('axolotl-crypto');

// NOTE: this allows us to export stuff to other bits of the codebase
window.axolotlCrypto = axolotlCrypto;
window.base64 = base64;

// variables
const numPreKeys = 10;
const keyServerUrl = 'https://twofish.cs.unc.edu';
const keyServerAPIUrl = `${ keyServerUrl }/api/v1/`;
let popupWindow = null;
// const keyServerAPIUrl = 'http://localhost:8080/api/v1/';

// edward's popup magic
chrome.commands.onCommand.addListener((command) => {
  if (command === 'textSecurePopup' && !popupWindow) {
    const width = 300;
    const height = 235;
    const left = Math.floor((screen.width / 2) - (width / 2));
    const top = Math.floor((screen.height / 2) - (height / 2));
    chrome.windows.create({
      url: chrome.extension.getURL('dist/secureTextPopup.html'),
      focused: true,
      type: 'popup',
      width,
      height,
      top,
      left,
    }, (win) => {
      popupWindow = win;
    });
  }
});

chrome.windows.onRemoved.addListener((windowID) => {
  if (popupWindow && windowID === popupWindow.id) {
    popupWindow = null;
  }
});


// TODO: uncomment this when it's ready for production
// chrome.windows.onFocusChanged.addListener((windowID) => {
//   if (popupWindow && windowID !== popupWindow.id) {
//     chrome.windows.remove(popupWindow.id, () => {
//       popupWindow = null;
//     });
//   }
// });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
              `from a content script:${ sender.tab.url }` :
              'from the extension');
  if (request.greeting === 'hello') {
    sendResponse({ farewell: 'goodbye' });
  }
  if (request.greeting === 'encryptMe') {
    const encrypt = base64.encode(crypto.randomBytes(32));
    sendResponse({ farewell: encrypt });
  }
  if (request.greeting === 'get messages') {
    chrome.storage.local.get({ message: {} }, (result) => {
      sendResponse({ farewell: result });
    });
    // sendResponse({ farewell: 'boo' });
  }
  return true;
});

const store = {
  base64_data: {},
  getLocalIdentityKeyPair: () => store.identityKeyPair,
  getLocalRegistrationId: () => store.base64_data.registrationId,
  getLocalPreKeyPair: preKeyId =>
    keypairDecode(store.base64_data.preKeys[preKeyId].keyPair),
  getLocalSignedPreKeyPair: signedPreKeyId =>
    keypairDecode(store.base64_data.preKeys[signedPreKeyId].keyPair),
  getLocalSignedPreKeySignature: signedPreKeyId =>
    base64.decode(store.base64_data.preKeys[signedPreKeyId].signature),
  getLocalLastResortPreKeyId: () => store.base64_data.lastResortPreKeyId,
};
const basicAuth = (serverTime) => {
  const username = `${ store.base64_data.identityKeyPair.pub }|${ store.getLocalRegistrationId() }`;
  const time = (typeof serverTime !== 'undefined') ? serverTime : Date.now();
  const password = `${ time }|${ base64.encode(axolotlCrypto.sign(store.getLocalIdentityKeyPair().priv, str2ab(String(time)))) }`;
  return { username, password };
};

const wrappedApiCall = (type, resource, jsonBody) => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  const auth = basicAuth();
  xhr.open(type, keyServerAPIUrl + resource, true);
  xhr.setRequestHeader('Authorization', `Basic ${ btoa(`${ auth.username }:${ auth.password }`) }`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (resource === 'key/initial') {
        console.log({ url: xhr.responseURL, body: xhr.response });
        resolve();
      } else {
        console.log({ url: xhr.responseURL, body: JSON.parse(xhr.response) });
        resolve(JSON.parse(xhr.responseText));
      }
    }
  };
  if (type !== 'GET') {
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(jsonBody));
  } else {
    xhr.send();
  }
});
const axol = axolotl(store);

// initial install registration stuff
const installKeygen = () => new Promise((resolve) => {
  axol.generateRegistrationId().then((value) => {
    store.base64_data.registrationId = value;
    axol.generateIdentityKeyPair().then((value) => {
      store.identityKeyPair = value;
      store.base64_data.identityKeyPair = keypairEncode(value);
      store.base64_data.preKeys = {};
      const storeToChromeLocal = (storeBase64) => {
        chrome.storage.local.set({ store: storeBase64 });
        console.log({ store: storeBase64 });
        const body = {
          lastResortKey: {
            id: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].id,
            preKey: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].pub,
          },
          prekeys: Object.keys(store.base64_data.preKeys).filter(key =>
              store.base64_data.preKeys[key].id !== store.getLocalLastResortPreKeyId()
            ).map((key) => {
              const current = store.base64_data.preKeys[key];
              return {
                id: current.id,
                signature: current.signature,
                preKey: current.keyPair.pub,
              };
            }),
        };
        wrappedApiCall('POST', 'key/initial', body).then(() => {
          resolve();
        });
      };
      const complete = numPreKeys + 1;
      let progress = 0;
      const callback = (value) => {
        value.keyPair = keypairEncode(value.keyPair);
        value.signature = base64.encode(value.signature);
        store.base64_data.preKeys[value.id] = value;
        if (++progress === complete) {
          storeToChromeLocal(store.base64_data);
        }
      };
      for (let index = 0; index < numPreKeys; index++) {
        axol.generateSignedPreKey(store.getLocalIdentityKeyPair(), index).then(callback);
      }
      axol.generateLastResortPreKey().then((value) => {
        value.keyPair = keypairEncode(value.keyPair);
        store.base64_data.lastResortPreKeyId = value.id;
        store.base64_data.preKeys[value.id] = value;
        if (++progress === complete) {
          storeToChromeLocal(store.base64_data);
        }
      });
    });
  });
});

// restore store.base64_data from chrome.storage [remove 'false && ' for normal behaviour]
const initializeStorage = () => new Promise((resolve) => {
  chrome.storage.local.get('store', (results) => {
    if (Object.keys(results).length !== 0) {
      store.base64_data = results.store;
      store.identityKeyPair = keypairDecode(store.base64_data.identityKeyPair);
      resolve();
    } else {
      installKeygen().then(() => { resolve(); });
    }
  });
});

const identityPubKeySearch = identityPubKey => new Promise((resolve) => {
  wrappedApiCall('GET', `key/${ encodeURIComponent(identityPubKey) }`, null).then((response) => {
    const responseKeys = Object.keys(response);
    for (const element in responseKeys) {
      if (responseKeys.hasOwnProperty(element)) {
        const device = response[Object.keys(response)[element]];
        const preKeyBundle = {
          identityKey: base64.decode(identityPubKey),
          preKeyId: device.id,
          preKey: base64.decode(device.preKey),
          signedPreKeyId: device.id,
          signedPreKey: base64.decode(device.preKey),
          signedPreKeySignature: base64.decode(device.signature),
        };
        axol.createSessionFromPreKeyBundle(preKeyBundle).then((session) => {
          resolve(session);
        });
      }
    }
  });
});

initializeStorage().then(() => {
  identityPubKeySearch(store.base64_data.identityKeyPair.pub).then((session) => {
    const message = str2ab('Hello Diane, Happy Tuesday!');
    console.log('pre-encrypt: Hello Diane, Happy Tuesday!');
    axol.encryptMessage(session, message).then((response) => {
      console.log('post-encrypt:', ab2str(response.body));
      axol.decryptPreKeyWhisperMessage(null, response.body).then((response) => {
        console.log('post-decrypt:', ab2str(response.message));
      });
    });
  });
});

// sockets =====================================================================

// make connection to server
const socket = ioClient.connect(keyServerUrl);
console.log(socket);

// executed on successful connection to server
socket.on('connect', () => {
  // push auth credentials to server
  console.log({ auth: basicAuth() });
  socket.emit('authentication', basicAuth());
});

// executed on 'not authorized' message from server
socket.on('not authorized', (data) => {
  console.log('not authorized message recieved');
  switch (data.message) {
  case 'badly formed credentials': // indicates that authCredentials were bad
    // deal with it
    break;
  case 'revoked': // indicates that submitted identityKey has been revoked
    // deal with it
    break;
  case 'signature': // indicates that signature in password could not be verified
    // deal with it
    break;
  case 'not registered': // indicates that idKey/did combo has not been registered with srerver
    // deal with it
    break;
  case 'time': // indicates submitted time was out of sync w/ server
    // this has NOT been tested
    // emit auth credentials
    socket.emit('authentication', basicAuth(data.serverTime));
    break;
  default:
    console.error('unrecognized "not authorized" message', data.message);
  }
});

// executed on 'authorized' message from server
socket.on('authorized', () => {
  // lets you know that socket.emit('authentication'... was successful
  console.log('authorized');
});

// executed on 'message' message from server
socket.on('message', (messageData) => {
  // confirm reception of message to server
  socket.emit('recieved', { messageId: messageData.id });

  console.log(messageData);

  // const messageHeader = messageData.header; // same header that was sent to server
  // const messageBody = messageData.body;     // same body that was sent to server

    // do something with messageData here
});

// TODO: Remove this once we go to production
/* eslint-enable no-console */
