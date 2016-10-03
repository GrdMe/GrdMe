var React = require('react');

var ContactEntry = React.createClass({
  propTypes : {
    name : React.PropTypes.string.isRequired
  },

  render : function(){
    return(
      <div className= "contactEntry">
        <div id = "contact_info">
          <h2>{this.props.name}</h2>
        </div>

        <div className="edit_button">
          <button type="button" className="gray-button" id="edit_contact">EDIT</button>
        </div>
      </div>
    );
  }
});

module.exports = ContactEntry;
