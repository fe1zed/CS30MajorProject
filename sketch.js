// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CHARACTERSPATH = "Characters";
const WEAPONSPATH = "Weapons";
const ENEMIESPATH = "Enemies";

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
    this.weaponPropelling = null;
  }

  move() {
    const directions = {                          
      [KEYS.LEFT]: () => {  
        this.x -= this.speed; 
        this.MoveDirection = "left"; },
      [KEYS.RIGHT]: () => { 
        this.x += this.speed; 
        this.MoveDirection = "right"; },
      
      [KEYS.UP]: () => {    
        this.y -= this.speed; },
      [KEYS.DOWN]: () => {  
        this.y += this.speed; }
    };
  
    for (let key in directions) {
      if (keyIsDown(key)) { 
        directions[key]();
      }
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
    let weaponData = weaponsDataJson[WEAPONSPATH][weaponName];
    let { pixelWidth, pixelHeight, followCursor, type } = weaponData;
    let weaponWidth = (pixelWidth / this.size) * 30;
    let weaponHeight = (pixelHeight / this.size) * 30;

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
    let weaponType = weaponsDataJson[WEAPONSPATH][weaponName]["type"];

    if (weaponType === "Gun") {
      this.shootBullet();
    } 
    else if (weaponType === "ColdWeapon") {
      this.shootBullet();
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
    let weaponData = this.weaponPropelling? weaponsDataJson[WEAPONSPATH][weaponName] : weaponsDataJson[WEAPONSPATH][weaponName]["Bullet"];
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
      weaponWidth = (pixelWidth / this.size) * 30;
      weaponHeight = (pixelHeight / this.size) * 30;
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
      dx: (dx / length) * weaponData["speed"],
      dy: (dy / length) * weaponData["speed"],
    };
  }

  normalizeVector(dx, dy) {
    const length = sqrt(dx * dx + dy * dy);
    return { x: dx / length, y: dy / length };
  }

  render() {
    this.move();
    this.display();
    this.displayWeapon();
  }
}

class Enemy {
  constructor(x, y, pixelWidth, pixelHeight, imagePath, attackImagePath, deadImagePath, health) {
    this.x = x;
    this.y = y;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.heath = health;
    this.alive = true;

    this.imagePath = imagePath;
    this.image = null;
    this.deadImagePath = deadImagePath;
    this.deadImage = null;
    this.attackImagePath = attackImagePath;
    this.attackImage = null
  }

  display() {
    image(this.image, this.x, this.y, this.pixelWidth, this.pixelHeight);
  }

  takeDamage(damage) {
    if (!this.alive) return;

    this.heath -= 10;

    console.log("Enemy took", damage, "damage!");
    if (this.heath <= 0) {
      this.die();
    }
  }

  die() {
    console.log("Enemy dead");
    this.alive = false;
    this.image = this.deadImage;
    // Delete later 
  }

  render() {
    this.display();
  }
}

// Data containers
let charactersDataJson;
let weaponsDataJson;
let enemiesDataJson;

// Adjust <<charactersName>> and <<weaponName>> to see ur character
let player = new Player(200, 200, 5, 100);
let charactersName = "DarkKnight"; 
let weaponName = "default";

let bgImage = null;
let heartImage = null;
let armorImage = null;
let energyImage = null;

//                              <-- DATA TABLE WITH INFO OF CHARACTERS -->
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 
//  NAME   >>  | DarkKnight | Priestess     | Rogue   | Witch     | Assasin     | Alchemist               | 
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 
//  WEAPON >>  | Bad Pistol | Wooden Cross  | Jack    | The Code  | Blood Blade | Dormant Bubble Machine  | 
//    : TYPE?  |   (Gun)    |    (Staff)    |(Cold Wp)| (In Hand) |  (Cold Wp)  |         (Gun)           |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 
//  HEALTH >>  |     6      |       3       |    5    |     3     |      4      |           5             | 
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 
//  ARMOR  >>  |     5      |       5       |    3    |     5     |      5      |           5             |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 
//  ENERGY >>  |    180     |      200      |   180   |    240    |     180     |          180            |
//         --  +------------+---------------+---------+-----------+-------------+-------------------------+ 

let bullets = [];
let enemies = [];

