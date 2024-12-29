// CS30 Major Project
// Oleh Pletmintsev, Dmitrii Pletmintsev
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
    this.visitedRooms = [];
  }

  move() {
    let newX = this.x;
    let newY = this.y;

    if (keyIsDown(65)) { // Left
      newX -= this.speed;
    }
    if (keyIsDown(68)) { // Right
      newX += this.speed;
    }
    if (keyIsDown(87)) { // Up
      newY -= this.speed;
    }
    if (keyIsDown(83)) { // Down
      newY += this.speed;
    }
    
    let inTrapRoom = false;
    let currentRoom = null;
    
    // Check if the new position is inside any room
    for (let room of rooms) {
      if (room.isInside(newX, newY)) {
        currentRoom = room;
        break;
      }
    }

    for (let room of rooms) {
      if (room.isInside(this.x, this.y)) {
        currentRoom = room;
        if (room.isOpen && !room.visitedRoom) {
          inTrapRoom = true;
        }
        break;
      }
    }

    // If the player is in the trap room, we do not allow him to leave it
    if (inTrapRoom && currentRoom) {
      if (!currentRoom.isInside(newX, newY)) {
        return; // The player cannot leave the trap room
      }
    }
    
    // If the player enters an unknown room, assign its type and mark it as visited
    if (currentRoom && currentRoom.isOpen && !currentRoom.visitedRoom) {
      currentRoom.assignType(); // Assign type as soon as the player enters a room
      currentRoom.isOpen = true; // Ensure the room is marked as open
    }

    // Checking if the new position is inside any open room or active bridge
    let isInsideRoom = false;
    for (let room of rooms) {
      if (room.isOpen && room.isInside(newX, newY)) {
        isInsideRoom = true;
        break;
      }
    }

    // Check if the new position is inside any bridge
    let isOnBridge = false;
    for (let bridge of bridges) {
      if (bridge.isActive && bridge.isOnBridge(newX, newY)) {
        isOnBridge = true;
        break;
      }
    }

    // If the new position is inside a room or on a bridge, update the player's position
    if (isInsideRoom || isOnBridge) {
      this.x = newX;
      this.y = newY;
    }
  }

  display() {
    circle(this.x + offsetX, this.y + offsetY, this.size * 2); // Player
  }
}

class Room {
  constructor(x, y, size, type = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isOpen = false;
    this.visitedRoom = false;
    this.type = type;
  }

