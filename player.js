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

class Player {
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
        this.auraDuration = 5000;
        this.currentAuraDuration = 0;

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
        // let weaponType = weaponsDataJson[WEAPONSPATH][weaponName]["type"];

        // if (weaponType === "Gun" || weaponType === "ColdWeapon") {
        //     this.shootBullet();
        // }
        // else if (weaponType === "InHand" || weaponType === "Staff") {
        //     console.log("Magic cast");
        // }
        // else {
        //     console.warn("Unknown weapon type:", weaponType);
        // }
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
        if (!this.usingUniqueAbility) return;

        if (this.uniqueAbilityIsAura) { // показываем аруру, улучшаем способности, вычитаем время ауры
            if (this.currentAuraDuration < this.auraDuration) {
                image(this.uniqueAbilityImage, this.x - 20, this.y - 15, 120, 120);
                console.log("Using unique ability");
                this.currentAuraDuration += 100;
                this.speed = this.maxSpeed;
            }
            else {
                this.usingUniqueAbility = false;
                this.currentAuraDuration = 0;
                this.speed = this.defaultSpeed;
                console.log("Using unique ability ENDED");
            }
        }
        else {
            console.log("Other ability");
        }
    }

    render() {
        this.move();
        this.executeUniqueAbility();
        this.display();
        this.displayWeapon();
    }
}


class DarkKnight extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }
}

class Priestess extends Player {
    attack() {

    }

    executeUniqueAbilityd() {

    }
}

class Rogue extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbilityd() {
        
    }
}

class Witch extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbilityd() {
        
    }
}

class Assasin extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbilityd() {
        
    }
}

class Alchemist extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbilityd() {
        
    }
}

class Berserk extends Player {
    attack() {
        if(this.alive)
            super.shootBullet();
    }

    executeUniqueAbilityd() {
        
    }
}

window.DarkKnight = DarkKnight;
window.Priestess = Priestess;
window.Rogue = Rogue;
window.Witch = Witch;
window.Assasin = Assasin;
window.Alchemist = Alchemist;
window.Berserk = Berserk;