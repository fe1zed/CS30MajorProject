// This scpirt manages all data with chest's drop
// To give common reward invoke: giveReward();
// To give reward after defeating boss invoke: giveBossReward();

// get random spot on map
// display chest
// if player interact -> don't display
// give reward with animation

let margin = 100; // min distance away from spawning chests
let chestWidth = 50;
let chestHeight = 50;

function createChest(chestPlaceholder) { // creates chest to display
    chestPlaceholder.push({
        x: Math.round(random(margin, width - margin)),
        y: Math.round(random(margin, height - margin)),
        image: loadImage('Sprites/Chests/WhiteChest.png'),
        width: chestWidth,
        height: chestHeight,
    });
}

function createReward(rewardPlaceholder, chestData) {
    let rewardType = random(["Health", "Energy", "Restoration", "Coins"]);
    let pathToImg = "";

    if (rewardType === "Health")            { pathToImg = "Sprites/Pots/HealthPotL.png"; }
    else if (rewardType === "Energy")       { pathToImg = "Sprites/Pots/EnergyPotL.png"; }
    else if (rewardType === "Restoration")  { pathToImg = "Sprites/Pots/RestorationPotL.png"; }
    else if (rewardType === "Coins")        { pathToImg = "UI/Coin.png"; }
    else { console.log("Wrong reward type:", rewardType); }

    rewardPlaceholder.push({
        x: chestData.x + chestData.width / 2 - 7,
        y: chestData.y + chestData.height / 2 - 11.5,
        image: loadImage(pathToImg),
        width: 14,
        height: 23,
        rewardType: rewardType,
    });
}

function giveReward(rewardType) {
    console.log("Giving reward:", rewardType);
    if (rewardType === "Health")            { player.healthPot(); }
    else if (rewardType === "Energy")       { player.energyPot(); }
    else if (rewardType === "Restoration")  { player.restorationPot(); }
    else if (rewardType === "Coins")        { player.coins += 10; }
    else { console.log("Wrong reward type:", rewardType); }
}