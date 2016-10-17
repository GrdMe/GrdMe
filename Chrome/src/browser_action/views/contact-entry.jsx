var React = require('react');

var ContactEntry = React.createClass({
    propTypes : {
      name : React.PropTypes.string.isRequired
    },

    handleChange: function(event) {
      this.setState({name: event.target.value});
    },

    getInitialState : function(){
      return {editable : false, name : this.props.name};
    },

    onClickEdit : function(){
      this.setState({editable : true});
    },

    onClickDone : function(){
      this.setState({editable : false});
    },

    onClickDelete : function(){
      this.props.delete(this.state.name);
    },

    render : function(){
      if(this.state.editable){
        return(
          <div className= "contactEntry">
            <div id = "contact_info">
              <form>
                <input type="text" ref = "name" onChange={this.handleChange} defaultValue={this.state.name}></input>
              </form>
            </div>

          <div className="contactButtons">
            <div id ="edit_contact">
              <button type="button" id="edit_button" onClick={this.onClickDone}>DONE</button>
            </div>

            <div id = "delete_contact">
              <button type="button" id="delete_button" onClick={this.onClickDelete}>DELETE</button>
            </div>
          </div>
          </div>
        );
      }else{
        return(
          <div className="contactEntry">
            <div id = "contact_info">
              <h2>{this.state.name}</h2>
            </div>


          <div className="contactButtons">
            <div id ="edit_contact">
              <button type="button" id="edit_button" onClick={this.onClickEdit}>EDIT</button>
            </div>

            <div id = "delete_contact">
              <button type="button" id="delete_button" onClick={this.onClickDelete}>DELETE</button>
            </div>
          </div>
          </div>
      );
      }
    }
});

  module.exports = ContactEntry;
