import React, { PropTypes } from 'react';

const HeadPanel = props => (
  <div id='blue-panel'>
    { props.children }
  </div>
);

HeadPanel.propTypes = {
  children: PropTypes.any,
};

export default HeadPanel;
