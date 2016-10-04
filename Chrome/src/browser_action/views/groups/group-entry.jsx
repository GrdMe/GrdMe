var React = require('react');
// var FontAwesome = require('react-fontawesome');

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    // TODO: specific proptype check
    members: React.PropTypes.string.isRequired
  },

  isSelected : function(){
    this.props.updateGroup(this.props.name);
  },

  render: function(){
    return(
        <div className={this.props.selectedGroup==this.props.name ? "group-entry-selected" : "group-entry-unselected"}>
          <div className="select" onClick={this.isSelected}>
            <input type="radio"/>
            <div className="check"><div className="inside"></div></div>
          </div>

          <div className="group-info">
            <div className="group-name-and-members">
              <h2>{this.props.name.toUpperCase()}</h2>
              <h5>{this.props.members}</h5>
            </div>
            <div className="group-icons">
              <div className="group-settings">
                {/* <FontAwesome name="pencil" /> */}
              </div>
              <div className="group-delete">
                {/* <FontAwesome name="trash" /> */}
              </div>
            </div>
          </div>

        </div>
    )
  }
});

module.exports = GroupEntry;
