'use strict';

var storageManager;
var $ = require('jquery');
var base64 = require('base64-arraybuffer');

var server = 'http://11.12.13.14:8080';
var serverInit = server + '/api/v1/key/initial';
var port;
var version = '0';
var typeKey = '0';
var typeMessage = '1';
var bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function loadPage() {
    chrome.storage.local.get('installed', function(result) {
        if(result.installed) {
            settingsTab();
        } else {
            installExtension();
        }
    });
    document.getElementById('nav').innerHTML = '<ul id="menu">' + '<li><a id="groups_tab">Groups</a></li>' + '<li><a id="settings_tab">Settings</a></li>' + '<li><a id="debug_tab">Debug</a><li>' + '<li><a>&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;</a></li>' + '</ul>';
    document.getElementById('groups_tab').onclick = function () {
        groupsTab();
    };
    document.getElementById('settings_tab').onclick = function () {
        settingsTab();
    };
    document.getElementById('debug_tab').onclick = function () {
        debugTab();
    };
    storageManager = new StorageManager();
}

function groupsTab() {
    document.getElementById('page').innerHTML = '<div id="newgroup"><button class="blue btn" id="creategroup">Create new group</button><div id="groupadd"></div></div><div><h5>Groups:</h5><ul id="groups"></ul></div><div id ="nogroup"><h5>Delete Contact</h5></div><div><button class="blue btn" id="deletecontact">Delete</button><div id="contacts"></div></div><div><p id="debug"></p></div>';
    document.getElementById('creategroup').onclick = function () {
        createNewGroup();
    };
    document.getElementById('deletecontact').onclick = function () {
        deleteContact();
    };
    storageManager.getGroups(updateGroups, []);
    storageManager.getContacts(populateContactSelect, []);
}

function settingsTab() {
    document.getElementById('page').innerHTML = '<div><button class="blue btn" id="debug_web">Copy My KeyTag to Clipboard to Share</button><div id="manual"><a>User Manual</a></div><div id="debug"></div></div>';
    document.getElementById('debug_web').onclick = function () {
        copyKeyTagToClipboard();
    }
    document.getElementById('manual').onclick = function() {
        chrome.tabs.create({ url: 'https://github.com/grdme/grd.me/wiki/User-Manual'});
    }
}

function debugTab() {
    document.getElementById('page').innerHTML = '<div id="message_add">message id<input type="text" id="mid">cyphertext<input type="text" id="mcypher">plaintext<input type="text" id="mplain">contact<input type="text" id="mcontact">group<input type="text" id="mgroup">timestamp<input type="text" id="mtimestamp"><button class="blue btn" id="message_button">Add message</button></div><div id="message"></div><div id="contact_add">local name<input type="text" id="clocal">server name<input type="text" id="cserver">registered device ids<input type="text" id="cdevice"><button class="blue btn" id="contact_button">Add contact</button></div><div id="contact"></div><div id="group_add">group name<input type="text" id="gname">group id<input type="text" id="gid">group members<input type="text" id="gmembers"><button class="blue btn" id="group_button">Add group</button></div><div id="group"></div><div id="show_messages"><button class="blue btn" id="show_message_button">Show messages</button></div><div id="messages_here"></div><div id="show_contacts"><button class="blue btn" id="show_contacts_button">Show contacts</button></div><div id="contacts_here"></div><div id="show_groups"><button class="blue btn" id="show_groups_button">Show groups</button></div><div id="groups_here"></div><div id="delete_message">delete message by id<input type="text" id="mid_delete"><button class="blue btn" id="message_delete_button">Delete message</button></div><div id="delete_contact">delete contact by local name<input type="text" id="user_delete"><button class="blue btn" id="contact_delete_button">Delete contact</button></div><div id="delete_group">delete group by name<input type="text" id="group_delete"><button class="blue btn" id="group_delete_button">Delete group</button></div><div>member name<input type="text" id="add_member_name">member group<input type="text" id="add_member_group"><button class="blue btn" id="group_add_member_button">Add group member</button></div><div>member name<input type="text" id="delete_member_name">member group<input type="text" id="delete_member_group"><button class="blue btn" id="group_delete_member_button">Delete group member</button></div><div id="debug">Debug here</div><div><button class="blue btn" id="server_button">Test server</button>Response here<p id="result">result</p><p id="status">status</p><p id="xhr">xhr</p><button id="uninstall" class="blue btn">Uninstall</button></div>';
    document.getElementById('message_button').onclick = function () {
        newMessage();
    };
    document.getElementById('contact_button').onclick = function () {
        newContact();
    };
    document.getElementById('group_button').onclick = function () {
        newGroup();
    };
    document.getElementById('show_message_button').onclick =function () {
        showMessages();
    };
    document.getElementById('show_contacts_button').onclick = function () {
        showContacts();
    };
    document.getElementById('show_groups_button').onclick = function () {
        showGroups();
    };
    document.getElementById('message_delete_button').onclick = function () {
        deleteMessage();
    };
    document.getElementById('contact_delete_button').onclick = function () {
        deleteContactDebug();
    };
    document.getElementById('group_delete_button').onclick = function () {
        deleteGroup();
    };
    document.getElementById('group_add_member_button').onclick = function () {
        addGroupMember();
    };
    document.getElementById('group_delete_member_button').onclick = function () {
        deleteGroupMember();
    };
    document.getElementById('server_button').onclick = function () {
        callServer();
    };
    document.getElementById('uninstall').onclick = function() {
        chrome.storage.local.set({ 'installed': false });
    }
}

