/*Game Script*/
(function() {
	// prepaire our game canvas
	var canvas = document.getElementById("gameCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	var context = canvas.getContext("2d");

	// game settings:	
	var FPS = 30;
	var INTERVAL = 1000 / FPS; // milliseconds
	var STEP = INTERVAL / 1000 // seconds

	// setup an object that represents the room
	var room = {
		width : 3000,
		height : 3000,
		map : new Game.Map(3000, 3000)
	};
	room.map.generate(); // generate a large image texture for the room
	
	var MiniMap = new Game.MiniMap(); //Minimap

	var player = new Game.Tank(500, 500); //Player
	
	var online_player = new Game.Tank(600, 600); //Player

	/*<------CAMERA------>*/
	var camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);
	camera.follow(player, canvas.width / 2, canvas.height / 2);
	/*--------------------*/
	
	/*<---START Game update function--->*/
	
	window.onresize = function() { /*listener for window resize(adjusts canvas)*/
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		camera.updateSize(canvas.width, canvas.height);
		MiniMap.updateMapPosition(canvas.width, canvas.height);
	}
	
	var update = function() {
		for(key in Game.Missiles) Game.Missiles[key].update();
		player.update(STEP, room.width, room.height);
		MiniMap.updatePlayerPosition(player.Config.x,player.Config.y);
		camera.update();
		player.currentHP = Game.Me.HP;
	}
	/*----------------------------------*/
	
	/*<---START Game draw function--->*/
	var draw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height); // clear the entire canvas

		/* START redraw all objects*/
			room.map.draw(context, camera.xView, camera.yView);
			for(key in Game.Missiles) Game.Missiles[key].draw(context, camera.xView, camera.yView);
			player.draw(context, camera.xView, camera.yView);
			for(key in Game.Players){
				online_player.ChangePos(Game.Players[key].x,Game.Players[key].y,key);
				online_player.ChangeDir(Game.Players[key].rot,key);
				online_player.update_HP(Game.Players[key].HP);
				online_player.draw(context, camera.xView, camera.yView,"enemy");
			}
			MiniMap.draw(context);
			
			/*PUT HERE OTHER REDRAWS*/
			
		/*END redraw all objects*/
	}
	/*--------------------------------*/

	// Game Loop
	var gameLoop = function() {
		update();
		draw();
	}
	
	/*<----START the game---->*/
	var runningId = -1;
	Game.play = function() {
		if (runningId == -1) {
			runningId = setInterval(function() {
				gameLoop();
			}, INTERVAL);
			console.log("play");
		}
	}
	/*<---------------------->*/

	///* This function is disabled
	Game.togglePause = function() {
		if (runningId == -1) {
			Game.play();
		} else {
			clearInterval(runningId);
			runningId = -1;
			console.log("paused");
		}
	}
	//*/
})();
// start the game when page is loaded
window.onload = function() {
	Game.play();
}


