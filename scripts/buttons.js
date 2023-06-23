let settingsHover = false;

$(document).ready(function() {

    $("input#ball-size").val(40);
    $("input#night-mode").checked = nightModeVal;
    nightMode(nightModeVal);

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
        }

    });



    $("input#ball-size").change(function() {
        processScores();
        ballD = JSON.parse($(this).val());
        ballR = ballD/2;
        debugLevel >= 3 ? console.log("Ball size changed to " + ballD) : "";
        $('div.ball').css({
            width: ballD + "px",
            height: ballD + "px"
        });
        highscore = highscores[ballD] !== null && highscores[ballD] !== undefined ? highscores[ballD] : 0;
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
                localStorage.setItem("nightMode", nightModeVal);
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
}

function shareClicked() {

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

