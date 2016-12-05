import $ from 'jquery';
import { StorageManager } from '../storage_manager/index';

/** This file handles the page encryption and decryption */
/*eslint-disable*/

class CryptoManager {
  constructor() {
    this.START_TAG = '~~GrdMe!';
    this.END_TAG = '~~';
    this.UNABLE_TO_DECRYPT = '[Unable to decrypt message]';
    this.UNABLE_START_TAG = '[start tag]';
    this.UNABLE_END_TAG = '[end tag]';
    this.NONCE_CHAR = '!';
    // this.DECRYPTED_MARK = this._getDecryptedMark();
    this.preferences = {
      decryptIndicator: true,
      emojis: true,
      sandboxDecrypt: false,
    };
    this.panelMode = false;
    this.activeKeys = [];
    this.keyList = [];
    this.frameComm = {};
    // this._getPreferences();

    $('body').on('mouseenter', 'grdme', function mouseEnterGrdMeHandler() {
      $(this).next('grdme_decrypt').css('font-weight', $(this).next('grdme_decrypt').css('font-weight') < 700 ? 700 : 400);
    }).on('mouseleave', 'grdme', function mouseLeaveGrdMeHandler() {
      $(this).next('grdme_decrypt').css('font-weight', '');
    });
  }

 /** Decrypt an elem's text and return an object with the plaintext,
     ciphertext, and whether or not an end crypto tage was found.
   * @param elem The jQuery element whose text should be decypted
   * @param [cb] Function that takes an object containing a decryption object
  */
  decryptElem(elem, cb) {
    console.log('Element');
    const callback = cb || (() => {});
    let val = elem;
    let index1;
    let index2;
    let html;
    let ciphertext;
    let plaintext;
    /** Report error decrypting message */
    const error = () => {
      elem.html(val.substring(0, index1) + this._sanitize(`${ this.UNABLE_TO_DECRYPT } ${ this.UNABLE_START_TAG } ${ val.substring(val.indexOf(this.START_TAG) + this.START_TAG.length).replace(this.END_TAG, this.UNABLE_END_TAG) }`));
      callback({
        endTagFound: index2 > 0,
        plaintext,
        ciphertext,
      });
    };

    /** Insert plaintext into page and call callback
     * @param originalPlaintext The decrypted text
     * @param ciphertext The encrypted text/nonce text
    */
    const finish = (originalPlaintext, ciphertext) => {
      const end = index2 > 0 ? html.substring(html.indexOf(this.END_TAG) + this.END_TAG.length) : '';
      const start = html.substring(0, html.indexOf(this.START_TAG));
      const uid = encodeURIComponent(this.getRandomString(64));
      const plaintext = originalPlaintext;
      elem.attr('grdMeUID', uid);
      // TODO: put decryptmark back in
      val = start + this.decryptMark(plaintext) + end; // 60 61 65 & 98

      // skip this if statement
      // make sure we have setupplaintext function
      // if (this.preferences.sandboxDecrypt) {
      //   plaintext = '[Decrypting Message...]';
      //   elem.html(start + this.decryptMark(plaintext) + end);
      //   elem.append($('<a>', { grdMeAnchor: '' }).hide());
      //   elem.contents().filter(function filterForTextNodes() {
      //     return this.nodeType === 3;
      //   }).remove();
      //   if (!this.frameComm.FRAME_SECRET) {
      //     console.error('A valid frameComm must be set in the CryptoManager');
      //   }
      //   this.intercept.add({
      //     location: {
      //       full: window.location.href,
      //       host: window.location.host,
      //       origin: window.location.origin,
      //     },
      //     message: {
      //       childrenCSS: this._setupChildren(elem.get(0)),
      //       css: this._getCSS(elem.get(0)),
      //       text: val,
      //     },
      //     secret: this.frameComm.FRAME_SECRET,
      //     uid,
      //   });
      //   if (elem.css('display') === 'inline') {
      //     elem.css('display', 'inline-block');
      //     if (elem.css('vertical-align') === 'baseline') {
      //       elem.css('vertical-align', '-moz-middle-with-baseline');
      //     }
      //   }
      // } else {
      elem.html(val);
      // }

      callback({
        endTagFound: index2 > 0,
        plaintext: this._sanitize(plaintext),
        ciphertext,
      });
    };

    // if (elem.attr('crypto_mark') === 'inFlight') {
    //   return;
    // }

    val = elem.text();
    // can ignore the facebook case, don't have to worry about this first if statement
    // if (val.toLowerCase().indexOf(this.END_TAG) > 0 && this._endsWith(window.location.hostname,
    // 'facebook.com')) {
    //   elem.parent().find('.text_exposed_hide').remove();
    //   elem.parent().find('.text_exposed_show').show();
    //   elem.parents('.text_exposed_root').addClass('text_exposed');
    //   val = elem.text();
    // }
    html = elem.html();
    index1 = val.toLowerCase().indexOf(this.START_TAG);
    index2 = val.toLowerCase().indexOf(this.END_TAG);

    if (index2 < 0 && callback && elem.parent(`:contains("${ this.END_TAG }"):not([contenteditable="true"])`).length) {
      this.decryptElem(elem.parent().attr('crypto_mark', false));
      return;
    }

    // TODO: check if we need strip function back in
    /* This checks the case of the start tag being broken by html elements */
    if (index1 > 0 && html.indexOf(this.START_TAG) < 0 &&
    this._strip(html).indexOf(this.START_TAG) > 0) {
      const character = this.START_TAG.slice(-1);
      let string;
      let index = html.indexOf(character) + 1;
      while (this._strip(string).indexOf(this.START_TAG) < 0 && index < html.length) {
        index = html.indexOf(character, index) + 1;
        string = html.substring(html.indexOf(character), index);
      }
      let preCounter = 0;
      while (this._strip(string) !== this.START_TAG) {
        preCounter++;
        string = string.slice(1);
      }
      html = html.substring(0, html.indexOf(character) + preCounter) +
      this._strip(string) + html.substring(index);
    }

    /* This checks the case of the end tag being broken by html elements */
    if (index2 > 0 && html.indexOf(this.END_TAG) < 0 &&
    this._strip(html).indexOf(this.END_TAG) > 0) {
      const character = this.END_TAG.slice(-1);
      let string;
      let index = html.indexOf(this.START_TAG) + this.START_TAG.length;
      while (this._strip(string).indexOf(this.END_TAG) < 0 && index < html.length) {
        index = html.indexOf(character, index) + 1;
        string = html.substring(html.indexOf(this.START_TAG) + this.START_TAG.length, index);
      }
      html = html.substring(0, html.indexOf(this.START_TAG) + this.START_TAG.length) +
      this._strip(string) + html.substring(index);
    }

    if (index2 > 0 && elem.attr('crypto_mark') === 'false') {
      val = this._strip(html);
      val = html.substring(0, html.indexOf(this.START_TAG)) +
      val.substring(val.indexOf(this.START_TAG), val.indexOf(this.END_TAG)) +
      html.substring(html.indexOf(this.END_TAG));
      index1 = val.toLowerCase().indexOf(this.START_TAG);
      index2 = val.toLowerCase().indexOf(this.END_TAG);
    }
    ciphertext = index2 > 0 ? val.substring(index1 + this.START_TAG.length, index2) :
    val.substring(index1 + this.START_TAG.length);

    // remove this stuff down to 209
    // if (ciphertext.charAt(0) === this.NONCE_CHAR) {
    //   const hash = ciphertext.slice(1);
    //   elem.attr('crypto_mark', 'inFlight');
    //   $.ajax({
    //     url: 'https://grd.me/message/get',
    //     type: 'GET',
    //     data: {
    //       hash,
    //     },
    //     success: (data) => {
    //       elem.removeAttr('crypto_mark');
    //       if (data && data.status && data.status[0] && !data.status[0].code) {
    //         plaintext = false;
    //         for (let i = 0; i < data.messages.length; i++) {
    //           plaintext = this.decryptText(data.messages[i].message);
    //           if ((new CryptoJS.SHA256(data.messages[i].message + data.messages[i].rand))
    //           .toString().slice(0, 60) === hash && plaintext) {
    //             finish(plaintext, ciphertext);
    //             return;
    //           }
    //         }
    //         error();
    //       } else {
    //         error();
    //       }
    //     },
    //     error: () => {
    //       elem.removeAttr('crypto_mark');
    //       error();
    //     },
    //   });
    // } else {
    plaintext = this.decryptText(ciphertext);
    console.log("value of plaintext: " + plaintext);
    if (plaintext) {
      finish(plaintext, ciphertext);
    } else {
      error();
    }
    // }
  }

