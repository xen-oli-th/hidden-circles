// todo:
// - pazaz (font)
// - toasts (score & share)
// - horiz ui mode

$(document).ready(function() {

    $('div.ball').css({
        width: ballD + "px",
        height: ballD + "px"
    });

    resetBoard();

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
                    quintupleCount++;
                    debugLevel >= 3 ? console.log(`Player has achieved ${quintupleCount} quintuple(s) this game.`) : "";
                    $("p#score").text(SCORE + score);
                } else if (falseCount <= THRESHOLD && GAME_STATES.postThreshold !== gameState) {
                    updateState(GAME_STATES.postThreshold);
                }
            }
        }
    });

});

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
            debugLevel >= 3 ? console.log(`New round threshold of ${BALL_COUNT - THRESHOLD} reached.`) : "";
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
            backgroundColor: ballBad,
            left: balls[i].x,
            top: balls[i].y
        })
    }

    currentMode = gridModeVal ? `${BALL_SIZE + ballD/20 + GRID_ON}` : `${BALL_SIZE + ballD/20 + GRID_OFF}`;
    $("p.mode").text(currentMode);
}

function endGame() {
    revealCircles();
    processScores();
    updateState(GAME_STATES.finished);
}

function processScores() {
    // highscore = score > highscore ? score : highscore;
    // localStorage.setItem("highscore", JSON.stringify(highscore));

    if (score > highscore) {
        debugLevel >= 2 ? console.log("Highscore broken, setting new score.") : "";
        highscore = score;
        highscores[+ gridModeVal][ballD] = score;
        localStorage.setItem("highscores", JSON.stringify(highscores));
    }
}

function resetScore() {
    score = 0;
    quintupleCount = 0;
}
