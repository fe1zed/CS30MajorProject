//                              <-- DATA TABLE WITH INFO OF CHARACTERS -->
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  NAME   >>  | DarkKnight | Priestess     | Rogue   | Witch     | Assasin     | Alchemist               | Berserk       |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  WEAPON >>  | Bad Pistol | Wooden Cross  | Jack    | The Code  | Blood Blade | Dormant Bubble Machine  | Boxing gloves |
//    : TYPE?  |   (Gun)    |    (Staff)    |(Cold Wp)| (In Hand) |  (Cold Wp)  |         (Gun)           |  (Cold Wp)    |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  HEALTH >>  |     6      |       3       |    5    |     3     |      4      |           5             |       9       |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  ARMOR  >>  |     5      |       5       |    3    |     5     |      5      |           5             |       3       |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  ENERGY >>  |    180     |      200      |   180   |    240    |     180     |          180            |      150      |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+
//  AURA   >>  |    YES     |      NO       |   NO    |    NO     |     YES     |          NO             |      YES      |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+---------------+

/* eslint-disable indent */
/* eslint-disable curly */
/* eslint-disable brace-style */

class Player {
    constructor(x, y, speed, size, room) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.image = null;
        this.deadImage = null;
        this.uniqueAbilityImage = null;
        this.size = size;
        this.MoveDirection = "right";
        this.alive = true;

        this.weaponImage = null;
        this.weaponType = null;
        this.weaponPropelling = null;

        this.health = 0;
        this.armor = 0;
        this.energy = 0;
        this.maxHealth = 0;
        this.maxArmor = 0;
        this.maxEnergy = 0;

        this.usingUniqueAbility = false;
        this.auraDuration = 3;
        this.currentAuraDuration = 0;
        this.auraStartTime = 0;

        this.defaultSpeed = speed;
        this.maxSpeed = speed * 2;

        this.timeBetweenShots = 250;
        this.defaulTimeBetweenShots = 250;
        this.lastTimeShooted = 0;

        this.takenHealthWidth = 150; 
        this.takenArmorWidth = 150; 
        this.takenEnergyWidth = 150; 

        this.timeToRepairArmor = 5000;
        this.lastTimeGotDamage = 0;

        this.coins = 0;

