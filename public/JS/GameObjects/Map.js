(function() {
	function Map(width, height) {
		// map dimensions
		this.width = width;
		this.height = height;
		this.image = null; //map texture
		/*
		this.obstacleTypes = [{w: 200,h: 200},
		                      {w: 500,h: 500},
		                      {w: 180,h: 200},
		                      {w: 500,h: 300}];
		this.obstacles = [];
		*/
	}
	
	// generate an example of a large map
	Map.prototype.generate = function(){
		var ctx = document.createElement("canvas").getContext("2d");		
		ctx.canvas.width = this.width;
		ctx.canvas.height = this.height;		
		
		var rows = ~~(this.width/5) + 1;
		var columns = ~~(this.height/5) + 1;
		
		var color = ["#e3d9aa",
		             "#d9d29a",
		             "#e0daa4",
		             "#f5e8bc",
		             "#faf7c8",
		             "#cfc98f",
		             ];				
		ctx.save();			
		ctx.fillStyle = color[Math.floor(Math.random() * (color.length))];		    
		for (var x = 0, i = 0; i < rows; x+=5, i++) {
			for (var y = 0, j=0; j < columns; y+=5, j++) {            
				ctx.beginPath();
				ctx.rect (x, y, 5, 5);				
				ctx.fillStyle = color[Math.floor(Math.random() * (color.length))];
				ctx.fill();
				ctx.closePath();
			}
		}
		/*
		ctx.fillStyle = "#7a5d40";
		for(var i = 0; i < 10; i++){
			var a = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
			this.obstacles[i] = {};
			this.obstacles[i].w = a.w;
			this.obstacles[i].h = a.h;
			this.obstacles[i].x = Math.random() * this.width;
			this.obstacles[i].y = Math.random() * this.height;
			ctx.beginPath();
			ctx.rect (this.obstacles[i].x, this.obstacles[i].y, this.obstacles[i].w, this.obstacles[i].h);				
			ctx.fill();
			ctx.closePath();
		}
		Game.obstacles = this.obstacles;
		*/
		ctx.restore();	
		
		// store the generate map as this image texture
		this.image = new Image();
		this.image.src = ctx.canvas.toDataURL("image/png");					
		
		// clear context
		ctx = null;
	}

	// draw the map adjusted to camera
	Map.prototype.draw = function(context, xView, yView) {
		
		// didactic way:
		var sx, sy, dx, dy;
		var sWidth, sHeight, dWidth, dHeight;

		// offset point to crop the image
		sx = xView;
		sy = yView;

		// dimensions of cropped image			
		sWidth = context.canvas.width;
		sHeight = context.canvas.height;

		// if cropped image is smaller than canvas we need to change the source dimensions
		if (this.image.width - sx < sWidth) {
			sWidth = this.image.width - sx;
		}
		if (this.image.height - sy < sHeight) {
			sHeight = this.image.height - sy;
		}

		// location on canvas to draw the croped image
		dx = 0;
		dy = 0;
		// match destination with source to not scale the image
		dWidth = sWidth;
		dHeight = sHeight;

		context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}

	// add "class" Map to our Game object
	Game.Map = Map;

})();