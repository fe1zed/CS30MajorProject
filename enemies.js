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
/* eslint-disable curly */
/* eslint-disable brace-style */

class EnemyBoss {
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
        this.state = "move"; // idle, move, attack, dead
        this.timeBetweenStates = 200;
        this.currentTimeBetweenStates = 0;
        this.minTimeBetweenStates = 50;
        this.maxTimeBetweenStates = 350;

        this.playerInstance = null;

        this.enemyMagicSphereImage = null;
        this.bulletImage = null;
        this.bullets = [];
        this.bulletAmount = 5;
        this.bulletsDeley = 200; // millis
        this.currentTime = 0;
        this.bulletSpeed = 10;
        this.bulletSize = 40;

        this.takenHealthWidth = this.pixelWidth - this.pixelWidth / 3; 

        this.angle = 0;

        this.bulletStartXPos = 0;
        this.bulletStartXNeg = 0;
        this.energyShpereSize = 250;

        this.attacks = ["LineAttack", "RotatingSphereAttack", "ShootAround", "LineAround1", "LineAround2"];
        this.choosedAttack = "";

        this.coinsAwardAfterDeath = 50;
        this.energyAwardAfterDeath = 100;
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
        player.receiveCoins(this.coinsAwardAfterDeath);
        player.receiveEnergy(this.energyAwardAfterDeath);
        this.bullets = [];
    }

    displayHealthBar() {
        let barWidth = this.pixelWidth - this.pixelWidth / 3;
        let barHeight = 12.5;
        let barX = this.x + this.pixelWidth / 6;
        let barY = this.y - 20;

        let healthRatio = this.health / this.maxHealth;
        let filledWidth = barWidth * healthRatio;

        // Black for BG
        stroke(0);
        fill(0, 0, 0);
        rect(barX, barY, barWidth, barHeight);

        // White for taken health
        if (this.takenHealthWidth > filledWidth) {
            this.takenHealthWidth -= (this.takenHealthWidth - filledWidth) / 10;
        }
        fill(255);
        rect(barX, barY, this.takenHealthWidth, barHeight);

        // Red for health
        fill(255, 0, 0);
        rect(barX, barY, filledWidth, barHeight);
    }

    move() {
        if (!this.alive) return;

        if (this.reachedPoint) {
            let minDistance = 50;
            let newX, newY;

            do {
                newX = random(0 + this.pixelWidth + 100, width - this.pixelWidth - 100);
                newY = random(0 + this.pixelHeight + 100, height - this.pixelHeight - 100);
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
            this.bullets = [];
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

        let states = ["idle", "move", "attack"]; // ["attack"];
        this.state = random(states);
        this.currentTimeBetweenStates = 0;
        this.timeBetweenStates = this.state === "attack"? 750 : random(this.minTimeBetweenStates, this.maxTimeBetweenStates);
        this.choosedAttack = random(this.attacks);
        console.log("Choosed attack", this.choosedAttack);
        console.log(`New state: ${this.state},`, `time till next state: ${this.timeBetweenStates}`);

        if (random(100) > 50) {
            this.executeUniqueAbility1();
        }
        else {
            this.executeUniqueAbility2();
        }
    }

    loadAdditionalData() {
        
    }

    loadPlayerData(_player) {
        this.playerInstance = _player;
    }

    shootBullet() {
        this.bulletStartX = this.direction === "right"? this.x + this.bulletStartXPos + this.energyShpereSize / 2:
        this.x - this.bulletStartXNeg + this.energyShpereSize / 2;
        this.bulletStartY = this.y + this.energyShpereSize / 2;

        let dx = this.playerInstance.x - this.bulletStartX;
        let dy = this.playerInstance.y - this.bulletStartY;
        let length = sqrt(dx * dx + dy * dy);

        let bulletSpawnX = this.bulletStartX - this.bulletSize / 2;
        let bulletSpawnY = this.bulletStartY - this.bulletSize / 2;

        let normalizedDX = dx / length * this.bulletSpeed;
        let normalizedDY = dy / length * this.bulletSpeed;

        if (this.choosedAttack === "ShootAround") {
            this.bullets.push(new ShootAround(bulletSpawnX, bulletSpawnY, this.bulletSize, this.bulletSize, this.bulletImage)); 
        }
        else if (this.choosedAttack === "RotatingSphereAttack") {
            this.bullets.push(new RotatingSphereAttack(bulletSpawnX, bulletSpawnY, this.bulletSize, this.bulletSize, this.bulletImage, 5, 0));
        }
        else if (this.choosedAttack === "LineAttack") {
            this.bullets.push(new LineAttack(bulletSpawnX, bulletSpawnY, this.bulletSize, this.bulletSize, normalizedDX, normalizedDY, this.bulletImage)); 
        }
        else if (this.choosedAttack === "LineAround1") {
            let amountOfAttacksAround = 12;
            let angle = 360 / amountOfAttacksAround;

            for (let i = 0; i < amountOfAttacksAround; i++) {
                this.bullets.push(new LineAround(bulletSpawnX, bulletSpawnY, this.bulletSize, this.bulletSize, this.bulletImage, angle * i)); 
            }
        }
        else if (this.choosedAttack === "LineAround2") {
            let amountOfAttacksAround = 6;
            let angle = 360 / amountOfAttacksAround;
    
            for (let i = 0; i < amountOfAttacksAround; i++) {
                this.bullets.push(new LineAround(bulletSpawnX, bulletSpawnY, this.bulletSize, this.bulletSize, this.bulletImage, angle * i + this.angle)); 
            }
            this.angle += 10;
        }
    }

    displayBullets() {
        for (let i = 0; i < this.bullets.length - 1; i++) {
            let bullet = this.bullets[i];
            bullet.render();

            if (bullet.checkCollisionWithPlayer(this.playerInstance)) {
                this.playerInstance.takeDamage(bullet.damage);
                this.bullets.splice(i, 1);
            }

            if (bullet.isOutOfBounds() || bullet.distance > 400) {
                this.bullets.splice(i, 1);
            }
        }
    }

    executeUniqueAbility1() {
        // rewrite
    }

    executeUniqueAbility2() {
        // rewrite
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

// BOSSES -------------------------------------------------------------------------
class Queen extends EnemyBoss {
    attack() {
        //console.log("Queen Attacks");
    }
}

class SkeletonKing extends EnemyBoss {
    attack() {
        //console.log("Skeleton King Attacks");
    }
}

class PhantomKing extends EnemyBoss {
    attack() {
        //console.log("Phantom King Attacks");
    }
}

class VarkolynLeader  extends EnemyBoss {
    constructor(x, y, pixelWidth, pixelHeight, health) {
        super(x, y, pixelWidth, pixelHeight, health);
        this.bulletStartXPos = this.pixelWidth * 2 / 3;
        this.bulletStartXNeg = this.pixelWidth * 2 / 3;

        this.timeBetweenPoisonedPoolAttack = 1000; // in millis
        this.currentTimeBetweenPoisonedPoolAttack = 0; 

        this.poisonedPoolImage = null;
        this.poisonedPoolSize = 150;
        this.poisonedPoolNumber = 7;
        this.poisonedPoolsCoordinates = [];

        this.warriorsNumber = 3;
    }

    attack() {
        if (this.currentTime + this.bulletsDeley <= millis()) {
            this.shootBullet();
            this.currentTime = millis();
        } 

        if (this.direction === "right") {
            image(this.enemyMagicSphereImage, this.x + this.bulletStartXPos, this.y, this.energyShpereSize, this.energyShpereSize); 
        }
        else {
            image(this.enemyMagicSphereImage, this.x - this.bulletStartXNeg, this.y, this.energyShpereSize, this.energyShpereSize);
        }
    }

    loadAdditionalData() {
        this.enemyMagicSphereImage = loadImage("Enemies/Sprites/ToxicEnergySphere.gif");
        this.bulletImage = loadImage("Enemies/Sprites/GreenDefaultBullet.png");
        this.poisonedPoolImage = loadImage("Enemies/Boss/VarkolynLeader/PoisonedPool.png");
    }

    executeUniqueAbility1() {
        // instantiates x-amount poisoned pools
        console.log("spawn 7 poisoned pools");
        this.poisonedPoolsCoordinates = [];
        for (let i = 0; i < this.poisonedPoolNumber; i++) {
            let newX = random(0, width);
            let newY = random(0, height);

            this.poisonedPoolsCoordinates.push(this.pushCoordinates(newX, newY));
        }
    }
    
    executeUniqueAbility2() {
        for (let i = 0; i < this.warriorsNumber; i++) {
            if (random(100) > 50) {
                createEnemy("Common", "BazingaFire");
                createEnemy("Common", "Varkolyn");

            }
            else {
                createEnemy("Common", "BazingaIce");
            }
        }
    }

    displayPoisonedPool() {
        if (!this.alive) return;

        for (let i = 0; i < this.poisonedPoolsCoordinates.length; i++) {
            let pool = this.poisonedPoolsCoordinates[i];
            image(this.poisonedPoolImage, pool.x, pool.y, this.poisonedPoolSize, this.poisonedPoolSize);

            if (pool.x < this.playerInstance.x + this.playerInstance.size && pool.x + this.poisonedPoolSize > this.playerInstance.x && pool.y < this.playerInstance.y + this.playerInstance.size && pool.y + this.poisonedPoolSize > this.playerInstance.y) {
                if (this.currentTimeBetweenPoisonedPoolAttack + this.timeBetweenPoisonedPoolAttack < millis()) {
                    this.currentTimeBetweenPoisonedPoolAttack = millis();
                    this.playerInstance.takeDamage(1);
                }
            }
        }
    }

    pushCoordinates(_x, _y) {
        return {x: _x, y: _y};
    }

    render() {
        this.applyState();
        this.changeState();
        this.displayPoisonedPool();
        this.display();
        this.displayBullets();
        if (this.alive) {
            this.displayHealthBar();
        }
    }
}

class ChristmasTreant extends EnemyBoss {
    attack() {
        //console.log("Christmas Treant Attacks");
    }
}

class Nian extends EnemyBoss {
    constructor(x, y, pixelWidth, pixelHeight, health) {
        super(x, y, pixelWidth, pixelHeight, health);
        this.bulletStartXPos = this.pixelWidth * 2 / 3 + 75;
        this.bulletStartXNeg = this.pixelWidth * 2 / 3 + 75;
    }

    attack() {
        if (this.currentTime + this.bulletsDeley <= millis()) {
            this.shootBullet();
            this.currentTime = millis();
        } 

        if (this.direction === "right") {
            image(this.enemyMagicSphereImage, this.x + this.bulletStartXPos, this.y, this.energyShpereSize, this.energyShpereSize); 
        }
        else {
            image(this.enemyMagicSphereImage, this.x - this.bulletStartXNeg, this.y, this.energyShpereSize, this.energyShpereSize);
        }
    }

    loadAdditionalData() {
        this.enemyMagicSphereImage = loadImage("Enemies/Sprites/OrangeEnergySphere.gif");
        this.bulletImage = loadImage("Enemies/Sprites/OrangeDefaultBullet.png");
    } 
}

window.Queen = Queen;
window.SkeletonKing = SkeletonKing;
window.PhantomKing = PhantomKing;
window.VarkolynLeader = VarkolynLeader;
window.ChristmasTreant = ChristmasTreant;
window.Nian = Nian;

// ------------------------- ENEMY -------------------------

class Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) {
        this.x = x;
        this.y = y;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        this.health = health;
        this.maxHealth = health;
        this.alive = true;
        this.image = null;
        this.direction = "right";
        this.reachedPoint = false;
        this.targetX = this.x;
        this.targetY = this.y;
        this.speed = 2;
        this.state = "move";
        this.timeBetweenStates = 200;
        this.currentTimeBetweenStates = 0;
        this.minTimeBetweenStates = 50;
        this.maxTimeBetweenStates = 350;

        this.playerInstance = null;

        this.coinsAwardAfterDeath = 50;
        this.energyAwardAfterDeath = 100;

        this.usingWeapon = "";

        this.weaponWidth = 0;
        this.weaponHeight = 0;
        this.weaponDamage = 0;
        this.weaponImage = null;

        this.bullets = [];
        this.lastTimeShooted = 0;
        this.timeBetweenShots = 350;
    }

    display() {
        if (this.direction === "left") {
            push();
            translate(this.x + this.pixelWidth, this.y);
            scale(-1, 1);
            image(this.image, 0, 0, this.pixelWidth, this.pixelHeight);
            pop();
        }
        else {
            image(this.image, this.x, this.y, this.pixelWidth, this.pixelHeight);
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
        player.receiveCoins(this.coinsAwardAfterDeath);
        player.receiveEnergy(this.energyAwardAfterDeath);
        this.bullets = [];
        let index = enemies.indexOf(this);
        enemies.splice(index, 1);
        gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel -= 1;
    }

    move() {
        if (!this.alive) return;

        if (this.reachedPoint) {
            let minDistance = 50;
            let newX, newY;

            do {
                newX = random(0 + this.pixelWidth + 100, width - this.pixelWidth - 100);
                newY = random(0 + this.pixelHeight + 100, height - this.pixelHeight - 100);
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

    displayWeapon() {
        if (!this.alive) return;

        let weaponWidth = this.weaponWidth / this.pixelWidth * 35;
        let weaponHeight = this.weaponHeight / this.pixelHeight * 35;

        let offsetX = this.direction === "right"
            ? this.x + this.pixelWidth / 2 + this.pixelWidth / 4
            : this.x + this.pixelWidth / 4;

        let offsetY = this.y + this.pixelHeight * 0.75;

        let angle = atan2(this.playerInstance.y - offsetY, this.playerInstance.x - offsetX);

        push();
        translate(offsetX, offsetY);
        rotate(angle);
        imageMode(CENTER);
        scale(1, angle >= -1.5 && angle <= 1.5 ? 1 : -1);
        image(this.weaponImage, 0, 0, weaponWidth, weaponHeight);
        pop();
    }

    shootBullet() {
        if (millis() < this.lastTimeShooted + this.timeBetweenShots) return;
        this.lastTimeShooted = millis();
        let bullet = this.createBullet();
        this.bullets.push(bullet);
    }

    createBullet() {
        let bulletData = weaponsDataJson["Weapons"][this.usingWeapon]["Bullet"];
        let offsetX = this.direction === "right"
            ? this.x + this.pixelWidth / 2 + this.pixelWidth / 4
            : this.x + this.pixelWidth / 4;

        let offsetY = this.y + this.pixelHeight * 0.75;

        let dx = this.playerInstance.x + this.playerInstance.size / 2 - offsetX;
        let dy = this.playerInstance.y + this.playerInstance.size / 2 - offsetY;
        let length = sqrt(dx * dx + dy * dy);

        let pixelWidth = bulletData["pixelWidth"];
        let pixelHeight = bulletData["pixelHeight"];

        let weaponWidth = 0;
        let weaponHeight = 0;

        if (this.weaponPropelling) {
            weaponWidth = pixelWidth / this.pixelWidth * 35;
            weaponHeight = pixelHeight / this.pixelHeight * 35;
        }
        else {
            weaponWidth = pixelWidth;
            weaponHeight = pixelHeight;
        }

        console.log(bulletData["image"]);

        return {
            x: offsetX,
            y: offsetY,
            pixelWidth: weaponWidth,
            pixelHeight: weaponHeight,
            image: loadImage(bulletData["image"]),
            speed: bulletData["speed"],
            dx: dx / length * bulletData["speed"],
            dy: dy / length * bulletData["speed"],
            damage: weaponsDataJson[WEAPONSPATH][weaponName]["damage"],
        };
    }

    displayBullets() {
        for (let bullet of this.bullets) {
            let angle = atan2(bullet.dy, bullet.dx);
      
            push();
            translate(bullet.x, bullet.y);
            rotate(angle);
            imageMode(CENTER);
            image(bullet.image, 0, 0, bullet.pixelWidth, bullet.pixelHeight);
            pop();
      
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            if (bullet.x < this.playerInstance.x + this.playerInstance.size && 
                bullet.x + bullet.pixelWidth > this.playerInstance.x && 
                bullet.y < this.playerInstance.y + this.playerInstance.size && 
                bullet.y + bullet.pixelHeight > this.playerInstance.y) {
                this.playerInstance.takeDamage(this.weaponDamage);
                let index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
            }
        }
    }

    attack() {
        console.log("Enemy Attacks!");
        this.shootBullet();
    }

    applyState() {
        if (this.state === "idle") {

        }
        else if (this.state === "move") {
            this.move();
        }
        else if (this.state === "attack") {
            this.attack();
        }
        else if (this.state === "dead") {
            this.bullets = [];
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

        let states = ["idle", "move", "attack"];
        this.state = random(states);
        this.currentTimeBetweenStates = 0;
        this.timeBetweenStates = random(this.minTimeBetweenStates, this.maxTimeBetweenStates);
    }

    loadAdditionalData() {
        let weaponData = weaponsDataJson[WEAPONSPATH][this.usingWeapon];
        this.weaponWidth = weaponData["pixelWidth"];
        this.weaponHeight = weaponData["pixelHeight"];
        this.weaponDamage = weaponData["damage"];
        this.weaponImage = loadImage(weaponData["image"]);
    }

    loadPlayerData(_player) {
        this.playerInstance = _player;
    }

    render() {
        this.applyState();
        this.changeState();
        this.display();
        this.displayWeapon();
        this.displayBullets();
    }
}

// THIRD FLOOR ----------------------------------------------------------------------------------------
class Alien extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Alien Gun";
    }
}

class UFO extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "UFO Gun";
    }
}

class Varkolyn extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Toxic";
        this.timeBetweenShots = 1200;
    }
}