        this.timeBetweenUsingUA = 10000;
        this.lastTimeUsedUA = 0;
    }

    move() {
        if (!this.alive) return;

        const directions = {
            [KEYS.LEFT]: () => {
                if (this.y < 100) {
                    if (!(this.x > width / 2 - 150)) {
                        return;
                    }
                }
                if (this.y + this.size > height - 100) {
                    if (!(this.x > width / 2 - 150)) {
                        return;
                    }
                }
                if (gameMap[curentGameRoomY][curentGameRoomX].leftBridge === 1 && gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel === 0) { // if bridge on left is open ->
                    if (this.x > 100) {
                        this.x -= this.speed;
                    }
                    else {
                        if (this.y > height / 2 - 150 && this.y + this.size + 10 < height / 2 + 150) {
                            this.x -= this.speed;
                        }
                    }
                }
                else {
                    if (this.x > 100) {
                        this.x -= this.speed;
                    }
                }

                this.MoveDirection = "left";
            },
            [KEYS.RIGHT]: () => {  
                if (this.y < 100) {
                    if (!(this.x + this.size < width / 2 + 150)) {
                        return;
                    }
                }
                if (this.y + this.size > height - 100) {
                    if (!(this.x + this.size < width / 2 + 150)) {
                        return;
                    }
                }
                
                if (gameMap[curentGameRoomY][curentGameRoomX].rightBridge === 1 && gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel === 0) { // if bridge on right is open -> 
                    if (this.x + this.size < width - 100) {
                        this.x += this.speed; 
                    }
                    else {
                        if (this.y > height / 2 - 150 && this.y + this.size + 10 < height / 2 + 150) {
                            this.x += this.speed;
                        }
                    }   
                }
                else {
                    if (this.x + this.size < width - 100) {
                        this.x += this.speed; 
                    }
                }
                this.MoveDirection = "right";
            },
            [KEYS.UP]: () => {
                if (this.x < 100) {
                    if (this.y < height / 2 - 150) {
                        return;
                    }
                }

                if (this.x + this.size> width - 100) {
                    if (this.y < height / 2 - 150) {
                        return;
                    }
                }

                if (gameMap[curentGameRoomY][curentGameRoomX].topBridge === 1 && gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel === 0) { // if bridge on top is open ->  
                    if (this.y > 100) {
                        this.y -= this.speed;
                    }
                    else {
                        if (this.x > width / 2 - 150 && this.x + this.size < width / 2 + 150) {
                            this.y -= this.speed;
                        }
                    }
                }
                else {
                    if (this.y > 100) {
                        this.y -= this.speed;
                    }
                }
            },
            [KEYS.DOWN]: () => {
                if (this.x < 100) {
                    if (this.y + this.size > height / 2 + 150) {
                        return;
                    }
                }

                if (this.x + this.size> width - 100) {
                    if (this.y + this.size > height / 2 + 150) {
                        return;
                    }
                }
                
                if (gameMap[curentGameRoomY][curentGameRoomX].bottomBridge === 1 && gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel === 0) { // if bridge on top is open ->  
                    if (this.y + this.size + 10< height - 100) {
                        this.y += this.speed;
                    }
                    else {
                        if (this.x > width / 2 - 150 && this.x + this.size < width / 2 + 150) {
                            this.y += this.speed;
                        }
                    }
                }
                else {
                    if (this.y + this.size + 10< height - 100) {
                        this.y += this.speed;
                    }
                }

            }
        };

        for (let key in directions) {
            if (keyIsDown(key)) {
                directions[key]();
            }
        }

        // colision with screen X
        if (this.x < 0) {this.x = width - this.size - 120; curentGameRoomX -= 1; bullets = []; onRoomEnter(); this.onChangeRoom(); }
        else if (this.x + this.size > width) { this.x = 120; curentGameRoomX += 1; bullets = []; onRoomEnter(); this.onChangeRoom(); }

        // colision with screen Y
        if (this.y < 0) { this.y = height - this.size - 120; curentGameRoomY -= 1; bullets = []; onRoomEnter(); this.onChangeRoom(); }
        else if (this.y + this.size > height) { this.y = 120; curentGameRoomY += 1; bullets = []; onRoomEnter(); this.onChangeRoom(); }
    }

    display() {
        if (!this.alive) {
            image(this.deadImage, this.x, this.y, this.size, this.size);
            return;
        }

        if (this.MoveDirection === "right") {
            image(this.image, this.x, this.y, this.size, this.size);
        }
        else {
            push();
            translate(this.x + this.size, this.y);
            scale(-1, 1);
            image(this.image, 0, 0, this.size, this.size);
            pop();
        }
    }

    displayWeapon() {
        if (!this.alive) return;

        let weaponData = weaponsDataJson[WEAPONSPATH][weaponName];
        let { pixelWidth, pixelHeight, followCursor, type } = weaponData;
        let weaponWidth = pixelWidth / this.size * 30;
        let weaponHeight = pixelHeight / this.size * 30;

        if (followCursor) {
            this.displayWeaponFollowCursor(weaponWidth, weaponHeight);
        }
        else {
            this.displayWeaponStatic(weaponWidth, weaponHeight, type);
        }
    }

    displayWeaponFollowCursor(weaponWidth, weaponHeight) {
        let offsetX = this.MoveDirection === "right"
            ? this.x + this.size / 2 + this.size / 4
            : this.x + this.size / 4;

        let offsetY = this.y + this.size * 0.75;

        let angle = atan2(mouseY - offsetY, mouseX - offsetX);

        push();
        translate(offsetX, offsetY);
        rotate(angle);
        imageMode(CENTER);
        scale(1, angle >= -1.5 && angle <= 1.5 ? 1 : -1);
        image(this.weaponImage, 0, 0, weaponWidth, weaponHeight);
        pop();
    }

    displayWeaponStatic(weaponWidth, weaponHeight, type) {
        let offsetX = this.MoveDirection === "right"
            ? weaponWidth
            : this.size - weaponWidth * 2;

        let offsetY = type === "Staff"
            ? this.y + weaponHeight / 2 - 10
            : this.y + this.size / 2 + 10;

        image(this.weaponImage, this.x + offsetX, offsetY, weaponWidth, weaponHeight);
    }

    attack() {
        if (!this.alive) return;
    }

    shootBullet() {
        if (millis() < this.lastTimeShooted + this.timeBetweenShots) return;

        this.lastTimeShooted = millis();

        if (this.energy > 0) {
            let bullet = this.createBullet();
            bullets.push(bullet);
            this.energy -= bullet.energyCost;
        }
        else {
            console.log("Not enough energy!");
        }
    }

    createBullet() {
        let weaponData = this.weaponPropelling ? weaponsDataJson[WEAPONSPATH][weaponName] : weaponsDataJson[WEAPONSPATH][weaponName]["Bullet"];
        let offsetX = this.MoveDirection === "right"
            ? this.x + this.size / 2 + this.size / 4
            : this.x + this.size / 4;

        let offsetY = this.y + this.size * 0.75;

        let dx = mouseX - offsetX;
        let dy = mouseY - offsetY;
        let length = sqrt(dx * dx + dy * dy);

        let pixelWidth = weaponData["pixelWidth"];
        let pixelHeight = weaponData["pixelHeight"];

        let weaponWidth = 0;
        let weaponHeight = 0;

        if (this.weaponPropelling) {
            weaponWidth = pixelWidth / this.size * 30;
            weaponHeight = pixelHeight / this.size * 30;
        }
        else {
            weaponWidth = pixelWidth;
            weaponHeight = pixelHeight;
        }

        return {
            x: offsetX,
            y: offsetY,
            pixelWidth: weaponWidth,
            pixelHeight: weaponHeight,
            image: loadImage(weaponData["image"]),
            speed: weaponData["speed"],
            dx: dx / length * weaponData["speed"],
            dy: dy / length * weaponData["speed"],
            damage: weaponsDataJson[WEAPONSPATH][weaponName]["damage"],
            energyCost: weaponsDataJson[WEAPONSPATH][weaponName]["energyCost"],
        };
    }

    normalizeVector(dx, dy) {
        const length = sqrt(dx * dx + dy * dy);
        return { x: dx / length, y: dy / length };
    }

    setPlayerValues() {
        player.image = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
        player.deadImage = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["deadImage"]);
        player.uniqueAbilityImage = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["uniqueAbility"]);
        player.speed = charactersDataJson[CHARACTERSPATH][charactersName]["speed"];
        player.size = charactersDataJson[CHARACTERSPATH][charactersName]["size"];
        player.health = charactersDataJson[CHARACTERSPATH][charactersName]["health"];
        player.armor = charactersDataJson[CHARACTERSPATH][charactersName]["armor"];
        player.energy = charactersDataJson[CHARACTERSPATH][charactersName]["energy"];

        player.uniqueAbilityIsAura = charactersDataJson[CHARACTERSPATH][charactersName]["uniqueAbilityIsAura"];

        player.maxHealth = player.health;
        player.maxArmor = player.armor;
        player.maxEnergy = player.energy;
    }

    laodPlayerWeapon() {
        player.weaponImage = loadImage(weaponsDataJson[WEAPONSPATH][weaponName]["image"]);
        player.weaponType = weaponsDataJson[WEAPONSPATH][weaponName]["type"];
        player.weaponPropelling = player.weaponType === "ColdWeapon" ? weaponsDataJson[WEAPONSPATH][weaponName]["propelling"] : false;
    }

    executeUniqueAbility() {
        console.log("Player uses unique ability. Override of each of character.");
    }

    takeDamage(damage) {
        if (!this.alive) return;

        this.lastTimeGotDamage = millis();

        if (this.armor > 0) {
            this.armor -= damage;
        }   
        else {
            this.health -= damage;
        }
        
        console.log("Player took", damage, "damage! Hp left:", this.health);

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log("Player dead");
        this.alive = false;
    }

    rapairArmor() {
        if (this.armor >= this.maxArmor) return;
        let currentTime = millis();

        if (currentTime > this.lastTimeGotDamage + this.timeToRepairArmor) {
                this.armor += 1;
                this.lastTimeGotDamage = millis();
            console.log("Rapairing armor");
        }
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        this.display();
        this.displayWeapon();
        this.rapairArmor();
    }

    loadAdditionalData() {
        // Use this to add some data 
    }

    receiveEnergy(energy) {
        if (this.energy + energy > this.maxEnergy) {
            this.energy = this.maxEnergy;
        }
        else {
            this.energy += energy;
        }
    }

    receiveCoins(coins) {
        this.coins += coins;
    }

    onChangeRoom() {

    }

    healthPot()  {
        if (this.health < this.maxHealth) {
            this.health = this.health + 1 > this.maxHealth? this.maxHealth: this.health + 1;
            console.log("New health:", this.health);
        }
    }

    energyPot() {
        if (this.energy < this.maxEnergy) {
            this.energy = this.energy + 100 > this.maxEnergy? this.maxEnergy: this.energy + 100;
            console.log("New energy:", this.energy);
        }
    }

    restorationPot() {
        this.healthPot(); 
        this.energyPot();
    }
}

