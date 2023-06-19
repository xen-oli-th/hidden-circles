let debugLevel = 3;


const GREEN = "#90ee90";
const RED = "#ff0000";
const INVIS = "#00000000"
const MSG_SIZE_SMALL = 48;
const MSG_SIZE_MID = 72;
const MSG_SIZE_LARGE = 96;

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

let score = 0;
let highscore = 0;

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

let hs = JSON.parse(localStorage.getItem("highscore"));
typeof(hs) === "number" && hs > 0 ? highscore = hs : "";