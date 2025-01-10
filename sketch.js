// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

/* eslint-disable curly */
/* eslint-disable brace-style */


const CHARACTERSPATH = "Characters";
const WEAPONSPATH = "Weapons";
const ENEMIESPATH = "Enemies";

const KEYS = { LEFT: 65, RIGHT: 68, UP: 87, DOWN: 83 };
const BULLET_DEFAULT_SIZE = 10;
const BULLET_SPEED_SCALE = 30;
const WEAPON_SIZE_SCALE = 30;
const INTERACT_KEY = "e";
const UNIQUE_ABILITY_KEY = "q";
const DROP_ITEM_KEY = "x";

// Data containers
let charactersDataJson;
let weaponsDataJson;
let enemiesDataJson;

// Adjust <<charactersName>> and <<weaponName>> to see ur character
let charactersName = "DarkKnight"; 
let charactersList = ["DarkKnight", "Priestess", "Rogue", "Witch", "Assasin", "Alchemist", "Berserk"];
let weaponName = "default";  //
let weaponIndex = 0;
let inventory = []; // "Wooden Cross", "Jack", "Bad Pistol", "The Code", "Blood Blade", "Dormant Bubble Machine", "Boxing Gloves"
let inventoryMaxSize = 2;
let player;
let startChargeUAFrom = -Infinity; // made for not allowing to charge UA in menu

let bgImage = null;
let heartImage = null;
let armorImage = null;
let energyImage = null;
let skillChargeImage = null;
let menuBg = null;

let logoImage = null;
let coinImage = null;

let bullets = [];
let enemies = [];
let drop = [];
let chests = [];
let rewards = [];

let scene = "Menu";
let characterImageToShowInMenu = null;

// Sounds
let clickSound;
let cancelSound;
let menuMusic;
let gameMusic;
let takeGunSound;
let uniqueAbilitySound;

// Font
let gameTextFont;


function preload() {
  charactersDataJson = loadJSON(CHARACTERSPATH + '/CharactersData.json');  
  weaponsDataJson = loadJSON(WEAPONSPATH + '/WeaponsData.json');  
  enemiesDataJson = loadJSON(ENEMIESPATH + '/EnemiesData.json');

  bgImage = loadImage('UI/BgNEW2.png');
  heartImage = loadImage('UI/Heart1.png');
  armorImage = loadImage('UI/Armor.png');
  energyImage = loadImage('UI/Energy1.png');
  coinImage = loadImage('UI/Coin.png');
  skillChargeImage = loadImage('UI/SkillCharge.png');

  logoImage = loadImage('UI/logo.png');
  menuBg = loadImage('UI/MenuBg5.jpg');

  clickSound = loadSound('Sounds/menu_click_08.ogg');
  cancelSound = loadSound('Sounds/menu_go_back_01.ogg');
  menuMusic = loadSound('Sounds/medieval-background-196571.mp3');
  gameMusic = loadSound('Sounds/medieval-adventure-270566.mp3');
  takeGunSound = loadSound('Sounds/takeGun.ogg');
  uniqueAbilitySound = loadSound('Sounds/uniqueAbility.mp3');

  gameTextFont = loadFont('Font/PixelatedEleganceRegular-ovyAA.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameTextFont);

  characterImageToShowInMenu = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);

  // createEnemy("Boss", "Varkolyn Leader"); // 
  createDrop(300, 300, "Blood Blade");
  createDrop(500, 500, "Jack");
  createDrop(300, 450, "Wooden Cross");
}

function draw() {
  if (scene === "Menu") {
    drawMenu();
    playSound(menuMusic);
    stopSound(gameMusic);
  }
  else if (scene === "Game") {
    drawGame();
    playSound(gameMusic);
    stopSound(menuMusic);
  }
}

function drawGame() {
  background(53, 80, 96);
  drawImage(1000, 200, 256, logoImage);

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
  displayChests();
  displayDrop();
  displayRewards();

  // ----- PLAYER -----
  player.render();

  // ----- AMMO -----
  if (player.weaponType === "Gun" || player.weaponType === "Staff") {
    displayBullets(); 
  }
  else if (player.weaponType === "ColdWeapon") {
    if (player.weaponPropelling) {
      displayBullets();
    }
  }

  // ----- UI -----
  drawHUD();
}

function drawMenu() {
  image(menuBg, 0, 0, width, height);
  //background(220);

  drawMenuCharacterStats();

  drawButton(200, 300, 300, 60, "Play", /*color(152, 207, 1)*/ "black", color(129, 176, 0), "white", () => { console.log("Play!"); scene = "Game"; onGameStart(); player.lastTimeUsedUA = millis(); }, true, clickSound);
  drawButton(200, 380, 300, 60, "Settings", /*color(198, 204, 180)*/ "black", color(159, 164, 145), "white", () => { console.log("Settings!"); }, true, clickSound);
  drawButton(200, 460, 300, 60, "Help?", /* color(255, 37, 3)*/ "black", color(207, 29, 1), "white", () => { console.log("Help?!"); }, true, cancelSound);

  drawButton(800, 300, 100, 100, "<", "white", "white", "black", () => { console.log("Change character to previous!"); prevCharacter(); }, false);
  drawButton(1200, 300, 100, 100, ">", "white", "white", "black", () => { console.log("Change character to next!"); nextCharacter(); }, false);

  let nameToDisplay = charactersName === "DarkKnight"? "Dark Knight": charactersName;
  drawButton(900, 100, 300, 50, nameToDisplay, "white", "white", "black", () => { console.log(nameToDisplay); }, false);
  drawImage(925, 175, 250, characterImageToShowInMenu);
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
      newEnemy = new window[className](width / 2, height / 2, enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health); 
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
  if (scene === "Menu") return;

  player.attack();
}

