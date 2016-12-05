import base64 from 'base64-arraybuffer';

/* eslint-disable */
/**
* JavaScript file for secureTextPopup.html. Used for populating group select
* with groups in the database, encrypting and sending messages
*/

var groups;
var contacts;
var storageManager;
const bg = chrome.extension.getBackgroundPage();

//onload, load all groups & contacts to make it easier because callback
//functions make code harder to write/read. Create select group option
document.addEventListener("DOMContentLoaded", function() {
    storageManager = new StorageManager();
    groups = storageManager.getGroups(populateSelect, []);
    contacts = storageManager.getContacts(function(result) {
        contacts = result;
     }, []);
});
/**
* Callback function for storageManager.getContacts() so that contacts can be
* stored in a global variable
* @param {object} result: object of contacts storage
*/
function makeContactsLocal(result) {
    contacts = result;
}

/**
* Callback function for storageManager.getGroups() that stores groups in global
* variable and generates a select element with group names and button for
* encrypting and submitting the message
* @param {object} result: object of groups storage
*/
function populateSelect(result){
    // groups = result;
    // var dropDown = document.createElement('select');
    // dropDown.id = 'groupSelect';
    // for(var prop in groups){
    //     var option = document.createElement('option');
    //     option.text = prop;
    //     option.value = prop;
    //     dropDown.appendChild(option);
    // }
    // document.getElementById('options').appendChild(dropDown);
    var encryptButton = document.createElement('button');
    var txt = document.createTextNode('Encrypt and Submit');
    encryptButton.onclick = function() {
        console.log("button has been clicked!!");
        submitMessage();
        document.getElementById('message').value = '';
        document.getElementById('message').placeholder = 'Message encrypted' +
        ' and submitted!';
    }
    encryptButton.appendChild(txt);
    document.getElementById('options').appendChild(encryptButton);
}

/**
* Function called when encrypt and submit button clicked. Gets group name from
* group selector, gets message from text area, and then encrypts the message
* for each group member and saves it to local storage and sends to message to
* server.
* TODO: 1. send message to server
*       2. encrypt ciphertext
*       3. get correct timestamp
*       4. clarify id
*       5. copy encrypted message to clipboard
*/
function submitMessage() {
    // var groupName = document.getElementById('groupSelect').value;
    var plaintext = document.getElementById('message').value;
    console.log(plaintext);
    var date = new Date();
    var timestamp = date.getTime();
    for(var contact in contacts) {
        console.log("made it!");
        var ciphertext = base64.encode(bg.axolotlCrypto.randomBytes(32));
        var id = base64.encode(bg.axolotlCrypto.randomBytes(32));
        console.log("this is the id: " + id);
        //don't need groupName in add message parameters anymore, nonce is the id
      storageManager.addMessage(id, ciphertext, plaintext, contact, timestamp);
    }
    var textArea = document.createElement('textarea');
    textArea.value = '~~GrdMe!01' + id + '~~';
    document.getElementById('debug').appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.getElementById('debug').removeChild(textArea);
}

/**
 * Class for using chrome local storage for storing contacts, groups, and
 * messages.
 */

