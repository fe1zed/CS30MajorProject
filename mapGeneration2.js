/* eslint-disable indent */
const MAP_SIZE_HORIZONTAL = 9;
const MAP_SIZE_VERTICAL = 9;
const roomsAmount = 9;


let gameMap;

let curentGameRoomX = Math.floor(MAP_SIZE_HORIZONTAL / 2);
let curentGameRoomY = Math.floor(MAP_SIZE_VERTICAL / 2);

let roomCounts = {
  fight: 0,
  shop: 0,
  bonus: 0,
  boss: 0,
  portal: 0,
  main: 1,
  statue : 0,
};

const maxRoomsByType = {
  fight: 5, // 4
  shop: 0, // 1
  bonus: 1, // 1
  boss: 1, // 1
  portal: 1, // 1
  statue : 0, // 0
};

let leftRoomsAmount = 8;

let level = 1;
let stage = 1;

let portalWidth = 200;
let portalHeight = 250;
let portalX;
let portalY;

function createEmpty2dArray(cols, rows) {
    let emptyGrid = [];
    for (let y = 0; y < rows; y++) {
        emptyGrid.push([]);
        for (let x = 0; x < cols; x++) {
            emptyGrid[y].push(0);
        }
    }
    emptyGrid[Math.floor(MAP_SIZE_HORIZONTAL / 2)][Math.floor(MAP_SIZE_VERTICAL / 2)] = 2;

    return emptyGrid;
}

function setUpPlaceForRooms(map) {
    let currentX = Math.floor(MAP_SIZE_HORIZONTAL / 2);
    let currentY = Math.floor(MAP_SIZE_VERTICAL / 2);
    let roomsLeft = roomsAmount - 1;

    while (roomsLeft > 0) {
        let directions = [
            { dx: 0, dy: -1 }, // вверх
            { dx: 0, dy: 1 },  // вниз
            { dx: -1, dy: 0 }, // влево
            { dx: 1, dy: 0 }   // вправо
        ];

        directions = directions.sort(() => Math.random() - 0.5);

        let placed = false;

        for (let { dx, dy } of directions) {
            let newX = currentX + dx;
            let newY = currentY + dy;

            if (newX >= 0 && newX < MAP_SIZE_HORIZONTAL && newY >= 0 && newY < MAP_SIZE_VERTICAL) {
                if (map[newY][newX] === 0) {
                    map[newY][newX] = 2;
                    currentX = newX;
                    currentY = newY;
                    roomsLeft--;
                    placed = true;
                    break;
                }
            }
        }

        if (!placed) {
            continue;
        }
    }

    return map;
}

function fillMapWithDefaultData(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 2) {
                let room = {
                    rightBridge: 0,
                    leftBridge: 0,
                    topBridge: 0,
                    bottomBridge: 0,
                    drop: [],
                    chests: [],
                    rewards: [],
                    roomType: "fight",
                    visited: false,
                    currentAmountOfEnemiesOnLevel: 0,
                };

                if (x + 1 < map[y].length && map[y][x + 1] !== 0) {
                    room.rightBridge = 1;
                }

                if (y + 1 < map.length && map[y + 1][x] !== 0) {
                    room.bottomBridge = 1;
                }

                if (x - 1 >= 0 && map[y][x - 1] !== 0) {
                    room.leftBridge = 1;
                }
                //else { console.log(map[y][x - 1]); }
                
                if (y - 1 >= 0 && map[y - 1][x] !== 0) {
                    room.topBridge = 1;
                }              

                // console.log(`Room at (${x}, ${y}):`, room);

                map[y][x] = room;
            }
        }
    }

    map[Math.floor(MAP_SIZE_HORIZONTAL / 2)][Math.floor(MAP_SIZE_VERTICAL / 2)].roomType = "main";
    map[Math.floor(MAP_SIZE_HORIZONTAL / 2)][Math.floor(MAP_SIZE_VERTICAL / 2)].visited = true;

    return map;
}

function onRoomEnter() {
    if (gameMap[curentGameRoomY][curentGameRoomX].visited) { return; }
    let availableTypes = [];

    if (roomCounts["fight"] < maxRoomsByType["fight"]) {
      availableTypes.push("fight");
    }
    if (roomCounts["shop"] < maxRoomsByType["shop"]) {
      availableTypes.push("shop");
    }
    if (roomCounts["bonus"] < maxRoomsByType["bonus"]) {
      availableTypes.push("bonus");
    }
    if (roomCounts["statue"] < maxRoomsByType["statue"]) {
      availableTypes.push("statue");
    }

    if (leftRoomsAmount === 2) {
        availableTypes.push(level === 5? "boss": "fight");
    }
    if (leftRoomsAmount === 1) {
        availableTypes.push("portal");
    }

    let newRoomType = random(availableTypes);
    gameMap[curentGameRoomY][curentGameRoomX].roomType = newRoomType;
    gameMap[curentGameRoomY][curentGameRoomX].visited = true;

    roomCounts[newRoomType] += 1;
    leftRoomsAmount -= 1;

    console.log("You have entered room with type:", newRoomType);

    switch (newRoomType) {
        case "fight": setUpFightRoom(); break;
        case "bonus": setUpBonusRoom(); break;
        case "shop": setUpShopRoom(); break;
        case "statue": setUpStatueRoom(); break;
    }
}

