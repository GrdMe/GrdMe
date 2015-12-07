// libaxolotl set dressing for webpack
process.platform = "Grd Me";
process.stderr = {
  write: function(t){
    console.log(t);
  }
}

//variables
var numPreKeys = 100;
//var keyServerAPIUrl = 'https://twofish.cs.unc.edu/api/v1/';
var keyServerAPIUrl = 'http://localhost:8080/api/v1/';

//main shit
var base64 = require('base64-arraybuffer');
var base64_helper = require("./base64-helper.js");
var axolotl = require("axolotl");
var crypto = require("axolotl-crypto");
var store = {
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
var wrapped_api_call = (type,reasource,json_body) => new Promise((resolve) => {
  var username = store.base64_data.identityKeyPair.public+'|'+store.getLocalRegistrationId();
  var time =  Date.now();
  var password = time + '|' + base64.encode(crypto.sign(store.getLocalIdentityKeyPair().private,base64_helper.str2ab(String(time))));
  var basic_auth = username + ':' + password;
  var xhr = new XMLHttpRequest();
  xhr.open(type, keyServerAPIUrl+reasource, true);
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(basic_auth));
  xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(JSON.parse(xhr.responseText));
      }
  }
  if (type !== 'GET') {
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(json_body));
  } else {
    xhr.send();
  }
});
var axol = axolotl(store);

//initial install registration stuff
var install_keygen = () => new Promise((resolve) => {
  axol.generateRegistrationId().then((value) => {
    store.base64_data.registrationId = value;
    axol.generateIdentityKeyPair().then((value) => {
      store.identityKeyPair = value;
      store.base64_data.identityKeyPair = base64_helper.keypair_encode(value);
      store.base64_data.preKeys = {};
      var storeToChromeLocal = (storeBase64) => {
        chrome.storage.local.set({store:storeBase64});
        var body = {
          lastResortKey: {
            id: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].id,
            preKey: store.base64_data.preKeys[store.getLocalLastResortPreKeyId()].public,
          },
          prekeys : Object.keys(store.base64_data.preKeys).filter((key) => {
            return (store.base64_data.preKeys[key].id !== store.getLocalLastResortPreKeyId());
          }).map((key) => {
              var current = store.base64_data.preKeys[key];
              return {
                id: current.id,
                signature: current.signature,
                preKey: current.keyPair.public,
              };
          }),
        };
        wrapped_api_call('POST','key/initial',body).then((response) => {
          resolve();
        });
      };
      var complete = numPreKeys + 1;
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

// restore store.base64_data from chrome.storage
var initialize_storage = () => new Promise((resolve) => {
  chrome.storage.local.get("store",(results) => {
    if (Object.keys(results).length !== 0) {
      store.base64_data = results.store;
      store.identityKeyPair = base64_helper.keypair_decode(store.base64_data.identityKeyPair);
      resolve();
    } else {
      install_keygen().then(() => { resolve() });
    }
  });
});

var identityPubKey_search = (identityPubKey) => new Promise((resolve) => {
  wrapped_api_call('GET','key/'+encodeURIComponent(identityPubKey),null).then((response) => {
    response.device = {
      identityKey: base64.decode(identityPubKey),
      preKeyId: response.device.id,
      preKey: base64.decode(response.device.preKey),
      signedPreKeyId: response.device.id,
      signedPreKey: base64.decode(response.device.preKey),
      signedPreKeySignature: base64.decode(response.device.signature),
    };
    axol.createSessionFromPreKeyBundle(preKeyBundle).then((session) => {
      
    });
    resolve(response);
  });
});

initialize_storage().then(() => {
  identityPubKey_search(store.base64_data.identityKeyPair.public).then((response) => {

  /*var message = base64_helper.str2ab("Hello bob");
  axol.encryptMessage(session,message).then((response) => {
    axol.decryptPreKeyWhisperMessage(null,response.body).then((response) =>{
      resolve(base64_helper.ab2str(response.message));
    });*/
  });

/*  wrapped_api_call('GET','key/'+encodeURIComponent("BW8VJ4jxSpVGicMaGmc90zpBkiTj1v8n9su1oeL66GkH"),null).then((response) => {
    console.log({search:response});
  });*/

});

/*
// sockets =====================================================================
var ioClient = require('socket.io-client');
var crypto = require("axolotl-crypto");

var URL_OF_SERVER = "http://11.12.13.14:8080/";
var clientIdentityKeyPair = // GET KEY PAIR FROM STORAGE ;
var clientDeviceId = // GET DEVICE ID FROM STORAGE ;

// make connection to server
var socket = ioClient.connect(URL_OF_SERVER);

// executed on successful connection to server
socket.on('connect', function (data) {
    // create auth credentials 
    var time = String((new Date())getTime());
    var signature = base64.encode(crypto.sign(clientIdentityKeyPair.private, base64.decode(time)));
    var authPassword = time + "|" + signature;
    var authUsername = base64.encode(clientIdentityKeyPair.public);
    authUsername = authUsername + "|" + String(clientDeviceId);

    // push auth credentials to server 
    socket.emit('authentication', { username:authUsername, password:authPassword });
});

// executed on 'not authorized' message from server 
socket.on('not authorized', function(data) {
    console.log("not authorized message recieved");
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
            var serverTime = String(data.serverTime); //int. unix time
            // sign serverTime and resend auth message 
            var signature = base64.encode(crypto.sign(clientIdentityKeyPair.private, base64.decode(serverTime)));
            var authPassword = serverTime + "|" + signature;
            var authUsername = base64.encode(clientIdentityKeyPair.public);
            authUsername = authUsername + "|" + String(clientDeviceId);

            // emit auth credentials 
            socket.emit('authentication', { username:authUsername, password:authPassword });
            break;
    }
});

// executed on 'authorized' message from server 
socket.on('authorized', function(data) {
    //lets you know that socket.emit('authentication'... was successful
});

// executed on 'message' message from server 
socket.on('message', function(messageData) {
    //confirm reception of message to server
    socket.emit('recieved', {messageId: messageData.id});

    var messageHeader = messageData.header; //same header that was sent to server
    var messageBody = messageData.body;     //same body that was sent to server

    // do something with messageData here
});

*/
