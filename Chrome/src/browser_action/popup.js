import React from 'react';
import ReactDOM from 'react-dom';
import ContactsPage from './views/contacts-page';
import StorageManager from '../storage_manager';

const element = (
  <ContactsPage storageManager={ StorageManager } />
);

function loadPage() {
  ReactDOM.render(
    element,
    document.getElementById('page')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  loadPage();
});
