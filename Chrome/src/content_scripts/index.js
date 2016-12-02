import $ from 'jquery';
import { CryptoManager } from './cryptoManager';
import { initObserver } from './observer';

/** This file handles controls injected scripts */

const cryptoManager = new CryptoManager();
// const frameComm = new FrameComm(cryptoManager);
// cryptoManager.setFrameComm(frameComm);

function endsWith(subject, suffix) {
  return subject.indexOf(suffix, subject.length - suffix.length) !== -1;
}

/** Scan for any crypto on the page and decypt if possible */
function decryptInterval() {
  if (!cryptoManager.keyList.length) {
    return;
  }
  $(`:contains("${ cryptoManager.START_TAG }"):not([crypto_mark="true"]):not([contenteditable="true"]):not(textarea):not(input):not(script)`).each((i, e) => {
    const $elem = $(e);
    if ($elem.find(`:contains("${ cryptoManager.START_TAG }"):not([crypto_mark="true"])').length || $elem.parents('[contenteditable="true"]`).length) {
// ASSUMPTION: an element not containing a crypto message itself will never contain a crypto message
      $elem.attr('crypto_mark', true);
      return;
    }
    cryptoManager.decryptElem($elem, (returnObj) => {
      $elem.parents('[crypto_mark="true"]').attr('crypto_mark', false);
      if (!returnObj.endTagFound) {
        returnObj.plaintext = returnObj.plaintext || '';
        let $parent = $elem.parent().parent().parent();
        if (endsWith(window.location.hostname, 'facebook.com')) {
          if ($elem.parents('.UFICommentBody').length) {
            $parent = $elem.parents('.UFICommentBody');
          } else if ($elem.parents('.userContent').length) {
            $parent = $elem.parents('.userContent');
          }
        }
        $parent.on('click', () => {
          window.requestAnimationFrame(() => {
            if ($parent.text().indexOf(cryptoManager.END_TAG) > 0) {
              let text = $parent.text();
              /* Handle the case of ciphertext in plaintext */
              while (returnObj.plaintext.indexOf(cryptoManager.START_TAG) + 1
              && returnObj.plaintext.indexOf(cryptoManager.END_TAG) + 1) {
                const pre = returnObj.plaintext.substring(0,
                returnObj.plaintext.indexOf(cryptoManager.START_TAG));
                const ciphertext = returnObj.plaintext.substring(
                returnObj.plaintext.indexOf(cryptoManager.START_TAG)
                + cryptoManager.START_TAG.length,
                returnObj.plaintext.indexOf(cryptoManager.END_TAG));
                const post = returnObj.plaintext.substring(
                returnObj.plaintext.indexOf(cryptoManager.END_TAG) + cryptoManager.END_TAG.length);
                returnObj.plaintext = pre + cryptoManager.decryptText(ciphertext) + post;
              }
              if (returnObj.plaintext.length) {
                text = text.trimLeft();
                returnObj.plaintext = returnObj.plaintext.trimLeft();
                const index = Math.max(text.indexOf(returnObj.plaintext), 0);
                $parent.text(text.substring(0, index) +
                  cryptoManager.START_TAG +
                  returnObj.ciphertext.trim() +
                  text.substring(index + returnObj.plaintext.length).trimLeft()
                 );
              } else {
                $parent.text(text.replace(`${ cryptoManager.UNABLE_TO_DECRYPT } ${ cryptoManager.UNABLE_START_TAG }`, cryptoManager.START_TAG));
              }
              cryptoManager.decryptElem($parent);
            }
          });
        });
      }
    });
  });
}

initObserver(decryptInterval);
