import base64 from 'base64-arraybuffer';

export const keypairEncode = keyPairStr => ({
  pub: base64.encode(keyPairStr.pub),
  priv: base64.encode(keyPairStr.priv),
});

export const keypairDecode = keyPair => ({
  pub: base64.decode(keyPair.pub),
  priv: base64.decode(keyPair.priv),
});

export const ab2str = buf => String.fromCharCode.apply(null, new Int8Array(buf));

export const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Int8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
