//                              <-- DATA TABLE WITH INFO OF ENEMIES -->               | // E, D, C, B, A, S, SSS, SSS+ 
//         --  +----------------------+---------------+---------------+---------------+---------------+
//         <<< |    NAME              |     TYPE      |      LEVEL    |      HP       |   RANK        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 1 >>  |    Christmas Treant  |     Boss      |      1        |      ---      |      -        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 1 >>  |    -------- ----     |     Boss      |      1        |      ---      |      -        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 1 >>  |    ------- ----      |     Boss      |      1        |      ---      |      -        |      
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 2 >>  |    Queen             |     Boss      |      2        |      100      |      B        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 2 >>  |    Skeleton King     |     Boss      |      2        |      100      |      B        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 2 >>  |    Phantom King      |     Boss      |      2        |      100      |      A        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 3 >>  |    Varkolyn Leader   |     Boss      |      3        |      ---      |      SSS+     |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 3 >>  |    ------------      |     Boss      |      3        |      ---      |      -        |
//         --  +----------------------+---------------+---------------+---------------+---------------+
// FLOOR 3 >>  |    ------- ----      |     Boss      |      3        |      ---      |      -        |      
//         --  +----------------------+---------------+---------------+---------------+---------------+

/* eslint-disable indent */
class Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) {
        this.x = x;
        this.y = y;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        this.health = health;
        this.maxHealth = health;
        this.alive = true;

        this.currentImage = null;
        this.image = null;
        this.deadImage = null;
        this.attackImage = null;
        this.moveImage = null;

        this.direction = "right";
        this.reachedPoint = false;
        this.targetX = this.x;
        this.targetY = this.y;
        this.speed = 2;
        this.state = "idle"; // idle, move, attack, dead
        this.timeBetweenStates = 200;
        this.currentTimeBetweenStates = 0;
        this.minTimeBetweenStates = 50;
        this.maxTimeBetweenStates = 350;

        this.playerInstance = null;
        this.bulletImage = null;
    }

    display() {
        if (this.direction === "left") {
            push();
            translate(this.x + this.pixelWidth, this.y);
            scale(-1, 1);
            image(this.currentImage, 0, 0, this.pixelWidth, this.pixelHeight);
            pop();
        }
        else {
            image(this.currentImage, this.x, this.y, this.pixelWidth, this.pixelHeight);
        }
    }

    takeDamage(damage) {
        if (!this.alive) return;

        this.health -= damage;

        console.log("Enemy took", damage, "damage! Hp left:", this.health);

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log("Enemy dead");
        this.alive = false;
        this.image = this.deadImage;
    }

    displayHealthBar() {
        let barWidth = this.pixelWidth - this.pixelWidth / 3;
        let barHeight = 10;
        let barX = this.x + this.pixelWidth / 6;
        let barY = this.y - 20;

        let healthRatio = this.health / this.maxHealth;
        let filledWidth = barWidth * healthRatio;

        stroke(0);
        fill(0, 0, 0);
        rect(barX, barY, barWidth, barHeight);

        fill(255, 0, 0);
        rect(barX, barY, filledWidth, barHeight);
    }

    move() {
        if (!this.alive) return;

        if (this.reachedPoint) {
            let minDistance = 50;
            let newX, newY;

            do {
                newX = random(0 + this.pixelWidth, width - this.pixelWidth);
                newY = random(0 + this.pixelHeight, height - this.pixelHeight);
            }
            while (dist(this.x, this.y, newX, newY) < minDistance);

            this.targetX = newX;
            this.targetY = newY;
            this.reachedPoint = false;
        }

        let deltaX = this.targetX - this.x;
        let deltaY = this.targetY - this.y;
        let distance = dist(this.x, this.y, this.targetX, this.targetY);

        if (distance > 1) {
            this.x += this.speed * (deltaX / distance);
            this.y += this.speed * (deltaY / distance);
            this.direction = deltaX > 0 ? "right" : "left";
        }
        else {
            this.reachedPoint = true;
        }
    }

    attack() {
        console.log("Enemy Attacks!");
    }


    applyState() {
        if (this.state === "idle") {
            this.currentImage = this.image;
        }
        else if (this.state === "move") {
            this.currentImage = this.moveImage;
            this.move();
        }
        else if (this.state === "attack") {
            this.currentImage = this.attackImage;
            this.attack();
        }
        else if (this.state === "dead") {
            this.currentImage = this.deadImage;
        }
    }

    changeState() {
        if (!this.alive) {
            this.state = "dead";
            return;
        }

        if (this.currentTimeBetweenStates < this.timeBetweenStates) {
            this.currentTimeBetweenStates += 1;
            return;
        }

        let states = ["attack"]; //["idle", "move", "attack"];
        this.state = random(states);
        this.currentTimeBetweenStates = 0;
        this.timeBetweenStates = this.state === "attack"? 750 : random(this.minTimeBetweenStates, this.maxTimeBetweenStates);
        console.log(`New state: ${this.state},`, `time till next state: ${this.timeBetweenStates}`);
    }

    loadAdditionalData() {
        
    }

    loadPlayerData(_player) {
        this.playerInstance = _player;
    }

    displayBullets() {

    }

    render() {
        this.applyState();
        this.changeState();
        this.display();
        this.displayBullets();
        if (this.alive) {
            this.displayHealthBar();
        }
    }
}

class Queen extends Enemy {
    attack() {
        //console.log("Queen Attacks");
    }
}

