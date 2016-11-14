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
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  onClickEdit() {
    this.setState({
      editable: true,
    });
  }

  onClickDone(e) {
    e.preventDefault();
    chrome.storage.sync.get({ contact: {} }, (result) => {
      const { name, newName } = this.state;
      result.contact[newName] = result.contact[name];
      if (newName !== name) {
        delete result.contact[name];
        chrome.storage.sync.set({ contact: result.contact }, () => {});
        this.setState({
          name: newName,
          editable: false,
        });
      } else {
        // chrome.storage.sync.set({contact: result.contact}, function(){});
        this.setState({
          editable: false,
        });
      }
    });
  }

  onClickDelete() {
    chrome.storage.sync.get({ contact: {} }, (result) => {
      delete result.contact[this.state.name];
      chrome.storage.sync.set({ contact: result.contact }, () => {});
      this.props.refresh();
      this.forceUpdate();
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
          <div className='contact-info'>
            <form onSubmit={ this.onClickDone }>
              <input type='text' onChange={ this.handleChange } value={ newName } />
            </form>
          </div>
          <div className='contactButtons'>
            <div className='edit-contact'>
              <button type='button' className='edit-button' onClick={ this.onClickDone }>
                DONE
              </button>
            </div>

            <div className='delete-contact'>
              <button type='button' className='delete-button' onClick={ this.onClickDelete }>
                DELETE
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='contactEntry'>
        <div className='contact-info'>
          <h5>
            { name }
          </h5>
        </div>
        <div className='contactButtons'>
          <div className='edit-contact'>
            <button type='button' className='edit-button' onClick={ this.onClickEdit }>
              EDIT
            </button>
          </div>

          <div className='delete-contact'>
            <button type='button' className='delete-button' onClick={ this.onClickDelete }>
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
