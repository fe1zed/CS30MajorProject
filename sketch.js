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
  
      let offsetX = this.x + this.size / 2 + this.size / 4; 
      let offsetY = this.y + this.size / 2 + this.size / 4;
  
      let angle = atan2(mouseY - offsetY, mouseX - offsetX);
  
      push();
      translate(offsetX, offsetY); 
      rotate(angle); 
      imageMode(CENTER);
      image(this.weaponImage, 0, 0, weaponWidth, weaponHeight); 
      pop();
    } 
    else {
      let weaponHeight = this.size;
      let aspectRatio = weaponsDataJson["Weapons"][weaponName]["pixelWidth"] / weaponsDataJson["Weapons"][weaponName]["pixelHeight"];
      let weaponWidth = weaponHeight * aspectRatio; 

      let offsetX = this.MoveDirection === "right" ? weaponWidth : this.size - weaponWidth * 2; 
      image(this.weaponImage, this.x + offsetX, this.y, weaponWidth, weaponHeight); 
    }
  }
}

let charactersDataJson;
let weaponsDataJson;

let player = new Player(200, 200, 5, 100);
let charactersName = "DarkKnight";
let weaponName = "Jack";


function preload() {
  charactersDataJson = loadJSON(CHARACTERSPATH + '/CharactersData.json');  
  weaponsDataJson = loadJSON(WEAPONSPATH + '/WeaponsData.json');  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.image = loadImage(charactersDataJson[CHARACTERSPATH][charactersName]["image"]);
  player.speed = charactersDataJson[CHARACTERSPATH][charactersName]["speed"];
  player.size = charactersDataJson[CHARACTERSPATH][charactersName]["size"];

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


// https://soul-knight.fandom.com/wiki/Knight
// Take characters from here
// https://ezgif.com/webp-to-gif/ezgif-3-d32a219e48.webp 
// convert here to .gif

// Linhk to join https://prod.liveshare.vsengsaas.visualstudio.com/join?00E4ADAA11E7DCE9480E1E4B502A36560F78