// SECOND FLOOR ----------------------------------------------------------------------------------------
class KnightEnemy extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Knights Gun";
    }
}

class EliteKnightEnemy extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Elite Knights Gun";
        this.timeBetweenShots = 1200;
    }
}

class Wizard extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Wizards Scepter";
        this.timeBetweenShots = 1200;
    }
}

class Slime extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Red";
        this.timeBetweenShots = 1200;
    }
}

// FIRST FLOOR ----------------------------------------------------------------------------------------
class Boar extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Red";
        this.timeBetweenShots = 1200;
    }
}

class Bazinga extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Red";
        this.timeBetweenShots = 1200;
    }
}

class BazingaFire extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Orange";
        this.timeBetweenShots = 1200;
    }
}

class BazingaIce extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Blue";
        this.timeBetweenShots = 1200;
    }
}

class BazingaToxic extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Toxic";
        this.timeBetweenShots = 1200;
    }
}

class BazingaTrap extends Enemy {
    constructor(x, y, pixelWidth, pixelHeight, health) { 
        super(x, y, pixelWidth, pixelHeight, health);
        this.usingWeapon = "Sphere Purple";
        this.timeBetweenShots = 1200;
    }
}

window.Alien = Alien;
window.UFO = UFO;
window.Varkolyn = Varkolyn;

