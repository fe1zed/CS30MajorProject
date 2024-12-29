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
let charactersName = "DarkKnight"; 
let weaponName = "default";
let weaponIndex = 0;
let inventory = []; // "Wooden Cross", "Jack", "Bad Pistol", "The Code", "Blood Blade", "Dormant Bubble Machine", "Boxing Gloves"
let player = new window[charactersName](200, 200, 5, 100);

let bgImage = null;
let heartImage = null;
let armorImage = null;
let energyImage = null;

let logoImage = null;
let coinImage = null;

let bullets = [];
let enemies = [];
let drop = [];

function preload() {
  charactersDataJson = loadJSON(CHARACTERSPATH + '/CharactersData.json');  
  weaponsDataJson = loadJSON(WEAPONSPATH + '/WeaponsData.json');  
  enemiesDataJson = loadJSON(ENEMIESPATH + '/EnemiesData.json');

  bgImage = loadImage('UI/BgNEW2.png');
  heartImage = loadImage('UI/Heart.png');
  armorImage = loadImage('UI/Armor.png');
  energyImage = loadImage('UI/Energy.png');
  coinImage = loadImage('UI/Coin.png');

  logoImage = loadImage('UI/logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.setPlayerValues();
  player.loadAdditionalData();

  loadPlayerWeapon();
  
  // createEnemy("Boss", "Varkolyn Leader"); // 

  inventory.push(weaponName);

  createDrop(300, 300, "Blood Blade");
  createDrop(500, 500, "Jack");
}

function draw() {
  background(53, 80, 96);
  drawCoolImage(1000, 200, 256, logoImage);

  if (charactersName === "Witch" || charactersName === "Assasin") {
    for (let spike of player.spikes) {
      for (let enemy of enemies) {
        if (!enemy.alive) { 
          continue;
        }
        if (spike.x < enemy.x + enemy.pixelWidth && spike.x + spike.pixelWidth > enemy.x && spike.y < enemy.y + enemy.pixelHeight && spike.y + spike.pixelHeight > enemy.y) {
          enemy.takeDamage(spike.damage); 
          player.spikes.splice(player.spikes.indexOf(spike), 1);
          break;
        }
      }
    }
  }

  if (charactersName === "Alchemist") {
    // check for collision with poisoned puddle

    if (player.zoneBuffActive) {
      player.displayZoneBuff();

      let elapsedTime = millis() - player.damagedLastTime;
    
      for (let enemy of enemies) {
        if (enemy.x + enemy.pixelWidth / 2 > player.zoneBuffPosition.x && enemy.x + enemy.pixelWidth / 2 < player.zoneBuffPosition.x + player.zoneBuffSize &&
            enemy.y + enemy.pixelHeight / 2 > player.zoneBuffPosition.y && enemy.y + enemy.pixelHeight / 2 < player.zoneBuffPosition.y + player.zoneBuffSize ) {
          if (elapsedTime >= player.timeBetweenDamage) {
            enemy.takeDamage(player.zoneDamage);
            player.damagedLastTime = millis();
            console.log("Damaging from gas");
          }
        }
      }
    }
  }

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

  // ----- DROP -----
  displayDrop();

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
    let newEnemy = null;
    if (enemyType === "Boss") {
      newEnemy = new window[className](400, 100, enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health); 
    }
    else {
      newEnemy = new window[className](random(100, width - 100), random(100, height - 100), enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health); 
    }
    
    newEnemy.image = loadImage(enemyData.image);
    if (enemyType === "Boss") {
      newEnemy.deadImage = loadImage(enemyData.deadImage);
      newEnemy.attackImage = loadImage(enemyData.attackImage);
      newEnemy.moveImage = loadImage(enemyData.moveImage);
    }

    newEnemy.loadAdditionalData();
    newEnemy.loadPlayerData(player); 
    
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
  if (key === "q" || key === "Q" || key === "й" || key === "Й") {
    if (!player.usingUniqueAbility)  {
      player.usingUniqueAbility = true;
    }
    else {
      console.warn("Already using unique ability");
    }
  }
}

function keyTyped() {
  if (key === '1') {
    weaponName = "Blood Blade";
    loadPlayerWeapon();
  }
  if (key === '2') {
    weaponName = "default";
    loadPlayerWeapon();
  }

  if (key === "e" || key === "E" || key === "у" || key === "У") {
    // take laying weapon
    for (let dropItem of drop) {
      if (dropItem.x > player.x && dropItem.x < player.x + player.size && dropItem.y > player.y && dropItem.y < player.y + player.size) {
        let weaponToTake = dropItem.name;
        inventory.push(weaponToTake);
        drop.splice(drop.indexOf(dropItem), 1);
        console.log("Weapon taken", weaponToTake);
        break;
      }
    }
  }
  if (key === "x" || key === "X") {
    dropPlayerItem();
  }
}

function loadPlayerWeapon() {
  if (!weaponsDataJson[WEAPONSPATH].hasOwnProperty(weaponName)) {
    weaponName = "default";
  }

  if (weaponName === "default") { // set to default weapon used by player if not assigned special
    weaponName = charactersDataJson[CHARACTERSPATH][charactersName]["enhanceStartingWeapon"];
  }

  player.laodPlayerWeapon();
}

function mouseWheel(event) {
  if (inventory.length < 2) return;

  if (event.delta > 0) {
    weaponIndex--;
    if (weaponIndex < 0) {
      weaponIndex = inventory.length - 1;
    }
    weaponName = inventory[weaponIndex];
    loadPlayerWeapon();
  } 
  else if (event.delta < 0) {
    weaponIndex++;
    if (weaponIndex > inventory.length - 1) {
      weaponIndex = 0;
    }
    weaponName = inventory[weaponIndex];
    loadPlayerWeapon();
  }
}

function displayDrop() {
  if (drop.length < 1) return;

  for (let dropItem of drop) { 
    image(dropItem.dropImage, dropItem.x, dropItem.y, dropItem.dropWidth / player.size * 30, dropItem.dropHeight / player.size * 30);
  }
}

function createDrop(_x, _y, dropName) {
  let dropData = weaponsDataJson[WEAPONSPATH][dropName];
  let dropImage = loadImage(dropData['image']);
  drop.push({
    x: _x,
    y: _y,
    dropImage: dropImage,
    dropWidth: dropData["pixelWidth"],
    dropHeight: dropData["pixelHeight"],
    name: dropName,
  });
}

function dropPlayerItem() {
  if (inventory.length - 1 === 0) {
    console.log("Unable to drop. U have last weapon!");
    return;
  }

  createDrop(player.x + player.size / 2, player.y + player.size / 2, inventory[weaponIndex]);
  inventory.splice(weaponIndex, 1);
  // console.log("Inventory:", inventory);
  weaponIndex = random(0, inventory.length - 1 === 1? 0: inventory.length - 1);
  // console.log("Weapon Index:", weaponIndex);
  weaponName = inventory[weaponIndex];
  // console.log("Choosed weapon:", weaponName);
  loadPlayerWeapon();
}

// ---------------- UI Render ---------------- 
function drawBar(icon, value, maxValue, x, y, iconSize, barWidth, barHeight, barColor, type) {
  image(icon, x, y, iconSize, iconSize); 
  let currentWidth = barWidth * (value / maxValue);
  let takenWidth;

  if (type === "h") takenWidth = player.takenHealthWidth;
  else if (type === "a") takenWidth = player.takenArmorWidth;
  else if (type === "m") takenWidth = player.takenManaWidth;


  if (takenWidth > currentWidth) {
    takenWidth -= (takenWidth - currentWidth) / 10;
  }

  if (type === "h") player.takenHealthWidth = takenWidth;
  else if (type === "a") player.takenArmorWidth = takenWidth;
  else if (type === "m") player.takenManaWidth = takenWidth;

  fill(0, 0, 0);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, barWidth, barHeight);

  fill(255);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, takenWidth, barHeight);

  fill(barColor);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, currentWidth, barHeight);
  
  noFill();
}

function drawCoins() {
  let coinsBarX = width - 100;
  let coinsBarY = 15;
  let barWidth = 100;
  let barHeight = 30;

  fill("black");
  rect(coinsBarX, coinsBarY, barWidth, barHeight); 

  image(coinImage, coinsBarX + 5, coinsBarY + 2, 15, 25);
  textSize(32);
  fill("white");
  text(player.coins, coinsBarX + barHeight, coinsBarY + 27);
}

function drawHUD() {
  let x = 20;
  let y = 20;
  let iconSize = 30;
  let spacing = 50;
  let barWidth = 150;
  let barHeight = 20;

  drawBar(heartImage, player.health, player.maxHealth, x, y, iconSize, barWidth, barHeight, color(255, 0, 0), "h"); 
  drawBar(armorImage, player.armor, player.maxArmor, x, y + spacing, iconSize, barWidth, barHeight, color(180), "a"); 
  drawBar(energyImage, player.energy, player.maxEnergy, x, y + spacing * 2, iconSize, barWidth, barHeight, color(0, 0, 255), "m"); 

  drawCoins();
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
// convert here to .gif .png



// 2nd floor
// Knight:
// https://soul-knight.fandom.com/wiki/Knight_Kingdom#Wizard

