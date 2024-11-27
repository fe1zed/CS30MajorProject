// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CHARACTERSPATH = "Characters";
const WEAPONSPATH = "Weapons";

const KEYS = { LEFT: 65, RIGHT: 68, UP: 87, DOWN: 83 };
const BULLET_DEFAULT_SIZE = 10;
const BULLET_SPEED_SCALE = 30;
const WEAPON_SIZE_SCALE = 30;

class Player {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = null;
    this.size = size;
    this.MoveDirection = "right";
    this.weaponImage = null;
    this.weaponType = null;
  }

  move() {
    const directions = {
      [KEYS.LEFT]: () => {  this.x -= this.speed; 
                            this.MoveDirection = "left"; },
      [KEYS.RIGHT]: () => { this.x += this.speed; 
                            this.MoveDirection = "right"; },
      
      [KEYS.UP]: () => {    this.y -= this.speed; },
      [KEYS.DOWN]: () => {  this.y += this.speed; }
    };
  
    for (let key in directions) {
      if (keyIsDown(key)) directions[key]();
    }
  }
  
  display() {
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
    let weaponData = weaponsDataJson["Weapons"][weaponName];
    let { pixelWidth, pixelHeight, followCursor, type } = weaponData;
    let weaponWidth = (pixelWidth / this.size) * 30;
    let weaponHeight = (pixelHeight / this.size) * 30;

    if (followCursor) {
        this.displayWeaponFollowCursor(weaponWidth, weaponHeight);
    } else {
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
    let weaponType = weaponsDataJson["Weapons"][weaponName]["type"];

    if (weaponType === "Gun") {
        this.shootBullet();
    } 
    else if (weaponType === "ColdWeapon") {
        console.log("Throwing Cold Weapon");
    } 
    else if (weaponType === "InHand" || weaponType === "Staff") {
        console.log("Magic cast");
    } 
    else {
        console.warn("Unknown weapon type:", weaponType);
    }
  }

  shootBullet() {
      console.log("Sending Bullet");

      let bullet = this.createBullet();
      bullets.push(bullet);
  }

  createBullet() {
      let weaponData = weaponsDataJson["Weapons"][weaponName]["Bullet"];
      let offsetX = this.MoveDirection === "right" 
        ? this.x + this.size / 2 + this.size / 4
        : this.x + this.size / 4;

      let offsetY = this.y + this.size * 0.75;

      let dx = mouseX - offsetX;
      let dy = mouseY - offsetY;
      let length = sqrt(dx * dx + dy * dy);

      return {
          x: offsetX,
          y: offsetY,
          size: 10,
          image: weaponData["image"],
          speed: weaponData["speed"],
          dx: (dx / length) * weaponData["speed"],
          dy: (dy / length) * weaponData["speed"]
      };
  }

  normalizeVector(dx, dy) {
    const length = sqrt(dx * dx + dy * dy);
    return { x: dx / length,
             y: dy / length };
  }

  render() {
    this.move();
    this.display();
    this.displayWeapon();
  }
}

// Data containers
let charactersDataJson;
let weaponsDataJson;

// Adjust <<charactersName>> and <<weaponName>> to see ur character
let player = new Player(200, 200, 5, 100);
let charactersName = "Alchemist";
let weaponName = "default";

let bullets = [];

function preload() {
  charactersDataJson = loadJSON(CHARACTERSPATH + '/CharactersData.json');  
  weaponsDataJson = loadJSON(WEAPONSPATH + '/WeaponsData.json');  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.image = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
  player.speed = charactersDataJson[CHARACTERSPATH][charactersName]["speed"];
  player.size = charactersDataJson[CHARACTERSPATH][charactersName]["size"];

  if (weaponName === "default") { // set to default weapon used by player if not assigned special
    weaponName = charactersDataJson[CHARACTERSPATH][charactersName]["enhanceStartingWeapon"];
  }

  player.weaponImage = loadImage(weaponsDataJson["Weapons"][weaponName]["image"]);
  player.weaponType = weaponsDataJson["Weapons"][weaponName]["type"];
}

function draw() {
  background(220);
  player.render();

  if (player.weaponType) {
    displayBullets(); 
  }
}

function displayBullets() {
  for (let bullet of bullets) {
    circle(bullet.x, bullet.y, bullet.size);
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  }
}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
}

function mouseClicked(event) {
  player.attack();
}


// https://soul-knight.fandom.com/wiki/Knight
// Take characters from here
// https://ezgif.com/webp-to-gif/ezgif-3-d32a219e48.webp 
// convert here to .gif

// Linhk to join https://prod.liveshare.vsengsaas.visualstudio.com/join?00E4ADAA11E7DCE9480E1E4B502A36560F78



//https://static.wikia.nocookie.net/soul-knight/images/0/00/Knight_25_chaotic_strike.png/revision/latest?cb=20241125030851