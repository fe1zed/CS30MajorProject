// This scpirt manages all data with chest's drop, exept display and player interaction (sketch.js)
// To spawn chest use createChest(chestsPlaceholder, chestType);
//
// Path in values of <<chestsPlaceholder: Array>> (to manage chest behaviour (sketch.js)), <<chestType: string>> (to auto manage of chest's drop (chestDrop.js))
// There is 3 types of chests: Common, Gold, Boss



let margin = 100; // min distance away from border of spawning chests
let chestWidth = 50;
let chestHeight = 50;

let healthRewardAmount = 1;
let energyRewardAmount = 80;
let coinsRewardAmount = 10;

let potWidth = 14;
let potHeight = 23;


function createChest(chestsPlaceholder, chestType="Common") { // creates chest to display
    let chestName = "";

    switch (chestType) {
        case "Common": chestName = "WhiteChest"; break;
        case "Gold": chestName = "GoldChest"; break;
        case "Gold": chestName = "BossChest"; break;
        default: console.log("Wrong chest type on creation chest!");
    }

    chestsPlaceholder.push({
        x: Math.round(random(margin, width - margin)),
        y: Math.round(random(margin, height - margin)),
        image: loadImage(`Sprites/Chests/${chestName}.png`),
        width: chestWidth,
        height: chestHeight,
        chestType: chestType,
    });
}

function createReward(rewardPlaceholder, chestData) {

    switch (chestData.chestType) {
        case "Common": 
            let rewardType = random(["Health", "Energy", "Restoration", "Coins"]);
            let pathToImg = "";
        
            switch (rewardType) {
                case "Health": pathToImg = "Sprites/Pots/HealthPotL.png"; break;
                case "Energy": pathToImg = "Sprites/Pots/EnergyPotL.png"; break;
                case "Restoration": pathToImg = "Sprites/Pots/RestorationPotL.png"; break;
                case "Coins": pathToImg = "UI/Coin.png"; break;
                default: console.log("Wrong reward type on creation reward!");
            }
        
            rewardPlaceholder.push({
                x: chestData.x + chestData.width / 2 - potWidth / 2,
                y: chestData.y + chestData.height / 2 - potHeight / 2,
                image: loadImage(pathToImg),
                width: potWidth,
                height: potHeight,
                rewardType: rewardType,
            });
            break;

        case "Gold": 
            console.log("Giving gold reward!");
            // Drops weapon
            break;

        case "Boss":
            console.log("Giving boss reward!");
            // Grops boss weapon
            break;

        default: console.log("Wrong reward type on creation reward!"); break;
    }
}

function giveReward(rewardType) {
    console.log("Giving reward:", rewardType);

    switch (rewardType) {
        case "Health": player.healthPot(); break;
        case "Energy": player.energyPot(); break;
        case "Restoration": player.restorationPot(); break;
        case "Coins": player.coins += coinsRewardAmount; break;
        default: console.log("Wrong reward type on creation reward!");
    }
}