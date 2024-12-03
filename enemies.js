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

      /*if (this.health < this.maxHealth / 2 && this.health > 0) {
        this.image = this.attackImage;
      } 
      else*/ if (this.health <= 0) {
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

        let states = ["idle", "move", "attack"];
        this.state = random(states);
        this.currentTimeBetweenStates = 0;
        this.timeBetweenStates = random(this.minTimeBetweenStates, this.maxTimeBetweenStates);
        console.log("New state:", this.state);
    }

    render() {
        this.applyState();
        this.changeState();
        this.display();
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
    attack() {
        //console.log("Varkolyn Leader Attacks");
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