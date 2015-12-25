// libaxolotl set dressing for webpack
process.platform = 'Grd Me';
process.stderr = {
  write: (t) => {
    console.log(t);
  }
}

//variables
const numPreKeys = 100;
const keyServerUrl = 'https://twofish.cs.unc.edu';
const keyServerAPIUrl = keyServerUrl + '/api/v1/';
//const keyServerAPIUrl = 'http://localhost:8080/api/v1/';

//edward's popup magic
chrome.commands.onCommand.addListener((command) => {
  if(command === 'textSecurePopup') {
    const w = 300;
    const h = 235;
    const left = Math.floor((screen.width / 2) - (w / 2));
    const top = Math.floor((screen.height / 2) - (h / 2));
    chrome.windows.create({
      url: chrome.extension.getURL('src/browser_action/secureTextPopup.html'),
      focused: true,
      type: 'popup',
      width: w,
      height: h,
      top: top,
      left: left,
    });
  }
});

chrome.runtime.onMessage.addListener(
  //this should probably change
  (request, sender, sendResponse) => {
    console.log(sender.tab ?
                'from a content script:' + sender.tab.url :
                'from the extension');
    if (request.greeting === 'hello') {
      sendResponse({farewell: 'goodbye'});
    }
    if(request.greeting === 'encryptMe'){
      const encrypt = base64.encode(crypto.randomBytes(32));
      sendResponse({farewell: encrypt});
    }
});

//main shit
base64 = require('base64-arraybuffer');
base64_helper = require('./base64-helper.js');
storage_manager = require('./storage_manager.js');
ioClient = require('socket.io-client');
axolotl = require('axolotl');
axolotl_crypto = require('axolotl-crypto');

store = {
  base64_data: {},
  getLocalIdentityKeyPair: () => {
    return store.identityKeyPair;
  },
  getLocalRegistrationId: () => {
    return store.base64_data.registrationId;
  },
  getLocalPreKeyPair: (preKeyId) => {
    return base64_helper.keypair_decode(store.base64_data.preKeys[preKeyId].keyPair);
  },
  getLocalSignedPreKeyPair: (signedPreKeyId) => {
    return base64_helper.keypair_decode(store.base64_data.preKeys[signedPreKeyId].keyPair);
  },
  getLocalSignedPreKeySignature: (signedPreKeyId) => {
    return base64.decode(store.base64_data.preKeys[signedPreKeyId].signature);
  },
  getLocalLastResortPreKeyId: (lastResortPreKeyId) => {
    return store.base64_data.lastResortPreKeyId;
  },
};
const basic_auth = (server_time) => {
  const username = store.base64_data.identityKeyPair.public + '|' + store.getLocalRegistrationId();
  const time = (typeof server_time !== "undefined") ? server_time : Date.now();
  const password = time + '|' + base64.encode(axolotl_crypto.sign(store.getLocalIdentityKeyPair().private,base64_helper.str2ab(String(time))));
  return { username: username, password:password };
};

const wrapped_api_call = (type,reasource,json_body) => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  const auth = basic_auth();
  xhr.open(type, keyServerAPIUrl+reasource, true);
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(auth.username + ':' + auth.password));
  xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (reasource === 'key/initial') {
          console.log({url:xhr.responseURL,body:xhr.response});
          resolve();
        } else {
          console.log({url:xhr.responseURL,body:JSON.parse(xhr.response)});
          resolve(JSON.parse(xhr.responseText));
        }
      }
  }
  if (type !== 'GET') {
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(json_body));
  } else {
    xhr.send();
  }
});
const axol = axolotl(store);

