/**
 * @author Enzo
 */

window.onload = (function() {
	var width = window.innerWidth - 17;
	var height = window.innerHeight - 17;
	var speed = width / 70;
	var speedY = height / 130;
	var length = height / 20;
	var i = 0;
	var enemyCount = 1;
	var bullets = [];
	var k = 0;

	Crafty.init(width, height);
	//Crafty.canvas.init();
	Crafty.background("black");
	for (var x = 0; x < enemyCount; x++) {
		new enemy();
	}
	
	var score = Crafty.e("2D, DOM, Text").textFont({
		family : "Lucida Console",
		size : length / 2.5 + "px",
		weight : "bold"
	}).text("Hit: " + 0 + "\nMiss: " + 0 + "\nDeaths: " + 0 + "\nScore:  0").textColor("#FFFFFF").attr({
		w : length * 2.7, 
		h : 100,
		x : length / 3,
		y : length / 3
	});
	
	var score2 = Crafty.e("2D, DOM, Text").textFont({
		family : "Lucida Console",
		size : length / 2.5 + "px",
		weight : "bold"
	}).text("Hit: " + 0 + "\nMiss: " + 0 + "\nDeaths: " + 0 + "\nScore:  0").textColor("#FFFFFF").attr({
		w : length * 2.7,
		h : 100,
		x : width - length * 3,
		y : length / 3
	});
	//players
	var player1 = Crafty.e("2D, DOM, Color, Collision, Keyboard, Ship").color("white").attr({
		w : length,
		h : length,
		x : width / 2 - length / 3,
		y : height - length * 2,
		hits : 0,
		miss : 0,
		death : 0,
		color : "white"
	}).bind('EnterFrame', function() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
	}).bind('KeyDown', function(key) {
		if (key.keyCode === Crafty.keys.W) {
			new bullet(this);
		}
	});
	player1.addComponent("Multiway").multiway(speed, {
		A : 180,
		D : 0
	});
	var player2 = Crafty.e("2D, DOM, Color, Collision, Keyboard, Ship").color("grey").attr({
		w : length,
		h : length,
		x : width / 2 - length / 3,
		y : height - length * 2,
		hits : 0,
		miss : 0,
		death : 0,
		color : "grey"
	}).bind('EnterFrame', function() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
	}).bind('KeyDown', function(key) {
		if (key.keyCode === Crafty.keys.UP_ARROW) {
			new bullet(this);
		}
	});
	player2.addComponent("Multiway").multiway(speed, {
		RIGHT_ARROW : 0,
		LEFT_ARROW : 180
	});

	function bullet(player) {
		Crafty.e("2D, DOM, Color, Collision, Bullet").color(player.color).attr({
			w : 10,
			h : 10,
			x : player.x + player.w / 3,
			y : player.y + 10,
			dY : speedY
		}).collision().bind('EnterFrame', function() {
			this.y -= this.dY;
			if (this._y < 0) {
				player.miss++;
				updateScore();
				this.destroy();
			}
		}).onHit("Enemy", function(hit) {
			
			if ((player1.hits+player2.hits) % 5 === 0 && enemyCount < width / 140) {
				new enemy();
				enemyCount++;
			}
			this.destroy();
			updateScore();
			resetAsteroid(hit[0].obj);
			player.hits++;
		});
	};

	function enemy() {
		Crafty.e("2D, DOM, Color, Collision, Enemy").color("white").attr({
			w : length * 59 / 30,
			h : length * 59 / 30,
			dY : speedY * 2 / 3,
			x : Crafty.math.randomNumber(0, width - length * 59 / 30),
			y : 0
		}).collision().bind('EnterFrame', function() {
			this.y += this.dY;
			if (this.y > height) {
				updateScore();
				resetAsteroid(this);
			}
		}).onHit("Ship", function(hit) {
			destroyShip(this, hit[0].obj);
		});
	};
	resetAsteroid = function(obj) {
		obj.dY += (player1.hits+player2.hits) / 10;
		obj.dY -= (player1.miss+player2.miss) / 10 + (player1.death+player2.death);
		if (obj.dY > speedY * 3 / 2) {
			obj.dY = speedY * 3 / 2;
		} else if (obj.dY < speedY * 2 / 3) {
			obj.dY = speedY * 2 / 3;
		}
		obj.y = 0;
		obj.x = Crafty.math.randomNumber(0, width * 14 / 15);
	};
	

	updateScore = function() {
		var total = Math.floor((10 * player1.hits) - (100 * player1.death) - (player1.miss / 4) + enemyCount);
		score.text("Hit: " + player1.hits + "\nMiss: " + Math.floor(player1.miss) + "\nDeaths: " + player1.death + "\nScore: " + total);
		var total2 = Math.floor((10 * player2.hits) - (100 * player2.death) - (player2.miss / 4) + enemyCount);
		score2.text("Hit: " + player2.hits + "\nMiss: " + Math.floor(player2.miss) + "\nDeaths: " + player2.death + "\nScore: " + total2);
	};
	
	destroyShip = function(obj, player) {
		player.removeComponent("Ship");
		player.x = width / 2 - length / 3;
		player.death++;
		obj.dY = speedY * 2 / 3;
		player.timeout(function() {
			player.addComponent("Ship");
		}, 3000);
		updateScore();
		resetAsteroid(obj);
	};

});
