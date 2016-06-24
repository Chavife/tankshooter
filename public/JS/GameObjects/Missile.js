(function() {
	function Missile(spawn_x,spawn_y, spawn_dir, spawn_speed){
		var self = this;
		
		this.Config = {
			size : 10, //tank size in px
			speed : spawn_speed,
			x : spawn_x + 30, //x pos
			y : spawn_y + 30, //y pos
			dir : spawn_dir, //rotation dir%360
		};
		this.Config.x += this.Config.size / 2; //Correction
		this.Config.y += this.Config.size / 2; //
		this.TTL = 500;
		
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
	}
	
	Missile.prototype.collision =  function (rect){
		var distX = Math.abs(this.Config.x - rect.x-rect.w/2);
	    var distY = Math.abs(this.Config.y - rect.y-rect.h/2);

	    if (distX > (rect.w/2 + this.Config.size)) { return false; }
	    if (distY > (rect.h/2 + this.Config.size)) { return false; }

	    if (distX <= (rect.w/2)) { return true; } 
	    if (distY <= (rect.h/2)) { return true; }

	    var dx=distX-rect.w/2;
	    var dy=distY-rect.h/2;
	    return (dx*dx+dy*dy<=(this.Config.size*this.Config.size));
	}
	

	Missile.prototype.move = function (d) {// {{{
		var x = this.Config.x, y = this.Config.y;  
//		var col = false;
//		for(var i = 0; i < Game.obstacles.length; i++){
//			if(this.collision(Game.obstacles[i])){
//				col = true;
//			}
//		}
//		if(col)this.TTL = 0;
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