class DarkKnight extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);
        this.secondWeaponImage = null;  
        this.dualWieldActive = false;  

        this.timeBetweenUsingUA = 25000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if (this.alive) {
            super.shootBullet(); 

            if (this.dualWieldActive) {
                this.shootSecondWeapon();
            }
        }
    }

    shootSecondWeapon() {
        if (this.energy > 0) {
            let secondBullet = this.createSecondBullet(); 
            bullets.push(secondBullet);
            this.energy -= secondBullet.energyCost;
        } 
    }

    executeUniqueAbility() { 
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }
        
        let auraDurationMillis = this.auraDuration * 1000;

        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Using unique ability {Dual Wield} STARTED");
        }

        let elapsedTime = millis() - this.auraStartTime;

        if (elapsedTime < auraDurationMillis) {
            image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
            this.dualWieldActive = true;
        } 
        else {
            this.usingUniqueAbility = false;
            this.auraStartTime = 0;
            this.dualWieldActive = false;
            this.lastTimeUsedUA = millis();
            console.log("Using unique ability {Dual Wield} ENDED");
        }
    }

    displayWeapon() {
        if (!this.alive) return;

        let weaponData = weaponsDataJson[WEAPONSPATH][weaponName];
        let { pixelWidth, pixelHeight, followCursor, type } = weaponData;
        let weaponWidth = pixelWidth / this.size * 30;
        let weaponHeight = pixelHeight / this.size * 30;

        if (followCursor) {
            this.displayWeaponFollowCursor(weaponWidth, weaponHeight);
        } 
        else {
            this.displayWeaponStatic(weaponWidth, weaponHeight, type);
        }
    }
    
    displaySecondWeapon() {
        if (!this.alive) return;

        let weaponData = weaponsDataJson[WEAPONSPATH][weaponName];
        let { pixelWidth, pixelHeight, followCursor, type } = weaponData;
        let weaponWidth = pixelWidth / this.size * 30;
        let weaponHeight = pixelHeight / this.size * 30;

        if (followCursor) {
            this.displaySecondWeaponFollowCursor(weaponWidth, weaponHeight);
        } 
        else {
            this.displaySecondWeaponStatic(weaponWidth, weaponHeight, type);
        }
    }

    displaySecondWeaponFollowCursor(weaponWidth, weaponHeight) {
        let offsetX = this.MoveDirection === "right"
            ? this.x + this.size / 2 - this.size / 5
            : this.x + this.size / 2 + this.size / 4;

        let offsetY = this.y + this.size * 0.75;

        let angle = atan2(mouseY - offsetY, mouseX - offsetX);

        push();
        translate(offsetX, offsetY);
        rotate(angle);
        imageMode(CENTER);
        scale(1, angle >= -1.5 && angle <= 1.5 ? 1 : -1);
        image(this.weaponImage, 0, 0, weaponWidth, weaponHeight);
        pop();
    }

    displaySecondWeaponStatic(weaponWidth, weaponHeight, type) {
        let offsetX = this.MoveDirection === "right"
            ? 0
            : this.size - this.size / 2;

        let offsetY = type === "Staff"
            ? this.y + weaponHeight / 2 - 10
            : this.y + this.size / 2 + 10;

        image(this.weaponImage, this.x + offsetX, offsetY, weaponWidth, weaponHeight);
    }

    createSecondBullet() {
        let weaponData = this.weaponPropelling ? weaponsDataJson[WEAPONSPATH][weaponName] : weaponsDataJson[WEAPONSPATH][weaponName]["Bullet"];
        let offsetX = this.MoveDirection === "right"
            ? this.x + this.size / 2 - this.size / 5
            : this.x + this.size / 2 + this.size / 4;

        let offsetY = this.y + this.size * 0.75;

        let dx = mouseX - offsetX;
        let dy = mouseY - offsetY;
        let length = sqrt(dx * dx + dy * dy);

        let pixelWidth = weaponData["pixelWidth"];
        let pixelHeight = weaponData["pixelHeight"];

        let weaponWidth = 0;
        let weaponHeight = 0;

        if (this.weaponPropelling) {
            weaponWidth = pixelWidth / this.size * 30;
            weaponHeight = pixelHeight / this.size * 30;
        }
        else {
            weaponWidth = pixelWidth;
            weaponHeight = pixelHeight;
        }

        return {
            x: offsetX,
            y: offsetY,
            pixelWidth: weaponWidth,
            pixelHeight: weaponHeight,
            image: loadImage(weaponData["image"]),
            speed: weaponData["speed"],
            dx: dx / length * weaponData["speed"],
            dy: dy / length * weaponData["speed"],
            damage: weaponsDataJson[WEAPONSPATH][weaponName]["damage"],
            energyCost: weaponsDataJson[WEAPONSPATH][weaponName]["energyCost"],
        };
    }

    laodPlayerWeapon() {
        player.weaponImage = loadImage(weaponsDataJson[WEAPONSPATH][weaponName]["image"]);
        player.secondWeaponImage = loadImage(weaponsDataJson[WEAPONSPATH][weaponName]["image"]); 
        player.weaponType = weaponsDataJson[WEAPONSPATH][weaponName]["type"];
        player.weaponPropelling = player.weaponType === "ColdWeapon" ? weaponsDataJson[WEAPONSPATH][weaponName]["propelling"] : false;
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        this.display();
        this.displayWeapon();
        if(this.dualWieldActive) {
            this.displaySecondWeapon();
        }
    }
}

