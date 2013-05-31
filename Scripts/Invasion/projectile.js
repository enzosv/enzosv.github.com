function Projectile(player, xPos) {
    gameObjects.push(this);
    this.owner = player;
    this.dir = player.number;
    this.center = new vector(xPos, 0);
    this.active = false;
    this.x = xPos;

    this.image = player.projectileImage;
    this.radius = baseRadius;
    this.diameter = this.radius * 2;
    this.level = 0;
    this.speed = 0;
    this.damage = 0;
    this.originalDamage = 0;
    this.speedOffset = 0;
    this.damageOffset = 0;
    this.LvlUp();

    this.up = false;
    this.down = false;
    this.kind = 0;
}
Projectile.prototype.Move = function () {
    this.center.x += this.dir * this.speed * delta;
    if (this.up) {
        this.center.y -= this.speed * delta / 3;
    } else if (this.down) {
        this.center.y += this.speed * delta / 3;
    }
    
}
Projectile.prototype.Activate = function (yPos) {
    this.active = true;
    this.diameter = this.radius * 2;
    this.center.y = yPos;
   
}
Projectile.prototype.Deactivate = function () {
    this.active = false;
    this.radius = baseRadius;
    this.diameter = this.radius * 2;
    this.damage = this.originalDamage;
    this.center.x = this.x;
}

Projectile.prototype.BoundWall = function () {
    if (this.dir === 1 && this.center.x + this.radius > width / 2) {
        this.Deactivate();
    } else if (this.dir === -1 && this.center.x - this.radius < width / 2) {
        this.Deactivate();
    }
    if (this.center.y + this.radius > height) {
        this.Deactivate();
    } else if (this.center.y - this.radius < 0) {
        this.Deactivate();
    }
}
Projectile.prototype.Collide = function () {
    for (var x = 0; x < this.owner.enemies.length; x++) {
        var enemy = this.owner.enemies[x];
        if (this.center.y > enemy.center.y - enemy.radius && this.center.y < enemy.center.y + enemy.radius) {
            if (this.center.distance(enemy.center) < this.radius + enemy.radius) {
                enemy.GetHit(this.damage);
                this.Deactivate();
            }
        }

    }
}
Projectile.prototype.Update = function () {
    if (this.active) {
        this.Move();
        this.BoundWall();
        this.Collide();
    }
}

Projectile.prototype.Draw = function () {
    if (this.active) {
        
        ctx.drawImage(this.image, this.center.x - this.radius, this.center.y - this.radius, this.diameter, this.diameter);
    }
}

Projectile.prototype.LvlUp = function () {
    this.level++;
    this.speed = 0.59 + this.level/100 + this.speedOffset;
    this.originalDamage = 9 + this.level+ this.damageOffset;
    this.damage = this.originalDamage; 
}

Projectile.prototype.Change = function(kind){
    this.kind = kind;
    if(this.kind === 0){
        this.speedOffset = 0;
        this.damageOffset = 0;
        this.image = this.owner.projectileImage;
    }else if(this.kind === 1){
        this.damageOffset = -5;
        this.speedOffset = -0.15;
        this.image = this.owner.projectileImage2;
    }else if(this.kind === 2){
        this.damageOffset = -7;
        this.speedOffset = -0.3;
        this.image = this.owner.projectileImage3;
    }
    this.LvlUp();
}