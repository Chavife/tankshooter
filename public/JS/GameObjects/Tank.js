(function() {
	function Tank(x_,y_,rot_){
		var self = this;
		
		this.Config = {
			size : 70, //tank size in px
			hitbox_r : (70 + 25)/2,
			x : x_ || 0, //x pos
			y : x_ || 0, //y pos
			dir : rot_ || 0, //rotation dir%360
			move_step : 10, //movement step in px
			missile_step : 15, //missile step in px
			missile_speed : 15, //missile speed (smaller is higher)
			missile_range : 400, //range od missile in px
			reload_time : 250, //time that need to reload missile
			turn_radius : 5, //turn radius in angle
			speed : 500, //speed (smaller is higher)
			HP : 20,
		};
		this.currentHP = this.Config.HP;
		this.reloaded = true;
		this.reloadTimerID = null;
		this.img = document.createElement('img');
		this.img.setAttribute('src','Pictures/tank.png');
		//this.ChangePos(Math.random () * (200) + 50, Math.random () * (200) + 50);	
		//this.ChangeDir(Math.random () * (360));
	}
	
	Tank.prototype.ChangePos = function(x,y,id){
		this.Config.x = x;
		this.Config.y = y;
		if(id == null){
			Game.Me.x = x;
			Game.Me.y = y;
			socket.emit ('changed_pos', socket.id, this.Config.x, this.Config.y);
		}
	}
	
	Tank.prototype.ChangeDir = function(d,id){
		if (d >= 360.0 || d < 0.0) {
		    if (d < 0.0) this.Config.dir = 360.0 - (-d % 360.0);
		    else this.Config.dir = d % 360.0;
		}else this.Config.dir = d;
		if(id == null){
			Game.Me.rot = this.Config.dir;
			socket.emit ('changed_rot', socket.id, this.Config.dir);
		}
	}
	
	Tank.prototype.move = function (d,dir) {
		var x = this.Config.x, y = this.Config.y;  
		for (; d > 0; d--) {
			var rad = (2 * Math.PI) / 360 * (this.Config.dir);
			if(dir == "forward"){
				x -= Math.sin (rad) * 1;
				y += Math.cos (rad) * 1;
			}else if(dir == "backward"){
				x += Math.sin (rad) * 1;
				y -= Math.cos (rad) * 1;
			}
	    }
		this.ChangePos (x, y);
	}
	
	
	Tank.prototype.update = function(step, worldWidth, worldHeight) {
		// check controls and move the player accordingly
		if (Game.controls.left) this.ChangeDir(this.Config.dir - this.Config.turn_radius);
		if (Game.controls.up) this.move(this.Config.move_step, "forward");
		if (Game.controls.right) this.ChangeDir(this.Config.dir + this.Config.turn_radius);
		if (Game.controls.down) this.move(this.Config.move_step, "backward");
		if (Game.controls.shoot && this.reloaded) this.shoot();

		// don't let player leaves the world's boundary
		if (this.Config.x - this.Config.hitbox_r < 0) this.Config.x = this.Config.hitbox_r;
		if (this.Config.y - this.Config.hitbox_r < 0) this.Config.y = this.Config.hitbox_r;
		if (this.Config.x + this.Config.hitbox_r > worldWidth) this.Config.x = worldWidth - this.Config.hitbox_r;
		if (this.Config.y + this.Config.hitbox_r > worldHeight) this.Config.y = worldHeight - this.Config.hitbox_r;
			
	}
	
	Tank.prototype.update_HP = function(hp){this.currentHP = hp;} 
	
	Tank.prototype.draw = function(context, xView, yView, kills, deaths, enemy) {
		// draw a simple rectangle shape as our player model
		context.save();
		
		//health
		context.fillStyle = "#222";
		context.fillRect((this.Config.x - this.Config.size / 2) - xView-1,
						 (this.Config.y + this.Config.size / 2 + 15) - yView-1,
						  this.Config.size+2,7);
		context.fillStyle = "#F00";
		context.fillRect((this.Config.x - this.Config.size / 2) - xView,
						 (this.Config.y + this.Config.size / 2 + 15) - yView,
						  (this.Config.size/this.Config.HP)*this.currentHP,5);
		//score
		context.fillStyle = "#000";
		context.font = "15px Arial";
		context.fillText(kills + "/" + deaths,(this.Config.x - this.Config.size / 2) - xView,
										(this.Config.y - this.Config.size / 2 - 15) - yView);
		
		context.translate(this.Config.x - xView, this.Config.y - yView);
		
		context.rotate(this.Config.dir * Math.PI/180);
		context.translate(-(this.Config.x - xView), 
						  -(this.Config.y - yView));
		context.drawImage(this.img, (this.Config.x - this.Config.size / 2) - xView, 
									(this.Config.y - this.Config.size / 2) - yView,
									 this.Config.size, this.Config.size);
		
		context.beginPath();
		context.arc((this.Config.x) - xView,(this.Config.y) - yView,(this.Config.size+25)/2,0,2*Math.PI);
		if(enemy == null)context.strokeStyle = "#080";
		else context.strokeStyle = "#F00";
		context.globalAlpha=0.5;
		context.lineWidth = 3;
		context.stroke();
		context.closePath();		
		context.restore();
	}
	
	
	Tank.prototype.shoot = function() {
		var x = this.Config.x - this.Config.size/2, y = this.Config.y - this.Config.size/2;  
		new Game.Missile(x,y,this.Config.dir,this.Config.missile_step);
		socket.emit ('missile_shot', x,y,this.Config.dir,this.Config.missile_step, socket.id);
		this.shoot_cooldown();
	}
	Tank.prototype.shoot_cooldown = function() {
		var self = this;
		if(self.reloaded) self.reloaded = false;
		this.reloadTimerID = setInterval(function () {
			self.reloaded = true;
			clearInterval(self.reloadTimerID);
		} , this.Config.reload_time);
	}
	Game.Tank = Tank;
})();

