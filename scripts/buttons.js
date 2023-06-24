let settingsHover = false;

$(document).ready(function() {

    $("input#ball-size").val(ballD);

    $("input#night-mode").prop("checked", nightModeVal);
    nightMode(nightModeVal);
    $("input#grid-mode").prop("checked", gridModeVal);
    gridMode(gridModeVal);

    $("input#hs-reset").prop("checked", allowHSReset);

    currentMode = gridModeVal ? `${BALL_SIZE + ballD/20 + GRID_ON}` : `${BALL_SIZE + ballD/20 + GRID_OFF}`;
    $("p.mode").text(currentMode);

    document.addEventListener('keydown', (e) => {
        debugLevel >= 4 ? console.log(`Key: ${e.key} pressed`) : "";
        if (!settingsActive && (e.key === " " || e.key === "Enter" || e.key === "Shift")) {
            playClicked();
        } else if (e.key === "s") {
            settingsActive ? exitClicked() : settingsClicked();
        } else if (e.key === "n") {
            nightModeVal = !nightModeVal;
            nightMode(nightModeVal);
            localStorage.setItem("nightMode", nightModeVal);
            $("input#night-mode").prop("checked", nightModeVal);
        } else if (e.key === "g") {
            gridModeVal = !gridModeVal;
            gridMode(gridModeVal);
            localStorage.setItem("gridMode", gridModeVal);
            $("input#grid-mode").prop("checked", gridModeVal);
        }
    });

    $("input#ball-size").change(function() {
        processScores();
        resetScore();
        ballD = JSON.parse($(this).val());
        localStorage.setItem("ballSize", JSON.stringify(ballD));
        ballR = ballD/2;
        debugLevel >= 3 ? console.log("Ball size changed to " + ballD) : "";
        $('div.ball').css({
            width: ballD + "px",
            height: ballD + "px"
        });
        highscore = highscores[+ gridModeVal][ballD] !== null && highscores[+ gridModeVal][ballD] !== undefined ? highscores[+ gridModeVal][ballD] : 0;
        resetBoard();
        updateState(GAME_STATES.ready);
    });

    $("input.builtin-checkbox").change(function() {
        let id = $(this).attr("id");
        let val = this.checked;
        debugLevel >= 3 ? console.log(`Switched ${id} checkbox to ${val} (${typeof(val)})`) : "";
        switch (id) {
            case "night-mode":
                nightModeVal = val;
                nightMode(nightModeVal);
                localStorage.setItem("nightMode", JSON.stringify(nightModeVal));
            break;
            case "grid-mode":
                gridModeVal = val;
                gridMode(gridModeVal);
                localStorage.setItem("gridMode", JSON.stringify(gridModeVal));
            break;
            case "hs-reset":
                allowHSReset = val;
                HSResetState(allowHSReset);
            break;
        }
    })

    $("div.settings-menu").on("mouseenter", function() {
        settingsHover = true;
        debugLevel >= 4 ? console.log("Mouse entered settings menu.") : "";
    }).on("mouseleave", function() {
        settingsHover = false;
        debugLevel >= 4 ? console.log("Mouse left settings menu.") : "";
    });

    $("div.settings-menu-wrapper").on("click", function() {
        if (!settingsHover) {
            $(this).css("display", "none");
            settingsActive = false;

            disableHSReset();
        }
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
            resetScore();
            updateState(GAME_STATES.ready);
        break;
    }
}

function settingsClicked() {
    $("div.settings-menu-wrapper").css("display", "flex");
    settingsActive = true;
}

function exitClicked() {
    $("div.settings-menu-wrapper").css("display", "none");
    settingsActive = false;

    disableHSReset();
}

function shareClicked() {
    let share3;
    share3 = quintupleCount === 1 ? SHARE_3_SING : SHARE_3_PL; 
    navigator.clipboard.writeText(SHARE_1 + score + SHARE_2 + quintupleCount + share3 + currentMode + SHARE_4);
    shareToast();
}

function nightMode(state) {
    if (state) {
        css.style.setProperty("--ball-bad", BALL_ORANGE);
        css.style.setProperty("--ball-good", BALL_PURPLE);
        css.style.setProperty("--bg", GREY);
        css.style.setProperty("--off-bg", OFF_GREY);
        css.style.setProperty("--border-colour", OFF_WHITE);
        css.style.setProperty("--button-normal", BUTTON_NORMAL_PURPLE);
        css.style.setProperty("--button-hover", BUTTON_HOVER_PURPLE);
        css.style.setProperty("--button-active", BUTTON_ACTIVE_PURPLE);
        css.style.setProperty("--text-colour", OFF_WHITE);
        css.style.setProperty("--semi-dark", SEMI_LIGHT);
        css.style.setProperty("--darkening", LIGHTENING);
    } else {
        css.style.setProperty("--ball-bad", BALL_RED);
        css.style.setProperty("--ball-good", BALL_GREEN);
        css.style.setProperty("--bg", WHITE);
        css.style.setProperty("--off-bg", OFF_WHITE);
        css.style.setProperty("--border-colour", BORDER_GREY);
        css.style.setProperty("--button-normal", BUTTON_NORMAL_GREEN);
        css.style.setProperty("--button-hover", BUTTON_HOVER_GREEN);
        css.style.setProperty("--button-active", BUTTON_ACTIVE_GREEN);
        css.style.setProperty("--text-colour", BLACK);
        css.style.setProperty("--semi-dark", SEMI_DARK);
        css.style.setProperty("--darkening", DARKENING);
    }
}

function gridMode(state) {
    if (state) {
        $("div.grid-container").css("display", "block");
        debugLevel >= 4 ? console.log("Grid enabled") : "";
    } else {
        $("div.grid-container").css("display", "none");
        debugLevel >= 4 ? console.log("Grid enabled") : "";
    }

    processScores();
    resetScore();
    highscore = highscores[+ gridModeVal][ballD] !== null && highscores[+ gridModeVal][ballD] !== undefined ? highscores[+ gridModeVal][ballD] : 0;
    resetBoard();
    updateState(GAME_STATES.ready);
}

function HSResetState(state) {
    if (state) {
        $("button.reset").attr("id", "enabled-button");
    } else {
        $("button.reset").attr("id", "disabled-button");
    }
}

function resetCurrent() {
    if (allowHSReset) {
        debugLevel >= 3 ? console.log(`Resetting current score (${ballD} + ${gridModeVal})`) : "";
        highscores[+ gridModeVal][ballD] = 0;
        localStorage.setItem("highscores", JSON.stringify(highscores));
        highscore = 0;
        $("p#highscore").text(HIGHSCORE + highscore);

        disableHSReset();
    } else {
        debugLevel >= 3 ? console.log(`Tried to reset current score but it is currently not allowed`) : "";
    }
}

function resetAll() {
    if (allowHSReset) {
        debugLevel >= 3 ? console.log(`Resetting ALL scores`) : "";
        highscores = [[], []];
        localStorage.setItem("highscores", JSON.stringify(highscores));
        highscore = 0;
        $("p#highscore").text(HIGHSCORE + highscore);

        disableHSReset();
    } else {
        debugLevel >= 3 ? console.log(`Tried to reset ALL scores but it is currently not allowed`) : "";
    }
}

function disableHSReset() {
    allowHSReset = false;
    HSResetState(allowHSReset);
    $("input#hs-reset").prop("checked", allowHSReset);
}

function scoreToast(value) {
    $("p#score-toast").stop().text(value).css({
        top: "0px",
        opacity: 1,
        display: "block",
    }).animate({
        top: "-20px",
        opacity: 0,
    }, {
        duration: 800,
        easing: "swing",
        complete: function() {
            $(this).css("display", "none");
        },
    });
}

function shareToast() {
    $("p#share-toast").stop().css({
        top: "-10px",
        opacity: 1,
        display: "block",
    }).animate({
        top: "-25px",
        opacity: 0,
    }, {
        duration: 800,
        easing: "swing",
        complete: function() {
            $(this).css("display", "none");
        },
    });
}

