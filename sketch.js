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

// Data containers
let charactersDataJson;
let weaponsDataJson;
let enemiesDataJson;

// Adjust <<charactersName>> and <<weaponName>> to see ur character
let charactersName = "Priestess"; 
let weaponName = "default";
let player = new window[charactersName](200, 200, 5, 100);

let bgImage = null;
let heartImage = null;
let armorImage = null;
let energyImage = null;

let logoImage = null;

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

  logoImage = loadImage('UI/Logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.setPlayerValues();

  // If not found such weapon, showing default
  if (!weaponsDataJson[WEAPONSPATH].hasOwnProperty(weaponName)) {
    weaponName = "default";
  }

  if (weaponName === "default") { // set to default weapon used by player if not assigned special
    weaponName = charactersDataJson[CHARACTERSPATH][charactersName]["enhanceStartingWeapon"];
  }

  player.laodPlayerWeapon();
  
  createEnemy("Boss", "Varkolyn Leader");
}

function draw() {
  background(53, 80, 96);
  drawCoolImage(1000, 200, 264, logoImage);

  // ----- ENEMIES -----
  for (let enemy of enemies) {
    enemy.render();
  }

  for (let bullet of bullets) {
    for (let enemy of enemies) {
      if (!enemy.alive) { 
        continue;
      }
      if (bullet.x < enemy.x + enemy.pixelWidth && bullet.x + bullet.pixelWidth > enemy.x && bullet.y < enemy.y + enemy.pixelHeight && bullet.y + bullet.pixelHeight > enemy.y) {
        enemy.takeDamage(bullet.damage); 
        bullets.splice(bullets.indexOf(bullet), 1);
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
  else if (player.weaponType === "ColdWeapon") {
    if (player.weaponPropelling) {
      displayBullets();
    }
  }

  drawHUD();
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
  let className = enemyName.replace(/\s+/g, '');

  if (typeof window[className] === 'function') {
    let newEnemy = new window[className](400, 100, enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health);
    
    newEnemy.image = loadImage(enemyData.image);
    newEnemy.deadImage = loadImage(enemyData.deadImage);
    newEnemy.attackImage = loadImage(enemyData.attackImage);
    newEnemy.moveImage = loadImage(enemyData.moveImage);
    
    enemies.push(newEnemy);
  } 
  else {
    console.error('Class with such name is not found:', className);
  }
}

function getEnemieDataFromJSONByTypeAndName(enemyType, enemieName) {
  return {
    image: enemiesDataJson[enemyType][enemieName]["image"],
    attackImage: enemiesDataJson[enemyType][enemieName]["attackImage"],
    deadImage: enemiesDataJson[enemyType][enemieName]["deadImage"],
    moveImage: enemiesDataJson[enemyType][enemieName]["walkingImage"],
    pixelWidth: enemiesDataJson[enemyType][enemieName]["pixelWidth"],
    pixelHeight: enemiesDataJson[enemyType][enemieName]["pixelHeight"],
    health: enemiesDataJson[enemyType][enemieName]["health"]
  };
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

function keyPressed() {
  if (key === "e" || key === "E" || key === "У" || key === "у") {
    if (!player.usingUniqueAbility)  {
      player.usingUniqueAbility = true;
    }
    else {
      console.warn("Already using unique ability");
    }
  }
}

function drawBar(icon, value, maxValue, x, y, iconSize, barWidth, barHeight, barColor) {
  image(icon, x, y, iconSize, iconSize); 

  fill(0, 0, 0);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, barWidth, barHeight);

  fill(barColor);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, barWidth * (value / maxValue), barHeight);
  noFill();
}

function drawHUD() {
  let x = 20;
  let y = 20;
  let iconSize = 30;
  let spacing = 50;
  let barWidth = 150;
  let barHeight = 20;

  drawBar(heartImage, player.health, player.maxHealth, x, y, iconSize, barWidth, barHeight, color(255, 0, 0)); 
  drawBar(armorImage, player.armor, player.maxArmor, x, y + spacing, iconSize, barWidth, barHeight, color(180)); 
  drawBar(energyImage, player.energy, player.maxEnergy, x, y + spacing * 2, iconSize, barWidth, barHeight, color(0, 0, 255)); 
}

// ------------------------------------------

function drawCoolImage(x, y, size, choosenImage) {
  image(choosenImage, x, y, size, size);
}

function drawLobby() {
  image(bgImage, 0, 0, width, height);
}

// https://soul-knight.fandom.com/wiki/Knight
// Take characters from here
// https://ezgif.com/webp-to-gif/ezgif-3-d32a219e48.webp 
// convert here to .gif

// Linhk to join https://prod.liveshare.vsengsaas.visualstudio.com/join?00E4ADAA11E7DCE9480E1E4B502A36560F78



//https://static.wikia.nocookie.net/soul-knight/images/0/00/Knight_25_chaotic_strike.png/revision/latest?cb=20241125030851