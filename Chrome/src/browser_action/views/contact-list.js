import React, { Component } from 'react';
import ContactEntry from './contact-entry';
// import StorageManager from '../../storage_manager';

// const noContacts = '';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  getContacts() {
    // StorageManager.getContacts(x => { this.setState({ contacts: x }) }, []);
    chrome.storage.sync.get({ contact: {} }, (result) => {
      // console.log("this is the result: " + result.contact);
      this.setState({ contacts: Object.keys(result.contact) });
    });
  }

  refreshContact() {
    // noContacts = "You don't have any contacts yet!";
    this.setState({
      contacts: [],
    });
  }

  renderContacts() {
    if (!this.state.contacts.length) {
      // noContacts = "You don't have any contacts yet!";
      this.getContacts();
      return null;
    }
    // noContacts = '';
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
        { /* <p>{noContacts}</p> */ }
      </div>
    );
  }
}

export default ContactList;
