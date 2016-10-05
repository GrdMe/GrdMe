var React = require('react');

var ContactEntry = React.createClass({
  propTypes : {
    name : React.PropTypes.string.isRequired
  },

  handleChange: function(event) {
    this.props.onUserInput(this.refs.searchStringInput.value);
    this.setState({name: event.refs.name.value});
    console.log(this.props.name);
  },

  getInitialState : function(){
    return {editable : false};
  },

  onClickEdit : function(){
    this.setState({editable : true});
  },

  onClickDone : function(){
    this.setState({editable : false});
  },

  render : function(){
    if(this.state.editable){
      return(
        <div className= "contactEntry">
          <div id = "contact_info">
            <form>
              <input type="text" ref = "name" onChange={this.handleChange} value={this.props.name} ></input>
            </form>
          </div>

          <div id ="done_button">
            <button type="button" className="gray-button" id="edit_contact" onClick={this.onClickDone}>DONE</button>
          </div>
        </div>
      );
    }else{
      return(
        <div className= "contactEntry">
          <div id = "contact_info">
            <h2>{this.props.name}</h2>
          </div>

          <div id ="edit_button">
            <button type="button" className="gray-button" id="edit_contact" onClick={this.onClickEdit}>EDIT</button>
          </div>
        </div>
    );
    }
  }
});

module.exports = ContactEntry;
