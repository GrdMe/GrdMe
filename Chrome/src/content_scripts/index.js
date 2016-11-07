import $ from 'jquery';
import StorageManager from '../storage_manager';

function replaceKeyInDOM(storage, key, original) {
  for (const contact in storage) {
    if (storage.hasOwnProperty(contact)) {
      if (storage[contact].name === key) {
        if (contact === 'MY_LONG_TERM_KEY') {
          const text = '~~This is your key!~~';
          document.body.innerHTML = document.body.innerHTML.replace(original, text);
          return;
        }
        // key exists already say its contact's key
        const text = `~~ ${ contact }'s key~~`;
        document.body.innerHTML = document.body.innerHTML.replace(original, text);
        return;
      }
    }
  }
  const button = document.createElement('button');
  const text = document.createTextNode('Lookup Key Using Server');
  button.appendChild(text);
  button.setAttribute('class', 'grd-me-key-tag');
  button.setAttribute('id', key);
  const html = button.outerHTML;
  document.body.innerHTML = document.body.innerHTML.replace(original, html);
  // doesnt exist, try to grab from server, give prompt
}

function replaceMessageInDOM(storage, nonce, original) {
  let msg = '~~unable to decrypt message~~';
  if (storage[nonce]) {
    msg = storage[nonce].plaintext ? storage[nonce].plaintext : msg;
  }
  document.body.innerHTML = document.body.innerHTML.replace(original, msg);
}

$('body').on('click', '.grd-me-key-tag', function getTag() {
  alert(this.id);
});
chrome.storage.local.get('longtermkey', (result) => {
  const longtermkey = result.longtermkey;
  const tags = [];
  const elements = document.querySelectorAll('body *');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerHTML) {
      let html = elements[i].innerHTML;
      let startIndex = 1;
      let endIndex;
      while (startIndex > 0) {
        startIndex = html.search('~~GrdMe!');
        if (startIndex === -1) {
          break;
        }
        html = html.slice(startIndex);
        endIndex = html.search(/.~~/);
        const tag = html.slice(0, endIndex + 3);
        html = html.slice(endIndex);
        if (tag.length > 0) {
          tags.push(tag);
        }
      }
    }
    if (elements[i].value) {
      let html = elements[i].value;
      let startIndex = 1;
      let endIndex;
      while (startIndex > 0) {
        startIndex = html.search('~~GrdMe!');
        if (startIndex === -1) {
          break;
        }
        html = html.slice(startIndex);
        endIndex = html.search(/.~~/);
        const tag = html.slice(0, endIndex + 3);
        html = html.slice(endIndex);
        if (tag.length > 0) {
          tags.push(tag);
        }
      }
    }
  }
  for (let i = 0; i < tags.length; i++) {
    //  each message needs to be checked here
    const msg = tags[i].slice(8, -2); // check stuff
    // make sure first char is 0 for version 0
    if (msg.charAt(0) !== '0') {
      document.body.innerHTML = document.body.innerHTML.replace(tags[i], '~~INVALID KEY FORMAT~~');
    } else if (msg.charAt(1) === '0') { // key
      const key = msg.slice(2);
      const original = tags[i];
      const callbackArgs = [key, original];
      if (key === longtermkey) {
        const text = '~~This is your key!~~';
        document.body.innerHTML = document.body.innerHTML.replace(original, text);
      } else {
        StorageManager.getContacts(replaceKeyInDOM, callbackArgs);
      }
    } else if (msg.charAt(1) === '1') { // message
      // var split = msg.split('#'); // delimeter between nonce, key (not used)
      const nonce = msg.slice(2); // split[0];
      // var key = split[1];
      const original = tags[i];
      const callbackArgs = [nonce, original];
      StorageManager.getMessages(replaceMessageInDOM, callbackArgs);
    } else {
      // invalid
      document.body.innerHTML = document.body.innerHTML.replace(tags[i], '~~INVALID KEY FORMAT~~');
    }
  }
});
