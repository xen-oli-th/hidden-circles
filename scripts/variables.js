let debugLevel = 3;



const MSG_SIZE_SMALL = 48;
const MSG_SIZE_MID = 72;
const MSG_SIZE_LARGE = 96;

// COLOURS
const BALL_GREEN = "#90ee90";
const BALL_RED = "#ff0000";
const BALL_PURPLE = 0;
const BALL_ORANGE = 0;
const BALL_INVIS = "#00000000";

const OFF_WHITE = "#f5f5f5";
const OFF_GREY = 0;
const BORDER_GREY = "#333333";
const BORDER_WHITE = 0;
const WHITE = "#ffffff";
const GREY = 0;

const BUTTON_GREEN_LIGHT = "#4CAF50";
const BUTTON_GREEN_MID = "#3C9F40";
const BUTTON_GREEN_DARK = "#2C8F30";

let ballBad = BALL_RED;
let ballGood = BALL_GREEN;

let canvasColour = OFF_WHITE;
let borderColour = BORDER_GREY;
let bgColour = WHITE;

let buttonNormal = BUTTON_GREEN_LIGHT;
let buttonHover = BUTTON_GREEN_MID;
let buttonActive = BUTTON_GREEN_DARK;


// replace this stuff with better code
const SCREEN_SIZE = 600;
const OFFSET = 25; // jQuery .offset()
const BORDER_WIDTH = 5;
/////////////////////////////////////

const BALL_COUNT = 5;
const BUFFER = 2;
const THRESHOLD = 2;
const GAME_STATES = {
    ready: "ready",
    clickable: "clickable",
    postThreshold: "postThreshold",
    quintuple: "quintuple",
    newRound: "newRound",
    finished: "finished",
}

let gameState = GAME_STATES.ready;

let ballD = 40;
let ballR = ballD/2;



class Ball {
    constructor(x, y, found) {
        this.x = x;
        this.y = y;
        this.found = found;
    }
}
let balls = [];
for (let i = 0; i < BALL_COUNT; i++) {
    balls[i] = new Ball(-100, -100, false);
}


let highscores;
let hs = JSON.parse(localStorage.getItem("highscores"));
if (hs === null || hs === undefined) {
    debugLevel >= 2 ? console.warn("Highscore localStorage item is null or undefined.") : "";
    highscores = {}
} else {
    highscores = hs;
}
let score = 0;
let highscore = highscores[ballD] !== null && highscores[ballD] !== undefined ? highscores[ballD] : 0;