import React, { Component } from 'react';

// TODO: sync display name with backend @8

class DisplayNameInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      editable: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get({ displayName: {} }, (result) => {
      if (Object.keys(result.displayName).length !== 0) {
        this.setState({ displayName: result.displayName, editable: false });
      }
    });
  }

  setDisplayName() {
    chrome.storage.local.get({ displayName: {} }, (result) => {
      if (result.displayName === '') {
        chrome.notifications.create('123', { type: 'basic',
          title: 'Uh Oh!',
          message: 'Please set your display name.',
          iconUrl: '../../../icons/icon48.png' },
          () => {});
      }
      this.setState({ displayName: result.displayName });
    });

    if (this.state.displayName === null) {
      this.setState({ displayName: 'Set Me' });
    } else {
      this.setState({
        editable: false,
      });
    }
    // return this.state.displayName;
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({
      displayName: event.target.value,
      editable: true,
    });

    chrome.storage.local.set({ displayName: event.target.value }, () => {});
  }

  render() {
    const { editable, displayName } = this.state;
    if (!editable) {
      return (
        <div id='display-name-info'>
          <div id='display-name-label'>
          MY DISPLAY NAME
        </div>
          <input type='text' id='display-name' value={ displayName } onChange={ this.handleChange } />
        </div>
      );
    }
    return (
      <div id='display-name-info'>
        <div id='display-name-label'>
          <button className='blue-button' onClick={ this.setDisplayName }>SET DISPLAY NAME</button>
        </div>
        <input type='text' id='display-name' value={ displayName } onChange={ this.handleChange } />
      </div>
    );
  }
  }

export default DisplayNameInfo;
