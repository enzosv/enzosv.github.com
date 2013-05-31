function Player(img, num) {
    gameObjects.push(this);
    this.image = img;
    this.number = num;
    this.radius = baseRadius * 10;
    this.diameter = this.radius * 2;
    this.maxProjectiles = 6;

    this.firing = true;
    this.shootTimer = 0;
    this.chargeTimer = 0;
    this.maxTimer = 20;
    this.cooldownSpeed = 0;
    this.power = 0;
    this.luck = 0;

    this.score = 0;
    this.lvl = 1;
    this.exp = 0;
    this.kills = 0;
    this.aible = true;

    this.weaponKind = 0;
    this.enemyX = width / 2;

    if (this.number === 1) {
        this.center = new vector(1.5 * this.radius, height / 2 - this.radius);
        this.projectileImage = findImage('hProj1');
        this.projectileImage2 = findImage('hProj2');
        this.projectileImage3 = findImage('hProj3');
        this.enemyImage = findImage('alienEnemyImage');
        this.projX = this.center.x + this.radius;
    }
    else {
        this.center = new vector(width - 1.5 * this.radius, height / 2 - this.radius);
        this.projectileImage = findImage('aProj1');
        this.projectileImage2 = findImage('aProj2');
        this.projectileImage3 = findImage('aProj3');
        this.enemyImage = findImage('humanEnemyImage');
        this.projX = this.center.x - this.radius;
    }
    this.speed = height / 1536;

    this.projectiles = [];
    this.projectiles2 = [];
    this.projectiles3 = [];

    for (var i = 0; i < this.maxProjectiles; i++) {
        this.projectiles[i] = new Projectile(this, this.projX);
        this.projectiles2[i] = new Projectile(this, this.projX);
        this.projectiles3[i] = new Projectile(this, this.projX);
    }

    this.enemies = [];
    this.enemies[0] = new Enemy(this);
    this.FindClosest();

    this.powerups = [];
}
Player.prototype.GetInput = function () {

    if (this.number === 1) {
        if (Key.isDown(Key.W)) {
            this.direction = -1;
        } else if (Key.isDown(Key.S)) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
        if (Key.isDown(Key.D)) {
            this.firing = false;
        } else {
            this.firing = true;
        }
    } else {
        if (Key.isDown(Key.UP)) {
            this.direction = -1;
        }
        else if (Key.isDown(Key.DOWN)) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
        if (Key.isDown(Key.LEFT)) {
            this.firing = false;
        } else {
            this.firing = true;
        }
    }
}
Player.prototype.Move = function () {
    this.center.y += this.direction * this.speed * delta;
}
Player.prototype.Charge = function () {

    if (this.chargeTimer <= 0) {
        this.Confirm();
        this.chargeTimer = this.maxTimer - this.cooldownSpeed;
        this.power += delta;
        redrawStats(this);
    }
}
Player.prototype.boundWall = function () {
    if (this.canWarp) {
        if (this.center.y >= height)
            this.center.y = 0;
        else if (this.center.y < 0)
            this.center.y = height;
    }
    else {
        if (this.center.y + this.radius >= height)
            this.center.y = height - this.radius;
        else if (this.center.y - this.radius < 0)
            this.center.y = this.radius;
    }
}
Player.prototype.Shoot = function () {
    if (this.shootTimer <= 0) {
        this.shootTimer = this.maxTimer - this.cooldownSpeed;
        for (var x = 0; x < this.projectiles.length; x++) {
            if (!this.projectiles[x].active && !this.projectiles2[x].active && !this.projectiles3[x].active) {

                if (this.power > 0) {
                    if (this.weaponKind === 0) {
                        this.projectiles[x].damage += this.power;
                        this.projectiles[x].radius += this.power / 10;
                    } else if (this.weaponKind === 1) {
                        this.projectiles[x].damage += this.power / 2;
                        this.projectiles[x].radius += this.power / 20;
                        this.projectiles2[x].damage += this.power / 2;
                        this.projectiles2[x].radius += this.power / 20;
                    } else {
                        this.projectiles[x].damage += this.power / 3;
                        this.projectiles[x].radius += this.power / 30;
                        this.projectiles2[x].damage += this.power / 3;
                        this.projectiles2[x].radius += this.power / 30;
                        this.projectiles3[x].damage += this.power / 3;
                        this.projectiles3[x].radius += this.power / 30;
                    }
                    this.power = 0;
                    redrawStats(this);
                    //alert(this.center.y);
                }
                if (this.weaponKind === 0)
                    this.projectiles[x].Activate(this.center.y);
                else if (this.weaponKind === 1) {
                    this.projectiles[x].Activate(this.center.y + this.radius / 2);
                    this.projectiles2[x].Activate(this.center.y - this.radius / 2);

                } else if (this.weaponKind === 2) {
                    this.projectiles[x].Activate(this.center.y);
                    this.projectiles2[x].Activate(this.center.y);
                    this.projectiles3[x].Activate(this.center.y);
                }
                break;
            }
        }
    }
}
Player.prototype.Cooldown = function () {
    if (this.shootTimer > 0)
        this.shootTimer -= delta / 20;
    if (this.chargeTimer > 0) {
        this.chargeTimer -= delta / 20;
    }
}
Player.prototype.Update = function () {
    if (this.aible)
        this.Ai();
    this.GetInput();
    this.Move();
    if (this.firing) {
        this.Shoot();
    } else {
        this.Charge();
    }
    this.boundWall();
    this.Cooldown();


}