class Priestess extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);
        this.zoneBuffActive = false;  

        this.zoneBuffPosition = {x: 0, y: 0 };
        this.zoneBuffTime = 5;
        this.zoneBuffStartTime = 0;
        this.zoneBuffSize = 250;

        this.damagedLastTime = 1;
        this.timeBetweenDamage = 1000;

        this.timeBetweenUsingUA = 30000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;
        
        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        console.log("Spawn healig zone at x:" + this.x + "y:" + this.y);
        this.zoneBuffPosition = {x: this.x - this.size, y: this.y - this.size};
        this.usingUniqueAbility = false;
        this.zoneBuffActive = true;
        this.lastTimeUsedUA = millis();
    }

    displayZoneBuff() {
        let zoneBuffDurationMillis = this.zoneBuffTime * 1000;
    
        if (this.zoneBuffStartTime === 0) {
            this.zoneBuffStartTime = millis();
            console.log("Using unique ability {Regeneration Pact} STARTED");
        }
    
        let elapsedTime = millis() - this.zoneBuffStartTime;
    
        if (elapsedTime < zoneBuffDurationMillis) {
            image(this.uniqueAbilityImage,this.zoneBuffPosition.x, this.zoneBuffPosition.y, this.zoneBuffSize, this.zoneBuffSize);
        } 
        else {
            this.zoneBuffStartTime = 0; 
            this.zoneBuffActive = false;
            console.log("Using unique ability {Regeneration Pact} ENDED");
        }
    }

    heal() {
        let elapsedTime = millis() - this.damagedLastTime; 

        if (this.x > this.zoneBuffPosition.x && this.x < this.zoneBuffPosition.x + this.zoneBuffSize &&
            this.y > this.zoneBuffPosition.y && this.y < this.zoneBuffPosition.y + this.zoneBuffSize
        ) {
            if (elapsedTime >= this.timeBetweenDamage) {
                if (this.health < this.maxHealth) {
                    this.health += 1;
                    this.damagedLastTime = millis();
                    console.log("healing");
                }
            }
        }
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        if(this.zoneBuffActive) {
            this.displayZoneBuff();
            this.heal();
        }
        this.display();
        this.displayWeapon();
    }

    onChangeRoom() {
        this.zoneBuffActive = false;
        this.zoneBuffStartTime = 0; 
        this.zoneBuffActive = false;
        console.log("Using unique ability {Regeneration Pact} ENDED");
    } 
}

