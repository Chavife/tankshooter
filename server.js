var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + '/public'));

var io = require ('socket.io').listen(app.listen (process.env.PORT || port,function () {
	console.log ('Listen on port ' + port);
}));

var Players = [];

io.on ('connection', function (socket) {
	var re_addr = socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort;
	var hndsh = socket.handshake, date = new Date ();
	console.log ('-- Client '+re_addr+' connected ['+socket.nsp.name+'] on '+ date + ' --');
	console.log ('   sockID='+socket.id+ '  cookies=', hndsh.headers.cookie);
	console.log ('   Total server clients='+ socket.conn.server.clientsCount);
	Players[socket.id.substring(2)] = {x:500,y:500,rot:0};
	socket.broadcast.emit('player',500,500,0,socket.id.substring(2));
	for(key in Players) if(key != socket.id.substring(2)) socket.emit('player',Players[key].x,Players[key].y,Players[key].rot,key);
	
	
	socket.on ('disconnect', function () {
		console.log ('-- Client '+re_addr+' disconnected ['+socket.nsp.name+'] --');
		console.log ('   Total server clients='+ socket.conn.server.clientsCount);
		if(Players[socket.id.substring(2)] != null) delete Players[socket.id.substring(2)];
		socket.broadcast.emit('leave_player',socket.id.substring(2));
	});

	socket.on ('changed_pos', function (id, x, y) {
		Players[id].x = x;
		Players[id].y = y;
		socket.broadcast.emit('player_changed_pos',id,x,y);
	});
	
	socket.on ('changed_rot', function (id, rot) {
		Players[id].rot = rot;
		socket.broadcast.emit('player_changed_rot',id,rot);
	});


});