/* eslint-disable indent */
const MAP_SIZE_HORIZONTAL = 9;
const MAP_SIZE_VERTICAL = 9;
const roomsAmount = 9;

let emptyMap = createEmpty2dArray(MAP_SIZE_HORIZONTAL, MAP_SIZE_VERTICAL);

let curentGameRoomX = Math.floor(MAP_SIZE_HORIZONTAL / 2);
let curentGameRoomY = Math.floor(MAP_SIZE_VERTICAL / 2);

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
                else { console.log(map[y][x - 1]); }
                
                if (y - 1 >= 0 && map[y - 1][x] !== 0) {
                    room.topBridge = 1;
                }              

                console.log(`Room at (${x}, ${y}):`, room);

                map[y][x] = room;
            }
        }
    }

    return map;
}

// Вызов функций в нужном порядке
let mapWithRooms = setUpPlaceForRooms(emptyMap);
let gameMap = fillMapWithDefaultData(mapWithRooms);


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
  }
  
  function drawRoomBg() {
    fill("gray");
    rect(100, 100, width - 200, height - 200);
    noFill();
  }