window.KnightEnemy = KnightEnemy;
window.EliteKnightEnemy = EliteKnightEnemy;
window.Wizard = Wizard;
window.Slime = Slime;

window.Boar = Boar;
window.Bazinga = Bazinga;
window.BazingaFire = BazingaFire;
window.BazingaIce = BazingaIce;
window.BazingaToxic = BazingaToxic;
window.BazingaTrap = BazingaTrap;

// ------------------------- ATTACK -------------------------
class Attack {
    constructor(x, y, bulletWidth, bulletHeight, _image) {
        this.x = x;
        this.y = y;
        this.bulletWidth = bulletWidth;
        this.bulletHeight = bulletHeight;
        this.image = _image;
        this.damage = 1;
    }

    display() {
        image(this.image, this.x, this.y, this.bulletWidth, this.bulletHeight);
    }

    checkCollisionWithPlayer(player) {
        return this.x < player.x + player.size && this.x + this.bulletWidth > player.x && this.y < player.y + player.size && this.y + this.bulletHeight > player.y;
    }

    isOutOfBounds() {
        return (
            this.x + this.bulletWidth < -500 ||  
            this.x > width + 500 ||  
            this.y + this.bulletHeight < -500 ||  
            this.y > height + 500    
        );
    }

    move() {
        // Placeholder, should be overridden in subclasses
    }

