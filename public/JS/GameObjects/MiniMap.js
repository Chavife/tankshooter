(function() {
	function MiniMap() {
		this.Config = {
			size : 200, //minimap size
			x : 0, //x pos
			y : 0, //y pos
			player_x : 0,
			player_y : 0,
		};
		var canvas = document.getElementById("gameCanvas");
		this.Config.x = canvas.width - this.Config.size;
		this.Config.y = canvas.height - this.Config.size;
	}
	MiniMap.prototype.updatePlayerPosition = function(player_x, player_y) {
		this.Config.player_x = player_x;
		this.Config.player_y = player_y;
	}
	MiniMap.prototype.updateMapPosition = function(canvasW, canvasH) {
		this.Config.x = canvasW - this.Config.size;
		this.Config.y = canvasH - this.Config.size;
	}
	MiniMap.prototype.draw = function(context) {
		context.save();
		
		context.font = "20px Arial";
		context.fillText("Move: arrows",10,50);
		context.fillText("Shoot: spacebar",10,70);
		context.globalAlpha=0.5;
		context.fillStyle = "#000";
		context.fillRect(this.Config.x,this.Config.y,this.Config.size,this.Config.size);
		context.strokeStyle = "#222";
		context.fillStyle = "#0F0";
		context.lineWidth = 5;
		context.globalAlpha=1;
		context.strokeRect(this.Config.x-3,this.Config.y-3,this.Config.size+10,this.Config.size+10);
		context.fillRect(this.Config.player_x/(3000/this.Config.size) + this.Config.x - 3,this.Config.player_y/(3000/this.Config.size) + this.Config.y-3,5,5);
		context.fillStyle = "#F00";
		for(key in Game.Players)context.fillRect(Game.Players[key].x/(3000/this.Config.size) + this.Config.x - 3,Game.Players[key].y/(3000/this.Config.size) + this.Config.y-3,5,5);
		context.restore();
	}
	Game.MiniMap = MiniMap;
})();