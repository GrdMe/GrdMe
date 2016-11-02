var React = require('react');

var ContactEntry = React.createClass({
    propTypes : {
      name : React.PropTypes.string.isRequired
    },

    handleChange: function(event) {
      if(event.keyCode == 13){
        this.onClickDone();
      }
      this.name = event.target.value;
      // this.setState({name: event.target.value});
    },

    getInitialState : function(){
      return {editable : false, name : this.props.name};
    },

    onClickEdit : function(){
      this.setState({editable : true});
    },

    onClickDone : function(e){
      e.preventDefault();
      var self = this;
      chrome.storage.local.get({contact: {}}, function(result){
        result.contact[self.name] = result.contact[self.state.name];
        console.log(self.name);
        console.log(self.state.name);
        if(self.name != self.state.name && self.name != undefined){
          console.log("don't wanna be here!");
          delete result.contact[self.state.name];
          chrome.storage.local.set({contact: result.contact}, function(){});
          self.setState({ name : self.name, editable : false});
        }else{
          //chrome.storage.local.set({contact: result.contact}, function(){});
          self.setState({ name : self.state.name, editable : false});
        }
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

    doNothing : function(){
      return;
    },

    render : function(){
      if(this.state.editable){
        return(
          <div className= "contactEntry">
            <div id = "contact_info">
              <form onSubmit={this.onClickDone}>
                <input type="text" ref = "name" onChange={this.handleChange} defaultValue={this.state.name}></input>
              </form>
            </div>

          <div className="contactButtons">
            <div id ="edit_contact">
              <button type="button" id="edit_button" onClick={this.onClickDone} onKeyDown={this.doNothing}>DONE</button>
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
              <button type="button" id="edit_button" onClick={this.onClickEdit} onKeyDown={this.doNothing}>EDIT</button>
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
