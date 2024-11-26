// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CHARACTERSPATH = "Characters";
const WEAPONSPATH = "Weapons";

class Player {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = null;
    this.size = size;
    this.MoveDirection = "right";
    this.weaponImage = null;
  }

  move() {
    if (keyIsDown(65)) {
      this.x -= this.speed;
      this.MoveDirection = "left";
    }
  
    if (keyIsDown(68)) {
      this.x += this.speed;
      this.MoveDirection = "right";

    }
  
    if (keyIsDown(87)) {
      this.y -= this.speed;
    }
  
    if (keyIsDown(83)) {
      this.y += this.speed;
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
    if (weaponsDataJson["Weapons"][weaponName]["followCursor"]) {
      let weaponWidth = weaponsDataJson["Weapons"][weaponName]["pixelWidth"];  // 120
      let weaponHeight = weaponsDataJson["Weapons"][weaponName]["pixelHeight"]; // 20

      weaponWidth = weaponWidth / this.size * 30; 
      weaponHeight = weaponHeight / this.size * 30;

      let offsetX = 0;
      let offsetY = 0;
  
      if (this.MoveDirection === "right") {
        offsetX = this.x + this.size / 2 + this.size / 4;
        offsetY = this.y + this.size / 2 + this.size / 4;
      }
      else {
        offsetX = this.x + this.size / 4;
        offsetY = this.y + this.size / 2 + this.size / 4;
      }
  
      let angle = atan2(mouseY - offsetY, mouseX - offsetX);

      push();
      translate(offsetX, offsetY); 
      rotate(angle); 
      imageMode(CENTER);
      // Flip weapon so doesnt go upsidedown
      if (angle >= -1.5 && angle <= 1.5) {
        scale(1, 1);
      }
      else {
        scale(1, -1);
      }
  
      image(this.weaponImage, 0, 0, weaponWidth, weaponHeight); 
      pop();
    } 
    else {
      let weaponWidth = weaponsDataJson["Weapons"][weaponName]["pixelWidth"];  // 120
      let weaponHeight = weaponsDataJson["Weapons"][weaponName]["pixelHeight"]; // 20

      weaponWidth = weaponWidth / this.size * 30; 
      weaponHeight = weaponHeight / this.size * 30;

      let offsetX = this.MoveDirection === "right" ? weaponWidth : this.size - weaponWidth * 2; 

      // Shownig only <<Staff>> weapons along player height 
      if (weaponsDataJson["Weapons"][weaponName]["type"] === "Staff") {
        image(this.weaponImage, this.x + offsetX, this.y + weaponHeight / 2 - 10, weaponWidth, weaponHeight); 
      }
      else {
        image(this.weaponImage, this.x + offsetX, this.y + this.size / 2 + 10, weaponWidth, weaponHeight);
      }
    }
  }

  attack() {
    let weaponType = weaponsDataJson["Weapons"][weaponName]["type"];

    if (weaponType === "Gun") {
      console.log("Sending Bullet");
    }
    else if (weaponType === "ColdWeapon") {
      console.log("Throwing Cold Weapon");
    }
    else if (weaponType === "InHand" || weaponType === "Staff") {
      console.log("Magic cast");
    }
  }
}

// Data containers
let charactersDataJson;
let weaponsDataJson;

// Adjust <<charactersName>> and <<weaponName>> to see ur character
let player = new Player(200, 200, 5, 100);
let charactersName = "Priestess";
let weaponName = "default";

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
}

function draw() {
  background(220);
  player.move();
  player.display();
  player.displayWeapon();
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