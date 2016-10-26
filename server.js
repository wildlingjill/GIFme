var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
// var http = require('http').Server(app);
// var io = require('socket.io')(http);



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './bower_components')));
app.use(session({ secret: 'keyboard cat'}));


var routes_setter = require('./server/config/routes.js');

routes_setter(app);


// io.on('connection', function(socket){
// 	// socket is like a person you can send messages to
// 	// could make an array of connections to loop over
// 	// can put this script in server.js and have normal http routes in angular factory
// 	// make api call in angular or server controller, doesn't matter
//   	socket.on('chat message', function(msg){
// 		io.emit('chat message', msg);
//   	});
// });


app.listen(8000, function(){
	console.log("Listening on port 8000");
});