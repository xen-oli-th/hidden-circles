$(document).ready(function() {

    $("input#ball-size").val(40);

    $("input#ball-size").change(function() {
        processScores();
        ballD = JSON.parse($(this).val());
        ballR = ballD/2;
        //console.log(ballSize);
        $('div.ball').css({
            width: ballD + "px",
            height: ballD + "px"
        });
        highscore = highscores[ballD] !== null && highscores[ballD] !== undefined ? highscores[ballD] : 0;
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

function shareClicked() {

}