  /** Decrypt ciphertext with all available keys. Returns false if no decryption possible
   * @param originalCiphertext The text excluding the crypto tags to decrypt
  */
  decryptText(originalCiphertext) {
    // this is where we compare nonces
    // from storage manager or chrome messages, compare the nonce like a hashmap
    // original cypher text is the nonce in this case
    // everything else underneath here can be blown away

    const nonce = originalCiphertext;
    let plaintext = 'Unable to Decrypt Message :(';

    let messages = StorageManager.getMessages(function(result) {
      messages = result;
    }, []);

    for(message in messages){
      if(message.ciphertext === nonce){
        plaintext = message.plaintext;
      }
    }

    return plaintext;

    // let ciphertext = originalCiphertext.replace(/\)/g, '+').replace(/\(/g, '/');
    // ciphertext = ciphertext.split('|');
    // let validDecryption = false;
    // let plaintext = '';
    // for (let i = 0; i < ciphertext.length; i++) {
    //   for (let j = 0; j < this.keyList.length; j++) {
    //     try {
    //       if (typeof this.keyList[j].key === 'object' && this.keyList[j].key.priv) {
    //         // plaintext = ecc.decrypt(this.keyList[j].key.priv, ciphertext[i]);
    //       } else if (typeof this.keyList[j].key !== 'object') {
    //         plaintext = CryptoJS.AES.decrypt(ciphertext[i], this.keyList[j].key);
    //         plaintext = plaintext.toString(CryptoJS.enc.Utf8);
    //       } else {
    //         continue;
    //       }
    //       if (!plaintext.trim()) {
    //         throw Error();
    //       }
    //       validDecryption = true;
    //       break;
    //     } catch (e) {
    //       validDecryption = false;
    //     }
    //   }
    //   if (validDecryption) {
    //     break;
    //   }
    // }
    // return validDecryption ? plaintext : false;
  }

/** Check that a string ends with another substring
 * @param subject String to search through
 * @param suffix The proposed suffix of the subject
*/
  static _endsWith(subject, suffix) {
    return subject.indexOf(suffix, subject.length - suffix.length) !== -1;
  }