class SkeletonKing extends Enemy {
    attack() {
        //console.log("Skeleton King Attacks");
    }
}

class PhantomKing extends Enemy {
    attack() {
        //console.log("Phantom King Attacks");
    }
}

class VarkolynLeader  extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) {
        super(x, y, pixelWidth, pixelHeight, health);

        this.enemyBulletImage = null;
        this.bullets = [];
        this.bulletAmount = 5;
        this.bulletsDeley = 200; // millis
        this.currentTime = 0;
        this.bulletSpeed = 10;
    }

    attack() {
        if (this.currentTime + this.bulletsDeley <= millis()) {
            this.shootBullet();
            this.currentTime = millis();
        } 

        if (this.direction === "right") {
            image(this.enemyBulletImage, this.x + this.pixelWidth * 2 / 3, this.y, 250, 250); 
        }
        else {
            image(this.enemyBulletImage, this.x - this.pixelWidth * 2 / 3, this.y, 250, 250);
        }
    }

    loadAdditionalData() {
        this.enemyBulletImage = loadImage("Enemies/Sprites/EnergySphere.gif");
        this.bulletImage = loadImage("Enemies/Sprites/DefaultBullet.png")
    }

    createBullet() {
        let dx = this.playerInstance.x - this.bulletStartX;
        let dy = this.playerInstance.y - this.bulletStartY;
        let length = sqrt(dx * dx + dy * dy);

        return new SwirlAttack(this.bulletStartX, this.bulletStartY, 20, 20, 0.05, 2.5, this.bulletImage);
        return new LineAttack(this.bulletStartX, this.bulletStartY, 20, 20, dx / length * this.bulletSpeed, dy / length * this.bulletSpeed); 

    }

    shootBullet() {
        this.bulletStartX = this.x + this.pixelWidth * 2 / 3 + 100;
        this.bulletStartY = this.y + 100;
        this.bullets.push(this.createBullet()); 
    }

    displayBullets() {
        for (let i = 0; i < this.bullets.length - 1; i++) {
            let bullet = this.bullets[i];
            bullet.render();

            if (bullet.checkCollisionWithPlayer(this.playerInstance)) {
                this.playerInstance.takeDamage(bullet.damage);
                this.bullets.splice(i, 1);
            }

            if (bullet.isOutOfBounds()) {
                this.bullets.splice(i, 1);
            }
        }
    }
}

class ChristmasTreant extends Enemy {
    attack() {
        //console.log("Christmas Treant Attacks");
    }
}

class Nian extends Enemy {
    attack() {
        //console.log("Nian Attacks");
    }
}

window.Queen = Queen;
window.SkeletonKing = SkeletonKing;
window.PhantomKing = PhantomKing;
window.VarkolynLeader = VarkolynLeader;
window.ChristmasTreant = ChristmasTreant;
window.Nian = Nian;

//Attack variaties
class LineAttack {
    constructor(x, y, bulletWidth, bulletHeight, dx, dy, _image) {
        this.x = x;
        this.y = y;

        this.dx = dx;
        this.dy = dy;

        this.bulletWidth = bulletWidth;
        this.bulletHeight = bulletHeight;
        this.baseY = y;
        this.elapsed = 0;
        this.damage = 1;

        this.image = _image;
    }

    display() {
        //fill("red");
        //circle(this.x, this.y, this.bulletWidth);
        image(this.image, this.x, this.y, this.bulletWidth, this.bulletHeight);
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    checkCollisionWithPlayer(player) {
        return (this.x < player.x + player.size && this.x + this.bulletWidth > player.x && this.y < player.y + player.size && this.y + this.bulletHeight > player.y);
    }

    isOutOfBounds() {
        return (
            this.x + this.bulletWidth < -500 ||  
            this.x > width + 500 ||  
            this.y + this.bulletHeight < -500 ||  
            this.y > height + 500    
        );
    }

    render() {
        this.move();
        this.display();
    }
}

class SwirlAttack {
    constructor(bulletStartX, bulletStartY, bulletWidth, bulletHeight, rotationSpeed, radiusIncrement, _image) {
        this.bulletStartX = bulletStartX;   
        this.bulletStartY = bulletStartY;  
        this.bulletWidth = bulletWidth;    
        this.bulletHeight = bulletHeight;  
        this.choice = random(100);
        this.rotationSpeed = this.choice > 50? rotationSpeed: -rotationSpeed;  
        this.radius = 30;  
        this.radiusIncrement = this.choice > 50? radiusIncrement: -radiusIncrement;  
        this.angle = 0;  
        this.damage = 1;
        this.image = _image;
    }

    display() {
        //fill("red");
        //circle(this.x, this.y, this.bulletWidth);
        image(this.image, this.x, this.y, this.bulletWidth, this.bulletHeight);
    }

    move() {
        this.angle += this.rotationSpeed;

        this.x = this.bulletStartX + cos(this.angle) * this.radius;
        this.y = this.bulletStartY + sin(this.angle) * this.radius;

        this.radius += this.radiusIncrement;
    }

    checkCollisionWithPlayer(player) {
        return (
            this.x < player.x + player.size &&
            this.x + this.bulletWidth > player.x &&
            this.y < player.y + player.size &&
            this.y + this.bulletHeight > player.y
        );
    }

    isOutOfBounds() {
        return (
            this.x + this.bulletWidth < -500 ||  
            this.x > width + 500 ||  
            this.y + this.bulletHeight < -500 ||  
            this.y > height + 500    
        );
    }

    render() {
        this.move();
        this.display();
    }
}