//INSTALLATION STUFF

function installExtension() {
    document.body.innerHTML = '<div id="installer"><p>The GrdMe extension needs a long term identity key to work. Click install to generate a key and register it to the server.</p><button id="btn" class="blue btn">Install Extension</button><div id="install_wait_animation" class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div><div id="debug"></div><div id="debug1"></div><div id="debug2"></div></div>';
        document.getElementById('install_wait_animation').style.visibility = 'hidden';
    $('#btn').click(function(){
        document.getElementById('install_wait_animation').style.visibility = 'visible';
        clickInstall();
    });
}

function clickInstall() {
    //generate longterm key
    //generate device id
    //register with server (show waiting thing while doing this)
    //to register, need basic auth:
    //  username: base64(identitykey)|deviceID
    //  password: timestamp|signature(timestamp)
    //save longterm key, deviceID
    //save installed set to true
    //
    var username = 'key|deviceID';
    var t = new Date();
    var time = t.getTime() //+ t.getTimezoneOffset()*60000;
    var password = time.toString() + '|' + time.toString();
    var basic_auth = username + ':' + password;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverInit, true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(basic_auth));
    xhr.onreadystatechange = function() {
        var newTime = new Date();
        $('#debug').html(xhr.responseText);
    }
    xhr.send();
    //add longterm key to storage
    var key = bg.base64.encode(bg.axolotl_crypto.randomBytes(32));
    //store longterm key in storage, also make a contact which is user for
    //ability to see own's key
    chrome.storage.local.set({ 'longtermkey': key });
    storageManager.addContact('MY_LONG_TERM_KEY', key, [], doNothing, []);
    //on success
    chrome.storage.local.set({ 'installed': true }, function() {
        document.body.innerHTML = '<nav id="nav"></nav><div id="page"></div>';
        loadPage();
    })
}

function doNothing() {
    return;
}

function copyKeyTagToClipboard() {
    //store user?
    chrome.storage.local.get('longtermkey', function(result) {
        var longTermKey = result.longtermkey ? result.longtermkey : 'key fail';
        var tag = '~~GrdMe!';
        //first char is the version, next type
        tag += version;
        tag += typeKey;
        //rest is key
        tag += longTermKey;
        tag += '~~';
        //create element, append to page, select text, copy
        var textArea = document.createElement('textarea');
        textArea.setAttribute('id', 'deleteme');
        textArea.value = tag;
       $('#page').append(textArea);
        textArea.select();
        document.execCommand('copy');
        //couldnt get jquery to work for this
        document.getElementById('page').removeChild(textArea);
    });
}