  /** Generate a random string
  	 * @param length Length of the random string
  	*/
  getRandomString(length) {
		const randArray = new Uint32Array(length);
		let rand = '';
		window.crypto.getRandomValues(randArray);
		for (let i = 0; i < randArray.length; i++) {
			rand += String.fromCharCode((randArray[i] % 94) + 33);
		}
		return rand;
	}

  /** emojify, linkify and fix line breaks in plaintext
	 * @param plaintext The plaintext to modify
	*/
	setupPlaintext(plaintext) {
		let formattedStr = linkify(this._sanitize(plaintext).replace(/\n/g, '<br>'));
		if (this.preferences.emojis) {
			formattedStr = emojify(formattedStr);
		}
		return formattedStr;
	}

  /** Mark a piece of text as decrypted - only works if the decryptIndicator is true
	 * @param originalPlaintext Text to be marked
	 * NOTE: originalPlaintext should already sanitzed when this is called
	*/
	decryptMark(originalPlaintext) {
		let plaintext = originalPlaintext;
		if (this.preferences.decryptIndicator) {
			const wrapper = $('<i>').append($('<grdme_decrypt>').html(plaintext));
			plaintext = this.DECRYPTED_MARK + ' ' + wrapper.html();
		}
		return plaintext;
	}

  /** Sanitize a string
	 * @param str String to sanitize
	*/
	_sanitize(str) {
		return $('<i>', {text: str}).html();
	}

}

export {CryptoManager};