Player.prototype.Draw = function () {
    ctx.drawImage(this.image, this.center.x - this.radius, this.center.y - this.radius, this.diameter, this.diameter);
}

Player.prototype.Ai = function () {
    if (this.center.y > this.target.center.y + this.radius) {
        this.center.y -= this.speed * delta;
    } else if (this.center.y < this.target.center.y - this.radius) {
        this.center.y += this.speed * delta;
    }
}

Player.prototype.FindClosest = function () {
    var closest;
    var distFromClosest = 2000;
    for (var i = 0; i < this.enemies.length; i++) {
        var distToCompare = this.center.distance(this.enemies[i].center);
        if (/*distToCompare > this.radius + this.enemies[i].radius &&*/ distToCompare < distFromClosest) {
            closest = this.enemies[i];
            distFromClosest = distToCompare;
        }
    }

    this.target = closest;
}
Player.prototype.AddScore = function (points) {
    this.score += points;
    this.kills++;
    if (this.kills % 10 == 0) {
        if (this.enemies.length < maxEnemies)
            this.enemies.push(new Enemy(this));
    }
    this.exp += points * 30 / this.lvl;
    if (this.exp >= this.lvl * 100) {
        this.LvlUp();
    }
    redrawStats(this);
}
Player.prototype.LvlUp = function () {
    this.lvl++;
    this.speed += this.speed / 100;
    this.cooldownSpeed += 0.02;
    for (var x = 0; x < this.projectiles.length; x++) {
        this.projectiles[x].originalDamage += this.projectiles[x].damage / 10;
    }
    for (var e = 0; e < this.opponent.enemies.length; e++) {
        this.opponent.enemies[e].LvlUp();
    }
    if (this.lvl === 3) {
        this.powerups[0] = new Powerup(this.projectileImage, this);
        this.powerups[0].kind = 0;
    } else if (this.lvl === 5) {
        this.canWarp = true;
    } else if (this.lvl === 10) {
        this.powerups[1] = new Powerup(this.projectileImage2, this);
        this.powerups[1].kind = 1;
    } else if (this.lvl === 15) {
        this.powerups[2] = new Powerup(this.projectileImage3, this);
        this.powerups[2].kind = 2;
    } else if (this.lvl > 15) {
        this.luck += 0.001;
    }
    //updateBonus(this, 'Level up!');
    // else if (this.lvl === 20) {
    //     for (var x = 0; x < this.projectiles.length; x++) {
    //         if (this.number === 1)
    //             this.projectiles[x].image = findImage('hProj3');
    //         else
    //             this.projectiles[x].image = findImage('aProj3');
    //     }
    // }
}
Player.prototype.MoveSpawnPoint = function () {
    this.enemyX -= this.number * width / 6;
    if (this.opponent.aible) {
        if (this.number === 1 && this.enemyX > widht / 2) {
            this.enemyX = width / 2;
        } else if (this.number === -1 && this.enemyX < width / 2) {
            this.enemyX = width / 2;
        }
    }
    if (this.enemyX <= 0) {
        this.enemyX = width / 6;
    } else if (this.enemyX >= width) {
        this.enemyX = width * 5 / 6;
    }
    this.opponent.enemyX = this.enemyX;
}
Player.prototype.Die = function () {
    this.MoveSpawnPoint();
    if (!this.aible && ((this.number === 1 && this.enemyX < width / 6) || (this.number === -1 && this.enemyX > width * 5 / 6))) {
        if (this.opponent.aible) {
            setHighScores(this.score);
        }
    }
    else {
        this.center.y = height / 2 - this.radius;
        this.speed -= this.speed / 500;
        this.cooldownSpeed -= 0.005;
        for (var x = 0; x < this.projectiles.length; x++) {
            this.projectiles[x].damage -= this.projectiles[x].damage / 50;
        }
        this.power = 0;
        for (var i = 0; i < this.maxProjectiles; i++) {
            this.projectiles[i].lvl = 0;
            this.projectiles2[i].lvl = 0;
            this.projectiles3[i].lvl = 0;
        }
        this.ChangeWeapon(0);
        this.luck = 0;
    }
}

Player.prototype.Confirm = function () {
    if (this.aible && !this.opponent.aible) {
        delete Key.pressed[Key.LEFT];
        delete Key.pressed[Key.D];
        var conf = confirm("Multiplayer mode will disable high scores. Are you sure?");
        if (conf)
            this.aible = false;
    }
    else
        this.aible = false;
}

Player.prototype.ChangeWeapon = function (kind) {
    this.weaponKind = kind;
    if (this.weaponKind === 2) {
        for (var i = 0; i < this.maxProjectiles; i++) {
            this.projectiles2[i].up = true;
            this.projectiles3[i].down = true;
            this.projectiles[i].Change(kind);
            this.projectiles2[i].Change(kind);
            this.projectiles3[i].Change(kind);
        }
    } else {
        for (var i = 0; i < this.maxProjectiles; i++) {
            this.projectiles2[i].up = false;
            this.projectiles3[i].down = false;
            this.projectiles[i].Change(kind);
            this.projectiles2[i].Change(kind);
            this.projectiles3[i].Change(kind);
        }
    }
}