class Rogue extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);

        this.originalImage = null;     
        this.abilityStartTime = 0;     
        this.dodgeDuration = 0.3;      
        this.dodgeStartTime = 0;
        this.dodgeSpeedMultiplier = 20;
        this.dodged = false;

        this.timeBetweenUsingUA = 3000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        let dodgeDurationMillis = this.dodgeDuration * 1000;
    
        if (this.dodgeStartTime === 0) {
            this.dodgeStartTime = millis();
            console.log("Using unique ability {DODGE} STARTED");
        }
    
        let elapsedTime = millis() - this.dodgeStartTime;
    
        if (elapsedTime < dodgeDurationMillis) {
            this.image = this.uniqueAbilityImage;
            if (!this.dodged) {
                this.dodge();
                this.dodged = true;
            }
            
        } 
        else {
            this.usingUniqueAbility = false;
            this.dodgeStartTime = 0; 
            this.image = this.originalImage;
            this.dodged = false;
            this.lastTimeUsedUA = millis();
            console.log("Using unique ability {DODGE} ENDED");
        }
    }
    

    loadAdditionalData() {
        this.originalImage = loadImage("Characters/RogueGif.gif");
        this.uniqueAbilityImage = loadImage("Characters/UniqueAbility/RogueUniqueAbility.gif");
    }

    dodge() {
        let angle = atan2(mouseY - this.y, mouseX - this.x); 
        let dodgeDistance = this.speed * this.dodgeSpeedMultiplier;

        this.x += cos(angle) * dodgeDistance;
        this.y += sin(angle) * dodgeDistance;
    }
}

