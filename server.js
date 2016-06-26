var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + '/public'));

var io = require ('socket.io').listen(app.listen (process.env.PORT || port,function () {
	console.log ('Listen on port ' + port);
}));

var Players = [];




io.on ('connection', function (socket) {
	
	function give_position() {
		var collision = true;
		var tank_r = (70 + 25)/2;
		while(collision){
			collision = false;
			var x = Math.random () * (3000-tank_r) + tank_r;
			var y = Math.random () * (3000-tank_r) + tank_r;
			var rot = Math.floor(Math.random () * (360));
			for(key in Players){
				if(key != socket.id.substring(2)) continue;
				var a = x - Players[key].x;
				var b = y - Players[key].y;
				var distance = Math.sqrt((a*a)+(b*b));
				if (distance < tank_r*2){
					collision = true;
					break;
				}
			}
		}
		return {x:x,y:y,rot:rot,HP:20};
	}
	
	
	
	var re_addr = socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort;
	var hndsh = socket.handshake, date = new Date ();
	console.log ('-- Client '+re_addr+' connected ['+socket.nsp.name+'] on '+ date + ' --');
	console.log ('   sockID='+socket.id+ '  cookies=', hndsh.headers.cookie);
	console.log ('   Total server clients='+ socket.conn.server.clientsCount);

	var position = give_position();
	Players[socket.id.substring(2)] = position; 
	socket.broadcast.emit('player',position.x,position.y,position.dir,position.HP,socket.id.substring(2));
	for(key in Players) if(key != socket.id.substring(2)) socket.emit('player',Players[key].x,Players[key].y,Players[key].rot,Players[key].HP,key);
	socket.emit('give_my_pos',position.x,position.y,position.rot,position.HP);
	
	
	socket.on ('disconnect', function () {
		console.log ('-- Client '+re_addr+' disconnected ['+socket.nsp.name+'] --');
		console.log ('   Total server clients='+ socket.conn.server.clientsCount);
		if(Players[socket.id.substring(2)] != null) delete Players[socket.id.substring(2)];
		socket.broadcast.emit('player_leave',socket.id.substring(2));
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
	
	socket.on ('missile_shot', function (x, y, dir, step, id) {
		socket.broadcast.emit('generate_missile',x, y, dir, step, id);
	});
	
	socket.on ('make_dmg', function (HP,id) {
		Players[id].HP = HP;
		//socket.broadcast.emit('update_HP',id,HP);
		if(HP == 0){
			var position = give_position();
			Players[id] = position; 
			socket.emit('player',position.x,position.y,position.rot,position.HP,id);
			socket.broadcast.emit('player',position.x,position.y,position.rot,position.HP,id);
		}
	});


});