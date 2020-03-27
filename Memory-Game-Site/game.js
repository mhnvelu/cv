var gamePattern = [];
var userClickedPattern = [];

var buttonColours = ["red", "blue", "green", "yellow"];

var level = 0;
var started = false;

$(document).on("keypress", function () {
    if (!started) {
        $("#level-title").text("Level " + level);
        started = true;
        nextSequence();
    }

});

$(".btn").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    if (level === userClickedPattern.length) {
        checkAnswer(level);
    }
});

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    var element = document.querySelector("#" + randomChosenColour);
    playSound(element.id);
}

function playSound(id) {

    switch (id) {
        case "red":
            var red = new Audio("sounds/red.mp3");
            red.play();
            break;
        case "blue":
            var blue = new Audio("sounds/blue.mp3");
            blue.play();
            break;
        case "green":
            var green = new Audio("sounds/green.mp3");
            green.play();
            break;
        case "yellow":
            var yellow = new Audio("sounds/yellow.mp3");
            yellow.play();
            break;
        default:
            var wrong = new Audio("sounds/wrong.mp3");
            wrong.play();
            break;
    }

}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {

    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        var success = true;
        for (var i = 0; i < gamePattern.length; i++) {
            if (userClickedPattern[i] !== gamePattern[i]) {
                console.log("wrong : " + userClickedPattern + gamePattern);
                success = false;
                break;
            }
        }
        if (success) {
            console.log("success : " + userClickedPattern + gamePattern);
            setTimeout(function () {
                nextSequence();
            }, 1000);
        } else {
            startOver();
        }

    } else {
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");
    playSound();
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
}