function setUpFightRoom() {
    console.log("Setting up Fight Room!");
    let emeniesAmountPerRoom = 5;
    
    if (stage === 1) {
        let possibleEnemies = ["Boar", "Bazinga", "BazingaFire", "BazingaIce", "BazingaToxic", "BazingaTrap"];

        for (let i = 0; i < emeniesAmountPerRoom; i++) {
            createEnemy("Common", random(possibleEnemies));
        } 
    }
    else if (stage === 2) {
        let possibleEnemies = ["Elite Knight Enemy", "Knight Enemy", "Slime", "Wizard"];

        for (let i = 0; i < emeniesAmountPerRoom; i++) {
            createEnemy("Common", random(possibleEnemies));
        }
    }

    gameMap[curentGameRoomY][curentGameRoomX].currentAmountOfEnemiesOnLevel = emeniesAmountPerRoom;
}

function setUpShopRoom() {
    console.log("Setting up Shop Room!");
}

function setUpBonusRoom() {
    console.log("Setting up Bonus Room!");
    createChest(gameMap[curentGameRoomY][curentGameRoomX].chests, "Gold");
}

function setUpStatueRoom() {
    console.log("Setting up Statue Room!");
}

function drawTopWalls(margin=100) {
  let openWidth = 150;
  if (gameMap[curentGameRoomY][curentGameRoomX].topBridge !== 1) { line(margin, margin, width - margin, margin); return; }
  line(margin, margin, width / 2 - openWidth, margin); 
  line(width / 2 - openWidth, margin, width / 2 - openWidth, 0);
  line(width / 2 + openWidth, margin, width - margin, margin);
  line(width / 2 + openWidth, margin, width / 2 + openWidth, 0);
}

function drawLeftWalls(margin=100) {
  let openWidth = 150;
  if (gameMap[curentGameRoomY][curentGameRoomX].leftBridge !== 1) { line(margin, margin, margin, height - margin); return; }
  line(margin, margin, margin, height / 2 - openWidth);
  line(0, height / 2 - openWidth, margin, height / 2 - openWidth);
  line(margin, height / 2 + openWidth, margin, height - margin);
  line(0, height / 2 + openWidth, margin, height / 2 + openWidth);
}

function drawRightWalls(margin=100) {
  let openWidth = 150;
  if (gameMap[curentGameRoomY][curentGameRoomX].rightBridge !== 1) { line(width - margin, margin, width - margin, height - margin); return; }
  line(width - margin, margin, width - margin, height / 2 - openWidth);
  line(width - margin, height / 2 - openWidth, width, height / 2 - openWidth);
  line(width - margin, height / 2 + openWidth, width - margin, height - margin);
  line(width - margin, height / 2 + openWidth, width, height / 2 + openWidth);
}

function drawBottomWalls(margin=100) {
  let openWidth = 150;
  if (gameMap[curentGameRoomY][curentGameRoomX].bottomBridge !== 1) { line(margin, height - margin, width - margin, height - margin); return; }
    line(margin, height - margin, width / 2 - openWidth, height - margin);
    line(width / 2 - openWidth, height - margin, width / 2 - openWidth, height);
    line(width / 2 + openWidth, height - margin, width - margin, height - margin);
    line(width / 2 + openWidth, height - margin, width / 2 + openWidth, height);
    //image(bottomOpenBridgeImage, width / 2 - openWidth, height - 200, openWidth * 2, 150);
}

function drawRoomBg() {
  fill("gray");
  rect(100, 100, width - 200, height - 200);
  noFill();
  image(closedLevelImage, 65, 100, width - 125, height - 140);
}

function drawPortal() {
    if (gameMap[curentGameRoomY][curentGameRoomX].roomType === "portal") {
        image(portalImage, portalX, portalY, portalWidth, portalHeight);

        if (player.x > portalX && player.x + player.size < portalX + portalWidth && player.y > portalY && player.y + player.size < portalY + portalHeight) {
            let offsetY = -50;
            fill("black");
            rect(portalX - 130 / 2 + portalWidth / 2, portalY + offsetY, 130, 30);
            fill("white");
            textSize(32);
            text("Enter", portalX - 130 / 2 + portalWidth / 2 + 2, portalY - 23, 130, 30);
            noFill();
        }
    }
}

function generateLevel() {
    leftRoomsAmount = 8;
    
    roomCounts = {
        fight: 0,
        shop: 0,
        bonus: 0,
        boss: 0,
        portal: 0,
        main: 1,
        statue : 0,
      };

    curentGameRoomX = Math.floor(MAP_SIZE_HORIZONTAL / 2);
    curentGameRoomY = Math.floor(MAP_SIZE_VERTICAL / 2);
    
    let emptyMap = createEmpty2dArray(MAP_SIZE_HORIZONTAL, MAP_SIZE_VERTICAL);
    let mapWithRooms = setUpPlaceForRooms(emptyMap);
    gameMap = fillMapWithDefaultData(mapWithRooms);

    portalX = width / 2 - portalWidth / 2;
    portalY = height / 2 - portalHeight / 2;
}