function testBackgroundPage() {
    document.getElementById('debug').innerHTML += 'Background page running!';
    /*chrome.runtime.sendMessage({greeting: 'hello'},
        function(response) {
            document.getElementById('debug').innerHTML += 'ALMOST';
            if(response.greeting) {
                document.getElementById('debug').innerHTML += 'FAILS';
            } else {
                document.getElementById('debug').innerHTML += 'WORKS';
            }
            $('#nav').html(response.greeting);
            document.getElementById('debug').innerHTML += 'Background page ran!';
        });
*/
    chrome.runtime.sendMessage({greeting: "encryptMe"}, function(response) {
        $('#nav').html(response.farewell);
    });
}

//GROUP STUFF

/**
* Function called when user clicks 'Add new group' button. Creates input
* element for writing new group name as well as Add and Cancel buttons
*/
function createNewGroup() {
    var groupInput = document.createElement('INPUT');
    groupInput.setAttribute('id', 'newgroupname');
    groupInput.id = 'newgroupname';
    groupInput.setAttribute('type', 'text');
    groupInput.placeholder = 'New group name';
    document.getElementById('groupadd').innerHTML = '';
    document.getElementById('groupadd').appendChild(groupInput);
    var createButton = document.createElement('BUTTON');
    createButton.className = 'blue btn';
    createButton.onclick = function () {
        var groupName = document.getElementById('newgroupname').value;
        storageManager.addGroup(groupName, 0, {}, updateGroups, []);
        document.getElementById('groupadd').innerHTML = '';
    };
    var createText = document.createTextNode('Create');
    createButton.appendChild(createText);
    document.getElementById('groupadd').appendChild(createButton);
    var cancelButton = document.createElement('BUTTON');
    cancelButton.onclick = function () {
        document.getElementById('groupadd').innerHTML = '';
    };
    var cancelText = document.createTextNode('Cancel');
    cancelButton.appendChild(cancelText);
    cancelButton.className = 'blue btn';
    document.getElementById('groupadd').appendChild(cancelButton);
}