var StorageManager = function StorageManager() {
    /**
     * Add (or update) a contact to local storage
     * @param {string} localName: the unique user given name
     * @param {string} publicName: the unique name for the user in server
     * @param {array} deviceIDs: array of device IDs associated with user
     * @param {function} callback: callback function after contact stored
     * @param {array} callbackArgs: array of args for callback function
     */
    this.addContact = function (localName, publicName, deviceIDs, callback, callbackArgs) {
        chrome.storage.local.get({ contact: {} }, function (result) {
            var update = result.contact;
            update[localName] = {
                name: publicName,
                devices: deviceIDs
            };
            chrome.storage.local.set({ contact: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
     * Gets contacts out of local storage and runs callback function with
     * results.
     * @param {function} callback: callback function after contacts retrieved
     * @param {array} callbackArgs: array of args for callback function
     */
    this.getContacts = function (callback, callbackArgs) {
        chrome.storage.local.get({ contact: {} }, function (result) {
            callbackArgs.unshift(result.contact);
            callback.apply(null, callbackArgs);
        });
    };
    /**
     * Delete contact from local storage
     * @param {string} localName: the local name of the contact to be deleted
     * @param {function} callback: callback function after contact deleted
     * @param {array} callbackArgs: array of args for callback function
     */
    this.deleteContact = function (localName, callback, callbackArgs) {
        chrome.storage.local.get({ contact: {} }, function (result) {
            var update = result.contact;
            delete update[localName];
            chrome.storage.local.set({ contact: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
     * Add a group to local storage
     * @param {string} name: group name
     * @param {string} id: group id
     * @param {object} members: local names of contacts stored as associative
     * array
     * @param {function} callback: callback function after group added
     * @param {array} callbackArgs: array of args for callback function
     */
    this.addGroup = function (name, id, members, callback, callbackArgs) {
        chrome.storage.local.get({ group: {} }, function (result) {
            var update = result.group;
            update[name] = {
                gid: id,
                members: members
            };
            chrome.storage.local.set({ group: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
     * Gets groups out of local storage and runs callback function with results
     * @param {function} callback: callback function after groups retrieved
     * @param {array} callbackArgs: array of args for callback function
     */
    this.getGroups = function (callback, callbackArgs) {
        chrome.storage.local.get({ group: {} }, function (result) {
            callbackArgs.unshift(result.group);
            callback.apply(null, callbackArgs);
        });
    };
    /**
    * WIP: not working, can just overwrite addgroup
    * Add member to group
    * @param {string} groupName: name of group
    * @param {string} member: localName of contact to add as member
    * @param {function} callback: callback function after member added
    * @param {array} callbackArgs: array of args for callback function
    */
    this.addGroupMember = function (groupName, member, callback, callbackArgs) {
        chrome.storage.local.get({ group: {} }, function (result) {
            var update = result.group;
            update[groupName].members.push(member);
            chrome.storage.local.set({ group: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
    * WIP: not working, can just overwrite addgroup
    * Deletes member from group in local storage
    * @param {string} groupName: name of group
    * @param {string} member: localName of contact to be deleted
    * @param {function} callback: callback function after member deleted
    * @param {array} callbackArgs: array of args for callback function
    */
    this.deleteGroupMember = function (groupName, member, callback, callbackArgs) {
        chrome.storage.local.get({ group: {} }, function (result) {
            var update = result.group;
            delete update[groupName].members[member];
            chrome.storage.local.set({ contact: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
    * Deletes group from local storage
    * @param {string} groupName: name of group to be deleted
    * @param {function} callback: callback function after group deleted
    * @param {array} callbackArgs: array of args for callback function
    */
    this.deleteGroup = function (groupName, callback, callbackArgs) {
        chrome.storage.local.get({ group: {} }, function (result) {
            var update = result.group;
            //update[groupName] = null;
            delete update[groupName];
            chrome.storage.local.set({ group: update }, function (result) {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
    * Add message to local storage
    * @param {string} id: id of message
    * @param {string} ciphertext: ciphertext message
    * @param {string} plaintext: plaintext message
    * @param {string} contact: contact associated with message (localname or
    * servername???)
    * @param {string} group: group associated with message
    * @param {number} timestamp: unix timestamp
    * @param {function} callback: callback function after message addded
    * @param {array} callbackArgs: array of args for callback function
    */
    this.addMessage = function (id, ciphertext, plaintext, contact, timestamp, callback, callbackArgs) {
        chrome.storage.local.get({ message: {} }, function (result) {
            var update = result.message;
            update[id] = {
                ciphertext: ciphertext,
                plaintext: plaintext,
                contact: contact,
                // group: group,
                timestamp: timestamp
            };
            chrome.storage.local.set({ message: update }, function () {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
    /**
     * Gets messages out of local storage and runs callback function with
     * results, puts messages object as first argument in callbackArgs
     * @param {function} callback: callback function after groups retrieved
     * @param {array} callbackArgs: array of args for callback function
     */
    this.getMessages = function (callback, callbackArgs) {
        chrome.storage.local.get({ message: {} }, function (result) {
            callbackArgs.unshift(result.message);
            callback.apply(null, callbackArgs);
        });
    };
    /**
    * Delete message from local storage
    * @param {string} id: message id
    * @param {function} callback: callback function after message deleted
    * @param {array} callbackArgs: array of args for callback function
    */
    this.deleteMessage = function (id, callback, callbackArgs) {
        chrome.storage.local.get({ message: {} }, function (result) {
            var update = result.message;
            delete update[id];
            chrome.storage.local.set({ message: update }, function (result) {
                callbackArgs.unshift(update);
                callback.apply(null, callbackArgs);
            });
        });
    };
};
