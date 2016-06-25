socket = io.connect ();

window.Game = [];
Game.Missiles = [];
Game.Players = [];
Game.Me = {x:500,y:500,rot:0,HP:20};

socket.on('player',function(x,y,rot,hp,key) {
	Game.Players[key] = {x:x,y:y,rot:rot,HP:hp};
});

socket.on('player_changed_pos',function(id,x,y) {
	Game.Players[id].x = x;
	Game.Players[id].y = y;
});

socket.on('player_changed_rot',function(id,rot) {
	Game.Players[id].rot = rot;
});

socket.on('player_leave',function(id) {
	delete Game.Players[id];
});

socket.on('update_HP',function(id,hp) {
	Game.Players[id].HP = hp;
});







/*Gives a uniqe ID for Object*/
function IDController(){
	this.ID = 0;
}
IDController.prototype.giveID = function(IDmod) {
	if(this.ID > 100) this.ID = 0;
	return (IDmod || '') + this.ID++;
}
var IDC = new IDController();



/*START Game Controller*/
Game.controls = {
		left : false,
		up : false,
		right : false,
		down : false,
		shoot : false,
		self_destroy : false,
	};

	window.addEventListener("keydown", function(e) {
		switch (e.keyCode) {
		case 37: // left arrow
			Game.controls.left = true;
			break;
		case 38: // up arrow
			Game.controls.up = true;
			break;
		case 39: // right arrow
			Game.controls.right = true;
			break;
		case 40: // down arrow
			Game.controls.down = true;
			break;
		case 32:
			Game.controls.shoot = true;
			break;
		}
	}, false);

	window.addEventListener("keyup", function(e) {
		switch (e.keyCode) {
		case 37: // left arrow
			Game.controls.left = false;
			break;
		case 38: // up arrow
			Game.controls.up = false;
			break;
		case 39: // right arrow
			Game.controls.right = false;
			break;
		case 40: // down arrow
			Game.controls.down = false;
			break;
		case 32:
			Game.controls.shoot = false;
			break;
		
		case 80: // key P pauses the game
			Game.togglePause();
			break;
		
		}
	}, false);
/*END Game Controller*/