  // This function will be called when a player enters a room to assign its type
  assignType() {
    if (!this.type) {
      let availableTypes = [];
      // We add available room types if their limit is not exhausted
      if (roomCounts["fight"] < maxRoomsByType["fight"]) {
        availableTypes.push("fight");
        fightLevel();
      }
      if (roomCounts["shop"] < maxRoomsByType["shop"]) {
        availableTypes.push("shop");
        shopLevel();
      }
      if (roomCounts["bonus"] < maxRoomsByType["bonus"]) {
        availableTypes.push("bonus");
        bonusLevel();
      }
      if (roomCounts["statue"] < maxRoomsByType["statue"]) {
        availableTypes.push("statue");
        statueLevel();
      }
      
      // If only boss and portal are available, select them
      if (availableTypes.length === 0) {
        if (roomCounts["boss"] === 0) {
          this.type = "boss";
          roomCounts["boss"]++;
          bossLevel();
        } 
        else if (roomCounts["portal"] === 0) {
          this.type = "portal";
          roomCounts["portal"]++;
          portalLevel();  
        }
      } 
      else {
        // Randomly select one of the available types
        this.type = random(availableTypes);
        roomCounts[this.type]++;
      }

      if (this.type === "statue" || this.type === "shop" || this.type === "bonus") {
        // Make the room visited, if it's a statue
        this.visitedRoom = true;

        for (let bridge of bridges) {
          if (dist(this.x, this.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < this.size) {
            bridge.isActive = true;
  
            // Making adjacent rooms open
            for (let otherRoom of rooms) {
              if (dist(otherRoom.x, otherRoom.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < this.size) {
                otherRoom.isOpen = true;
              }
            }
          }
        }
      }
  
      // Displaying the room type in the console
      console.log(`Assigned room type: ${this.type}`);
    }
  }

  isInside(x, y) {
    return (    
      // If player is going to be fully located in room or bridge it is not able to move outside of them
      x >= this.x - this.size / 2 &&
      x <= this.x + this.size / 2 &&
      y >= this.y - this.size / 2 &&
      y <= this.y + this.size / 2
    );
  }

  display() {
    const typeColors = {
      main: "green",
      fight: "red",
      shop: "yellow",
      bonus: "orange",
      boss: "purple",
      portal: "blue",
      statue: "pink"
    };

    if (this.visitedRoom) {
      let baseColor = color(typeColors[this.type] || "white"); // Getting the base color
      let alpha = 75; // Alpha level
      fill(red(baseColor), green(baseColor), blue(baseColor), alpha); // Apply color with alpha
    } 
    else if (this.isOpen) {
      fill(typeColors[this.type] || "white"); // Color based on room type
    } 
    else {
      fill(100); // Grey for unopened rooms
    }
    rect(
      this.x - this.size / 2 + offsetX,
      this.y - this.size / 2 + offsetY,
      this.size,
      this.size
    ); // Room
  }  
}

class Bridge {
  constructor(x, y, xSize, ySize) {
    this.x = x;
    this.y = y;
    this.xSize = xSize;
    this.ySize = ySize;
    this.isActive = false;
  }

  isOnBridge(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.xSize &&
      y >= this.y &&
      y <= this.y + this.ySize
    );
  }

  display() {
    if (this.isActive) {
      fill(180);
      rect(this.x + offsetX, this.y + offsetY, this.xSize, this.ySize); // Bridge
    }
  }
}

let rooms = [];
let bridges = [];
let player;
let offsetX = 0;
let offsetY = 0;
let statueActivated = true;
let showShopUI = false;
let interactingRoom = null;
let chestActivated = true;

const roomCounts = {
  fight: 0,
  shop: 0,
  bonus: 0,
  boss: 0,
  portal: 0,
  main: 1,
  statue : 0,
};

const maxRoomsByType = {
  fight: 3,
  shop: 1,
  bonus: 1,
  boss: 1,
  portal: 1,
  statue : 1,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  // generateLevel(9, windowHeight>windowWidth? height/2 : width/2); // Generation of a level with what ever # of rooms you set here?
  generateLevel(9); // Generation of a level with what ever # of rooms you set here
  player = new Player(rooms[0].x, rooms[0].y, 10, rooms[0].size / 20);
  rooms[0].isOpen = true; // Central room becomes open
  rooms[0].visitedRoom = true;
  rooms[0].type = "main";
  activateInitialRooms(); // Making neighboring rooms connected
}

function draw() {
  background(220);

  // Drawing room
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].display();
  }

  // Drawing bridge
  for (let i = 0; i < bridges.length; i++) {
    bridges[i].display();
  }

  // Player
  player.display();
  player.move();

  statueLevel();
  shopLevel();
  bonusLevel();

  cameraFollow();
}

// function generateLevel(numRooms, sizeOfRooms) {
//   let roomSize = sizeOfRooms;
//   let bridgeSize = sizeOfRooms/2;
function generateLevel(numRooms) {
  let roomSize = 100;
  let bridgeSize = 50;
  let distance = roomSize + bridgeSize; // Distance between rooms

  let centerX = width / 2;
  let centerY = height / 2;
  rooms.push(new Room(centerX, centerY, roomSize, "main")); // Central room — main

  while (rooms.length < numRooms) {
    let direction = random(["up", "down", "left", "right"]);

    let baseRoom = random(rooms);
    let x = baseRoom.x;
    let y = baseRoom.y;

    if (direction === "up") {
      y -= distance;
    } 
    else if (direction === "down") {
      y += distance;
    } 
    else if (direction === "left") {
      x -= distance;
    } 
    else if (direction === "right") {
      x += distance;
    } 

    let roomExists = false;
    for (let room of rooms) {
      if (room.x === x && room.y === y) {
        roomExists = true;
        break;
      }
    }

    if (!roomExists) {
      rooms.push(new Room(x, y, roomSize));
    }
  } 

  // Bridge Generation
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      let roomA = rooms[i];
      let roomB = rooms[j];

      // Calculating distance between rooms
      if (dist(roomA.x, roomA.y, roomB.x, roomB.y) === distance) {
        // Adding a bridge between rooms
        if (roomA.x === roomB.x) {
          // Vertical bridge
          // Creating bridges between rooms if their distance matches the specified one (be not perpendicular to line between rooms)
          let bridgeY = min(roomA.y, roomB.y) + roomSize / 2;
          bridges.push(new Bridge(roomA.x - bridgeSize / 2, bridgeY, bridgeSize, distance - roomSize));
        } 
        else if (roomA.y === roomB.y) {
          // Horizontal bridge
          //Creating bridges between rooms if their distance matches the specified one (be not perpendicular to line between rooms)
          let bridgeX = min(roomA.x, roomB.x) + roomSize / 2;
          bridges.push(new Bridge(bridgeX, roomA.y - bridgeSize / 2, distance - roomSize, bridgeSize));
        }
      }
    }
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

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    for (let room of rooms) {
      if (room.isOpen && room.isInside(player.x, player.y)) {
        room.assignType(); // We assign a type upon entering the room
        room.visitedRoom = true;
        activateConnectedRoomsAndBridges(room);
        if (room.type === "portal") {
          location.reload();
        } 
        else {
          break;
        }
      }
    }
  }

  if (keyCode === 69) { // "E" for interaction
    for (let room of rooms) {
      if (room.type === "statue" && statueActivated) {
        if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
          console.log("Player interacted with the statue!");
          statueActivated = false;
          // Add functionality like increasing characteristics etc
        }
      }

      if (room.type === "shop" && !showShopUI) {
        if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
          console.log("Player interacted with the shop!");
        }
      }

      if (room.type === "bonus" && chestActivated) {
        if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
          console.log("Player interacted with the chest!");
          chestActivated = false;
          // Give items
        }
      }
    }
  }
}

