let debugLevel = 4;



const MSG_SIZE_SMALL = 48;
const MSG_SIZE_MID = 72;
const MSG_SIZE_LARGE = 120;

// COLOURS
const BALL_GREEN = "#90ee90";
const BALL_RED = "#ff0000";
const BALL_PURPLE = "#8228dc";
const BALL_ORANGE = "#f98c17";
const BALL_INVIS = "#00000000";

const OFF_WHITE = "#f5f5f5"; // canvas & settings (& text & border)
const OFF_GREY = "#202020"; // ^
const BORDER_GREY = "#333333"; // borders
const WHITE = "#ffffff"; // main page bg
const GREY = "#252525"; // ^
const BLACK = "#000000" // text
const DARKENING = "#00000022"; // misc
const LIGHTENING = "#ffffff22"; // ^
const SEMI_DARK = "#aaaaaaaa"; // misc
const SEMI_LIGHT = "#666666aa"; // ^

const BUTTON_NORMAL_GREEN = "#4CAF50";
const BUTTON_HOVER_GREEN = "#3C9F40";
const BUTTON_ACTIVE_GREEN = "#2C8F30";

const BUTTON_NORMAL_PURPLE = "#8228dc";
const BUTTON_HOVER_PURPLE = "#7021bf";
const BUTTON_ACTIVE_PURPLE = "#621ca8";

const ballBad = "var(--ball-bad)";
const ballGood = "var(--ball-good)";
const ballInvis = "var(--ball-invis)";

let css = document.querySelector(":root");

// let canvasColour = OFF_WHITE;
// let borderColour = BORDER_GREY;
// let bgColour = WHITE;

// let buttonNormal = BUTTON_NORMAL_GREEN;
// let buttonHover = BUTTON_HOVER_GREEN;
// let buttonActive = BUTTON_ACTIVE_GREEN;


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

let ballD = typeof(JSON.parse(localStorage.getItem("ballSize"))) === "number" ? JSON.parse(localStorage.getItem("ballSize")) : 40;
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

let nightModeVal = typeof(JSON.parse(localStorage.getItem("nightMode"))) === "boolean" ? JSON.parse(localStorage.getItem("nightMode")) : true;
let gridModeVal = typeof(JSON.parse(localStorage.getItem("gridMode"))) === "boolean" ? JSON.parse(localStorage.getItem("gridMode")) : false;
let cursorModeVal = typeof(JSON.parse(localStorage.getItem("cursorMode"))) === "boolean" ? JSON.parse(localStorage.getItem("cursorMode")) : true;

let highscores;
let hs = JSON.parse(localStorage.getItem("highscores"));
if (hs === null || hs === undefined) {
    debugLevel >= 2 ? console.warn("Highscore localStorage item is null or undefined.") : "";
    highscores = [[], []];
} else {
    highscores = hs;
}
let score = 0;
let highscore = highscores[+ gridModeVal][ballD] !== null && highscores[+ gridModeVal][ballD] !== undefined ? highscores[+ gridModeVal][ballD] : 0;
let quintupleCount = 0;

let settingsActive = false;
let allowHSReset = false;
let currentMode = "";