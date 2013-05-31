function Powerup(img, player){
	gameObjects.push(this);
	this.image = img;
	this.center = new vector(0,0);
	this.radius = baseRadius * 5;
	this.diameter = this.radius*2;
	this.speed = 0.1;
	this.player = player;
	this.direction = -player.number;
	this.kind = 0;
}
Powerup.prototype.Move = function () {
    this.center.x += this.direction * this.speed * delta;
}
Powerup.prototype.BoundWall = function () {
    if (this.direction === -1 && this.center.x + this.radius > width / 2) {
        this.active = false;
    } else if (this.direction === 1 && this.center.x - this.radius < width / 2) {
        this.active = false;
    }
}
Powerup.prototype.Collide = function () {
    if (this.center.y - this.radius < this.player.center.y + this.player.radius || this.center.y + this.radius > this.player.center.y - this.player.radius) {
        if (this.center.distance(this.player.center) <= this.radius + this.player.radius) {
            this.player.ChangeWeapon(this.kind);
            this.active = false;
        }
    }
}
Powerup.prototype.Update = function () {
	if(this.active){
    	this.Move();
    	this.BoundWall();
    	this.Collide();
	}
}

Powerup.prototype.Draw = function () {
    if(this.active){
    	ctx.drawImage(this.image, this.center.x - this.radius, this.center.y - this.radius, this.diameter, this.diameter);
    }
}

Powerup.prototype.Activate = function(pos){
	this.active = true;
	this.center = pos;
}

// Powerup.prototype.Deactivate = function(pos, player){
// 	this.active = false;
// 	this.center = pos;
// 	this.player = player;
// 	this.direction = this.player.number;
// }