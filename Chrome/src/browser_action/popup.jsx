var React = require('react');
var ReactDOM = require('react-dom');
var PageContainer = require('./views/page-container.jsx');
var NewGroupPage = require('./views/new_group/new-group-page.jsx');
var StorageManager = require('./storage_manager.js');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function loadPage() {
  ReactDOM.render(
    <PageContainer storageManager={new StorageManager()}/>,
    document.getElementById('page')
  );
}
