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

class Player { // 219
    constructor(x, y, speed, size) {
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
        this.uniqueAbilityIsAura = false;
        this.auraDuration = 3;
        this.currentAuraDuration = 0;
        this.auraStartTime = 0;

        this.defaultSpeed = speed;
        this.maxSpeed = speed * 2;
    }

    move() {
        if (!this.alive) return;

        const directions = {
            [KEYS.LEFT]: () => {
                this.x -= this.speed;
                this.MoveDirection = "left";
            },
            [KEYS.RIGHT]: () => {
                this.x += this.speed;
                this.MoveDirection = "right";
            },
            [KEYS.UP]: () => {
                this.y -= this.speed;
            },
            [KEYS.DOWN]: () => {
                this.y += this.speed;
            }
        };

        for (let key in directions) {
            if (keyIsDown(key)) {
                directions[key]();
            }
        }
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
        console.log("651515165151");
        if (!this.alive) return;
    }

    shootBullet() {
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

    render() {
        this.move();
        this.executeUniqueAbility();
        this.display();
        this.displayWeapon();
    }
}


class DarkKnight extends Player { // 175
    constructor(x, y, speed, size) {
        super(x, y, speed, size);
        this.secondWeaponImage = null;  // Второе оружие
        this.dualWieldActive = false;  // Флаг активности двойного оружия
    }

    attack() {
        if (this.alive) {
            super.shootBullet(); // Атаковать с основным оружием

            if (this.dualWieldActive) {
                // Атаковать с вторым оружием
                this.shootSecondWeapon();
            }
        }
    }

    shootSecondWeapon() {
        // Логика стрельбы из второго оружия
        if (this.energy > 0) {
            let secondBullet = this.createSecondBullet(); // Создаем пуля для второго оружия
            bullets.push(secondBullet);
            this.energy -= secondBullet.energyCost;
        } 
        else {
            console.log("Не хватает энергии для второго оружия!");
        }
    }

    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        let auraDurationMillis = this.auraDuration * 1000;

        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Использование уникальной способности {Dual Wield} НАЧАЛОСЬ");
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
            console.log("Использование уникальной способности {Dual Wield} ЗАВЕРШЕНО");
        }
    }

    // Переопределение метода для отображения оружия
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
        player.secondWeaponImage = loadImage(weaponsDataJson[WEAPONSPATH][weaponName]["image"]); // Загрузим изображение второго оружия
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
    attack() {

    }

    executeUniqueAbility() {

    }
}

class Rogue extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbility() {
        
    }
}

class Witch extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbility() {
        
    }
}

class Assasin extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    // Assasing unique skill is <<Dark Blade>> that makes him the fastest unit in the hole game
    executeUniqueAbility() {
        if (!this.usingUniqueAbility) return;

        let auraDurationMillis = this.auraDuration * 1000;
    
        if (this.auraStartTime === 0) {
            this.auraStartTime = millis();
            console.log("Using unique ability {Dark Blade} STARTED");
        }
    
        let elapsedTime = millis() - this.auraStartTime;
    
        if (elapsedTime < auraDurationMillis) {
            image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
            this.speed = this.maxSpeed * 1.5;
        } else {
            this.usingUniqueAbility = false;
            this.auraStartTime = 0; 
            this.speed = this.defaultSpeed;
            console.log("Using unique ability {Dark Blade} ENDED");
        }
    }
}

class Alchemist extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbility() {
        
    }
}

class Berserk extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbility() {
        
    }
}

window.DarkKnight = DarkKnight;
window.Priestess = Priestess;
window.Rogue = Rogue;
window.Witch = Witch;
window.Assasin = Assasin;
window.Alchemist = Alchemist;
window.Berserk = Berserk;