function preload() {
  charactersDataJson = loadJSON(CHARACTERSPATH + '/CharactersData.json');  
  weaponsDataJson = loadJSON(WEAPONSPATH + '/WeaponsData.json');  
  enemiesDataJson = loadJSON(ENEMIESPATH + '/EnemiesData.json');

  bgImage = loadImage('UI/BgNEW2.png');
  heartImage = loadImage('UI/Heart.png');
  armorImage = loadImage('UI/Armor.png');
  energyImage = loadImage('UI/Energy.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.image = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
  player.speed = charactersDataJson[CHARACTERSPATH][charactersName]["speed"];
  player.size = charactersDataJson[CHARACTERSPATH][charactersName]["size"];

  // If not found such weapon, showing default
  if (!weaponsDataJson[WEAPONSPATH].hasOwnProperty(weaponName)) {
    weaponName = "default";
  }

  if (weaponName === "default") { // set to default weapon used by player if not assigned special
    weaponName = charactersDataJson[CHARACTERSPATH][charactersName]["enhanceStartingWeapon"];
  }

  player.weaponImage = loadImage(weaponsDataJson[WEAPONSPATH][weaponName]["image"]);
  player.weaponType = weaponsDataJson[WEAPONSPATH][weaponName]["type"];
  player.weaponPropelling = player.weaponType === "ColdWeapon"? weaponsDataJson[WEAPONSPATH][weaponName]["propelling"]: false;

  createEnemy("Boss", "Queen");
}

function draw() {
  background(53, 80, 96);

  // ----- ENEMIES -----
  for (let enemy of enemies) {
    enemy.render();
  }

  for (let bullet of bullets) {
    for (let enemy of enemies) {
      if (!enemy.alive) continue;
      if (bullet.x < enemy.x + enemy.pixelWidth && 
        bullet.x + bullet.pixelWidth > enemy.x &&
        bullet.y < enemy.y + enemy.pixelHeight &&
        bullet.y + bullet.pixelHeight > enemy.y) {
          console.log("Enemy hit!");
          enemy.takeDamage(10); // Метод получения урона у врага
          bullets.splice(bullets.indexOf(bullet), 1); // Удаление пули
          break;
      }
    }
  }

  // ----- PLAYER -----
  player.render();

  // ----- AMMO -----
  if (player.weaponType === "Gun") {
    displayBullets(); 
  }
  else if (player.weaponType == "ColdWeapon") {
    if (player.weaponPropelling) {
      displayBullets();
    }
  }
}

// ----- CODE -----

function displayBullets() {
  for (let bullet of bullets) {
    let angle = atan2(bullet.dy, bullet.dx);

    push();
    translate(bullet.x, bullet.y);
    rotate(angle);
    imageMode(CENTER);
    image(bullet.image, 0, 0, bullet.pixelWidth, bullet.pixelHeight);
    pop();

    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  }
}

function createEnemy(enemyType, enemyName) {
  let enemyData = getEnemieDataFromJSONByTypeAndName(enemyType, enemyName);
  let newEnemy = new Enemy(400, 100, enemyData.pixelWidth, enemyData.pixelHeight, enemyData.imagePath, enemyData.attackImagePath, enemyData.deadImagePath, enemyData.health)
  newEnemy.image = loadImage(enemyData.imagePath);
  newEnemy.deadImage = loadImage(enemyData.deadImagePath);
  newEnemy.attackImage = loadImage(enemyData.attackImagePath);
  enemies.push(newEnemy); 
}

function getEnemieDataFromJSONByTypeAndName(enemyType, enemieName) {
  return {
    imagePath: enemiesDataJson[enemyType][enemieName]["image"],
    attackImagePath: enemiesDataJson[enemyType][enemieName]["attackImage"],
    deadImagePath: enemiesDataJson[enemyType][enemieName]["deadImage"],
    pixelWidth: enemiesDataJson[enemyType][enemieName]["pixelWidth"],
    pixelHeight: enemiesDataJson[enemyType][enemieName]["pixelHeight"],
    health: enemiesDataJson[enemyType][enemieName]["health"]
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

function drawLobby() {
  image(bgImage, 0, 0, width, height);
}

function drawHUD() {

}

// https://soul-knight.fandom.com/wiki/Knight
// Take characters from here
// https://ezgif.com/webp-to-gif/ezgif-3-d32a219e48.webp 
// convert here to .gif

// Linhk to join https://prod.liveshare.vsengsaas.visualstudio.com/join?00E4ADAA11E7DCE9480E1E4B502A36560F78



//https://static.wikia.nocookie.net/soul-knight/images/0/00/Knight_25_chaotic_strike.png/revision/latest?cb=20241125030851