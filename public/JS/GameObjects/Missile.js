(function() {
	function Missile(spawn_x,spawn_y, spawn_dir, spawn_speed, enemyID){
		var self = this;
		
		this.Config = {
			size : 10, //missile size in px
			speed : spawn_speed,
			x : spawn_x + 30, //x pos
			y : spawn_y + 30, //y pos
			dir : spawn_dir, //rotation dir%360
		};
		this.Config.x += this.Config.size / 2; //Correction
		this.Config.y += this.Config.size / 2; //
		this.TTL = 500;
		this.enemyID = enemyID;
		
		this.ID = IDC.giveID('M');
		Game.Missiles[this.ID] = this;
		this.img = document.createElement('img');
		this.img.setAttribute('src','Pictures/bullet.png');
	}
	
	Missile.prototype.getID = function() {
		return this.ID;
	}
	
	Missile.prototype.ChangePos = function(x,y){
		this.Config.x = x;
		this.Config.y = y;
		var tank_r = (70 + 25)/2;
		for(key in Game.Players){
			if(key == this.enemyID) continue;
			var a = x - Game.Players[key].x;
			var b = y - Game.Players[key].y;
			var distance = Math.sqrt((a*a)+(b*b));
			if (distance < this.Config.size/2 + tank_r){
				this.TTL = 0;
				if(Game.Players[key].HP > 0){
					Game.Players[key].HP--;
					socket.emit ('make_dmg', Game.Players[key].HP,key);
					break;
				}
				
			}
		}
		var a = x - Game.Me.x;
		var b = y - Game.Me.y;
		var distance = Math.sqrt((a*a)+(b*b));
		if (distance < this.Config.size/2 + tank_r){
			if(this.enemyID != null){
				this.TTL = 0;
				if(Game.Me.HP>0){
					Game.Me.HP--;
				}
			}
		}
	}

	Missile.prototype.move = function (d) {// {{{
		var x = this.Config.x, y = this.Config.y;  
		this.TTL -= d;
		for (; d > 0; d--) {
			var rad = (2 * Math.PI) / 360 * (this.Config.dir);
			x -= Math.sin (rad) * 1;
			y += Math.cos (rad) * 1;
	    }
		if(this.TTL <= 0) delete Game.Missiles[this.ID];
		this.ChangePos (x, y);
	}
	
	Missile.prototype.update = function(step, worldWidth, worldHeight) {
		this.move(this.Config.speed);
		// don't let missile leave the world's boundary
		if (this.Config.x - this.Config.size / 2 < 0) this.TTL = 0;
		if (this.Config.y - this.Config.size / 2 < 0) this.TTL = 0;
		if (this.Config.x + this.Config.size / 2 > worldWidth) this.TTL = 0;
		if (this.Config.y + this.Config.size / 2 > worldHeight) this.TTL = 0;
	}
	
	Missile.prototype.draw = function(context, xView, yView) {
		context.save();
		context.drawImage(this.img, (this.Config.x - this.Config.size / 2) - xView, 
									(this.Config.y - this.Config.size / 2) - yView,
									 this.Config.size, this.Config.size);
		context.restore();
	}
	Game.Missile = Missile;
})();

socket.on('generate_missile',function(x, y, dir, step, id) {
	//console.log(x + " " + y +" " + " " + dir + " " + step);
	new Game.Missile(x, y, dir, step, id);
});