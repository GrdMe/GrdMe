var React = require('react');
var ReactDOM = require('react-dom');
var ContactsPage = require('./views/contacts-page.jsx');
var StorageManager = require('./storage_manager.js');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function loadPage() {
  ReactDOM.render(
    <ContactsPage storageManager={new StorageManager()}/>,
    document.getElementById('page')
  );
}
