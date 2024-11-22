// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


class Player {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = null;
    this.size = size;
  }

  move() {
    if (keyIsDown(65)) {
      this.x -= this.speed;
    }
  
    if (keyIsDown(68)) {
      this.x += this.speed;
    }
  
    if (keyIsDown(87)) {
      this.y -= this.speed;
    }
  
    if (keyIsDown(83)) {
      this.y += this.speed;
    }
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}

let charactersDataJson;

let player = new Player(200, 200, 5, 100);
let charactersName = "Priestess";

function preload() {
  charactersDataJson = loadJSON('Characters/CharactersData.json');  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player.image = loadImage(charactersDataJson["Characters"][charactersName]["image"]);
  player.speed = charactersDataJson["Characters"][charactersName]["speed"];
  player.size = charactersDataJson["Characters"][charactersName]["size"];
}

function draw() {
  background(220);
  player.move();
  player.display();
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
