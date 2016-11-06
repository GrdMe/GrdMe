import React from 'react';

// TODO: sync display name with backend @8

const DisplayNameInfo = () => (
  <div id='display-name-info'>
    <div id='display-name-label'>
      MY DISPLAY NAME
    </div>
    <input type='text' id='display-name' defaultValue='John Cena' />
  </div>
);

export default DisplayNameInfo;