class Witch extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);

        this.amountOfSpikes = 10;
        this.pathToIceSpike = "Weapons/Bullets/IceSpike.png";
        this.iceSpikeImage = null;
        this.spikes = [];
        this.shootedSpikes = false;
        this.usingUniqueAbility = false;

        this.timeBetweenUsingUA = 15000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        let auraDurationMillis = this.auraDuration * 1000;
    
        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Using unique ability {SUPER MAJIC CAST} STARTED");
        }
    
        let elapsedTime = millis() - this.auraStartTime;
    
        if (elapsedTime < auraDurationMillis) {
            image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
            this.usingUniqueAbility = true;
            this.speed = this.maxSpeed;
            if(!this.shootedSpikes){
                this.shootSpikes();
            }
        } 
        else {
            this.usingUniqueAbility = false;
            this.auraStartTime = 0; 
            this.shootedSpikes = false;
            this.spikes = [];
            this.speed = this.defaultSpeed;
            this.lastTimeUsedUA = millis();
            console.log("Using unique ability {SUPER MAJIC CAST} ENDED");
        }
    }

    shootSpikes() {
        console.log("Shooting spikes");
        this.spikes = [];
        let degreeToRotate = 360 / this.amountOfSpikes;
    
        for (let i = 0; i < this.amountOfSpikes; i++) {
            let angleInDegrees = i * degreeToRotate;
            this.spikes.push(this.createIceSpike(this.x - this.size, this.y - this.size, angleInDegrees));
            console.log("Creating spike at angle:", angleInDegrees);
        }
    
        this.shootedSpikes = true;
    }

    moveSpikes() {
        for (let spike of this.spikes) {
            spike.x += spike.dx; 
            spike.y += spike.dy; 
        }
    }

    createIceSpike(x, y, angleInDegrees) {
        let angleInRadians = radians(angleInDegrees);
        return {
            x: x,
            y: y,
            pixelWidth: 240,
            pixelHeight: 240,
            image: this.iceSpikeImage,
            speed: 5,
            dx: cos(angleInRadians) * 7.5, 
            dy: sin(angleInRadians) * 7.5, 
            damage: 20,
            angle: angleInDegrees + 90,
        };
    }

    displaySpikes() {
        for (let i = 0; i < this.spikes.length; i++) {
            let spike = this.spikes[i];
            push();
            imageMode(CENTER);
            translate(spike.x + this.size + this.size / 2, spike.y + this.size + this.size / 2);
            angleMode(DEGREES);
            rotate(spike.angle);
            image(spike.image, 0, 0, spike.pixelWidth, spike.pixelHeight); 
            pop();
        }
        angleMode(RADIANS);
    }

    loadAdditionalData() {
        this.iceSpikeImage = loadImage(this.pathToIceSpike);
    }


    render() {
        this.move();
        this.executeUniqueAbility();
        if(this.usingUniqueAbility) {
            this.displaySpikes();
            this.moveSpikes();
        }
        this.display();
        this.displayWeapon();
    }

    onChangeRoom() {
        this.spikes = [];
    }
}

