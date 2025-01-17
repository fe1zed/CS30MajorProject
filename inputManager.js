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
    createEnemy("Boss", "Varkolyn Leader");               
  }               
  if (key === '2') {                
    createChest(gameMap[curentGameRoomY][curentGameRoomX].chests, "Common");               
  }               
  if (key === '3') {                
    createChest(gameMap[curentGameRoomY][curentGameRoomX].chests, "Gold");                
  }                             
  // <---------------------------------------------               

  if (key.toLowerCase() === INTERACT_KEY || key === "у" || key === "У") {
    // take laying weapon
    for (let dropItem of gameMap[curentGameRoomY][curentGameRoomX].drop) {
      if (dropItem.x > player.x && dropItem.x < player.x + player.size && dropItem.y > player.y && dropItem.y < player.y + player.size) {
        if (inventory.length < inventoryMaxSize) {
          let weaponToTake = dropItem.name;
          inventory.push(weaponToTake);
          gameMap[curentGameRoomY][curentGameRoomX].drop.splice(gameMap[curentGameRoomY][curentGameRoomX].drop.indexOf(dropItem), 1);
          console.log("Weapon taken", weaponToTake);
          playSound(takeGunSound);
          return;
        }
        else console.log("Unable to take. Overflow amount of items. Drop something to take other item!");
      }
    }

    for (let chest of gameMap[curentGameRoomY][curentGameRoomX].chests) {
      if (chest.x > player.x && chest.x < player.x + player.size && chest.y > player.y && chest.y < player.y + player.size) {
        gameMap[curentGameRoomY][curentGameRoomX].chests.splice(gameMap[curentGameRoomY][curentGameRoomX].chests.indexOf(chest), 1);
        createReward(gameMap[curentGameRoomY][curentGameRoomX].rewards, chest);
        return;
      }
    }

    for (let reward of gameMap[curentGameRoomY][curentGameRoomX].rewards) {
      if (reward.x > player.x && reward.x < player.x + player.size && reward.y > player.y && reward.y < player.y + player.size) {
        giveReward(reward.rewardType);
        gameMap[curentGameRoomY][curentGameRoomX].rewards.splice(gameMap[curentGameRoomY][curentGameRoomX].rewards.indexOf(reward), 1);
        return;
      }
    }

    if (player.x > portalX && player.x + player.size < portalX + portalWidth && player.y > portalY && player.y + player.size < portalY + portalHeight && 
      gameMap[curentGameRoomY][curentGameRoomX].roomType === "portal"
    ) {
      level++;
      if (level % 6 === 0) { stage += 1; level = 1; console.log("New Stage", stage); } 
      console.log("New Level", level);

      onGameStart();
    }
  }
  if (key.toLowerCase() === DROP_ITEM_KEY) {
    dropPlayerItem();
    playSound(cancelSound);
  }
}

function mouseWheel(event) {
  if (scene === "Menu") return;

  if (inventory.length < 2) return;

  playSound(changeWeaponSound, true);

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