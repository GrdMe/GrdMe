var React = require('react');

var ContactEntry = React.createClass({
    propTypes : {
      name : React.PropTypes.string.isRequired
    },

    handleChange: function(event) {
      this.name = event.target.value;
      // this.setState({name: event.target.value});
    },

    getInitialState : function(){
      return {editable : false, name : this.props.name};
    },

    onClickEdit : function(){
      this.setState({editable : true});
    },

    onClickDone : function(){
      var self = this;
      chrome.storage.local.get({contact: {}}, function(result){
        result.contact[self.name] = result.contact[self.state.name];
        delete result.contact[self.state.name];
        chrome.storage.local.set({contact: result.contact}, function(){});
        self.setState({ name : self.name, editable : false});
      });

    },

    onClickDelete : function(){
      var self = this;
      chrome.storage.local.get({contact: {}}, function(result){
        delete result.contact[self.state.name];
        chrome.storage.local.set({contact: result.contact}, function(){});
        self.props.refresh();
      });
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
