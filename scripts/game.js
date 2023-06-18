// todo:
// - highscore changes when changing ball size
// - grid mode
// - share button
// - make it look prittier (CSS)
// - divide into separate js files maybe
// - fix size disparity
// - day/night mode


const GREEN = "#90ee90";
const RED = "#ff0000";
const INVIS = "#00000000"
const MSG_SIZE_SMALL = 48;
const MSG_SIZE_MID = 72;
const MSG_SIZE_LARGE = 96;

const SCREEN_SIZE = 600;
const BORDER_WIDTH = 5;

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

let ballSize = 40;

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

let debugLevel = 5;

$(document).ready(function() {

    resetBoard();

    $("input#ball-size").val(40);

    let hs = JSON.parse(localStorage.getItem("highscore"));
    typeof(hs) === "number" && hs > 0 ? highscore = hs : "";

    updateState(GAME_STATES.ready);

    $("div.click").click(function(e) {
        if (gameState === GAME_STATES.clickable || gameState === GAME_STATES.postThreshold) {
            if (!withinCircle(e.pageX, e.pageY)) {
                endGame();
            } else {
                let falseCount = balls.filter(b => b.found === false).length;
                if (falseCount === 0) {
                    debugLevel >= 3 ? console.log(`QUINTUPLE!`) : "";
                    updateState(GAME_STATES.quintuple);
                    score += 5;
                } else if (falseCount <= THRESHOLD && GAME_STATES.postThreshold !== gameState) {
                    debugLevel >= 3 ? console.log(`"New round threshold" of ${BALL_COUNT - THRESHOLD} reached.`) : "";
                    updateState(GAME_STATES.postThreshold);
                }
            }
        }
    })

    $("input#ball-size").change(function() {
        ballSize = JSON.parse($(this).val());
        //console.log(ballSize);
        $('div.ball').css({
            width: ballSize + "px",
            height: ballSize + "px"
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
            $("p#score").text(SCORE + score);
            $("p#highscore").text(HIGHSCORE + highscore);
            $("button.play").attr("id", "enabled-button").text(PLAY_GAME);
            $("p.msg").stop().hide();
        break;
        case GAME_STATES.clickable:
            $("button.play").attr("id", "disabled-button").text(NEXT_ROUND);
        break;
        case GAME_STATES.postThreshold:
            $("button.play").attr("id", "enabled-button").text(NEXT_ROUND);
        break;
        case GAME_STATES.quintuple:
            $("button.play").attr("id", "enabled-button").text(NEXT_ROUND);
            $("p.msg").stop().text(QUINTUPLE).show().animate({
                fontSize: MSG_SIZE_LARGE
            }, {
                duration: 1000, 
                easing: "swing",
            });
        break;
        case GAME_STATES.newRound:
            $("button.play").attr("id", "enabled-button").text(START_ROUND);
            $("p.msg").stop().hide().css("font-size", MSG_SIZE_MID);
        break;
        case GAME_STATES.finished:
            $("p#highscore").text(HIGHSCORE + highscore);
            $("button.play").attr("id", "enabled-button").text(NEW_GAME);
            $("p.msg").stop().text(GAME_OVER).show();
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
        balls[i].x = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballSize));
        balls[i].y = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballSize));
        balls[i].found = false;

        while (overlapCheck(i)) {
            debugLevel >= 3 ? console.log(`There is an overlap with ball ${i} at [${balls[i].x}, ${balls[i].y}], re-rolling.`) : "";
            balls[i].x = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballSize));
            balls[i].y = Math.floor(Math.random() * (SCREEN_SIZE - (BORDER_WIDTH * 2) - ballSize));
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
        // console.log(`checking ${i} @ [${balls[i].x}, ${balls[i].y}] & ${j} @ [${balls[j].x}, ${balls[j].y}]`)
        if ((Math.abs(balls[i].x - balls[j].x) <= ballSize) && (Math.abs(balls[i].y - balls[j].y) <= ballSize)) {
            return true;
        }
    }
    return false;
}

function withinCircle(x, y) {
    for (let i = 0; i < balls.length; i++) {
        let xDist = balls[i].x + ballSize + BORDER_WIDTH - x;
        let yDist = balls[i].y + ballSize + BORDER_WIDTH - y;
        if (Math.sqrt(xDist * xDist + yDist * yDist) <= ballSize/2 + BUFFER) {
            debugLevel >= 3 ? console.log(`Player clicked within ball ${i}.`) : "";
            ballClicked(i);
            return true;
        }
    }
    debugLevel >= 3 ? console.log(`Player clicked the canvas.`) : "";
    return false;
}

function endGame() {
    debugLevel >= 3 ? console.log(`Game over.`) : "";
    revealCircles();
    processScores();
    updateState(GAME_STATES.finished);
}

function processScores() {
    highscore = score > highscore ? score : highscore;
    localStorage.setItem("highscore", JSON.stringify(highscore));
    score = 0;
}