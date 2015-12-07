var msgs = [];
var elements = document.querySelectorAll('body *');
for(var i = 0; i < elements.length; i++){
    if(elements[i].innerHTML){
        var html = elements[i].innerHTML;
        var startIndex = 1;
        var endIndex;
        do{
            startIndex = html.search('~~GrdMe!');
            html = html.slice(startIndex);
            endIndex = html.search(/.~~/);
            var tag = html.slice(0, endIndex + 3);
            var msg = tag.slice(8, -2);
            html = html.slice(endIndex);
            if(msg.length > 0) {
                msgs.push(msg);
            }
        } while(startIndex > 0);
    }
    if(elements[i].value){
        var html = elements[i].value;
        var startIndex = 1;
        var endIndex;
        do{
            startIndex = html.search('~~GrdMe!');
            html = html.slice(startIndex);
            endIndex = html.search(/.~~/);
            var tag = html.slice(0, endIndex + 3);
            var msg = tag.slice(8, -2);
            html = html.slice(endIndex);
            if(msg.length > 0) {
                msgs.push(msg);
            }
        } while(startIndex > 0);
    }
}
document.body.innerHTML = msgs.length;
for(var i = 0; i < msgs.length; i++){
    document.body.innerHTML += msgs[i] + '<br>';
}


///////////////////////////////////////////////////////////////////////////////

var msgs = [];
var elements = document.querySelectorAll('body *');
for(var i = 0; i < elements.length; i++){
    if(elements[i].innerHTML){
        var html = elements[i].innerHTML;
        var startIndex = 1;
        var endIndex;
        do{
            startIndex = html.search('~~GrdMe!');
            html = html.slice(startIndex);
            endIndex = html.search(/.~~/);
            var tag = html.slice(0, endIndex + 3);
            var msg = tag.slice(8, -2);
            html = html.slice(endIndex);
            if(msg.length > 0) {
                msgs.push(msg);
            }
        } while(startIndex > 0);
    }
    if(elements[i].value){
        var html = elements[i].value;
        var startIndex = 1;
        var endIndex;
        do{
            startIndex = html.search('~~GrdMe!');
            html = html.slice(startIndex);
            endIndex = html.search(/.~~/);
            var tag = html.slice(0, endIndex + 3);
            var msg = tag.slice(8, -2);
            html = html.slice(endIndex);
            if(msg.length > 0) {
                msgs.push(msg);
            }
        } while(startIndex > 0);
    }
}
for(var i = 0; i < msgs.length; i++){
    document.body.innerHTML = document.body.innerHTML.replace(/clone/i, 'REPLACED');
}


///////////////////////////////////////////////////////////////////////////////

var msgs = []; var elements = document.querySelectorAll('body *'); for(var i = 0; i < elements.length; i++){ if(elements[i].innerHTML){ var html = elements[i].innerHTML; var startIndex = 1; var endIndex; do{ startIndex = html.search('~~GrdMe!'); html = html.slice(startIndex); endIndex = html.search(/.~~/); var tag = html.slice(0, endIndex + 3); var msg = tag.slice(8, -2) + ' ' + elements[i]; html = html.slice(endIndex); if(msg.length > 0) { msgs.push(msg); } } while(startIndex > 0); } if(elements[i].value){ var html = elements[i].value; var startIndex = 1; var endIndex; do{ startIndex = html.search('~~GrdMe!'); html = html.slice(startIndex); endIndex = html.search(/.~~/); var tag = html.slice(0, endIndex + 3); var msg = tag.slice(8, -2) + ' ' + elements[i]; html = html.slice(endIndex); if(msg.length > 0) { msgs.push(msg); } } while(startIndex > 0); } } for(var i = 0; i < msgs.length; i++){ var body = document.body.innerHTML; body = body.replace(msgs[i], 'REPLACED'); document.body.innerHTML = body; }

///////////////////////////////////////////////////////////////////////////////

UGLY BUT WORKING

///////////////////////////////////////////////////////////////////////////////

var startIndex;
var endIndex;
var html = document.body.innerHTML;
var msgs = [];
do{
    startIndex = html.search('~~GrdMe!');
    html = html.slice(startIndex); endIndex = html.search(/.~~/);
    var tag = html.slice(0, endIndex + 3);
    if(tag.length > 0) {
        msgs.push(tag);
    }
    html = html.slice(endIndex);
} while(startIndex > 0);
for(var i = 0; i < msgs.length; i++) {
    document.body.innerHTML = document.body.innerHTML.replace(msgs[i], 'REPLACED');
}
