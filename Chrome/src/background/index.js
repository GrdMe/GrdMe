// libaxolotl set dressing for webpack
process.platform = "Grd Me";
process.stderr = {
  write: function(t){
    console.log(t);
  }
}

//main shit
var abHelper = require("./arrayBufferHelper.js");
var axolotl = require("axolotl");

//initial install registration stuff

var install_keygen = function() {
  chrome.storage.local.remove(["axol","store"]);
  chrome.storage.local.get("store",(store) => {
    if(Object.keys(store).length == 0){
      chrome.storage.local.get("axol",(axol) => {
        if(Object.keys(axol).length == 0){
          store = {
            getLocalIdentityKeyPair: () => {
              return abHelper.kp_str2ab(identityKeyPair);
            },
            getLocalRegistrationId: () => {
              return this.registrationId;
            },
            getLocalSignedPreKeyPair: (signedPreKeyId) => {
              console.log("ERROR: where the fuck is this method used?");
            },
            getLocalPreKeyPair: (preKeyId) => {
              return abHelper.kp_str2ab(preKeys[preKeyId].keyPair);
            },
          }
          var axol = axolotl(store);
          chrome.storage.local.set({axol: axol});
          axol.generateRegistrationId().then((value) => {
            store.registrationId = value;
            axol.generateIdentityKeyPair().then((value) => {
              store.identityKeyPair = abHelper.kp_ab2str(value);
              axol.generatePreKeys(0, 100).then((values) => {
                for (index in values) {
                  values[index].keyPair = abHelper.kp_ab2str(values[index].keyPair);
                };
                store.preKeys = values;
                axol.generateLastResortPreKey().then((value) => {
                  value.keyPair = abHelper.kp_ab2str(value.keyPair);
                  store.lastResortPreKeyId = value.id;
                  store.preKeys[value.id] = value;
                  chrome.storage.local.set({store: store});
                  console.log(store);
                });
              });
            });
          });
        }
      });
    }
  });
};
