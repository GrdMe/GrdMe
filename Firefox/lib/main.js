/** This is the main file */

var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var Panel = require("sdk/panel").Panel;
var clipboard = require("sdk/clipboard");
var ss = require("sdk/simple-storage");
var Request = require("sdk/request").Request;
var notifications = require("sdk/notifications");
var timers = require("sdk/timers");
var preferences = require("sdk/simple-prefs");
var Intercept = require("intercept").Intercept;
var CryptoJS = require("lib/aes").CryptoJS;
var workers = [];

ss.storage.keys = ss.storage.keys || [{
	key: ":N5gaDV7)\P3.r5",
	description: "This is Grd Me's default shared key"
}];

ss.storage.encryptedKeys = ss.storage.encryptedKeys || false;

ss.storage.uids = ss.storage.uids || [];

ss.storage.randomMap = ss.storage.randomMap || {};

ss.storage.acceptableSharedKeys = ss.storage.acceptableSharedKeys || [];

if(!ss.storage.activeKeys){
	ss.storage.activeKeys = [ss.storage.keys[0].key];
}
for(var i=0; i<ss.storage.activeKeys.length; i++){
	ss.storage.activeKeys[JSON.stringify(ss.storage.activeKeys[i])] = true;
}

function handleChange(state) {
	if (state.checked) {
		prefPanel.show();
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

var button = require("sdk/ui/button/toggle").ToggleButton({
	id: "crypt_btn",
	label: "Grd Me Key Manager",
	icon: data.url("icons/icon64.png"),
	onChange: handleChange
});

preferences.on("decryptIndicator", function(){
	for(var i=0; i<workers.length; i++){
		workers[i] && workers[i].port.emit("decryptIndicator", preferences.prefs.decryptIndicator);
	}
});

preferences.on("sandboxDecrypt", function(){
	for(var i=0; i<workers.length; i++){
		workers[i] && workers[i].port.emit("sandboxDecrypt", preferences.prefs.sandboxDecrypt);
	}
});

var prefPanel = Panel({
	contentURL: data.url("prefs.html"),
	contentStyleFile: data.url("prefs.css"),
	contentScriptFile: [data.url("lib/jquery-2.1.3.min.js"),
						data.url('lib/ecc.min.js'),
						data.url('dropdown.js'),
						data.url("prefs.js")],
	position: button,
	onHide: handleHide,
	width: 300,
	height: 400
});

for(var i=0; i<ss.storage.keys.length; i++){
	if(ss.storage.activeKeys[JSON.stringify(ss.storage.keys[i].key)]){
		prefPanel.port.emit("activeKeyIndex", i);
	}
}

/** Refresh the displayed keys in the pref panel */
prefPanel.refreshKeys = function(){
	prefPanel.port.emit("displayKeys", {
		keys: ss.storage.keys,
		encrypted: ss.storage.encryptedKeys
	});
}

prefPanel.refreshKeys();

prefPanel.port.emit("uids", ss.storage.uids);

prefPanel.port.on("encryptKeychain", function(password){
	if(!password.length){
		return;
	}
	ss.storage.keys = CryptoJS.AES.encrypt(JSON.stringify(ss.storage.keys), password).toString();
	ss.storage.encryptedKeys = true;
	prefPanel.refreshKeys();
});

prefPanel.port.on("decryptKeychain", function(password){
	if(!password.length){
		return;
	}
	plaintext = CryptoJS.AES.decrypt(ss.storage.keys, password);
	try{
		plaintext = plaintext.toString(CryptoJS.enc.Utf8);
		if(!plaintext){
			throw true;
		}
		ss.storage.keys = JSON.parse(plaintext);
		ss.storage.encryptedKeys = false;
	}
	catch(e){}
	prefPanel.refreshKeys();
});

prefPanel.port.on("setActiveKeys", function(indices){
	ss.storage.activeKeys = [];
	for(var i=0; i<indices.length; i++){
		ss.storage.activeKeys.push(ss.storage.keys[indices[i]].key);
		ss.storage.activeKeys[JSON.stringify(ss.storage.keys[indices[i]].key)] = true;
	}
	for(i=0; i<workers.length; i++){
		workers[i].port.emit("secret", {active: ss.storage.activeKeys, keys: ss.storage.keys});
	}
});

prefPanel.port.on("addKey", function(keyObj){
	ss.storage.keys.push(keyObj);
	prefPanel.refreshKeys();
});

prefPanel.port.on("deleteKey", function(index){
	ss.storage.keys.splice(index, 1);
	prefPanel.refreshKeys();
});

/** Update a key's description
 * obj: an object containing the index of the key to change and the updated description
*/
prefPanel.port.on("updateDescription", function(obj){
	ss.storage.keys[obj.index].description = obj.description;
});

prefPanel.port.on("removeAcceptableSharedKey", function(index){
	ss.storage.acceptableSharedKeys.splice(index, 1);
});

/** Make a request to publish a public key */
prefPanel.port.on("publishKey", function(key){
	var addKeyRequest = Request({
		url: "https://grd.me/key/add",
		content: {
			uid: key.uid,
			pub: key.pub,
			sig: key.sig
		},
		onComplete: function (data) {
			data = data.json;
			if(!data || !data.status || !data.status[0] || data.status[0].code){
				prefPanel.port.emit("publishResult", {success: false, index: key.index});				
			}
			else {
				ss.storage.uids.push(key.uid);
				ss.storage.uids = uniq(ss.storage.uids);
				ss.storage.keys[key.index].key.published = true;
				prefPanel.port.emit("publishResult", {success: true, index: key.index});
				prefPanel.port.emit("uids", ss.storage.uids);
				prefPanel.refreshKeys();
			}
		}
	}).post();
});

/** Make a request to revoke a public key */
prefPanel.port.on("revokeKey", function(key){
	var revokeKeyRequest = Request({
		url: "https://grd.me/key/revoke",
		content: {
			pub: key.pub,
			sig: key.sig
		},
		onComplete: function (data) {
			data = data.json;
			if(!data || !data.status || !data.status[0] || data.status[0].code){
				prefPanel.port.emit("revokeResult", {success: false, index: key.index});
			}
			else {
				ss.storage.keys.splice(key.index, 1);
				prefPanel.port.emit("revokeResult", {success: true, index: key.index});
				prefPanel.refreshKeys();
			}
		}
	}).post();
});

/** Share a shared key with another user */
prefPanel.port.on("shareKey", function(key){
	var shareKeyRequest = Request({
		url: "https://grd.me/key/shareKey",
		content: key,
		onComplete: function (data) {
			data = data.json;
			if(!data || !data.status || !data.status[0] || data.status[0].code){
				prefPanel.port.emit("shareKeyResult", false);
			}
			else {
				prefPanel.port.emit("shareKeyResult", true);
				ss.storage.randomMap[key.sharedKey] = key.rand;
			}
		}
	}).post();
});

/** Make a request to delete a shared key */
prefPanel.port.on("deleteSharedKeyRequest", function(key){
	key.rand = ss.storage.randomMap[key.sharedKey];
	var deleteSharedKeyRequest = Request({
		url: "https://grd.me/key/deleteSharedKey",
		content: key,
		onComplete: function (data) {
			data = data.json;
			if(!data || !data.status || !data.status[0] || data.status[0].code){
				console.log("Error making delete shared key request");
			}
			else {
				delete ss.storage.randomMap[key.sharedKey];
			}
		}
	}).post();
});

/** Notify user of any symmetric keys shared with them */
prefPanel.port.on("notifySharedKeys", function(keys){
	ss.storage.acceptableSharedKeys = keys;
	var length = keys.length;
	notifications.notify({
		title: "New Shared Key"+(length>1? "s" : ""),
		text: "You have "+length+" new shared key"+(length>1? "s" : "")+"!",
		iconURL: data.url("icons/icon64.png"),
		onClick: function(){
			timers.setTimeout(function(){
				button.state('window', {checked: true});
				prefPanel.show();
			}, 0);
		}
	});
});

/** Prefpanel show event handler */
prefPanel.on("show", function(){
	prefPanel.port.emit("show", ss.storage.acceptableSharedKeys);
});

exports.main = function(options){
	var attachTo = ["top", "frame"];
	if(options.loadReason === "install"){
		attachTo.push("existing");
	}
	var secureTextPanel = Panel({
		contentURL: data.url("secureText.html"),
		contentStyleFile: data.url("secureText.css"),
		contentScriptFile: [data.url("lib/aes.js"),
							data.url('lib/ecc.min.js'),
							data.url('lib/sha256.js'),
							data.url("lib/jquery-2.1.3.min.js"),
							data.url("lib/mousetrap.min.js"),
							data.url("lib/linkify.min.js"),
							data.url("constants.js"),
							data.url("observer.js"),
							data.url("crypt.js")],
		width: 300,
		height: 235
	});
	
	secureTextPanel.port.on("copy_ciphertext", function(text){
		clipboard.set(text, "text");
	});
	
	secureTextPanel.port.emit("secret", {active: ss.storage.activeKeys, keys: ss.storage.keys});
	
	secureTextPanel.port.emit("panelMode");
	
	secureTextPanel.on("show", function(){
		secureTextPanel.port.emit("show");
	});
	
	pageMod.PageMod({
		include: ["*"],
		contentScriptFile: [data.url("lib/aes.js"),
							data.url('lib/ecc.min.js'),
							data.url('lib/sha256.js'),
							data.url("lib/jquery-2.1.3.min.js"),
							data.url("lib/mousetrap.min.js"),
							data.url("lib/linkify.min.js"),
							data.url("constants.js"),
							data.url("frameComm.js"),
							data.url("observer.js"),
							data.url("crypt.js")],
		contentScriptWhen: "ready",
		contentScriptOptions: {
			active: ss.storage.activeKeys,
			keys: ss.storage.keys,
			decryptIndicator: preferences.prefs.decryptIndicator,
			sandboxDecrypt: preferences.prefs.sandboxDecrypt
		},
		attachTo: attachTo,
		onAttach: function(worker){
			workers.push(worker);
			
			worker.on('detach', function(){
				detachWorker(this, workers);
			});
			
			/** Send worker the latest info */
			worker.port.emit("decryptIndicator", preferences.prefs.decryptIndicator);
			worker.port.emit("sandboxDecrypt", preferences.prefs.sandboxDecrypt);
			worker.port.emit("secret", {active: ss.storage.activeKeys, keys: ss.storage.keys});
			
			var {Cu} = require("chrome");
			var {Worker} = Cu.import(data.url("dummy.jsm"));
			Cu.unload(data.url("dummy.jsm"));
			
			var webWorker = new Worker(data.url("worker.js"));
			
			webWorker.onmessage = function(event){
				worker.port.emit("callback", JSON.parse(event.data));
			};
			
			/** Send a message to the webworker
			 * id: the id of the messsage
			 * data: any data to send to the worker
			*/
			function sendWebWorkerMessage(id, data){
				data.keyList = ss.storage.keys;
				webWorker.postMessage(JSON.stringify({id: id, data: data}));
			}
			
			worker.port.on("newTab", function(href){
				tabs.open(href);
			});
			
			worker.port.on("prepareIframe", function(data){
				Intercept.add(data.uid, data.location, data.secret, data.message);
				worker.port.emit("preparedIframe", data.uid);
			});
			
			worker.port.on("decrypt", function(data){
				sendWebWorkerMessage("decrypt", data);
			});
			
			worker.port.on("recheckDecryption", function(data){
				sendWebWorkerMessage("recheckDecryption", data);
			});
			
			worker.port.on("copy_ciphertext", function(text){
				clipboard.set(text, "text");
			});
			
			worker.port.on("message_add", function(obj){
				var addMessageRequest = Request({
					url: "https://grd.me/message/add",
					content: obj.data,
					onComplete: function(data){
						data = data.json;
						if(!data || !data.status || !data.status[0] || data.status[0].code){
							clipboard.set(obj.ciphertext, "text");
							worker.port.emit("message_add_fail");
						}
					}
				}).post();
			});
			
			worker.port.on("message_get", function(obj){
				var getMessageRequest = Request({
					url: "https://grd.me/message/get",
					content: {hash: obj.hash},
					onComplete: function(data){
						data = data.json;
						if(data && data.status && data.status[0] && !data.status[0].code) {
							//Success
							data.hash = obj.hash;
							data.callback = obj.callback;
							sendWebWorkerMessage("verifyShortMessage", data);
						}
						else {
							//Error
							worker.port.emit("callback", {index: obj.callback, data: false});
						}
					}
				}).get();
			});
			
			worker.port.on("secureText", function(){
				secureTextPanel.show();
			});
		}
	});
	
	pageMod.PageMod({
		include: ["data:*"],
		contentScriptFile: [data.url("lib/jquery-2.1.3.min.js"),
							data.url("lib/linkify.min.js"),
							data.url("lib/aes.js"),
							data.url("constants.js"),
							data.url("observer.js"),
							data.url("intercept.js")],
		contentScriptWhen: "ready",
		attachTo: ["frame"],
		onAttach: function(worker){
			workers.push(worker);
			worker.on('detach', function(){
				detachWorker(this, workers);
			});
			
			/* Verify frames were created by Grd Me */
			worker.port.on("verifyFrame", function(obj){
				Intercept.getInfo(obj.uid, obj.secret, function(returnObj){
					if(returnObj){
						worker.port.emit("frameVerified", returnObj);
					}
					else {
						worker.port.emit("frameFailed");
					}
				});
			});
		}
	});
}

/** Detach a worker from an array of workers
 * worker: the worker to remove
 * workerArray: the array to remove the worker from
*/
function detachWorker(worker, workerArray) {
	var index = workerArray.indexOf(worker);
	if(index != -1) {
		workerArray.splice(index, 1);
	}
}

/** Get rid of duplicate elements in an array
 * arr: the array to do such to
*/
function uniq(arr) {
    var seen = {};
    var out = [];
    var len = arr.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = arr[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

/** Check for shared keys and delete old shared keys - run every minute */
timers.setInterval(function(){
	var keys = [];
	for(var i=0; i<ss.storage.keys.length; i++){
		if(ss.storage.keys[i].key.priv){
			keys.push(ss.storage.keys[i].key.pub);
		}
	}
	var checkShareKeyRequest = Request({
		url: "https://grd.me/key/checkSharedKey",
		content: {
			keys: keys
		},
		onComplete: function (data) {
			data = data.json;
			if(data && data.status && data.status[0] && !data.status[0].code){
				data.acceptableSharedKeys = ss.storage.acceptableSharedKeys;
				prefPanel.port.emit("checkSharedKey", data);
			}
		}
	}).post();
}, 60000);