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

var kp_str2ab = function(keyPair_str) {
  return {
    public: str2ab(keyPair_str.public),
    private: str2ab(keyPair_str.private),
  };
};
module.exports.kp_str2ab = kp_str2ab;

var kp_ab2str = function(keyPair) {
  return {
    public: ab2str(keyPair.public),
    private: ab2str(keyPair.private),
  };
};
module.exports.kp_ab2str = kp_ab2str;
