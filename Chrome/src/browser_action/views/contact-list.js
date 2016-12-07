import React, { Component } from 'react';
import ContactEntry from './contact-entry';
// import StorageManager from '../../storage_manager';

let noContacts = '';

class ContactList extends Component {

  static addContact() {
    const publicName = 'New Contact';
    const localName = publicName;
    const deviceIDs = '1001';
    chrome.storage.sync.get({ contact: {} }, (result) => {
      const update = result.contact;
      update[localName] = {
        name: publicName,
        devices: deviceIDs,
      };
      chrome.storage.sync.set({ contact: update }, () => {});
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
    this.refreshContact = this.refreshContact.bind(this);
  }

  getContacts() {
    // StorageManager.getContacts(x => { this.setState({ contacts: x }) }, []);
    chrome.storage.sync.get({ contact: {} }, (result) => {
      this.setState({ contacts: Object.keys(result.contact) });
    });
  }

  refreshContact() {
    // noContacts = "You don't have any contacts yet!";
    // console.log(this.state.contacts);
    this.setState({
      contacts: [],
    });
    this.forceUpdate();
  }

  renderContacts() {
    this.getContacts();
    if (!this.state.contacts.length) {
      // console.log('dont have any contacts anymore');
      noContacts = "You don't have any contacts yet!";
      // this.getContacts();
      return null;
    }
    // console.log('i do have contacts now!');
    noContacts = '';
    const contactEntries = this.state.contacts.map(x => (
      <ContactEntry name={ x } refresh={ this.refreshContact } />
    ));
    // const contactEntries = contacts.map(x => (
    //   <ContactEntry name={x} delete={this.deleteContact}/>
    // ));

    return contactEntries;
  }

  render() {
    return (
      <div id='contact-list'>
        { this.renderContacts() }
        <div id='no-contacts'>
          { noContacts }
        </div>
        <div className='add'>
          <button type='button' id='add-button' onClick={ ContactList.addContact }>+ Add Contact</button>
        </div>
      </div>
    );
  }
}

export default ContactList;
