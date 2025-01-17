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
let portalImage = null;

let logoImage = null;
let coinImage = null;

let closedLevelImage;
let bottomOpenBridgeImage;

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
let changeWeaponSound;
let swordSound;

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

  portalImage = loadImage("Sprites/Portal.png");

  clickSound = loadSound('Sounds/menu_click_08.ogg');
  cancelSound = loadSound('Sounds/menu_go_back_01.ogg');
  menuMusic = loadSound('Sounds/medieval-background-196571.mp3');
  gameMusic = loadSound('Sounds/medieval-adventure-270566.mp3');
  takeGunSound = loadSound('Sounds/takeGun.ogg');
  uniqueAbilitySound = loadSound('Sounds/uniqueAbility.mp3');
  changeWeaponSound = loadSound('Sounds/changeWeaponSound.mp3');

  closedLevelImage = loadImage('Sprites/GameBg/GameBgTextures/ClosedLevelImproved.png');
  bottomOpenBridgeImage = loadImage('Sprites/GameBg/GameBgTextures/BottomOpenBridge.png');


  gameTextFont = loadFont('Font/PixelatedEleganceRegular-ovyAA.ttf');

  charactersName = localStorage.getItem("CharactersName") !== null? localStorage.getItem("CharactersName"): "DarkKnight";
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameTextFont);

  characterImageToShowInMenu = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
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

  drawRoomBg();
  drawTopWalls();
  drawLeftWalls();
  drawRightWalls();
  drawBottomWalls();

  // drawImage(1000, 200, 256, logoImage);

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

  textUIAboveGameObject(gameMap[curentGameRoomY][curentGameRoomX].drop, `Take`, "Weapons"); // [${INTERACT_KEY}]
  textUIAboveGameObject(gameMap[curentGameRoomY][curentGameRoomX].chests, `Open`, "Chests"); // [${INTERACT_KEY}]
  textUIAboveGameObject(gameMap[curentGameRoomY][curentGameRoomX].rewards, `Take`, "Rewards"); // [${INTERACT_KEY}]

  drawPortal();

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

  drawMenuCharacterStats();

  drawButton(200, 300, 300, 60, "Play", "black", color(129, 176, 0), "white", () => { console.log("Play!"); scene = "Game"; onGameStart(); player.lastTimeUsedUA = millis(); }, true, clickSound);
  drawButton(200, 380, 300, 60, "Settings", "black", color(159, 164, 145), "white", () => { console.log("Settings!"); }, true, clickSound);
  drawButton(200, 460, 300, 60, "Help?", "black", color(207, 29, 1), "white", () => { console.log("Help?!"); }, true, cancelSound);

  drawButton(800, 300, 100, 100, "<", "white", "white", "black", () => { console.log("Change character to previous!"); prevCharacter(); }, false);
  drawButton(1200, 300, 100, 100, ">", "white", "white", "black", () => { console.log("Change character to next!"); nextCharacter(); }, false);

  let nameToDisplay = charactersName === "DarkKnight"? "Dark Knight": charactersName;
  drawButton(900, 100, 300, 50, nameToDisplay, "white", "white", "black", () => { console.log(nameToDisplay); }, false);
  drawImage(925, 175, 250, characterImageToShowInMenu);

  charterMenuDescription(900, 500, heartImage, 30, charactersDataJson[CHARACTERSPATH][charactersName]["health"]);
  charterMenuDescription(900, 550, armorImage, 30, charactersDataJson[CHARACTERSPATH][charactersName]["armor"]);
  charterMenuDescription(900, 600, energyImage, 30, charactersDataJson[CHARACTERSPATH][charactersName]["energy"]);
}

// ----- CODE -----

function createEnemy(enemyType, enemyName) {
  let enemyData = getEnemieDataFromJSONByTypeAndName(enemyType, enemyName);
  let className = enemyName.replace(/\s+/g, '');

  if (typeof window[className] === 'function') {
    let newEnemy = null;
    if (enemyType === "Boss") {
      newEnemy = new window[className](width / 2, height / 2, enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health); 
    }
    else {
      newEnemy = new window[className](random(200, width - 200), random(200, height - 200), enemyData.pixelWidth, enemyData.pixelHeight, enemyData.health); 
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

function loadPlayerWeapon() {
  if (!weaponsDataJson[WEAPONSPATH].hasOwnProperty(weaponName)) {
    weaponName = "default";
  }

  if (weaponName === "default") { // set to default weapon used by player if not assigned special
    weaponName = charactersDataJson[CHARACTERSPATH][charactersName]["enhanceStartingWeapon"];
  }

  player.laodPlayerWeapon();
}

function createDrop(_x, _y, dropName) {
  let dropData = weaponsDataJson[WEAPONSPATH][dropName];
  let dropImage = loadImage(dropData['image']);
  gameMap[curentGameRoomY][curentGameRoomX].drop.push({
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

// ----- DISPLAYING -----
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

function displayDrop() {
  if (gameMap[curentGameRoomY][curentGameRoomX].drop.length < 1) return;

  for (let dropItem of gameMap[curentGameRoomY][curentGameRoomX].drop) { 
    image(dropItem.dropImage, dropItem.x, dropItem.y, dropItem.dropWidth / player.size * 30, dropItem.dropHeight / player.size * 30);
  }
}

function displayChests() {
  for (let chest of gameMap[curentGameRoomY][curentGameRoomX].chests) {
    image(chest.image, chest.x, chest.y, chest.width, chest.height);
  }
}

function displayRewards() {
  for (let reward of gameMap[curentGameRoomY][curentGameRoomX].rewards) {
    image(reward.image, reward.x, reward.y, reward.width, reward.height);
  }
}

// ----- EVENTS -----
function onGameExit() {
  bullets = [];
  enemies = [];
  drop = [];
  chests = [];
  rewards = [];
  inventory = []; 
  weaponName = "default";
  gameMap = null;

  level = 1;
  stage = 1;
}

function onGameStart() {
  generateLevel();
  player = new window[charactersName](200, 200, 5, 100);
  player.setPlayerValues();
  player.loadAdditionalData();
  player.lastTimeUsedUA = startChargeUAFrom;
  loadPlayerWeapon();
  inventory.push(weaponName);
  setTimeout(() => { bullets = []; }, 100); // clear 1st bullet
}