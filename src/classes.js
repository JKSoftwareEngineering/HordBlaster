//Read: what was originally just the class data has slowly evolved into virtually all game logic and is best navigated by the regions

const imageList = 
{
    player: "./images/game/image.png",
    walker: "./images/game/image2.png",
    runner: "./images/game/image2.png",
    brute: "./images/game/image2.png",
    bullet:"./images/game/bullet1.png",
    floor:"./images/game/floor1.png",
    health100: "./images/game/health100.png",
    health75: "./images/game/health75.png",
    health50: "./images/game/health50.png",
    health25: "./images/game/health25.png",
    gameUIBase: "./images/ui/topUI.png",
    healthBarEmpty: "./images/ui/playerhpempty.png",
    healthBarFull: "./images/ui/playerhpfull.png",
};
const keyBinding = 
{
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
    pause: "KeyP",
}
//#region Base Classes
class Item
{
    //Indexes 
    //1 = bullet
    //2 = player
    //3 = heavy armor
    //4 = mid armor
    //5 = light armor
    //6 = pistol
    //7 = rifle
    //8 = shotgun
    //9 = walker
    //10 = runner
    //11 = brute
    constructor(nameIn = "Item", indexIn = 0)
    {
        // 0 is not indexed
        this.index = indexIn;
        this.name = nameIn;
    }
}
class Weapon extends Item
{
    constructor(nameIn = "Weapon", indexIn = 0, damageIn = 0, ammoCurIn = 0, ammoMaxIn = 0, costIn = 0)
    {
        super(nameIn, indexIn);
        this.damage = damageIn;
        this.ammoCur = ammoCurIn;
        this.ammoMax = ammoMaxIn;
        this.cost = costIn;
    }
}
class Entity extends Item
{
    constructor(nameIn = "Entity", indexIn = 0, imageIn = "No Image Found", healthIn = 100, speedIn = 1, xIn = 0, yIn = 0, angleIn = 0)
    {
        super(nameIn, indexIn);
        this.health = healthIn;
        this.healthMax = healthIn; // everything always spawns with full health
        this.alive = true; // if it spawns its alive
        this.speed = speedIn;
        this.x = xIn;
        this.y = yIn;
        this.angle = angleIn;
        this.centerX = 0;
        this.centerY = 0;
        this.image = new Image(0,0);
        this.image.src = imageIn;
        this.imageWidth = 50;
        this.imageHeight = 50;
        this.armor = 0;
    }
    recalculateCenter()
    {
        this.centerX = this.x + this.imageWidth / 2; 
        this.centerY = this.y + this.imageHeight / 2;
    }
}
class Enemy extends Entity
{
    constructor(nameIn = "Enemy", indexIn = 0, imageIn = "No Image Found", healthIn = 100, speedIn = 1, xIn = 0, yIn = 0, angleIn = 0, damageIn = 0, targetIn = undefined)
    {
        super(nameIn, indexIn, imageIn, healthIn, speedIn, xIn, yIn, angleIn);
        this.damage = damageIn;
        this.target = targetIn;
        this.health100 = new Image(0,0);
        this.health75 = new Image(0,0);
        this.health50 = new Image(0,0);
        this.health25 = new Image(0,0);
    }
    rotate(ctx)
    {
        if(this.target)
        {
            this.recalculateCenter();
            this.target.recalculateCenter();
            this.angle = Math.atan2(this.target.centerY - this.centerY, this.target.centerX - this.centerX) + (Math.PI/2);
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.angle);
            ctx.translate(-this.centerX, -this.centerY);
            ctx.drawImage(this.image, this.x, this.y);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    move()
    {
        this.x = this.x + this.speed * Math.sin(this.angle);
        this.y = this.y + -this.speed * Math.cos(this.angle);
    }
    takeDamage(damageTaken)
    {
        let max = 100;
        max = max - this.armor;
        damageTaken = damageTaken * max;
        this.health -= damageTaken;
        if(this.health <= 0)
        {
            this.health = 0;
            this.alive = false;
        }
    }
}
class Button
{
    // button designed with the html button and unity button combination as insperation
    constructor()
    {
        this.name = "";
        this.x = 0;
        this.y = 0;

        this.trigger = false;

        // only one state active at a time
        this.hover = false;
        this.click = false;
        this.active = true; // active will be determined by maxout stats

        this.imageMain = new Image(0,0);
        this.imageClick = new Image(0,0);
        this.imageHover = new Image(0,0);
        this.imageDisable = new Image(0,0);
        this.imageMain.src = "./images/ui/buttonMain.png";
        this.imageClick.src = "./images/ui/buttonClick.png";
        this.imageDisable.src = ""; // not implimented yet
        this.imageHover.src = "./images/ui/buttonHover.png",
        this.imageWidth = 200;
        this.imageHeight = 50;
        this.buttonText = "";
        this.boundKey = "";
    }
    manageButtonImage(ctx, mouse, mouseDown, mouseUp)
    {
        if(this.trigger && mouseUp)
        {
            //start scene events here
            if(this.name == "easy game")
            {
                this.name = "advance to easy";
            }
            else if(this.name == "medium game")
            {
                this.name = "advance to medium";
            }
            else if(this.name == "hard game")
            {
                this.name = "advance to hard";
            }
            else if(this.name == "exit game")
            {
                this.name = "advance to exit";
            }
            //pause csene events here
            if(this.name == "pistol")
            {
                this.name = "active display pistol";
            }
            if(this.name == "rifle")
            {
                this.name = "active display rifle";
            }
            if(this.name == "shotgun")
            {
                this.name = "active display shotgun";
            }
            if(this.name == "armor")
            {
                this.name = "active display armor";
            }
            if(this.name == "speed")
            {
                this.name = "active display speed";
            }
            if(this.name == "health")
            {
                this.name = "active display health";
            }
            if(this.name == "back")
            {
                this.name = "unpause";
            }
            if(this.name == "exit")
            {
                this.name = "exit game";
            }
            if(this.name == "equip")
            {
                this.name = "equip weapon";
            }
            if(this.name == "upgrade")
            {
                this.name = "upgrade this";
            }
        }
        if(this.checkMouseOver(mouse))
        {
            if(!mouseDown)
            {
                this.hover = true;
            }
            else
            {
                this.hover = false;
                this.click = true;
            }
       }
        // if we are not over a button
        else
        {
            this.click = false;
            this.hover = false;
        }
        // if not clicking draw main button
        if(!this.click)
        {
            ctx.drawImage(this.imageMain, this.x ,this.y, this.imageWidth, this.imageHeight)
            //ctx.drawImage(this.imageMain, this.x ,this.y);
            this.trigger = false;
        }
        // if clicking draw the clicked button
        if(this.click)
        {
            ctx.drawImage(this.imageClick, this.x ,this.y, this.imageWidth, this.imageHeight);
            this.trigger = true;
        }
        // if not clicking and hovering draw the main button and hoverbutton
        if(this.hover)
        {
            ctx.drawImage(this.imageHover, this.x - this.imageWidth / 8, this.y - this.imageWidth / 8, this.imageWidth + this.imageWidth * .25, this.imageHeight + this.imageHeight);
            ctx.drawImage(this.imageMain, this.x ,this.y, this.imageWidth, this.imageHeight);
            this.trigger = false;
        }
        ctx.save();
        ctx.font = "22pt 'Press Start 2P', Audiowide";
        ctx.fillStyle = "red";
        ctx.fillText(this.buttonText, this.x + this.imageWidth * .1 - this.buttonText.length, this.y + this.imageHeight * .75);
        ctx.restore();
        ctx.save();
        ctx.font = "22pt 'Press Start 2P', Audiowide";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeText(this.buttonText, this.x + this.imageWidth * .1 - this.buttonText.length, this.y + this.imageHeight * .75);
        ctx.restore();
    }
    // note: need a way for no mouse to play as well plobably number key binding
    checkMouseOver(mouse)
    {
        let over = false;
        if(mouse.x <= this.x + this.imageWidth && mouse.x >= this.x)// + this.imageWidth)
        {
            if(mouse.y >= this.y && mouse.y <= this.y + this.imageHeight)
            {
                over = true;
            }
        }
        return over;
    }
}
//#endregion
export class GameManager
{
    constructor(screenWidth, screenHeight, mouse)
    {
        // scene active 
        // 0 = start ui
        // 1 = game ui
        // 2 = pause ui
        this.saveData = "jk9927-P2";
        this.pauseControl = false;
        this.sceneActive = 0;
        this.start = new UIStart();
        this.game = new UIGame(screenWidth, screenHeight, mouse);
        this.pause = new UIPause();
        this.dificulty = 1;
    }
    manageUI(dt, ctx, mouse, mouseDown, mouseUp, screenWidth, screenHeight, keysIn)
    {
        // start
        if(this.sceneActive == 0)
        {
            // active elements
            this.start.active = true;
            this.game.active = false;
            this.start.setupScene(ctx, screenWidth, screenHeight);
            this.start.easyButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp)
            this.start.mediumButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp)
            this.start.hardButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp)
            this.start.exitButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp)

            this.start.easyButton.buttonText = "Easy";
            this.start.mediumButton.buttonText = "Medium";
            this.start.hardButton.buttonText = "Hard";
            this.start.exitButton.buttonText = "Exit";
            
            if(this.start.easyButton.name == "advance to easy")
            {
                this.start.easyButton.name = "easy game";
                this.sceneActive = 1;
                this.dificulty = 1;
            }
            else if(this.start.mediumButton.name == "advance to medium")
            {
                this.start.mediumButton.name = "medium game";
                this.sceneActive = 1;
                this.dificulty = 2;
            }
            else if(this.start.hardButton.name == "advance to hard")
            {
                this.start.hardButton.name = "hard game";
                this.sceneActive = 1;
                this.dificulty = 3;
            }
            else if(this.start.exitButton.name == "advance to exit")
            {
                this.start.exitButton.name = "exit game";
                //no need to save data at the home
                window.close();
            }
            // inactive elements
        }
        // game
        else if(this.sceneActive == 1)
        {
            this.start.active = false;
            this.game.active = true;
            // switching scene should pause 
            this.game.setupScene(dt, ctx, keysIn, mouseDown, mouseUp, screenWidth, screenHeight, this.dificulty);
            // game over
            if(this.game.world.player.health <= 0)
            {
                this.sceneActive = 3;
            }
            // upper UI
            ctx.save();
            ctx.font = "22pt 'Press Start 2P', Audiowide";
            ctx.fillStyle = "white";
            ctx.fillText("Kill Count: " + this.game.world.player.killCount, screenWidth/2 - 100, 50);
            ctx.restore();
            if(this.game.world.player.weaponSelected == 0)
            {
                ctx.save();
                ctx.font = "22pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "white";
                ctx.fillText("Weapon Selected: Pistol", screenWidth - screenWidth/3.5, 50);
                ctx.restore();
            }
            else if(this.game.world.player.weaponSelected == 1)
            {
                ctx.save();
                ctx.font = "22pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "white";
                ctx.fillText("Weapon Selected: Rifle", screenWidth - screenWidth/3.5, 50);
                ctx.restore();
            }
            else
            {
                ctx.save();
                ctx.font = "22pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "white";
                ctx.fillText("Weapon Selected: Shotgun", screenWidth - screenWidth/3.5, 50);
                ctx.restore();
            }
            
            this.game.healthBarFullOffset = this.game.world.player.health / this.game.world.player.healthMax;
            if(!this.pauseControl)
            {
                for(let i = 0; i < keysIn.length; i++)
                {
                    if(keysIn[i] ==  keyBinding.pause)
                    {
                        // still true... for some reason you are still holding pause
                        this.pauseControl = false;
                    }
                    else
                    {
                        this.pauseControl = true;
                    }
                }
            }
            else
            {
                for(let i = 0; i < keysIn.length; i++)
                {
                    if(keysIn[i] ==  keyBinding.pause)
                    {
                        this.sceneActive = 2;
                        this.pauseControl = true;
                    }
                }
            }
        }
        // pause
        else if(this.sceneActive == 2)
        {
            // need a key up event to tell if pause has been released
            this.start.active = false;
            this.game.active = false;
            this.pause.setupScene(ctx, screenWidth, screenHeight,);

            this.pause.pistolButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.rifleButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.shotgunButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.defenceButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.speedButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.vitalityButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.returnButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.exitButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);

            ctx.save();
            ctx.font = "22pt 'Press Start 2P', Audiowide";
            ctx.fillStyle = "white";
            ctx.fillText("Kill Count: " + this.game.world.player.killCount, screenWidth - screenWidth/4, 50);
            ctx.restore();

            if(this.pause.pistolButton.name == "active display pistol")
            {
                this.pause.title = "Pistol";
                this.pause.description = "Basic firearm, this is a semiautomatic weapon it is the cheapest to upgrade and will take a while to upgrade but if you keep at it the pistol is on par with any other weapon.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 0;
            }
            if(this.pause.rifleButton.name == "active display rifle")
            {
                this.pause.title = "Rifle";
                this.pause.description = "Rapid fire is the name of the game, as the hords barrel down at you this weapon gives you crowd control like no other but sacrifices damage.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 1;
            }
            if(this.pause.shotgunButton.name == "active display shotgun")
            {
                this.pause.title = "Shotgun";
                this.pause.description = "As the battle rages around you its time to lay down the law with the highest starting damage, one round at a time.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 2;
            }
            if(this.pause.defenceButton.name == "active display armor")
            {
                this.pause.title = "Armor";
                this.pause.description = "The best way to stay alive is to put armor between you and the thing that wants to kill you.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 3;
            }
            if(this.pause.vitalityButton.name == "active display health")
            {
                this.pause.title = "Health";
                this.pause.description = "Blood sweat and tears... well mainly blood, your blood, if you cant keep it inside you then you need to make more.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 4;
            }
            if(this.pause.speedButton.name == "active display speed")
            {
                this.pause.title = "Speed";
                this.pause.description = "Sting like a butterfly and move like a bee... or somthing like that, who needs philosophy when you move like lightning.";
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.pause.elementDisplayed = 5;
            }
            if(this.pause.returnButton.name == "unpause")
            {
                this.pause.pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                this.sceneActive = 1;
                this.pauseControl = false;
            }
            if(this.pause.exitButton.name == "exit game")
            {
                this.pause. pistolButton.name = "pistol";
                this.pause.rifleButton.name = "rifle";
                this.pause.shotgunButton.name = "shotgun";
                this.pause.defenceButton.name = "armor";
                this.pause.speedButton.name = "speed";
                this.pause.vitalityButton.name = "health";
                this.pause.returnButton.name = "back";
                this.pause.exitButton.name = "exit";
                window.close();
            }

            if(this.pause.upgradeButton.name == "upgrade this")
            {
                this.pause.upgradeButton.name = "upgrade";
                this.pause.equipButton.name = "equip";
                if(this.pause.elementDisplayed == 0)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.pistolCostBase * this.game.world.player.pistolLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.pistolCostBase * this.game.world.player.pistolLevelCost);
                        this.game.world.player.pistolLevelCost++;
                        this.game.world.player.pistol.damage+=2;
                    }
                }
                if(this.pause.elementDisplayed == 1)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.rifleCostBase * this.game.world.player.rifleLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.rifleCostBase * this.game.world.player.rifleLevelCost);
                        this.game.world.player.rifleLevelCost++;
                        this.game.world.player.rifle.damage+=2;
                    }
                }
                if(this.pause.elementDisplayed == 2)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.shotgunCostBase * this.game.world.player.shotgunLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.shotgunCostBase * this.game.world.player.shotgunLevelCost);
                        this.game.world.player.shotgunLevelCost++;
                        this.game.world.player.shotgun.damage+=2;
                    }
                }

                if(this.pause.elementDisplayed == 3)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.armorCostBase * this.game.world.player.armorLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.armorCostBase * this.game.world.player.armorLevelCost);
                        this.game.world.player.armorLevelCost++;
                        this.game.world.player.armor += 1;
                    }
                }
                if(this.pause.elementDisplayed == 4)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.healthCostBase * this.game.world.player.healthLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.healthCostBase * this.game.world.player.healthLevelCost);
                        this.game.world.player.health = this.game.world.player.healthMax;
                    }
                }
                if(this.pause.elementDisplayed == 5)
                {
                    if(this.game.world.player.killCount >= (this.game.world.player.speedCostBase * this.game.world.player.speedLevelCost))
                    {
                        this.game.world.player.killCount -= (this.game.world.player.speedCostBase * this.game.world.player.speedLevelCost);
                        this.game.world.player.speedLevelCost++;
                        this.game.world.player.speed+=1;   
                    }
                }
            }
            if(this.pause.equipButton.name == "equip weapon")
            {
                this.pause.upgradeButton.name = "upgrade";
                this.pause.equipButton.name = "equip";
                this.game.world.player.weaponSelected = this.pause.elementDisplayed;
            }

            if(this.pause.elementDisplayed == 0)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "Equip";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Damage: " + this.game.world.player.pistol.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Damage: " + this.game.world.player.pistol.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.pistolCostBase * this.game.world.player.pistolLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.pistolCostBase * this.game.world.player.pistolLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();

                if(this.game.world.player.killCount >= (this.game.world.player.pistolCostBase * this.game.world.player.pistolLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }
            if(this.pause.elementDisplayed == 1)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "Equip";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Damage: " + this.game.world.player.rifle.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Damage: " + this.game.world.player.rifle.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.rifleCostBase * this.game.world.player.rifleLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.rifleCostBase * this.game.world.player.rifleLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                
                if(this.game.world.player.killCount >= (this.game.world.player.rifleCostBase * this.game.world.player.rifleLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }
            if(this.pause.elementDisplayed == 2)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "Equip";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Damage: " + this.game.world.player.shotgun.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Damage: " + this.game.world.player.shotgun.damage, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.shotgunCostBase * this.game.world.player.shotgunLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.shotgunCostBase * this.game.world.player.shotgunLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();

                if(this.game.world.player.killCount >= (this.game.world.player.shotgunCostBase * this.game.world.player.shotgunLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }
            if(this.pause.elementDisplayed == 3)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Armor: " + this.game.world.player.armor, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Armor: " + this.game.world.player.armor, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.armorCostBase * this.game.world.player.armorLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.armorCostBase * this.game.world.player.armorLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();

                if(this.game.world.player.killCount >= (this.game.world.player.armorCostBase * this.game.world.player.armorLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }
            if(this.pause.elementDisplayed == 4)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Health: " + Math.round(this.game.world.player.health), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Health: " + Math.round(this.game.world.player.health), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.healthCostBase * this.game.world.player.healthLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.healthCostBase * this.game.world.player.healthLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();

                if(this.game.world.player.killCount >= (this.game.world.player.healthCostBase * this.game.world.player.healthLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }
            if(this.pause.elementDisplayed == 5)
            {
                this.pause.upgradeButton.buttonText = "Upgrade";
                this.pause.equipButton.buttonText = "";

                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Speed: " + this.game.world.player.speed, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Speed: " + this.game.world.player.speed, screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                this.pause.linePoint += .2;
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText("Upgrade Cost: " + (this.game.world.player.speedCostBase * this.game.world.player.speedLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText("Upgrade Cost: " + (this.game.world.player.speedCostBase * this.game.world.player.speedLevelCost), screenWidth/16, (screenHeight/3.75) * this.pause.linePoint);
                ctx.restore();

                if(this.game.world.player.killCount >= (this.game.world.player.speedCostBase * this.game.world.player.speedLevelCost))
                {
                    this.pause.upgradeButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
                }
                this.pause.equipButton.manageButtonImage(ctx, mouse, mouseDown, mouseUp);
            }

            this.pause.pistolButton.buttonText = "Pistol";
            this.pause.rifleButton.buttonText = "Rifle";
            this.pause.shotgunButton.buttonText = "Shotgun";
            this.pause.defenceButton.buttonText = "Armor";
            this.pause.speedButton.buttonText = "Speed";
            this.pause.vitalityButton.buttonText = "Health";
            this.pause.returnButton.buttonText = "Back";
            this.pause.exitButton.buttonText = "Exit";

            if(this.pauseControl)
            {
                for(let i = 0; i < keysIn.length; i++)
                {
                    if(keysIn[i] ==  keyBinding.pause)
                    {
                        // still true... if for some reason you are still holding pause
                        this.pauseControl = true;
                    }
                    else
                    {
                        this.pauseControl = false;
                    }
                }
            }
            else
            {
                for(let i = 0; i < keysIn.length; i++)
                {
                    if(keysIn[i] ==  keyBinding.pause)
                    {
                        this.sceneActive = 1;
                        this.pauseControl = false;
                    }
                }
            }
        } 
        else
        {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, screenWidth, screenHeight);
            ctx.save();
            ctx.font = "125pt 'Press Start 2P', Audiowide";
            ctx.fillStyle = "red";
            ctx.fillText("Game Over", 250, 200);
            ctx.restore();
            ctx.save();
            ctx.font = "125pt 'Press Start 2P', Audiowide";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeText("Game Over", 250, 200);
            ctx.restore();
            ctx.save();
        }
    }
}
class UIPause
{
    // the pause screen this is where the player manages their weapons and armor
    constructor()
    {
        this.active = false; // is the ui active
        this.backgroundImage = new Image(0,0);
        this.backgroundImage.src = "./images/ui/pauseMain.png";
        this.pistolButton = new Button();// player pistol stats
        this.rifleButton = new Button();// player rifle stats
        this.shotgunButton = new Button();// player shotgun stats
        this.defenceButton = new Button();// player armor
        this.speedButton = new Button(); // player speed
        this.vitalityButton = new Button(); // player amount of health
        this.upgradeDamageButton = new Button(); // selected damage increase
        this.upgradeRateOfFireButton = new Button(); // selected rate of fire increase
        this.returnButton = new Button();// return to the game
        this.exitButton = new Button();// exit program... this will close the window / will probably save too
        this.title = "";// selection title
        this.description = "";// selection description

        this.upgradeButton = new Button(); // upgrade action 
        this.equipButton = new Button(); // equip weapons
        this.elementDisplayed = -1;
        this.linePoint = 1;
    }
    setupScene(ctx, screenWidth, screenHeight,)
    {
        ctx.drawImage(this.backgroundImage, 0, 0, screenWidth, screenHeight); 
        this.pistolButton.x = screenWidth - screenWidth / 4;
        this.rifleButton.x =  screenWidth - screenWidth / 4;
        this.shotgunButton.x =  screenWidth - screenWidth / 4;
        this.defenceButton.x =  screenWidth - screenWidth / 4;
        this.speedButton.x =  screenWidth - screenWidth / 4;
        this.vitalityButton.x =  screenWidth - screenWidth / 4;
        this.returnButton.x =  screenWidth - screenWidth / 4;
        this.exitButton.x =  screenWidth - screenWidth / 4;
        // 8 buttons
        this.pistolButton.y = 0 + screenHeight / 9;
        this.rifleButton.y = 0 + (screenHeight / 9) * 2;
        this.shotgunButton.y = 0 + (screenHeight / 9) * 3;
        this.defenceButton.y = 0 + (screenHeight / 9) * 4;
        this.speedButton.y = 0 + (screenHeight / 9) * 5;
        this.vitalityButton.y = 0 + (screenHeight / 9) * 6;
        this.returnButton.y = 0 + (screenHeight / 9) * 7;
        this.exitButton.y = 0 + (screenHeight / 9) * 8;
        
        this.upgradeButton.x = screenWidth/16;
        this.equipButton.x = screenWidth/4.75;
        this.upgradeButton.y = screenHeight - screenHeight * .15;
        this.equipButton.y = screenHeight - screenHeight * .15;
        this.upgradeButton.name = "upgrade";
        this.equipButton.name = "equip";
        this.upgradeButton.buttonText = "";
        this.equipButton.buttonText = "";

        this.pistolButton.name = "pistol";
        this.rifleButton.name = "rifle";
        this.shotgunButton.name = "shotgun";
        this.defenceButton.name = "armor";
        this.speedButton.name = "speed";
        this.vitalityButton.name = "health";
        this.returnButton.name = "back";
        this.exitButton.name = "exit";

        ctx.save();
        ctx.font = "35pt 'Press Start 2P', Audiowide";
        ctx.fillStyle = "red";
        ctx.fillText(this.title, screenWidth/16, screenHeight/7);
        ctx.restore();
        ctx.save();
        ctx.font = "35pt 'Press Start 2P', Audiowide";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeText(this.title, screenWidth/16, screenHeight/7);
        ctx.restore();

        let words = this.description.split(" ");
        let lineOut = "";
        let charWidthMax = 25;
        let charCount = 0;
        this.linePoint = 1;
        for(let i = 0; i < words.length; i++)
        {
            charCount += words[i].length + 1;
            if(charCount < charWidthMax)
            {
                lineOut = lineOut + words[i] + " ";
            }
            else
            {
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.fillStyle = "red";
                ctx.fillText(lineOut, screenWidth/16, (screenHeight/3.75) * this.linePoint);
                ctx.restore();
                ctx.save();
                ctx.font = "20pt 'Press Start 2P', Audiowide";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeText(lineOut, screenWidth/16, (screenHeight/3.75) * this.linePoint);
                ctx.restore();

                lineOut = words[i] + " ";
                charCount = words[i].length + 1;
                this.linePoint += .2;
            }
        }
        // get anything left over
        if(lineOut.length != 0)
        {
            ctx.save();
            ctx.font = "20pt 'Press Start 2P', Audiowide";
            ctx.fillStyle = "red";
            ctx.fillText(lineOut, screenWidth/16, (screenHeight/3.75) * this.linePoint);
            ctx.restore();
            ctx.save();
            ctx.font = "20pt 'Press Start 2P', Audiowide";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeText(lineOut, screenWidth/16, (screenHeight/3.75) * this.linePoint);
            ctx.restore();
            lineOut = " ";
            charCount = 0;
            this.linePoint += .4;
        }
        
    }
}
class UIGame
{
    // the main game screen this is the topdown gameplay view
    constructor(screenWidth, screenHeight, mouse)
    {
        this.active = true;
        this.backgroundImage = new Image(0,0);
        this.world = new World(screenWidth, screenHeight, mouse);
        this.backgroundImage.src = imageList.floor;
        this.upperUI = new Image(0,0);
        this.upperUI.src = imageList.gameUIBase;
        this.healthBarEmpty = new Image(0,0);
        this.healthBarEmpty.src = imageList.healthBarEmpty;
        this.healthBarFull = new Image(0,0);
        this.healthBarFull.src = imageList.healthBarFull;
        this.healthBarFullOffset = 0;
    }
    setupScene(dt, ctx, keysIn, mouseDown, mouseUp, screenWidth, screenHeight, dificulty)
    {
        // draw floor
        ctx.drawImage(this.backgroundImage, 0, 0, screenWidth, screenHeight);
        // create the wave
        this.world.manageWaves(dificulty);
        // add a bullet to the scene
        this.world.attack(dt, mouseDown, mouseUp);
        // add enemys to the scene
        this.world.manageEnemys(dt, ctx);
        // add bullets to the scene
        this.world.manageBullets(dt, ctx);
        // manage player control
        this.world.player.move(dt, keysIn);
        this.world.player.rotate(ctx);
        //upper UI
        ctx.drawImage(this.healthBarEmpty, 0, 0, screenWidth, screenHeight);
        ctx.drawImage(this.healthBarFull, 0, 0, screenWidth * this.healthBarFullOffset, screenHeight);
        ctx.drawImage(this.upperUI, 0, 0, screenWidth, screenHeight);
    }
}
class UIStart
{
    // the title screen starting point of the program 
    constructor()
    {
        this.active = true; // is the ui active
        this.easyButton = new Button();
        this.mediumButton = new Button();
        this.hardButton = new Button();
        this.exitButton = new Button();// exit program... this will close the window
        this.backgroundImage = new Image(0,0);
        this.backgroundImage.src = "";
    }
    setupScene(ctx, screenWidth, screenHeight)
    {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.save();
        ctx.font = "125pt 'Press Start 2P', Audiowide";
        ctx.fillStyle = "red";
        ctx.fillText("Hord Blaster", 150, 200);
        ctx.restore();
        ctx.save();
        ctx.font = "125pt 'Press Start 2P', Audiowide";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeText("Hord Blaster", 150, 200);
        ctx.restore();
        this.easyButton.x = 100;
        this.mediumButton.x = screenWidth * .37 - this.mediumButton.imageWidth/2;
        this.hardButton.x = screenWidth * .62 - this.hardButton.imageWidth/2;
        this.exitButton.x = screenWidth - (100 + this.exitButton.imageWidth);
        this.easyButton.y = 500;
        this.mediumButton.y = 500;
        this.hardButton.y = 500;
        this.exitButton.y = 500;
        this.easyButton.name = "easy game";
        this.mediumButton.name = "medium game";
        this.hardButton.name = "hard game";
        this.exitButton.name = "exit game";
    }
}
//#region Upper classes
class Bullet extends Item
{
    constructor(xIn = 0, yIn = 0, angleIn = 0, lifespan = 0)
    {
        super("Bullet", 1);
        this.contact = false;
        this.speed = 700;
        this.x = xIn;
        this.y = yIn;
        this.angle = angleIn;
        this.centerX = 0;
        this.centerY = 0;
        this.image = new Image(0,0);
        this.image.src = imageList.bullet;
        this.imageWidth = 10;
        this.imageHeight = 10;
        //eventually the bullet will need to be removed if the player plays for a long time 
        this.timeActive = lifespan;
    }
    recalculateCenter()
    {
        this.centerX = this.x + this.imageWidth / 2; 
        this.centerY = this.y + this.imageHeight / 2;
    }
    move(dt, ctx)
    {
        this.timeActive += dt;
        this.x = this.x + this.speed * dt * Math.sin(this.angle);
        this.y = this.y + -this.speed * dt * Math.cos(this.angle);
        ctx.drawImage(this.image, this.x, this.y, this.imageWidth, this.imageHeight);
    }
    checkCollision(entity)
    {
        if(this.x >= entity.x && this.x <= entity.x + entity.imageWidth)
        {
            if(this.y >= entity.y && this.y <= entity.y + entity.imageHeight)
            {
                this.contact = true;
            }        
        }    
        return this.contact;  
    }
}
class Pistol extends Weapon
{
    constructor()
    {
        super("Pistol", 6, 3, 5, 5, 100);
    }
}
class Rifle extends Weapon
{
    constructor()
    {
        super("Rifle", 7, 1, 20, 20, 1000);
    }
}
class Shotgun extends Weapon
{
    constructor()
    {
        super("Shotgun", 8, 10, 10, 10, 1000);
    }
}
class Player extends Entity
{
    constructor(xIn = 0, yIn = 0, targetIn = undefined)
    {
        let localName = "placeHolder";
        let localIndex = 100;
        let localHealth = 100;
        let localSpeed = 100;
        let localImage = "";
        async function loadJsonFetch()
        {
            try
            {
                const response = await fetch("./data/presets.json");
                if(!response.ok)
                {
                    throw new Error(response.status);
                }
                let json = await response.json();
                localName = json.player.name;
                localIndex = json.player.index;
                localHealth = json.player.health;
                localImage = json.player.image;
                localSpeed = json.player.speed;
            }
            catch
            {
                // error is already in console from response.ok
            }
        }
        loadJsonFetch();
        super(localName, localIndex, imageList.player, localHealth, localSpeed, xIn, yIn, 0);
        this.target = targetIn;
        this.pistol = new Pistol();
        this.rifle = new Rifle();
        this.shotgun = new Shotgun();
        // 0 = pistol, 1 = rifle, 2 = shotgun
        this.weaponSelected = 0;
        this.trigger = false;
        this.pistolRateOfFIre = 0;
        this.rifleRateOfFIre = 0;
        this.shotgunRateOfFIre = 0;
        this.killCount = 0;
        
        this.pistolLevelCost = 1;
        this.rifleLevelCost = 1;
        this.shotgunLevelCost = 1;
        this.armorLevelCost = 1;
        this.speedLevelCost = 1;
        this.healthLevelCost = 1;
        this.pistolCostBase = 8;
        this.rifleCostBase = 15;
        this.shotgunCostBase = 12;
        this.armorCostBase = 10;
        this.speedCostBase = 10;
        this.healthCostBase = 25;
    }
    rotate(ctx)
    {
        if(this.target)
        {
            this.recalculateCenter();
            let targetCenter = {x:this.target.x, y:this.target.y};
            this.angle = Math.atan2(targetCenter.y - this.centerY, targetCenter.x - this.centerX) + (Math.PI/2);
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.angle);
            ctx.translate(-this.centerX, -this.centerY);
            ctx.drawImage(this.image, this.x, this.y, this.imageWidth, this.imageHeight);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    move(dt, keysIn)
    {
        let w = false;
        let a = false;
        let s = false;
        let d = false;
        if(keysIn)
        {
            for(let i = 0; i < keysIn.length; i++)
            {
                if(keysIn[i] == keyBinding.up)
                {
                    w = true;
                }
                if(keysIn[i] ==  keyBinding.left)
                {
                    a = true;
                }
                if(keysIn[i] ==  keyBinding.down)
                {
                    s = true;
                }
                if(keysIn[i] ==  keyBinding.right)
                {
                    d = true;
                }
            }
            // how far away from the mouse are we
            if(this.x >= this.target.x - 50 && this.x <= this.target.x)
            {
                if(this.y >= this.target.y - 50 && this.y <= this.target.y)
                {
                    // dont move forward, itll clip
                    w = false;
                }
            }
            // player is slightly faster from the start
            if(w)
            {
                this.x = this.x + (this.speed * (dt * 60)) * Math.sin(this.angle);
                this.y = this.y + -1 * (this.speed * (dt * 60)) * Math.cos(this.angle);
            }
            if(s)
            {
                this.x = this.x + -1 * (this.speed * (dt * 60)) * Math.sin(this.angle);
                this.y = this.y + (this.speed * (dt * 60)) * Math.cos(this.angle);
            }
            if(a)
            {
                this.x = this.x + -1 * (this.speed * (dt * 60)) * Math.cos(this.angle);
                this.y = this.y + -1 * (this.speed * (dt * 60)) * Math.sin(this.angle);
            }
            if(d)
            {
                this.x = this.x + (this.speed * (dt * 60)) * Math.cos(this.angle);
                this.y = this.y + (this.speed * (dt * 60)) * Math.sin(this.angle);
            }
        }
    }
    damage()
    {
        if(this.weaponSelected == 0)
        {
            return this.pistol.damage;
        }
        else if(this.weaponSelected == 1)
        {
            return this.rifle.damage;
        }
        else if(this.weaponSelected == 2)
        {
            return this.shotgun.damage;
        }
    }
}
class Walker extends Enemy
{
    constructor(xIn = 0, yIn = 0, targetIn = undefined)
    {
        let localName = "placeHolder";
        let localIndex = 100;
        let localHealth = 1000;
        let localSpeed = 100;
        let localImage = "";
        async function loadJsonFetch()
        {
            try
            {
                const response = await fetch("./data/presets.json");
                if(!response.ok)
                {
                    throw new Error(response.status);
                }
                let json = await response.json();
                localName = json.walker.name;
                localIndex = json.walker.index;
                localHealth = json.walker.health;
                localImage = json.walker.image;
                localSpeed = json.walker.speed;
            }
            catch
            {
                // error is already in console from response.ok
            }
        }
        loadJsonFetch();
        super(localName, localIndex, imageList.walker, localHealth, localSpeed, xIn, yIn, 0, 10, targetIn);
    }
    move(dt, ctx)
    {
        if(this.target)
        {
            // how far away from the target are we
            if(this.x >= this.target.x - 50 && this.x <= this.target.x)
            {
                if(this.y >= this.target.y - 50 && this.y <= this.target.y)
                {
                    // damageOut
                    this.target.health -= (.3 - (.01 * this.target.armor));
                }
            }
            this.recalculateCenter();
            this.target.recalculateCenter();
            this.angle = Math.atan2(this.target.centerY - this.centerY, this.target.centerX - this.centerX) + (Math.PI/2);
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.angle);
            ctx.translate(-this.centerX, -this.centerY);
            this.x = this.x + this.speed * dt * Math.sin(this.angle);
            this.y = this.y + -this.speed * dt * Math.cos(this.angle);
            ctx.drawImage(this.image, this.x, this.y, this.imageWidth, this.imageHeight);
            if(this.health/this.healthMax > .75)
            {
                this.health100.src = imageList.health100;
                ctx.drawImage(this.health100, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .5)
            {
                this.health75.src = imageList.health75;
                ctx.drawImage(this.health75, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .25)
            {
                this.health50.src = imageList.health50;
                ctx.drawImage(this.health50, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > 0)
            {
                this.health25.src = imageList.health25;
                ctx.drawImage(this.health25, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}
class Runner extends Enemy
{
    constructor(xIn = 0, yIn = 0, targetIn = undefined)
    {
        let localName = "placeHolder";
        let localIndex = 100;
        let localHealth = 1000;
        let localSpeed = 100;
        let localImage = "";
        async function loadJsonFetch()
        {
            try
            {
                const response = await fetch("./data/presets.json");
                if(!response.ok)
                {
                    throw new Error(response.status);
                }
                let json = await response.json();
                localName = json.runner.name;
                localIndex = json.runner.index;
                localHealth = json.runner.health;
                localImage - json.runner.image;
                localSpeed = json.runner.speed;
            }
            catch
            {
                // error is already in console from response.ok
            }
        }
        loadJsonFetch();
        super(localName, localIndex, imageList.runner, localHealth, localSpeed, xIn, yIn, 0, 10, targetIn);
    }
    move(dt, ctx)
    {
        if(this.target)
        {
            // how far away from the target are we
            if(this.x >= this.target.x - 50 && this.x <= this.target.x)
            {
                if(this.y >= this.target.y - 50 && this.y <= this.target.y)
                {
                    // damageOut
                    this.target.health -= (.1 - (.01 * this.target.armor));
                }
            }
            this.recalculateCenter();
            this.target.recalculateCenter();
            this.angle = Math.atan2(this.target.centerY - this.centerY, this.target.centerX - this.centerX) + (Math.PI/2);
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.angle);
            ctx.translate(-this.centerX, -this.centerY);
            this.x = this.x + this.speed * dt * Math.sin(this.angle);
            this.y = this.y + -this.speed * dt * Math.cos(this.angle);
            ctx.drawImage(this.image, this.x, this.y, this.imageWidth, this.imageHeight);
            if(this.health/this.healthMax > .75)
            {
                this.health100.src = imageList.health100;
                ctx.drawImage(this.health100, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .5)
            {
                this.health75.src = imageList.health75;
                ctx.drawImage(this.health75, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .25)
            {
                this.health50.src = imageList.health50;
                ctx.drawImage(this.health50, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > 0)
            {
                this.health25.src = imageList.health25;
                ctx.drawImage(this.health25, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}
class Brute extends Enemy
{
    constructor(xIn = 0, yIn = 0, targetIn = undefined)
    {
        let localName = "placeHolder";
        let localIndex = 100;
        let localHealth = 3000;
        let localSpeed = 100;
        let localImage = "";
        async function loadJsonFetch()
        {
            try
            {
                const response = await fetch("./data/presets.json");
                if(!response.ok)
                {
                    throw new Error(response.status);
                }
                let json = await response.json();
                localName = json.brute.name;
                localIndex = json.brute.index;
                localHealth = json.brute.health;
                localImage = json.brute.image;
                localSpeed = json.brute.speed;
            }
            catch
            {
                // error is already in console from response.ok
            }
        }
        loadJsonFetch();
        super(localName, localIndex, imageList.brute, localHealth, localSpeed, xIn, yIn, 0, 10, targetIn);
    }
    move(dt, ctx)
    {
        if(this.target)
        {
            // how far away from the target are we
            if(this.x >= this.target.x - 50 && this.x <= this.target.x)
            {
                if(this.y >= this.target.y - 50 && this.y <= this.target.y)
                {
                    // damageOut
                    this.target.health -= (.9 - (.01 * this.target.armor));
                }
            }
            this.recalculateCenter();
            this.target.recalculateCenter();
            this.angle = Math.atan2(this.target.centerY - this.centerY, this.target.centerX - this.centerX) + (Math.PI/2);
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.angle);
            ctx.translate(-this.centerX, -this.centerY);
            this.x = this.x + this.speed * dt * Math.sin(this.angle);
            this.y = this.y + -this.speed * dt * Math.cos(this.angle);
            ctx.drawImage(this.image, this.x, this.y, this.imageWidth, this.imageHeight);
            if(this.health/this.healthMax > .75)
            {
                this.health100.src = imageList.health100;
                ctx.drawImage(this.health100, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .5)
            {
                this.health75.src = imageList.health75;
                ctx.drawImage(this.health75, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > .25)
            {
                this.health50.src = imageList.health50;
                ctx.drawImage(this.health50, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            if(this.health/this.healthMax > 0)
            {
                this.health25.src = imageList.health25;
                ctx.drawImage(this.health25, this.x - this.imageWidth / 2, this.y - this.imageHeight / 2, this.imageWidth * 2, this.imageHeight * 2);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}
//#endregion
class World
{
    constructor(screenWidth, screenHeight, mouse)
    {
        this.player = new Player(screenWidth/2, screenHeight/2, mouse);
        this.player.speed = 5;
        this.bulletList = [];
        this.walkerList = [];
        this.runnerList = [];
        this.bruteList = [];
        this.enemyCount = 0;
        this.level = 0;
    }
    attack(dt, mouseDown, mouseUp)
    {
        // pistol
        if(this.player.weaponSelected == 0)
        {
            this.player.pistolRateOfFIre -= dt;
            if(mouseDown)
            {
                if(!this.player.trigger)
                {
                    if(this.player.pistolRateOfFIre <= 0)
                    {
                        // as fast as you can click
                        this.player.pistolRateOfFIre = 0;//.7;
                        this.player.trigger = true;
                        this.player.recalculateCenter();
                        let bullet = new Bullet(this.player.centerX, this.player.centerY, this.player.angle, 0);
                        this.bulletList.push(bullet);
                    }
                }
            }
            if(mouseUp)
            {
                this.player.trigger = false;
            }
        }
        // rifle
        if(this.player.weaponSelected == 1)
        {
            // note: rate of fire is dt
            this.player.rifleRateOfFIre -= dt;
            if(mouseDown)
            {
                if(!this.player.trigger)
                {
                    if(this.player.rifleRateOfFIre <= 0)
                    {
                        this.player.rifleRateOfFIre = .1;
                        this.player.trigger = true;
                        this.player.recalculateCenter();
                        let bullet = new Bullet(this.player.centerX, this.player.centerY, this.player.angle);
                        this.bulletList.push(bullet);
                    }
                }
            }
            // rate of fire control here
            if(this.player.trigger = true)
            {
                this.player.trigger = false;
            }
        }
        // shotgun
        if(this.player.weaponSelected == 2)
        {
            this.player.shotgunRateOfFIre -= dt;
            if(mouseDown)
            {
                if(!this.player.trigger)
                {
                    if(this.player.shotgunRateOfFIre <= 0)
                    {
                        this.player.shotgunRateOfFIre = 1.2;
                        this.player.trigger = true;
                        this.player.recalculateCenter();
                        let bullet = new Bullet(this.player.centerX, this.player.centerY, this.player.angle);
                        this.bulletList.push(bullet);
                    }
                }
            }
            if(mouseUp)
            {
                this.player.trigger = false;
            }
        }
    }
    spawnWave(waveCount, walkerCount, runnerCount, bruteCount)
    {
        this.enemyCount = waveCount;

        for(let i = 0; i < walkerCount; i++)
        {
            let cardinal = {bottom: Math.random(), right: Math.random()};
            if(cardinal.bottom >= .5)
            {
                if(cardinal.right >= .5)
                {
                    let walker = new Walker(Math.floor(Math.random() * 1920), Math.floor(Math.random() * 1080), this.player);
                    walker.speed = walker.speed * (Math.random() + 1);
                    this.walkerList.push(walker);
                }
                else
                {
                    let walker = new Walker( -1 * (Math.floor(Math.random() * 1920)), Math.floor(Math.random() * 1080), this.player);
                    walker.speed = walker.speed * (Math.random() + 1);
                    this.walkerList.push(walker);
                }
            }
            else
            {
                if(cardinal.right >= .5)
                {
                    let walker = new Walker(Math.floor(Math.random() * 1920), -1 * (Math.floor(Math.random() * 1080)), this.player);
                    walker.speed = walker.speed * (Math.random() + 1);
                    this.walkerList.push(walker);
                }
                else
                {
                    let walker = new Walker(-1 * (Math.floor(Math.random() * 1920)), -1 * (Math.floor(Math.random() * 1080)), this.player);
                    walker.speed = walker.speed * (Math.random() + 1);
                    this.walkerList.push(walker); 
                }
                
            }
        }
        for(let i = 0; i < runnerCount; i++)
        {
            let cardinal = {bottom: Math.random(), right: Math.random()};
            if(cardinal.bottom >= .5)
            {
                if(cardinal.right >= .5)
                {
                    let runner = new Runner(Math.floor(Math.random() * 1920 + 500), Math.floor(Math.random() * 1080 + 500), this.player);
                    runner.speed = runner.speed * (Math.random() + 1);
                    runner.imageHeight = 25;
                    runner.imageWidth = 25;
                    this.runnerList.push(runner);
                }
                else
                {
                    let runner = new Runner( -1 * (Math.floor(Math.random() * 1920 - 500)), Math.floor(Math.random() * 1080 - 500), this.player);
                    runner.speed = runner.speed * (Math.random() + 1);
                    runner.imageHeight = 25;
                    runner.imageWidth = 25;
                    this.runnerList.push(runner);
                }
            }
            else
            {
                if(cardinal.right >= .5)
                {
                    let runner = new Runner(Math.floor(Math.random() * 1920 + 500), -1 * (Math.floor(Math.random() * 1080 + 500)), this.player);
                    runner.speed = runner.speed * (Math.random() + 1);
                    runner.imageHeight = 25;
                    runner.imageWidth = 25;
                    this.runnerList.push(runner);
                }
                else
                {
                    let runner = new Runner(-1 * (Math.floor(Math.random() * 1920 - 500)), -1 * (Math.floor(Math.random() * 1080 - 500)), this.player);
                    runner.speed = runner.speed * (Math.random() + 1);
                    runner.imageHeight = 25;
                    runner.imageWidth = 25;
                    this.runnerList.push(runner); 
                }
                
            }
        }
        for(let i = 0; i < bruteCount; i++)
        {
            let cardinal = {bottom: Math.random(), right: Math.random()};
            if(cardinal.bottom >= .5)
            {
                if(cardinal.right >= .5)
                {
                    let brute = new Brute(Math.floor(Math.random() * 1920 + 500), Math.floor(Math.random() * 1080 + 500), this.player);
                    brute.speed = brute.speed * (Math.random() + 1);
                    brute.imageHeight = 75;
                    brute.imageWidth = 75;
                    this.bruteList.push(brute);
                }
                else
                {
                    let brute = new Brute( -1 * (Math.floor(Math.random() * 1920 - 500)), Math.floor(Math.random() * 1080 - 500), this.player);
                    brute.speed = brute.speed * (Math.random() + 1);
                    brute.imageHeight = 75;
                    brute.imageWidth = 75;
                    this.bruteList.push(brute);
                }
            }
            else
            {
                if(cardinal.right >= .5)
                {
                    let brute = new Brute(Math.floor(Math.random() * 1920 + 500), -1 * (Math.floor(Math.random() * 1080 + 500)), this.player);
                    brute.speed = brute.speed * (Math.random() + 1);
                    brute.imageHeight = 75;
                    brute.imageWidth = 75;
                    this.bruteList.push(brute);
                }
                else
                {
                    let brute = new Brute(-1 * (Math.floor(Math.random() * 1920 - 500)), -1 * (Math.floor(Math.random() * 1080 - 500)), this.player);
                    brute.speed = brute.speed * (Math.random() + 1);
                    brute.imageHeight = 75;
                    brute.imageWidth = 75;
                    this.bruteList.push(brute); 
                }
            }
        }
    }
    manageWaves(dificulty)
    {
        if(this.enemyCount <= 0)
        {
            this.level++;
            if(this.level == 1)
            {
                this.spawnWave(3 * dificulty,3 * dificulty,0,0);
            }
            if(this.level == 2)
            {
                this.spawnWave(3 * dificulty,0,3 * dificulty,0);
            }
            if(this.player.level == 3)
            {
                this.spawnWave(5 * dificulty,2 * dificulty,3 * dificulty,0);
            }
            if(this.level == 4)
            {
                this.spawnWave(10 * dificulty,4 * dificulty,5 * dificulty,1 * dificulty);
            }
            if(this.level == 5)
            {
                this.spawnWave(20 * dificulty,11 * dificulty,8 * dificulty,1 * dificulty);
            }
            if(this.level == 6)
            {
                this.spawnWave(30 * dificulty,15 * dificulty,13 * dificulty,2 * dificulty);
            }
            if(this.level == 7)
            {
                this.spawnWave(40 * dificulty,20 * dificulty,15 * dificulty,5 * dificulty);
            }
            if(this.level >= 8)
            {
                this.spawnWave(50 * dificulty,22 * dificulty,22 * dificulty,6 * dificulty);
            }
        }
    }
    manageBullets(dt, ctx)
    {
        let exit = false;
        let index = this.bulletList.length;

        for(let j = 0; j < this.bulletList.length; j++)
        {
            this.bulletList[j].move(dt, ctx);
            if(this.bulletList[j].timeActive > 12)
            {
                exit = true;
                index = j;
            }
        }

        for(let i = 0; i < this.walkerList.length; i++)
        {
            if(exit)
            {
                break;
            }
            for(let j = 0; j < this.bulletList.length; j++)
            {
                if(this.bulletList[j].checkCollision(this.walkerList[i]))
                {
                    this.walkerList[i].takeDamage(this.player.damage());
                    exit = true;
                    index = j;
                    break;
                }
            }
        }
        for(let i = 0; i < this.runnerList.length; i++)
        {
            if(exit)
            {
                break;
            }
            for(let j = 0; j < this.bulletList.length; j++)
            {
                if(this.bulletList[j].checkCollision(this.runnerList[i]))
                {
                    this.runnerList[i].takeDamage(this.player.damage());
                    exit = true;
                    index = j;
                    break;
                }
            }
        }
        for(let i = 0; i < this.bruteList.length; i++)
        {
            if(exit)
            {
                break;
            }
            for(let j = 0; j < this.bulletList.length; j++)
            {
                if(this.bulletList[j].checkCollision(this.bruteList[i]))
                {
                    this.bruteList[i].takeDamage(this.player.damage());
                    exit = true;
                    index = j;
                    break;
                }
            }
        }
        if(exit)
        {
            this.bulletList.splice(index, 1);
        }
    }
    manageEnemys(dt, ctx)
    {
        // if there is a walker list
        if(this.walkerList)
        {
            // I lose a frame when using splice but not when reassigning the entire list ... 
            let localTemp = [];
            for(let i = 0; i < this.walkerList.length; i++)
            {
                if(!this.walkerList[i].alive)
                {
                    this.enemyCount--;
                    this.player.killCount++;
                }
                else
                {
                    this.walkerList[i].move(dt, ctx);
                    localTemp.push(this.walkerList[i])
                }
            }
            this.walkerList = localTemp;
        }
        // if there is a runner list
        if(this.runnerList)
        {
            let localTemp = [];
            for(let i = 0; i < this.runnerList.length; i++)
            {
                if(!this.runnerList[i].alive)
                {
                    this.enemyCount--;
                    this.player.killCount++;
                }
                else
                {
                    this.runnerList[i].move(dt, ctx);
                    localTemp.push(this.runnerList[i])
                }
            }
            this.runnerList = localTemp;
        }
        // if there is a brute list
        if(this.bruteList)
        {
            let localTemp = [];
            for(let i = 0; i < this.bruteList.length; i++)
            {
                if(!this.bruteList[i].alive)
                {
                    this.enemyCount--;
                    this.player.killCount++;
                }
                else
                {
                    this.bruteList[i].move(dt, ctx);
                    localTemp.push(this.bruteList[i])
                }
            }
            this.bruteList = localTemp;
        }
    }
}