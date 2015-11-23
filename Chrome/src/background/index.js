// libaxolotl set dressing for webpack
process.platform = "Grd Me";
process.stderr = {
  write: function(t){
    console.log(t);
  }
}

var axolotl = require("axolotl");
var store = {
  identityKeyPair: null,
  registrationId: 0,
  getLocalIdentityKeyPair: function() {
    return identityKeyPair;
  },
  getLocalRegistrationId: function() {
    return this.registrationId;
  },
  getLocalSignedPreKeyPair: function(signedPreKeyId){
    return identityKeyPair;
  },
  getLocalPreKeyPair: function(preKeyId){
    return identityKeyPair;
  },
}
var axol = axolotl(store);
axol.generateIdentityKeyPair().then(function(value) {
  store.identityKeyPair = value;
});
axol.generateRegistrationId().then(function(value) {
  store.registrationId = value;
});

console.log(store);