/**
* Creates/updates list view of groups in document. Creates a list with each
* group as an item. Each group has its own list made up of its members and
* buttons and selects for deleting groups, deleting and adding group members.
* @param {object} groups: groups storage object
*/
function updateGroups(groups) {
    //empty groups div
    var groupsDiv = document.getElementById('groups');
    groupsDiv.innerHTML = '';
    //create unordered list to store groups
    var listOfGroups = document.createElement('ul');
    groupsDiv.appendChild(listOfGroups);
    //for each group, create unordered list storing number of members and
    //options for adding and deleting members
    //need to fix when changing from let to var

    var _loop = function (groupName) {
        //groupListItem is the list item for this group
        var groupListItem = document.createElement('li');
        groupListItem.innerHTML = '<i>' + groupName + '</i>';
        listOfGroups.appendChild(groupListItem);
        //listOfGroupMembers will hold group members and buttons/selects
        var listOfGroupMembers = document.createElement('ul');
        groupListItem.appendChild(listOfGroupMembers);
        //populate listOfGroupMembers with group members
        for (var contact in groups[groupName].members) {
            var memberListItem = document.createElement('li');
            memberListItem.innerHTML = '<b>' + contact + '</b>';
            listOfGroupMembers.appendChild(memberListItem);
        }
        //create button for deleting group
        var deleteGroupButton = document.createElement('BUTTON');
        deleteGroupButton.className = 'blue btn';
        var txt = document.createTextNode('delete group');
        deleteGroupButton.appendChild(txt);
        //works with let, not with var becaue var will always hold groupName
        //as value of last group... way around?
        deleteGroupButton.onclick = function () {
            delete groups[groupName];
            groupListItem.innerHTML = '';
            storageManager.deleteGroup(groupName, updateGroups, []);
        };
        var groupListItemForButton = document.createElement('li');
        groupListItemForButton.appendChild(deleteGroupButton);
        listOfGroupMembers.appendChild(groupListItemForButton);
        //create select and button for adding a member
        var addMemberSelect = document.createElement('SELECT');
        storageManager.getContacts(function (contacts) {
            for (var contact in contacts) {
                var option = document.createElement('option');
                option.text = contact;
                option.value = contact;
                addMemberSelect.add(option);
            }
        }, []);
        var groupListItemForAddMember = document.createElement('li');
        listOfGroupMembers.appendChild(groupListItemForAddMember);
        groupListItemForAddMember.appendChild(addMemberSelect);
        var addMemberButton = document.createElement('BUTTON');
        addMemberButton.className = 'blue btn';
        var txt2 = document.createTextNode('add member');
        addMemberButton.appendChild(txt2);
        addMemberButton.onclick = function () {
            var newMemberName = addMemberSelect.options[addMemberSelect.selectedIndex].value;
            groups[groupName].members[newMemberName] = true;
            var newMember = document.createElement('li');
            newMember.innerHTML = newMemberName;
            listOfGroupMembers.appendChild(newMember);
            //add member to group currently replacing old group
            storageManager.addGroup(groupName, groups[groupName].id, groups[groupName].members, updateGroups, []);
        };
        groupListItemForAddMember.appendChild(addMemberButton);
        //create select and button for deleting a member
        var deleteMemberSelect = document.createElement('SELECT');
        for (var contact in groups[groupName].members) {
            var option = document.createElement('option');
            option.text = contact;
            option.value = contact;
            deleteMemberSelect.add(option);
        }
        var deleteMemberButton = document.createElement('BUTTON');
        deleteMemberButton.className = 'blue btn';
        var txt3 = document.createTextNode('delete member');
        deleteMemberButton.appendChild(txt3);
        deleteMemberButton.onclick = function () {
            try {
                var contactName = deleteMemberSelect.value;
                delete groups[groupName].members[contactName];
                //use addGroup to overwrite existing group with updated group.
                //eventually change to deleteGroupMember when working
                storageManager.addGroup(groupName, groups[groupName].id, groups[groupName].members, updateGroups, []);
            } catch (err) {
                document.getElementById('debug2').innerHTML = 'delete failed';
            }
        };
        var groupListItemForDeleteMember = document.createElement('li');
        groupListItemForDeleteMember.appendChild(deleteMemberSelect);
        groupListItemForDeleteMember.appendChild(deleteMemberButton);
        listOfGroupMembers.appendChild(groupListItemForDeleteMember);
    };

    for (var groupName in groups) {
        _loop(groupName);
    }
}

/**
* Populates contacts from local storage into select object used for deleting
* contacts
* @param {object} contacts: contact storage object
*/
function populateContactSelect(contacts) {
    var contactSelect = document.createElement('SELECT');
    contactSelect.id = 'contactselect';
    for (var contact in contacts) {
        var option = document.createElement('option');
        option.text = contact;
        option.value = contact;
        contactSelect.add(option);
    }
    document.getElementById('contacts').appendChild(contactSelect);
}

/**
* Deletes contact from storage based on contact selected from page
*/
function deleteContact() {
    var contactSelect = document.getElementById('contactselect');
    var contactName = contactSelect.options[contactSelect.selectedIndex].value;
    storageManager.deleteContact(contactName, refresh, []);
}

/**
* Refreshes groups and contacts on page
*/
function refresh() {
    document.getElementById('contacts').innerHTML = '';
    storageManager.getGroups(updateGroups, []);
    storageManager.getContacts(populateContactSelect, []);
}

//DEBUG STUFF

function putMessage(messages, place) {
    document.getElementById(place).innerHTML = '';
    for (var prop in messages) {
        document.getElementById(place).innerHTML += 'mid: ' + prop;
        document.getElementById(place).innerHTML += ', cyphertext: ' + messages[prop].ciphertext;
        document.getElementById(place).innerHTML += ', plaintext: ' + messages[prop].plaintext;
        document.getElementById(place).innerHTML += ', contact: ' + messages[prop].contact;
        document.getElementById(place).innerHTML += ', group: ' + messages[prop].group;
        document.getElementById(place).innerHTML += ', timestamp: ' + messages[prop].timestamp;
    }
}

