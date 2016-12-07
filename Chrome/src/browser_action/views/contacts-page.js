import React from 'react';
import HeadPanel from './head-panel';
import ContactList from './contact-list';
import KeyInfo from './key-info';
import DisplayNameInfo from './display-name-info';

const ContactsPage = () => (
  <div>
    <HeadPanel>
      <div id='center'>
        CONTACTS
      </div>
    </HeadPanel>
    <ContactList />
    <div id='contact-footer'>
      <p>
        To add a contact, have someone send you their Contact Code.
      </p>
    </div>
    <KeyInfo />
    <DisplayNameInfo />
  </div>
);

export default ContactsPage;
