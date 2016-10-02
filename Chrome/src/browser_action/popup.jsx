var React = require('react');
var ReactDOM = require('react-dom');
var GroupPage = require('./views/groups/group-page.jsx');
var ContactsPage = require('./views/contacts/contacts-page.jsx');
var NewGroupPage = require('./views/new_group/new-group-page.jsx');

document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function loadPage() {
  ReactDOM.render(
    <GroupPage/>,
    document.getElementById('page')
  );
}