    render() {
        this.move();
        this.display();
    }
}

class LineAttack extends Attack { 
    constructor(x, y, bulletWidth, bulletHeight, dx, dy, _image) {
        super(x, y, bulletWidth, bulletHeight, _image);
        this.dx = dx;
        this.dy = dy;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

class RotatingSphereAttack extends Attack {
    constructor(x, y, bulletWidth, bulletHeight, _image, speed, distance) {
        super(x, y, bulletWidth, bulletHeight, _image);
        this.speed = speed; 
        this.distance = distance;
        this.angle = 0; 
        this.centerX = x; 
        this.centerY = y; 
    }

    move() {
        this.angle += this.speed;
        if (this.angle >= 360) this.angle = 0;

        this.x = this.centerX + this.distance * cos(radians(this.angle));
        this.y = this.centerY + this.distance * sin(radians(this.angle));

        this.distance += 1; 
    }
}

class ShootAround extends Attack {
    constructor(x, y, bulletWidth, bulletHeight, _image) {
        super(x, y, bulletWidth, bulletHeight, _image);
        this.randomAngle = random(0, 360);

        this.dx = cos(radians(this.randomAngle)) * 10;  
        this.dy = sin(radians(this.randomAngle)) * 10;  
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

class LineAround extends Attack {
    constructor(x, y, bulletWidth, bulletHeight, _image, angle) {
        super(x, y, bulletWidth, bulletHeight, _image);
        this.angle = angle;

        this.dx = cos(radians(this.angle)) * 10;  
        this.dy = sin(radians(this.angle)) * 10;  
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
}