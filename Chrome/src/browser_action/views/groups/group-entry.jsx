var React = require('react');

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    // TODO: specific proptype check
    members: React.PropTypes.object.isRequired
  },

  render: function(){
    return(
        <div className="group-entry">
          <div className="select">
            <input type="radio"/>
            <div className="check"><div className="inside"></div></div>
          </div>

          <div className="group-info">
              <h2>{this.props.name.toUpperCase()}</h2>
              <h5>{this.props.members}</h5>
          </div>

        </div>
    )
  }
});

module.exports = GroupEntry;
