(function() {
	function Tank(x_,y_){
		var self = this;
		
		this.Config = {
			size : 70, //tank size in px
			hitbox_r : (70 + 25)/2,
			x : x_ || 0, //x pos
			y : x_ || 0, //y pos
			dir : 0, //rotation dir%360
			move_step : 10, //movement step in px
			missile_step : 15, //missile step in px
			missile_speed : 15, //missile speed (smaller is higher)
			missile_range : 400, //range od missile in px
			reload_time : 250, //time that need to reload missile
			turn_radius : 5, //turn radius in angle
			speed : 500, //speed (smaller is higher)
		};
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
		if(id == null) socket.emit ('changed_pos', socket.id, this.Config.x, this.Config.y);
	}
	
	Tank.prototype.ChangeDir = function(d,id){
		if (d >= 360.0 || d < 0.0) {
		    if (d < 0.0) this.Config.dir = 360.0 - (-d % 360.0);
		    else this.Config.dir = d % 360.0;
		}else this.Config.dir = d;
		if(id == null) socket.emit ('changed_rot', socket.id, this.Config.dir);
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
	
	Tank.prototype.collision =  function (rect){
		
		var distX = Math.abs(this.Config.x - rect.x-rect.w/2);
	    var distY = Math.abs(this.Config.y - rect.y-rect.w/2);

	    if (distX > (rect.w/2 + this.Config.hitbox_r)) { return false; }
	    if (distY > (rect.h/2 + this.Config.hitbox_r)) { return false; }

	    if (distX <= (rect.w/2)) {
	    	console.log("distx is: " + (rect.w/2 - distX));
	    	if(this.Config.x < rect.x)this.Config.x -= Math.abs(rect.w/2 - distX);
	    	else this.Config.x += Math.abs(rect.w/2 - distX + this.Config.hitbox_r);
	    	
	    	return true;
	    } 
//	    if (distY <= (rect.h/2)) { 
//	    	console.log("disty is: " + distY);
//	    	if(this.Config.x < rect.x)this.Config.x += distY + rect.h/2;
//	    	else this.Config.x -= distX + rect.h/2;
//	    	
//	    	return true;
//	    }
	    
	    
	    var dx=distX-rect.w/2; 
	    var dy=distY-rect.h/2;
	    if (dx*dx+dy*dy<=(this.Config.hitbox_r*this.Config.hitbox_r)){
	    };
	    
		/*
		var distX = Math.abs(this.Config.x - rect.x-rect.w/2);
	    var distY = Math.abs(this.Config.y - rect.y-rect.h/2);

	    if (distX > (rect.w/2 + this.Config.hitbox_r)) { return -1; }
	    if (distY > (rect.h/2 + this.Config.hitbox_r)) { return -1; }

	    if (distX <= (rect.w/2)) { 
	    	if(this.Config.y < rect.y)return 0;
	    	else return 1;
	    } 
	    if (distY <= (rect.h/2)) {
	    	if(this.Config.y < rect.y)return 2;
	    	else return 3; 
	    }

	    var dx=distX-rect.w/2;
	    var dy=distY-rect.h/2;
	    if(dx*dx+dy*dy<=(this.Config.hitbox_r*this.Config.hitbox_r)){
	    	return 4;
	    };
	    */
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
	
	Tank.prototype.draw = function(context, xView, yView) {
		// draw a simple rectangle shape as our player model
		context.save();
		context.font = "20px Arial";
		context.fillText("Hračov online: " + Game.Players.length ,10,50);
		//context.fillText("y: " + this.Config.y ,10,90);
		context.translate(this.Config.x - xView, this.Config.y - yView);
		context.rotate(this.Config.dir * Math.PI/180);
		context.translate(-(this.Config.x - xView), 
						  -(this.Config.y - yView));
		context.drawImage(this.img, (this.Config.x - this.Config.size / 2) - xView, 
									(this.Config.y - this.Config.size / 2) - yView,
									 this.Config.size, this.Config.size);
		context.beginPath();
		context.arc((this.Config.x) - xView,(this.Config.y) - yView,(this.Config.size+25)/2,0,2*Math.PI);
		context.strokeStyle = "#080";
		context.globalAlpha=0.2;
		context.lineWidth = 3;
		context.stroke();
		context.closePath();
		
		context.restore();
	}
	
	
	Tank.prototype.shoot = function() {
		var x = this.Config.x - this.Config.size/2, y = this.Config.y - this.Config.size/2;  
		new Game.Missile(x,y,this.Config.dir,this.Config.missile_step);
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