class Assasin extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);

        this.amountOfSpikes = 10;
        this.pathToIceSpike = "Weapons/Bullets/BloodBladeWave.png";
        this.iceSpikeImage = null;
        this.spikes = [];
        this.shootedSpikes = false;
        this.usingUniqueAbility = false;

        this.timeBetweenUsingUA = 10000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        let auraDurationMillis = this.auraDuration * 1000;
    
        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Using unique ability {DARK BLADE} STARTED");
        }
    
        let elapsedTime = millis() - this.auraStartTime;
    
        if (elapsedTime < auraDurationMillis) {
            image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
            this.usingUniqueAbility = true;
            this.speed = this.maxSpeed * 1.5;
            if(!this.shootedSpikes){
                this.shootSpikes();
            }
        } 
        else {
            this.usingUniqueAbility = false;
            this.auraStartTime = 0; 
            this.shootedSpikes = false;
            this.spikes = [];
            this.speed = this.defaultSpeed;
            this.lastTimeUsedUA = millis();
            console.log("Using unique ability {DARK BLADE} ENDED");
        }
    }

    shootSpikes() {
        console.log("Shooting spikes");
        this.spikes = [];
        let degreeToRotate = 360 / this.amountOfSpikes;
    
        for (let i = 0; i < this.amountOfSpikes; i++) {
            let angleInDegrees = i * degreeToRotate; 
            this.spikes.push(this.createIceSpike(this.x - this.size, this.y - this.size, angleInDegrees));
            console.log("Creating spike at angle:", angleInDegrees);
        }
    
        this.shootedSpikes = true;
    }

    moveSpikes() {
        for (let spike of this.spikes) {
            spike.x += spike.dx; 
            spike.y += spike.dy; 
        }
    }

    createIceSpike(x, y, angleInDegrees) {
        let angleInRadians = radians(angleInDegrees);
        return {
            x: x,
            y: y,
            pixelWidth: 120,
            pixelHeight: 120,
            image: this.iceSpikeImage,
            speed: 5,
            dx: cos(angleInRadians) * 7.5, 
            dy: sin(angleInRadians) * 7.5, 
            damage: 20,
            angle: angleInDegrees,
        };
    }

    displaySpikes() {
        for (let i = 0; i < this.spikes.length; i++) {
            let spike = this.spikes[i];
            push();
            imageMode(CENTER);
            translate(spike.x + this.size + this.size / 2, spike.y + this.size + this.size / 2);
            angleMode(DEGREES);
            rotate(spike.angle);
            image(spike.image, 0, 0, spike.pixelWidth, spike.pixelHeight);
            pop();
        }
        angleMode(RADIANS);
    }

    loadAdditionalData() {
        this.iceSpikeImage = loadImage(this.pathToIceSpike);
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        if(this.usingUniqueAbility) {
            this.displaySpikes();
            this.moveSpikes();
        }
        this.display();
        this.displayWeapon();
    }

    onChangeRoom() {
        this.spikes = [];
    }
}

