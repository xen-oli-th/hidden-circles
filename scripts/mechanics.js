function hideCircles() {
    for (let i = 0; i < balls.length; i++) {
        $("div.ball#b" + i).css("background-color", BALL_INVIS);
    }
}

function revealCircles() {
    for (let i = 0; i < balls.length; i++) {
        if (!balls[i].found) {
            $("div.ball#b" + i).css("background-color", BALL_RED);
        }
    }
}

function ballClicked(ball) {
    $("div.ball#b" + ball).css("backgroundColor", BALL_GREEN);
    if (balls[ball].found === false) {
        score++;
        $("p#score").text(SCORE + score);
        balls[ball].found = true;
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