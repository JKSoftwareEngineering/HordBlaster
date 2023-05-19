// imput, delta time, and conections to the page are managed here
import {GameManager} from "./classes.js";
// scene variables
let ctx;
let canvas;
let screenHeight = innerHeight*.978;
let screenWidth = innerWidth*.989;
//input variables
let mouse = {x:0,y:0};
let keysIn = [];
let keyIndex = 0;
let keyUp = false;
// game variables
let mouseDown = false;
let mouseUp = false;
let gameManager;
// for delta time
let lastTime = 0;
function init()
{
    gameManager = new GameManager(screenWidth, screenHeight, mouse);
    canvas = document.querySelector("canvas");
    canvas.width=screenWidth;
    canvas.height=screenHeight;
    document.body.style.overflow = "hidden";
    ctx = canvas.getContext("2d");
    setupInput();
}
function setupInput()
{
    // mouse functions
    onmousemove = function(e)
    {
        mouse.x = e.clientX; 
        // 50 becouse of the bulma header
        mouse.y = e.clientY - 50;
    }
    onmousedown = function(e)
    {
        mouseDown = true;
        mouseUp = false;
    }
    onmouseup = function(e)
    {
        mouseDown = false;
        mouseUp = true;
    }
    // basically a keylogger, just build a list of everything pressed and them look through the list later for specific keys
    onkeydown = function(e)
    {
        let add = true;
        for(let i = 0; i < keyIndex; i++)
        {
            if(keysIn[i] == e.code)
            {
                add = false;
                break;
            }
        }
        if(add)
        {
            keysIn[keyIndex] = "" + e.code;
            keyIndex++;
        }
    }
    onkeyup = function(e)
    {
        let localTemp = [];
        for(let i = 0, j = 0; i < keyIndex; i++, j++)
        {
            if(keysIn[i] == e.code)
            {
                i++;
            }
            localTemp[j] = keysIn[i];
        }
        keysIn = localTemp;
        keyIndex--;
    }
}
function gameLoop(time = 0)
{
    requestAnimationFrame(gameLoop);
    let dt = (time - lastTime)/1000;
    lastTime = time;
    ctx.clearRect(0,0,screenWidth,screenHeight);
    gameManager.manageUI(dt, ctx, mouse, mouseDown, mouseUp, screenWidth, screenHeight, keysIn);
}
//gameplay
init();
gameLoop();