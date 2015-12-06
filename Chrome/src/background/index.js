// libaxolotl set dressing for webpack
process.platform = "Grd Me";
process.stderr = {
  write: function(t){
    console.log(t);
  }
}

//main shit
var base64 = require('base64-arraybuffer');
var base64_helper = require("./base64-helper.js");
var axolotl = require("axolotl");
var store = {
  data: {},
  getLocalIdentityKeyPair: () => {
    return base64_helper.keypair_decode(store.data.identityKeyPair);
  },
  getLocalRegistrationId: () => {
    return store.data.registrationId;
  },
  getLocalPreKeyPair: (preKeyId) => {
    return base64_helper.keypair_decode(store.data.preKeys[preKeyId].keyPair);
  },
  getLocalSignedPreKeyPair: (signedPreKeyId) => {
    return base64_helper.keypair_decode(store.data.preKeys[signedPreKeyId].keyPair);
  },
  getLocalSignedPreKeySignatue: (signedPreKeyId) => {
    return base64.decode(store.data.preKeys[signedPreKeyId].signature);
  }
};
var axol = axolotl(store);

//initial install registration stuff
var install_keygen = new Promise(function(resolve) {
  chrome.storage.local.remove(["store"],() => {
    chrome.storage.local.get("store",(results) => {
      if (Object.keys(results).length !== 0) {
        store.data = results.store;
        resolve();
      } else {
        axol.generateRegistrationId().then((value) => {
          store.data.registrationId = value;
          axol.generateIdentityKeyPair().then((value) => {
            store.data.identityKeyPair = base64_helper.keypair_encode(value);
            store.data.preKeys = [];
            for (var index = 0; index < 10; index++) {
              axol.generateSignedPreKey(store.getLocalIdentityKeyPair(),index).then((value) => {
                value.keyPair = base64_helper.keypair_encode(value.keyPair);
                value.signature = base64.encode(value.signature);
                store.data.preKeys[value.id] = value;
              });
            }
            console.log({kp: store.data.keyPairs});
            axol.generateLastResortPreKey().then((value) => {
              value.keyPair = base64_helper.keypair_encode(value.keyPair);
              store.data.lastResortPreKeyId = value.id;
              store.data.preKeys[value.id] = value;
              resolve();
            });
          });
        });
      }
    });
  });
});

install_keygen.then(() => {
  chrome.storage.local.get('store',(results) => {
    console.log({dbg0:results});
    console.log({msg:store});
    var message = base64_helper.str2ab("Hello bob");
    var preKeyBundle = {
      identityKey: store.getLocalIdentityKeyPair().public,
      preKeyId: 0,
      preKey: store.getLocalSignedPreKeyPair(0).public,
      signedPreKeyId: 0,
      signedPreKey: store.getLocalSignedPreKeyPair(0).public,
      signedPreKeySignature: store.data.preKeys[0].signature,
    };
    console.log({pkb:preKeyBundle});
    axol.createSessionFromPreKeyBundle(preKeyBundle).then((session) => {
      axol.encryptMessage(session,message).then((response) => {
        console.log(response);
        axol.decryptPreKeyWhisperMessage(null,response.body).then((response) =>{
          console.log(response);
          console.log(base64_helper.ab2str(response.message));
        });
      });
    });
  });
});

// sockets =====================================================================
var ioClient = require('socket.io-client');
var crypto = require("axolotl-crypto");

/*********************************************************
************** EDIT THESE THINGS!!! **********************
*********************************************************/
var URL_OF_SERVER = "http://11.12.13.14:8080/";
var clientIdentityKeyPair = /* GET KEY PAIR FROM STORAGE */;
var clientDeviceId = /* GET DEVICE ID FROM STORAGE */;
/********************************************************/

/* make connection to server */
var socket = ioClient.connect(URL_OF_SERVER);

/* executed on successful connection to server */
socket.on('connect', function (data) {
    /* create auth credentials */
    var time = String((new Date())getTime());
    var signature = base64.encode(crypto.sign(clientIdentityKeyPair.private, base64.decode(time)));
    var authPassword = time + "|" + signature;
    var authUsername = base64.encode(clientIdentityKeyPair.public);
    authUsername = authUsername + "|" + String(clientDeviceId);

    /* push auth credentials to server */
    socket.emit('authentication', { username:authUsername, password:authPassword });
});

/* executed on 'not authorized' message from server */
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
            /* sign serverTime and resend auth message */
            var signature = base64.encode(crypto.sign(clientIdentityKeyPair.private, base64.decode(serverTime)));
            var authPassword = serverTime + "|" + signature;
            var authUsername = base64.encode(clientIdentityKeyPair.public);
            authUsername = authUsername + "|" + String(clientDeviceId);

            /* emit auth credentials */
            socket.emit('authentication', { username:authUsername, password:authPassword });
            break;
    }
});

/* executed on 'authorized' message from server */
socket.on('authorized', function(data) {
    //lets you know that socket.emit('authentication'... was successful
});

/* executed on 'message' message from server */
socket.on('message', function(messageData) {
    //confirm reception of message to server
    socket.emit('recieved', {messageId: messageData.id});

    var messageHeader = messageData.header; //same header that was sent to server
    var messageBody = messageData.body;     //same body that was sent to server

    // do something with messageData here
});