function activateConnectedRoomsAndBridges(room) {
  for (let bridge of bridges) {
    if (dist(room.x, room.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < room.size) {
      bridge.isActive = true;
      for (let otherRoom of rooms) {
        if (dist(otherRoom.x, otherRoom.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < room.size) {
          otherRoom.isOpen = true;
        }
      }
    }
  }
}

function activateInitialRooms() {
  const centralRoom = rooms[0]; // Central room
  for (let bridge of bridges) {
    // If the bridge is connected to the central passage
    if (dist(centralRoom.x, centralRoom.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < centralRoom.size) {
      bridge.isActive = true; // Activating the bridge
      for (let room of rooms) {
        // If the room is connected to an activated bridge
        if (dist(room.x, room.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < centralRoom.size) {
          room.isOpen = true; // Making the room accessible
        }
      }
    }
  }
}

function cameraFollow() {  
  // lerp (start, stop, amt)
  offsetX = lerp(offsetX, width / 2 - player.x, 0.05);
  offsetY = lerp(offsetY, height / 2 - player.y, 0.05);
}

function fightLevel() {
  // Spawn enemies
}

function bonusLevel() {
  // Spawn square in the center of the room that represents chest
  // if player next to this square - 'press "E" to interct with chest'
  for (let room of rooms) {
    if (room.type === "bonus" && chestActivated) {
      // Draw a rectangle in the center of the room
      fill("grey"); // color
      rect(
        room.x - room.size / 10 + offsetX,
        room.y - room.size / 10 + offsetY,
        room.size / 5,
        room.size / 5
      );

      // Checking if a player is nearby to display a hint
      if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('Press "E" to interact with the chest', width / 2, height / 2 - 30);
      }
    }
  }
}

function shopLevel() {
  // Spawn square in the center of the room that represents trading post
  for (let room of rooms) {
    if (room.type === "shop") {
      fill("grey"); // color
      rect(
        room.x - room.size / 10 + offsetX,
        room.y - room.size / 10 + offsetY,
        room.size / 5,
        room.size / 5
      );

      // If the player is nearby, show a hint
      if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('Press "E" to interact with the shop', width / 2, height / 2 - 30);

        // If the "E" key is pressed, open the store interface
        if (keyIsDown(69)) { // "E" key
          showShopUI = true;
          interactingRoom = room;
        }
      }
    }
  }

  // If the store is open
  if (showShopUI && interactingRoom.type === "shop") {
    fill(200);
    rect(width / 2 - 200, height / 2 - 150, 400, 300); // Large store interface window
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Shop Interface", width / 2, height / 2 - 100);
    text("Buy items or exit", width / 2, height / 2);

    // If the player leaves the store or presses "ESC", close the interface
    if ((dist(player.x, player.y, interactingRoom.x, interactingRoom.y) >= interactingRoom.size / 3) || keyCode === 27) {
      showShopUI = false;
      interactingRoom = null;
    }
  }
}

function bossLevel() {
  // Spawn Boss
}

function portalLevel() {
  // Move player to the next level
}

function statueLevel() {
  // Spawn square in the center of the room that represents statue
  for (let room of rooms) {
    if (room.type === "statue" && statueActivated) {
      // Draw a rectangle in the center of the room
      fill("grey"); // color
      rect(
        room.x - room.size / 10 + offsetX,
        room.y - room.size / 10 + offsetY,
        room.size / 5,
        room.size / 5
      );

      // Checking if a player is nearby to display a hint
      if (dist(player.x, player.y, room.x, room.y) < room.size / 3) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('Press "E" to interact with the statue', width / 2, height / 2 - 30);
      }
    }
  }
}