/* eslint-disable no-extra-parens */
/* eslint-disable indent */
/* eslint-disable curly */
/* eslint-disable brace-style */

let lastClickTime = 0;

/**
 * Draws a button on the screen.
 * 
 * @param {number} x - The x-coordinate of the button.
 * @param {number} y - The y-coordinate of the button.
 * @param {number} width - The width of the button.
 * @param {number} height - The height of the button.
 * @param {string} [textToDisplay="Play"] - The text displayed on the button. Defaults to "Play".
 * @param {color} color - Default color.
 * @param {color} colorHighlight - Color on highlight.
 * @param {color} textColor - Color of text.
 * @param {Function} onClick - Triggers passed function.
 * @param {boolean} [animate=true] - Use button animation.
 * @param {sound} [soundOnClick=clickSound] - The sound played on click.
 */
function drawButton(x, y, width, height, textToDisplay = "Play", color, colorHighlight, textColor=0, onClick, animate=true, soundOnClick=clickSound) {
    let xOffset = 20;
    let isHighlighted = mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;
    let timeBetweenClicks = 200; // 1 second
    let isAbleToClick = millis() > timeBetweenClicks + lastClickTime;

    // Button
    strokeWeight(2);
    fill(isHighlighted ? colorHighlight : color);
    rect(isHighlighted && animate? x + xOffset : x, y, width, height);

    // Button text
    textSize(textToDisplay.length < 2? 64: 30);
    fill(textColor);
    let textWidthValue = textWidth(textToDisplay);
    let textX = (isHighlighted && animate? x + xOffset : x) + (width / 2) - (textWidthValue / 2);

    let textHeight = textAscent() + textDescent();
    let textY = y + (height / 2) + (textHeight / 4) + 5;

    text(textToDisplay, textX, textY);
    noFill();

    // Handle button click
    if (isAbleToClick && isHighlighted && mouseIsPressed && typeof onClick === 'function') {
        onClick();
        playSound(soundOnClick);
        lastClickTime = millis();
    }
}

/**
 * Draws a bar on the screen.
 * 
 * @param {any} icon - The icon of bar
 * @param {number} value - The curent value of thing u want to display in the bar.
 * @param {number} maxValue - The max value of thing u want to display in the bar.
 * @param {number} x - The x-coordinate of the bar.
 * @param {number} y - The y-coordinate of the bar.
 * @param {number} iconSize - The size of icon.
 * @param {number} barWidth - The width of the bar.
 * @param {number} barHeight - The height of the bar.
 * @param {color} barColor - The color of the bar.
 * @param {string} type - The type of the bar.
 */
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
  
/**
 * Draws a coin window on the screen.
*/
function drawCoins() {
  let coinsBarX = width - 100;
  let coinsBarY = 70;
  let barWidth = 100;
  let barHeight = 30;
  
  fill("black");
  rect(coinsBarX, coinsBarY, barWidth, barHeight); 
  
  image(coinImage, coinsBarX + 5, coinsBarY + 2, 15, 25);
  textSize(32);
  fill("white");
  text(player.coins, coinsBarX + barHeight, coinsBarY + 27);
}
  
/**
 * Draws a skill charge bar on the screen.
*/
function drawSkillCharge(skillChargeImage, lastTimeUsed, cooldown, x, y, iconSize, barWidth, barHeight, r, g, b) {
  let currentTime = millis();
  let elapsedTime = currentTime - lastTimeUsed;
  let progress = player.usingUniqueAbility? 0: constrain(elapsedTime / cooldown, 0, 1);
  
  image(skillChargeImage, x, y, iconSize, iconSize);
  
  fill(0, 0, 0);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, barWidth, barHeight);
  
  fill(r, g, b, progress === 1? 255: 180);
  rect(x + iconSize + 10, y + iconSize / 2 - barHeight / 2, barWidth * progress, barHeight);
}
  
/**
 * Draws all UI charge bar on the screen.
*/
function drawHUD() {
  let x = 20;
  let y = 20;
  let iconSize = 20;
  let spacing = 30;
  let barWidth = 150;
  let barHeight = 20;
  
  drawBar(heartImage, player.health, player.maxHealth, x, y, iconSize, barWidth, barHeight, color(255, 0, 0), "h"); 
  drawBar(armorImage, player.armor, player.maxArmor, x, y + spacing, iconSize, barWidth, barHeight, color(180), "a"); 
  drawBar(energyImage, player.energy, player.maxEnergy, x, y + spacing * 2, iconSize, barWidth, barHeight, color(0, 0, 255), "m"); 
  
  drawSkillCharge(skillChargeImage, player.lastTimeUsedUA, player.timeBetweenUsingUA, x, y + spacing * 3, iconSize, barWidth, barHeight, 255, 165, 0); // Not showing remaining time
  drawCoins();

  drawButton(width - 100, 10, 100, 50, "Exit", "black", "red", "white", () => {scene = "Menu"; onGameExit(); }, false, cancelSound);
}

/** 
* @param {number} x - The x pos.
* @param {number} x - The y pos.
* @param {number} x - The size of image.
* @param {image} choosenImage - The image to show.
*/
function drawImage(x, y, size, choosenImage) {
  image(choosenImage, x, y, size, size);
}

function drawLobby() {
  image(bgImage, 0, 0, width, height);
}

function drawMenuCharacterStats() {
  // bg 
  push();
  translate(width / 2, height / 2);
  angleMode(DEGREES);
  rotate(-70);
  fill("black");
  rect(0 - width / 2, -100, 1920, 1080);

  angleMode(RADIANS);
  noFill();

  pop();
} 

/** 
* @param {number} x - The x pos.
* @param {number} x - The y pos.
* @param {Image} icon - The Icon to display.
* @param {number} iconSize - The image size.
* @param {string} textToDisplay - The text to display.
*/
function charterMenuDescription(x, y, icon, iconSize, textToDisplay) {
  let textOffset = 50;
  image(icon, x, y, iconSize, iconSize);

  fill("white");
  text(textToDisplay, x + textOffset, y + iconSize - 5, 300, 60);
  noFill();
}

function displayTextAboveGameObject(gameObject, boxWidth, boxHeight, textToDisplay, type) {
  let gameObjectDisplayedWidth;
  if (type === "Weapons") {
    gameObjectDisplayedWidth = gameObject.dropWidth / player.size * 30;
  }
  else if ("Chests" || "Rewards") {
    gameObjectDisplayedWidth = gameObject.width;
  }
  else { gameObjectDisplayedWidth = gameObject.width; }
  

  let offsetY = -50;
  fill("black");
  rect(gameObject.x - boxWidth / 2 + gameObjectDisplayedWidth / 2, gameObject.y + offsetY, boxWidth, boxHeight);
  fill("white");
  textSize(32);
  text(textToDisplay, gameObject.x - boxWidth / 2 + gameObjectDisplayedWidth / 2 + 2, gameObject.y - 23, boxWidth, boxHeight);
  noFill();
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
  localStorage.setItem("CharactersName", charactersName);
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
  localStorage.setItem("CharactersName", charactersName);
  console.log(charactersName, "choosed!");
}

function textUIAboveGameObject(gameObjArray, text, type) {
  for (let gameObject of gameObjArray) {
    if (gameObject.x > player.x && gameObject.x < player.x + player.size && gameObject.y > player.y && gameObject.y < player.y + player.size) {
      displayTextAboveGameObject(gameObject, 100, 30, text, type);
    }
  }
}
