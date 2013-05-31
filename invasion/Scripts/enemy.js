function Enemy(player) {

    gameObjects.push(this);
    this.opponent = player;
    this.image = player.enemyImage;
    this.radius = baseRadius * 12;
    this.center = new vector(width / 2 - this.radius, Math.random() * height);
    this.direction = -player.number;

    this.diameter = this.radius * 2;
    this.maxLife = 40;
    this.life = this.maxLife;
    this.speed = width / 20000;
    this.lvl = 1;
}

Enemy.prototype.Move = function () {
    this.center.x += this.direction * this.speed * delta;
}

Enemy.prototype.Collide = function () {
    if (this.center.y - this.radius < this.opponent.center.y + this.opponent.radius || this.center.y + this.radius > this.opponent.center.y - this.opponent.radius) {
        if (this.center.distance(this.opponent.center) < this.radius + this.opponent.radius) {
            this.opponent.Die();
            this.SetPosition();
        }
    }
}

Enemy.prototype.BoundWall = function () {
    if (this.center.y + this.diameter >= height) {
        this.SetPosition();
    } else if (this.center.y - this.diameter < 0) {
        this.SetPosition();
    }
    if (this.center.x + this.radius > width) {
        this.SetPosition();
    } else if (this.center.x - this.radius < 0) {
        this.SetPosition();
    }
}
Enemy.prototype.Update = function () {
    this.Move();
    this.BoundWall();
    this.Collide();
}

Enemy.prototype.Draw = function () {

    ctx.drawImage(this.image, this.center.x - this.radius, this.center.y - this.radius, this.diameter, this.diameter);
}

Enemy.prototype.LvlUp = function () {
    this.lvl++;
    this.radius += this.radius / 50;
    this.diameter = this.radius * 2;
    this.maxLife += 5;
    this.speed += this.speed / 10;
}

Enemy.prototype.SetPosition = function () {
    this.center = new vector(this.opponent.enemyX - this.radius, Math.random() * height);
    this.life = this.maxLife;
}

Enemy.prototype.GetHit = function (damage) {
    this.life -= damage;
    if (this.life <= 0) {
        this.Drop();
        this.SetPosition();
        this.opponent.FindClosest();
        this.opponent.AddScore(this.lvl);
    }
}

Enemy.prototype.Drop = function () {
    var random = Math.random() + this.opponent.luck;
    
    if (random > 0.9 && this.opponent.powerups[2] && !this.opponent.powerups[2].active) {
        this.opponent.powerups[2].Activate(this.center);
    } else if (random > 0.8 && this.opponent.powerups[1] && !this.opponent.powerups[1].active) {
        this.opponent.powerups[1].Activate(this.center);
    } else if (random > 0.7 && this.opponent.powerups[0] && !this.opponent.powerups[0].active) {
        this.opponent.powerups[0].Activate(this.center);
    }
}
