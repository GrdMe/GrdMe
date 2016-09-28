var React = require('react');
var ReactDOM = require('react-dom');

document.addEventListener('DOMContentLoaded', function(){
  loadPage();
});

var Menu = React.createClass({
  
})

function loadPage(){
  ReactDOM.render(
    <Menu/>,
    document.getElementById('page')
  );
}
