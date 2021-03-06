/** This file handles the secure text box chrome logic */
const clipboard = require('sdk/clipboard');
const data = require('sdk/self').data;
const Panel = require('sdk/panel').Panel;
const ss = require('sdk/simple-storage');

const secureTextPanel = new Panel({
	contentURL: data.url('secureTextPanel/secureText.html'),
	contentStyleFile: data.url('secureTextPanel/secureText.css'),
	contentScriptFile: [data.url('lib/aes.js'),
						data.url('lib/ecc.js'),
						data.url('lib/sha256.js'),
						data.url('lib/jquery-2.1.3.js'),
						data.url('lib/mousetrap.js'),
						data.url('lib/linkify.js'),
						data.url('observer.js'),
						data.url('frameComm.js'),
						data.url('cryptoManager.js'),
						data.url('main.js')],
	width: 300,
	height: 235,
});

secureTextPanel.port.on('copy_ciphertext', (text) => {
	clipboard.set(text, 'text');
});

secureTextPanel.port.emit('panelMode');

secureTextPanel.on('show', () => {
	secureTextPanel.port.emit('secret', {
		active: ss.storage.activeKeys,
		keys: ss.storage.keys,
	});
	secureTextPanel.port.emit('show');
});

exports.secureTextPanel = secureTextPanel;
