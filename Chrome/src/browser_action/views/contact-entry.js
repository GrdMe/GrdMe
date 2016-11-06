import React, { Component, PropTypes } from 'react';

class ContactEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      name: props.name,
      newName: props.name,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onClickEdit() {
    this.setState({
      editable: true,
    });
  }

  onClickDone(e) {
    e.preventDefault();
    chrome.storage.local.get({ contact: {} }, (result) => {
      const { name, newName } = this.state;
      result.contact[newName] = result.contact[name];
      if (newName !== name) {
        delete result.contact[name];
        // FIXME: this looks like we're deleting the contact, but not adding a new one. Bug?
        chrome.storage.local.set({ contact: result.contact }, () => {});
        this.setState({
          name: newName,
          editable: false,
        });
      } else {
        // chrome.storage.local.set({contact: result.contact}, function(){});
        this.setState({
          editable: false,
        });
      }
    });
  }

  onClickDelete() {
    chrome.storage.local.get({ contact: {} }, (result) => {
      delete result.contact[this.state.name];
      chrome.storage.local.set({ contact: result.contact }, () => {});
      this.props.refresh();
    });
  }

  handleChange(event) {
    this.setState({
      newName: event.target.value,
    });
  }

  render() {
    const { editable, name, newName } = this.state;
    if (editable) {
      return (
        <div className='contactEntry'>
          <div id='contact-info'>
            <form onSubmit={ this.onClickDone }>
              <input type='text' onChange={ this.handleChange } value={ newName } />
            </form>
          </div>
          <div className='contactButtons'>
            <div id='edit-contact'>
              <button type='button' id='edit-button' onClick={ this.onClickDone }>
                DONE
              </button>
            </div>

            <div id='delete-contact'>
              <button type='button' id='delete-button' onClick={ this.onClickDelete }>
                DELETE
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='contactEntry'>
        <div id='contact-info'>
          <h2>
            { name }
          </h2>
        </div>
        <div className='contactButtons'>
          <div id='edit-contact'>
            <button type='button' id='edit-button' onClick={ this.onClickEdit }>
              EDIT
            </button>
          </div>

          <div id='delete-contact'>
            <button type='button' id='delete-button' onClick={ this.onClickDelete }>
              DELETE
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ContactEntry.propTypes = {
  name: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default ContactEntry;