// todo:
// - highscore changes when changing ball size
// - grid mode
// - share button
// - make it look prittier (CSS)
// - divide into separate js files maybe
// - day/night mode


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

$(document).ready(function() {

    resetBoard();

    $("input#ball-size").val(40);

    let hs = JSON.parse(localStorage.getItem("highscore"));
    typeof(hs) === "number" && hs > 0 ? highscore = hs : "";

    updateState(GAME_STATES.ready);

    $("div.click").click(function(e) {
        if (gameState === GAME_STATES.clickable || gameState === GAME_STATES.postThreshold) {
            if (!withinCircle(e.pageX - OFFSET, e.pageY - OFFSET)) {
                endGame();
            } else {
                let falseCount = balls.filter(b => b.found === false).length;
                if (falseCount === 0) {
                    updateState(GAME_STATES.quintuple);
                    score += 5;
                } else if (falseCount <= THRESHOLD && GAME_STATES.postThreshold !== gameState) {
                    updateState(GAME_STATES.postThreshold);
                }
            }
        }
    })

    $("input#ball-size").change(function() {
        ballD = JSON.parse($(this).val());
        ballR = ballD/2;
        //console.log(ballSize);
        $('div.ball').css({
            width: ballD + "px",
            height: ballD + "px"
        });
        processScores();
        resetBoard();
        updateState(GAME_STATES.ready);
    });
});

function playClicked() {
    switch (gameState) {
        case GAME_STATES.ready:
            updateState(GAME_STATES.clickable);
            hideCircles();
        break;
        case GAME_STATES.newRound:
            updateState(GAME_STATES.clickable);
            hideCircles();
        break;
        case GAME_STATES.postThreshold:
            resetBoard();
            updateState(GAME_STATES.newRound);
        break;
        case GAME_STATES.quintuple:
            resetBoard();
            updateState(GAME_STATES.newRound);
        break;
        case GAME_STATES.finished:
            resetBoard();
            updateState(GAME_STATES.ready);
        break;
    }
}

function hideCircles() {
    for (let i = 0; i < balls.length; i++) {
        $("div.ball#b" + i).css("background-color", INVIS);
    }
}

function revealCircles() {
    for (let i = 0; i < balls.length; i++) {
        if (!balls[i].found) {
            $("div.ball#b" + i).css("background-color", RED);
        }
    }
}

function shareClicked() {

}

function updateState(state) {
    gameState = state;

    switch (gameState) {
        case GAME_STATES.ready:
            debugLevel >= 3 ? console.log(`Game is ready.`) : "";
            $("p#score").text(SCORE + score);
            $("p#highscore").text(HIGHSCORE + highscore);
            $("button.play").attr("id", "enabled-button").text(PLAY_GAME);
            $("p.msg").stop().hide();
        break;
        case GAME_STATES.clickable:
            debugLevel >= 3 ? console.log(`Game has started.`) : "";
            $("button.play").attr("id", "disabled-button").text(NEXT_ROUND);
        break;
        case GAME_STATES.postThreshold:
            debugLevel >= 3 ? console.log(`"New round threshold" of ${BALL_COUNT - THRESHOLD} reached.`) : "";
            $("button.play").attr("id", "enabled-button").text(NEXT_ROUND);
        break;
        case GAME_STATES.quintuple:
            debugLevel >= 3 ? console.log(`QUINTUPLE!`) : "";
            $("button.play").attr("id", "enabled-button").text(NEXT_ROUND);
            $("p.msg").stop().text(QUINTUPLE).css("font-size", MSG_SIZE_MID).show().animate({
                fontSize: MSG_SIZE_LARGE
            }, {
                duration: 1000, 
                easing: "swing",
            });
        break;
        case GAME_STATES.newRound:
            debugLevel >= 3 ? console.log(`New round generated.`) : "";
            $("button.play").attr("id", "enabled-button").text(START_ROUND);
            $("p.msg").stop().hide();
        break;
        case GAME_STATES.finished:
            debugLevel >= 3 ? console.log(`Game over.`) : "";
            $("p#highscore").text(HIGHSCORE + highscore);
            $("button.play").attr("id", "enabled-button").text(NEW_GAME);
            $("p.msg").stop().text(GAME_OVER).css("font-size", MSG_SIZE_MID).show();
        break;
    }
}

function ballClicked(ball) {
    $("div.ball#b" + ball).css("backgroundColor", GREEN);
    if (balls[ball].found === false) {
        score++;
        $("p#score").text(SCORE + score);
        balls[ball].found = true;
    } 
}

function resetBoard() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballD));
        balls[i].y = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballD));
        balls[i].found = false;

        for (let count = 0; count < 100; count++) {
            if (overlapCheck(i)) {
                debugLevel >= 3 ? console.log(`There is an overlap with ball ${i} at [${balls[i].x}, ${balls[i].y}], re-rolling (attempt ${count + 1}).`) : "";
                balls[i].x = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballD));
                balls[i].y = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballD));
            }
            else {
                break;
            }
        }

        $("div.ball#b" + i).css({
            backgroundColor: RED,
            left: balls[i].x,
            top: balls[i].y
        })
    }
}

function overlapCheck(i) {
    for (let j = 0; j < i; j++) {
        if (distanceCheck([balls[i].x, balls[i].y, ballR], [balls[j].x, balls[j].y, ballR], ballD + BUFFER)) {
            return true;
        } 
    }
    return false;
}

function withinCircle(x, y) {
    for (let i = 0; i < balls.length; i++) {
        if (distanceCheck([balls[i].x, balls[i].y, ballR], [x, y, 0], ballR + BUFFER)) {
            debugLevel >= 3 ? console.log(`Player clicked within ball ${i}.`) : "";
            ballClicked(i);
            return true;
        }
    }
    debugLevel >= 3 ? console.log(`Player clicked the canvas.`) : "";
    return false;
}

function endGame() {
    revealCircles();
    processScores();
    updateState(GAME_STATES.finished);
}

function processScores() {
    highscore = score > highscore ? score : highscore;
    localStorage.setItem("highscore", JSON.stringify(highscore));
    score = 0;
}

function distanceCheck(pos1, pos2, dist) {
    // pos1[2] = (pos1[2] === null || pos1[2] === undefined) ? 0 : pos1[2]
    // pos2[2] = (pos2[2] === null || pos2[2] === undefined) ? 0 : pos2[2]
    let x = (pos1[0] + pos1[2]) - (pos2[0] + pos2[2]);
    let y = (pos1[1] + pos1[2]) - (pos2[1] + pos2[2]);
    if (Math.sqrt(x * x + y * y) <= dist) {
        debugLevel >= 4 ? console.log(`Distance (${dist}) check between [${pos1[0]}, ${pos1[1]}] and [${pos2[0]}, ${pos2[1]}] returning TRUE (${x}, ${y}).`) : "";
        return true;
    } else {
        debugLevel >= 4 ? console.log(`Distance (${dist}) check between [${pos1[0]}, ${pos1[1]}] and [${pos2[0]}, ${pos2[1]}] returning FALSE (${x}, ${y}).`) : "";
        return false;
    }
}