class Alchemist extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);
        this.zoneBuffActive = false;  

        this.zoneBuffPosition = {x: 0, y: 0 };
        this.zoneBuffTime = 5;
        this.zoneBuffStartTime = 0;
        this.zoneBuffSize = 250;

        this.damagedLastTime = 1;
        this.timeBetweenDamage = 1000; 
        this.zoneDamage = 20;

        this.timeBetweenUsingUA = 15000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        console.log("Spawn healig zone at x:" + this.x + "y:" + this.y);
        this.zoneBuffPosition = {x: this.x - this.size, y: this.y - this.size};
        this.usingUniqueAbility = false;
        this.zoneBuffActive = true;
        this.lastTimeUsedUA = millis();
    }

    displayZoneBuff() {
        let zoneBuffDurationMillis = this.zoneBuffTime * 1000;
    
        if (this.zoneBuffStartTime === 0) {
            this.zoneBuffStartTime = millis();
            console.log("Using unique ability {Gas Grenade} STARTED");
        }
    
        let elapsedTime = millis() - this.zoneBuffStartTime;
    
        if (elapsedTime < zoneBuffDurationMillis) {
            image(this.uniqueAbilityImage,this.zoneBuffPosition.x, this.zoneBuffPosition.y, this.zoneBuffSize, this.zoneBuffSize);
        } 
        else {
            this.zoneBuffStartTime = 0; 
            this.zoneBuffActive = false;
            console.log("Using unique ability {Gas Grenade} ENDED");
        }
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        this.display();
        this.displayWeapon();
    }

    onChangeRoom() {
        this.zoneBuffStartTime = 0; 
        this.zoneBuffActive = false;
    }
}

class Berserk extends Player {
    constructor(x, y, speed, size) {
        super(x, y, speed, size);

        this.rageAttackSpeed = this.defaulTimeBetweenShots / 2;

        this.timeBetweenUsingUA = 25000;
        this.lastTimeUsedUA = 0;
    }

    attack() {
        if(this.alive) super.shootBullet();
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        if (this.lastTimeUsedUA + this.timeBetweenUsingUA > millis()) { return; }

        let auraDurationMillis = this.auraDuration * 1000;
    
        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Using unique ability {RAGE} STARTED");
        }
    
        let elapsedTime = millis() - this.auraStartTime;
    
        if (elapsedTime < auraDurationMillis) {
            image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
            this.timeBetweenShots = this.rageAttackSpeed;
        } 
        else {
            this.usingUniqueAbility = false;
            this.auraStartTime = 0; 
            this.timeBetweenShots = this.defaulTimeBetweenShots;
            this.lastTimeUsedUA = millis();
            console.log("Using unique ability {RAGE} ENDED");
        }
    }
}

window.DarkKnight = DarkKnight;
window.Priestess = Priestess;
window.Rogue = Rogue;
window.Witch = Witch;
window.Assasin = Assasin;
window.Alchemist = Alchemist;
window.Berserk = Berserk;