//initial install registration stuff
const install_keygen = () => new Promise((resolve) => {
  axol.generateRegistrationId().then((value) => {
    store.base64_data.registrationId = value;
    axol.generateIdentityKeyPair().then((value) => {
      store.identityKeyPair = value;
      store.base64_data.identityKeyPair = base64_helper.keypair_encode(value);
      store.base64_data.preKeys = {};
      const storeToChromeLocal = (storeBase64) => {
        chrome.storage.local.set({store:storeBase64});
        console.log({store:storeBase64});
        const body = {
          lastResortKey: {
            id: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].id,
            preKey: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].public,
          },
          prekeys : Object.keys(store.base64_data.preKeys).filter((key) => {
            return (store.base64_data.preKeys[key].id !== store.getLocalLastResortPreKeyId());
          }).map((key) => {
              const current = store.base64_data.preKeys[key];
              return {
                id: current.id,
                signature: current.signature,
                preKey: current.keyPair.public,
              };
          }),
        };
        wrapped_api_call('POST', 'key/initial', body).then((response) => {
          resolve();
        });
      };
      const complete = numPreKeys + 1;
      var progress = 0;
      for (var index = 0; index < numPreKeys; index++) {
        axol.generateSignedPreKey(store.getLocalIdentityKeyPair(),index).then((value) => {
          value.keyPair = base64_helper.keypair_encode(value.keyPair);
          value.signature = base64.encode(value.signature);
          store.base64_data.preKeys[value.id] = value;
          if (++progress === complete) {
            storeToChromeLocal(store.base64_data);
          };
        });
      }
      axol.generateLastResortPreKey().then((value) => {
        value.keyPair = base64_helper.keypair_encode(value.keyPair);
        store.base64_data.lastResortPreKeyId = value.id;
        store.base64_data.preKeys[value.id] = value;
        if (++progress === complete) {
          storeToChromeLocal(store.base64_data);
        };
      });
    });
  });
});

// restore store.base64_data from chrome.storage [remove 'false && ' for normal behaviour]
const initialize_storage = () => new Promise((resolve) => {
  chrome.storage.local.get('store', (results) => {
    if (false && Object.keys(results).length !== 0) {
      store.base64_data = results.store;
      store.identityKeyPair = base64_helper.keypair_decode(store.base64_data.identityKeyPair);
      resolve();
    } else {
      install_keygen().then(() => { resolve() });
    }
  });
});

const identityPubKey_search = (identityPubKey) => new Promise((resolve) => {
  wrapped_api_call('GET', 'key/' + encodeURIComponent(identityPubKey), null).then((response) => {
    for (element in Object.keys(response)) {
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
  });
});

initialize_storage().then(() => {
  console.log(store);
});

/*
initialize_storage().then(() => {
  identityPubKey_search(store.base64_data.identityKeyPair.public).then((session) => {
    const message = base64_helper.str2ab('Hello Diane, Happy Tuesday!');
    console.log('pre-encrypt: Hello Diane, Happy Tuesday!');
    axol.encryptMessage(session, message).then((response) => {
      console.log('post-encrypt: '+base64_helper.ab2str(response.body));
      axol.decryptPreKeyWhisperMessage(null, response.body).then((response) =>{
        console.log('post-decrypt: '+base64_helper.ab2str(response.message));
      });
    });
  });
});
*/

// sockets =====================================================================

// make connection to server
const socket = ioClient.connect(keyServerUrl);
console.log(socket);

// executed on successful connection to server
socket.on('connect', function (data) {

    // push auth credentials to server
    console.log({auth: basic_auth()});
    socket.emit('authentication', basic_auth());
});

// executed on 'not authorized' message from server
socket.on('not authorized', (data) => {
    console.log('not authorized message recieved');
    switch(data.message){
        case 'badly formed credentials': //indicates that authCredentials were
            //deal with it
            break;
        case 'revoked': //indicates that submitted identityKey has been revoked
            //deal with it
            break;
        case 'signature': //indicates that signature in password could not be verified
            //deal with it
            break;
        case 'not registered': //indicates that idKey/did combo has not been registered with srerver
            //deal with it
            break;
        case 'time': //indicates submitted time was out of sync w/ server
            // this has NOT been tested
            // emit auth credentials
            socket.emit('authentication', basic_auth(data.serverTime));
            break;
    }
});

// executed on 'authorized' message from server
socket.on('authorized', (data) => {
    //lets you know that socket.emit('authentication'... was successful
    console.log('authorized');
});

// executed on 'message' message from server
socket.on('message', function(messageData) {
    //confirm reception of message to server
    socket.emit('recieved', {messageId: messageData.id});

    console.log(messageData);

    var messageHeader = messageData.header; //same header that was sent to server
    var messageBody = messageData.body;     //same body that was sent to server

    // do something with messageData here
});