function keyPressed() {
  if (scene === "Menu") return;

  if (key.toLowerCase() === UNIQUE_ABILITY_KEY || key === "й" || key === "Й") {
    if (!player.usingUniqueAbility)  {
      if (player.lastTimeUsedUA + player.timeBetweenUsingUA > millis()) { return; }
      player.usingUniqueAbility = true;
      playSound(uniqueAbilitySound);
    }
    else {
      console.warn("Already using unique ability");
    }
  }
}

function keyTyped() {
  if (scene === "Menu") return;

  // TEST KEYS DELETE ON BUILD ------------------->               
  if (key === '1') {                
    weaponName = "Blood Blade";               
    loadPlayerWeapon();               
  }               
  if (key === '2') {                
    weaponName = "default";               
    loadPlayerWeapon();               
  }               
  if (key === '3') {                
    createChest(chests, "Gold");                
  }                 
  if (key === '4') {                
    playSound(clickSound);                
  }               
  // <---------------------------------------------               

  if (key.toLowerCase() === INTERACT_KEY || key === "у" || key === "У") {
    // take laying weapon
    for (let dropItem of drop) {
      if (dropItem.x > player.x && dropItem.x < player.x + player.size && dropItem.y > player.y && dropItem.y < player.y + player.size) {
        if (inventory.length < inventoryMaxSize) {
          let weaponToTake = dropItem.name;
          inventory.push(weaponToTake);
          drop.splice(drop.indexOf(dropItem), 1);
          console.log("Weapon taken", weaponToTake);
          playSound(takeGunSound);
          return;
        }
        else console.log("Unable to take. Overflow amount of items. Drop something to take other item!");
      }
    }

    for (let chest of chests) {
      if (chest.x > player.x && chest.x < player.x + player.size && chest.y > player.y && chest.y < player.y + player.size) {
        chests.splice(chests.indexOf(chest), 1);
        createReward(rewards, chest);
        return;
      }
    }

    for (let reward of rewards) {
      if (reward.x > player.x && reward.x < player.x + player.size && reward.y > player.y && reward.y < player.y + player.size) {
        giveReward(reward.rewardType);
        rewards.splice(rewards.indexOf(reward), 1);
        return;
      }
    }
  }
  if (key.toLowerCase() === DROP_ITEM_KEY) {
    dropPlayerItem();
    playSound(cancelSound);
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
  if (scene === "Menu") return;

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
  weaponIndex = random(0, inventory.length - 1 === 1? 0: inventory.length - 1);
  weaponName = inventory[weaponIndex];
  loadPlayerWeapon();
}

function displayChests() {
  for (let chest of chests) {
    image(chest.image, chest.x, chest.y, chest.width, chest.height);
  }
}

function displayRewards() {
  for (let reward of rewards) {
    image(reward.image, reward.x, reward.y, reward.width, reward.height);
  }
}

function onGameExit() {
  bullets = [];
  enemies = [];
  drop = [];
  chests = [];
  rewards = [];
  inventory = [];
  weaponName = "default";
}

function onGameStart() {
  player = new window[charactersName](200, 200, 5, 100);
  player.setPlayerValues();
  player.loadAdditionalData();
  player.lastTimeUsedUA = startChargeUAFrom;
  loadPlayerWeapon();
  inventory.push(weaponName);
}

function prevCharacter() {
  let currentCharacterIndex = charactersList.indexOf(charactersName);

  if (currentCharacterIndex - 1 < 0) { // set to last character
    charactersName = charactersList[charactersList.length - 1];
  }
  else {
    charactersName = charactersList[currentCharacterIndex - 1];
  }

  characterImageToShowInMenu = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
  console.log(charactersName, "choosed!");
}

function nextCharacter() {
  let currentCharacterIndex = charactersList.indexOf(charactersName);

  if (currentCharacterIndex + 1 > charactersList.length - 1) { // set to last character
    charactersName = charactersList[0];
  }
  else {
    charactersName = charactersList[currentCharacterIndex + 1];
  }

  characterImageToShowInMenu = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
  console.log(charactersName, "choosed!");
}

// https://soul-knight.fandom.com/wiki/Knight
// Take characters from here
// https://ezgif.com/webp-to-gif/ezgif-3-d32a219e48.webp 
// convert here to .gif .png

// 2nd floor
// Knight:
// https://soul-knight.fandom.com/wiki/Knight_Kingdom#Wizard