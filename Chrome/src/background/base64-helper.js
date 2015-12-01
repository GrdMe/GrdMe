var base64 = require('base64-arraybuffer');

var keypair_encode = function(keyPair_str) {
  return {
    public: base64.encode(keyPair_str.public),
    private: base64.encode(keyPair_str.private),
  };
};
module.exports.keypair_encode = keypair_encode;

var keypair_decode = function(keyPair) {
  return {
    public: base64.decode(keyPair.public),
    private: base64.decode(keyPair.private),
  };
};
module.exports.keypair_decode = keypair_decode;

var ab2str = function(buf) {
  return String.fromCharCode.apply(null, new Int8Array(buf));
};
module.exports.ab2str = ab2str;

var str2ab = function(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Int8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
module.exports.str2ab = str2ab;
