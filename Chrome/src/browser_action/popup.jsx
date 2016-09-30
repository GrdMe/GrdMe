var React = require('react');
var ReactDOM = require('react-dom');
var GroupPage = require('./views/group-page.jsx');
var ContactsPage = require('./views/contacts-page.jsx');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function loadPage() {
  ReactDOM.render(
    <ContactsPage/>,
    document.getElementById('page')
  );
}
