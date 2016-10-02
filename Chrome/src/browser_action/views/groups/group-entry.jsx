var React = require('react');

var GroupEntry = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    //Need a specific proptype check
    members: React.PropTypes.object.isRequired
  },

  render: function(){
    return(
      <div>
        <div className="groupEntry">
          <div id="select">
            <input type="radio"/>
            <label for="radio"></label>
          </div>

          <div id = "group_info">
              <h2>{this.props.name}</h2>
              <h5>{this.props.members}</h5>
          </div>

        </div>
      </div>
    )
  }
});

module.exports = GroupEntry;
