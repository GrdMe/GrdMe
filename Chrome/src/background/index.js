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
      signedPreKeyId: 0,
      signedPreKey: store.getLocalSignedPreKeyPair(0).public,
      signedPreKeySignature: store.data.preKeys[0].signature,
    };
    console.log({pkb:preKeyBundle});
    axol.createSessionFromPreKeyBundle(preKeyBundle).then((session) => {
      axol.encryptMessage(session,message).then((response) => {
        console.log(response);
      });
    });
  });
});