function putContact(contacts, place) {
    document.getElementById(place).innerHTML = '';
    for (var prop in contacts) {
        document.getElementById(place).innerHTML += 'local name: ' + prop;
        document.getElementById(place).innerHTML += ', server name: ' + contacts[prop].name;
        document.getElementById(place).innerHTML += ', registered ' + 'deviceIDs: ' + contacts[prop].devices;
    }
}

function putGroup(groups, place) {
    document.getElementById(place).innerHTML = '';
    for (var groupName in groups) {
        document.getElementById(place).innerHTML += 'group name: ' + groupName;
        document.getElementById(place).innerHTML += ', gid: ' + groups[groupName].gid;
        document.getElementById(place).innerHTML += ', members: ' + groups[groupName].members;
        document.getElementById(place).innerHTML += '**';
        for (var contact in groups[groupName].members) {
            document.getElementById(place).innerHTML += contact + ',';
        }
        document.getElementById(place).innerHTML += '**';
    }
}

function newMessage() {
    var mid = document.getElementById('mid').value;
    var cypher = document.getElementById('mcypher').value;
    var plain = document.getElementById('mplain').value;
    var contact = document.getElementById('mcontact').value;
    var group = document.getElementById('mgroup').value;
    var timestamp = document.getElementById('mtimestamp').value;
    var args = ['message'];
    storageManager.addMessage(mid, cypher, plain, contact, group, timestamp, putMessage, args);
}

function newContact() {
    var localName = document.getElementById('clocal').value;
    var serverName = document.getElementById('cserver').value;
    var device = document.getElementById('cdevice').value;
    var args = ['contact'];
    storageManager.addContact(localName, serverName, device, putContact, args);
}

function newGroup() {
    var gname = document.getElementById('gname').value;
    var gid = document.getElementById('gid').value;
    var memberName = document.getElementById('gmembers').value;
    var gmembers = {};
    gmembers[memberName] = true;
    var args = ['group'];
    storageManager.addGroup(gname, gid, gmembers, putGroup, args);
}

function showMessages() {
    var args = ['messages_here'];
    storageManager.getMessages(putMessage, args);
}

function showContacts() {
    var args = ['contacts_here'];
    storageManager.getContacts(putContact, args);
}

function showGroups() {
    var args = ['groups_here'];
    storageManager.getGroups(putGroup, args);
}

function deleteMessage() {
    var mid = document.getElementById('mid_delete').value;
    var args = ['messages_here'];
    storageManager.deleteMessage(mid, putMessage, args);
}

function deleteContactDebug() {
    var name = document.getElementById('user_delete').value;
    var args = ['contacts_here'];
    storageManager.deleteContact(name, putContact, args);
}

function deleteGroup() {
    var group = document.getElementById('group_delete').value;
    var args = ['groups_here'];
    storageManager.deleteGroup(group, putGroup, args);
}

function addGroupMember() {
    var groupName = document.getElementById('add_member_group');
    var member = document.getElementById('add_member_name');
    var args = ['groups_here'];
    storageManager.addGroupMember(groupName, member, putGroup, args);
}

function deleteGroupMember() {
    var groupName = document.getElementById('delete_member_group');
    var member = document.getElementById('delete_member_name');
    var args = ['groups_here'];
    storageManager.deleteGroupMember(groupName, member, putGroup, args);
}

function callServer() {
    /*
    $.ajax({
        url: SERVER,
        type: 'GET',
        success: function success(result, status, xhr) {
            $('#result').html(result);
            $('#status').html(status);
            $('#xhr').html(xhr);
        }
    });
    */
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
    this.addMessage = function (id, ciphertext, plaintext, contact, group, timestamp, callback, callbackArgs) {
        chrome.storage.local.get({ message: {} }, function (result) {
            var update = result.message;
            update[id] = {
                ciphertext: ciphertext,
                plaintext: plaintext,
                contact: contact,
                group: group,
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
