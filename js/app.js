const guessEl = document.getElementById("guess");
const minDisplayEl = document.getElementById("min-value");
const maxDisplayEl = document.getElementById("max-value");
const nDisplayEl = document.getElementById("n-value");
const messageDisplayEl = document.getElementById("message");
const highLowBtn = document.getElementById("high-low");
const dividingEndsBtn = document.getElementById("dividends");
const evenOddBtn = document.getElementById("even-odd");
const maxMinIngBtn = document.getElementById("sub-tractor");
const numberEls = document.getElementsByClassName("number");
const buttonEls = document.getElementsByTagName("button");
const pendingEl = document.getElementById("pending");
const padEl = document.getElementById("pad");
const divBtnEls = document.getElementById("button-container");
const divBtnElBlu = document.getElementById("but-three");
const divBtnElGrn = document.getElementById("but-two");
const divBtnElRed = document.getElementById("but-one");
const startResetContainer = document.getElementById("start-reset");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

// button audio
const confirmBtnSound = new Audio("./resources/sounds/Confirm8-Bit.ogg");
confirmBtnSound.volume = .4;
const cancelBtnSound = new Audio("./resources/sounds/Cancel8-Bit.ogg");
cancelBtnSound.volume = .4;
const startBtnSound = new Audio("./resources/sounds/Menu8-Bit.ogg");
startBtnSound.volume = .3;
const resetBtnSound = new Audio("./resources/sounds/Select8-Bit.ogg");
resetBtnSound.volume = .3;

let minRangeValue;
let maxRangeValue;
let nValue;
let tries = 0;
let win = false;
let isRangeSet = false;
let interID; // stores the random number visual change as a setInterval()
let winnerID; // for toggling win animation on min-max elements
let isSwitch = false; // switch to allow for different randomNumber range generation
let isReadRules = false; // checks to see if user has read rules
let pageTurner = 0; // tracker for showing messages in order

// event callback function when guessing the possible n-value
const guess = () => {
    if (event.key === "Enter") {
        if (guessEl.value < minRangeValue || guessEl.value > maxRangeValue) {
            showTries("Please enter a valid number");
        } else if (tries < 3 && guessEl.value) {
            const attempt = event.target.value;
            tries++;
            showTries(verify(parseInt(attempt)));
            winLose();
        }
        guessEl.value = "";
    }
};

// checks the guess against the actual n-value
const verify = (number) => {
    if (number === nValue) {
        win = true;
    } else if (number < nValue) {
        return "Underestimated";
    } else if (number > nValue) {
        return "Overestimated"
    }
};

// win|loss check
const winLose = () => {
    if (tries === 3 && !win) {
        clearInterval(interID);
        nDisplayEl.innerHTML = "(´。＿。｀)";
        messageDisplayEl.innerHTML = `No more tries left.<br> Try again?<br> Y/N?`;
        resetPrompt()
    } else if (win) {
        clearInterval(interID);
        nDisplayEl.innerText = `
        *★,°*:.☆(￣▽￣)/$:*.°★* 
        n was ${nValue}`;
        messageDisplayEl.innerHTML = `You did it. You figured out a number.<br> Try again?<br> Y/N?`;
        addWinAnim();
        resetPrompt();
    }
};

// shorthand-use function
const showTries = message => {
    messageDisplayEl.innerHTML = message + `<br/> ${3 - tries} attempt(s) left`;
}

// updates displayed range values
const updateRange = () => {
    if (minRangeValue > 999) {
        // adds commas to format for display when value has 4+ digits
        minDisplayEl.textContent = minRangeValue.toLocaleString();
    } else if (minRangeValue >= 0) {
        minDisplayEl.textContent = minRangeValue;
    } else {
        minDisplayEl.textContent = "";
    }
    if (maxRangeValue > 999) {
        maxDisplayEl.textContent = maxRangeValue.toLocaleString();
    } else if (maxRangeValue > minRangeValue) {
        maxDisplayEl.textContent = maxRangeValue;
    } else {
        maxDisplayEl.textContent = "";
    }
};

const highLow = event => {
    const number = parseInt(guessEl.value);
    if (!guessEl.value) {
        messageDisplayEl.innerText = `
            ㄟ( ▔, ▔ )ㄏ
            Please enter a valid number`;
        guessEl.value = "";
    } else if (number <= nValue && number > minRangeValue) {
        showTries(`Within lower range`);
        minRangeValue = number;
        highLowBtn.disabled = true;
        highLowBtn.style.filter = `grayscale(200%)`;
        highLowBtn.classList.remove("shiftColor");
        guessEl.value = "";
    } else if (number > nValue && number < maxRangeValue) {
        showTries(`Within higher range`);
        maxRangeValue = number;
        highLowBtn.disabled = true;
        highLowBtn.style.filter = `grayscale(200%)`;
        highLowBtn.classList.remove("shiftColor");
        guessEl.value = "";
    }
    updateRange();
};

const evenOdd = () => {
    showTries(nValue % 2 === 0 ? `Even` : `Odd`);
    evenOddBtn.disabled = true;
    evenOddBtn.style.filter = `invert(30%)`;
    evenOddBtn.classList.remove("inverse")
};

const maxMin = () => {
    const maxMinDif = maxRangeValue - minRangeValue;
    let nMinDif = nValue - minRangeValue;
    // add some randomness to change of new min-value to make it harder to determine n-value from the change
    const randomMinRangeValue = nMinDif - Math.floor((Math.random() * nMinDif));
    if (randomMinRangeValue < minRangeValue && maxMinDif < nValue) {
        showTries(`max-min-ing comparison results in no change in range`);
    } else if (nMinDif < nValue || maxMinDif > nValue) {
        if (randomMinRangeValue > minRangeValue) {
            minRangeValue = randomMinRangeValue;
            showTries(`max-ing min-value`);
        } else if (maxMinDif > nValue) {
            maxRangeValue = maxMinDif;
            showTries(`min-ing max value`);
        }
        updateRange();
        maxMinIngBtn.disabled = true;
        maxMinIngBtn.style.filter = `grayscale(200%)`;
        maxMinIngBtn.classList.toggle("bigSmall");
    }
}

const dividingEnds = () => {
    const dividedNValue = nValue / minRangeValue;
    const dividedRangeValue = maxRangeValue / nValue;
    const dividedRatio = (dividedRangeValue / dividedNValue);
    const tempMin = Math.floor(minRangeValue / dividedRatio);
    const tempMax = Math.ceil(maxRangeValue / dividedRatio);
    if (minRangeValue > 0 && (tempMin > minRangeValue && tempMin < nValue || tempMax < maxRangeValue && tempMax > nValue)) {
        if (dividedRatio < 1) {
            minRangeValue = tempMin;
            showTries(`min:n ratio is wider`);
        } else if (dividedRatio === 1) {
            showTries(`Equal ratios`);
        } else {
            maxRangeValue = tempMax;
            showTries(`n:max ratio is wider`);
        }
        updateRange();
        dividingEndsBtn.disabled = true;
        dividingEndsBtn.style.filter = `grayscale(200%)`;
        dividingEndsBtn.classList.toggle("colorFlashHov");
    } else {
        showTries(`div/iding e/nd comparison results in no change in range`);
    }
};

// calculates a random n-value within the min and max range
const calcRange = (min, max) => {
    nValue = Math.ceil(Math.random() * (max - min)) + min;
    console.log(nValue);
};

// enables necessary functions and styling to play the game
const startRound = () => {
    interID = setInterval(randomNumbers, 100);
    guessEl.value = "";
    messageDisplayEl.innerHTML = `n is between ${minRangeValue} and ${maxRangeValue}
    <br />Tries left: ${3 - tries}`;
    resetMessageFormatting();
    guessEl.removeEventListener("keypress", getRange);
    guessEl.addEventListener("keypress", guess);
    addHelpBtnFunc();
    addBtnAnimations();
    colorInBtn();
    enableButtons();
};

// event callback function for custom range values
const getRange = event => {
    if (event.key === "Enter") {
        if (!guessEl.value) {
            messageDisplayEl.innerText = `
            ㄟ( ▔, ▔ )ㄏ
            Please enter a valid number`;
            guessEl.value = ``;
        } else if (!isRangeSet && guessEl.value >= 0 && !minRangeValue) {
            minRangeValue = parseInt(guessEl.value);
            updateRange();
            messageDisplayEl.style.textAlign = "right";
            messageDisplayEl.innerText = `
            (づ￣ 3￣)づ
            Please enter range of [n]'s max-value`;
            messageDisplayEl.style.justifyContent = "end";
            guessEl.value = ``;
        } else if (guessEl.value > minRangeValue) {
            maxRangeValue = parseInt(guessEl.value);
            updateRange();
            calcRange(minRangeValue, maxRangeValue);
            isRangeSet = true;
            startRound();
        }
    }
};

// changes settings to allow for range value input
const setRange = () => {
    guessEl.type = "number";
    guessEl.value = "";
    messageDisplayEl.style.textAlign = "left";
    messageDisplayEl.innerText = `
    o(*￣▽￣*)ブ
    Please enter range of [n]'s min-value`;
    messageDisplayEl.style.alignItems = "start";
    messageDisplayEl.style.justifyContent = "start";
    guessEl.addEventListener("keypress", getRange);
};

// separated reset functionality to be used on gameover
const resetCall = event => {
    if (event.key === "Enter" || event.target.className === "deco-button") {
        if (guessEl.value === "Y" || guessEl.value === "y" || event.target.id === "but-two") {
            event.target.id === "but-two" ? confirmBtnSound.play() : "";
            divBtnElGrn.style.cursor = "default";
            divBtnElRed.style.cursor = "default";
            reset();
            setRange();
        } else if (guessEl.value === "N" || guessEl.value === "n" || event.target.id === "but-one") {
            event.target.id === "but-one" ? cancelBtnSound.play() : "";
            for (const element in numberEls) {
                numberEls[element].textContent = ``;
            };
            messageDisplayEl.textContent = ``;
            nDisplayEl.innerHTML = `<div id="pending">.</div>`;
            guessEl.value = ``;
            guessEl.disabled = true;
            divBtnElGrn.style.cursor = "default";
            divBtnElRed.style.cursor = "default";
            guessEl.removeEventListener("keypress", resetCall);
            divBtnEls.removeEventListener("click", resetCall);
            clearInterval(interID);
            removeWinAnim();
            removeBtnAnimations();
        }
    }
};

// changes styling and input settings for gameover prompt
const resetPrompt = () => {
    guessEl.removeEventListener("keypress", guess);
    grayButtons();
    guessEl.type = "text";
    guessEl.addEventListener("keypress", resetCall);
    divBtnEls.addEventListener("click", resetCall);
    divBtnElGrn.style.cursor = "pointer";
    divBtnElRed.style.cursor = "pointer";
}

const reset = event => {
    guessEl.removeEventListener("keypress", resetCall);
    divBtnEls.removeEventListener("click", resetCall);
    minRangeValue = "";
    maxRangeValue = "";
    isRangeSet = false;
    win = false;
    tries = 0;
    nValue = 0;
    pageTurner = 0;
    nDisplayEl.innerHTML = `<div id="pending">.</div>`;
    minDisplayEl.textContent = "";
    maxDisplayEl.textContent = "";
    guessEl.value = "";
    guessEl.type = "number";
    guessEl.disabled = false;
    removeWinAnim();
    setRange();
    divBtnElGrn.removeEventListener("click", nextMsg)
    guessEl.removeEventListener("keypress", guess);
    clearInterval(interID);
    removeWinAnim();
    guessEl.removeEventListener("keypress", readingRules);
    isReadRules = false;
};

const disableButtons = () => {
    for (const button in buttonEls) {
        buttonEls[button].disabled = true;
    }
};

const enableButtons = () => {
    for (const button in buttonEls) {
        buttonEls[button].disabled = false;
    }
};

const randomNumbers = () => {
    let randomNumber
    // added if-else statement to allow random number generation display min and max values
    if (isSwitch) {
        randomNumber = Math.ceil(Math.random() * (maxRangeValue - minRangeValue)) + minRangeValue;
        isSwitch = false;
    } else {
        randomNumber = Math.floor(Math.random() * (maxRangeValue - minRangeValue)) + minRangeValue;
        isSwitch = true;
    }
    nDisplayEl.innerHTML = `${randomNumber}`;
};

const addHelpBtnFunc = () => {
    highLowBtn.addEventListener("click", highLow);
    evenOddBtn.addEventListener("click", evenOdd);
    maxMinIngBtn.addEventListener("click", maxMin);
    dividingEndsBtn.addEventListener("click", dividingEnds);
};

const removeHelpBtnFunc = () => {
    highLowBtn.removeEventListener("click", highLow);
    evenOddBtn.removeEventListener("click", evenOdd);
    maxMinIngBtn.removeEventListener("click", maxMin);
    dividingEndsBtn.removeEventListener("click", dividingEnds);
};

const addBtnAnimations = () => {
    highLowBtn.classList.add("shiftColor");
    evenOddBtn.classList.add("inverse");
    maxMinIngBtn.classList.add("bigSmall");
    dividingEndsBtn.classList.add("colorFlashHov");
};

const addWinAnim = () => {
    padEl.classList.add("spin");
    divBtnEls.classList.add("colorFlash");
    startBtn.classList.add("wipe");
    resetBtn.classList.add("wipe");
    minDisplayEl.textContent = nValue;
    maxDisplayEl.textContent = nValue;
    winnerID = setInterval(() => {
        minDisplayEl.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        maxDisplayEl.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        minDisplayEl.style.background = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        maxDisplayEl.style.background = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }, 500);
}

const removeWinAnim = () => {
    padEl.classList.remove("spin");
    divBtnEls.classList.remove("colorFlash");
    startBtn.classList.remove("wipe");
    resetBtn.classList.remove("wipe");
    clearInterval(winnerID);
    minDisplayEl.style.background = "black";
    maxDisplayEl.style.background = "black";
    minDisplayEl.style.color = "rgb(17, 164, 17)";
    maxDisplayEl.style.color = "rgb(17, 164, 17)";
}

const removeBtnAnimations = () => {
    highLowBtn.classList.remove("shiftColor");
    evenOddBtn.classList.remove("inverse");
    maxMinIngBtn.classList.remove("bigSmall");
    dividingEndsBtn.classList.remove("colorFlashHov");
};

const grayOut = event => {
    event.target.style.filter = `grayscale(200%)`;
};

// grayOut specifically for evenOdd button due to black-white color
const bwGrayOut = () => {
    event.target.style.filter = `invert(30%)`;
};

// for removing grayOut
const colorInBtn = () => {
    highLowBtn.style.filter = ``;
    evenOddBtn.style.filter = ``;
    maxMinIngBtn.style.filter = ``;
    dividingEndsBtn.style.filter = ``;
};

// adds event listener to gray out button on use
const addGrayOut = () => {
    highLowBtn.addEventListener("click", grayOut);
    evenOddBtn.addEventListener("click", bwGrayOut);
    maxMinIngBtn.addEventListener("click", grayOut);
    dividingEndsBtn.addEventListener("click", grayOut);
};

// for making buttons gray when game is not in play
const grayButtons = () => {
    disableButtons();
    removeBtnAnimations();
    removeHelpBtnFunc();
    highLowBtn.style.filter = `grayscale(200%)`;
    evenOddBtn.style.filter = `invert(30%)`;
    maxMinIngBtn.style.filter = `grayscale(200%)`;
    dividingEndsBtn.style.filter = `grayscale(200%)`;
};

const readingRules = event => {
    if (event.key === "Enter" || event.target.className === "deco-button") {
        if (guessEl.value === "Y" || guessEl.value === "y" || event.target.id === "but-two") {
            divBtnEls.removeEventListener("click", readingRules);
            confirmBtnSound.muted = false;
            event.target.id === "but-two" ? confirmBtnSound.play() : "";
            maxDisplayEl.textContent ? "" : showConfirmPrompt();
            divBtnElRed.style.cursor = "default";
            pageTurner = 0;
            isReadRules = true;
            messageDisplayEl.innerHTML = `The point of the game is to find n's point between the range of a min and max.`;
        } else if (guessEl.value === "N" || guessEl.value === "n" || event.target.id === "but-one") {
            event.target.id === "but-one" ? cancelBtnSound.play() : "";
            setRange();
            divBtnElGrn.style.cursor = "default";
            divBtnElRed.style.cursor = "default";
            divBtnElGrn.removeEventListener("click", nextMsg)
            divBtnEls.removeEventListener("click", readingRules);
            guessEl.removeEventListener("keypress", readingRules);
        }
        guessEl.value = "";
    }
};

// where game explanation mainly occurs
const nextMsg = event => {
    pageTurner < 7 ? confirmBtnSound.play() : confirmBtnSound.muted = true;
    if (!isReadRules) {
        messageDisplayEl.innerHTML = `Would you like to read the rules?<br />Y/N?`;
        guessEl.type = "text";
        guessEl.addEventListener("keypress", readingRules);
        divBtnEls.addEventListener("click", readingRules);
    }
    if (pageTurner === 0 && isReadRules) {
        messageDisplayEl.innerHTML = `First, set the range the [n-value] will be between.`;
        pageTurner++;
    } else if (pageTurner === 1) {
        messageDisplayEl.innerHTML = `Decide the minimum range value followed by the maximum range value by entering them in the input below followed by pressing "Enter".`;
        pageTurner++;
    } else if (pageTurner === 2) {
        messageDisplayEl.innerHTML = `Then try to guess what the generated n-value is using the same input for your guesses.`;
        pageTurner++;
    } else if (pageTurner === 3) {
        messageDisplayEl.innerHTML = `If you want clues on what the [n-value] may be use the buttons below to (possibly) change the min and max values.<br />The [n-value] will always be within the displayed range.`;
        pageTurner++;
    } else if (pageTurner === 4) {
        messageDisplayEl.innerHTML = `You can use the [Start] button to start a game with a random range (min 1-100, max 100-1000) or the [Reset] button to return to the beginning without refreshing the page.`;
        pageTurner++;
    } else if (pageTurner === 5) {
        messageDisplayEl.innerHTML = `If you'd like to know more on what the buttons do refer to the README.`;
        pageTurner++;
    } else if (pageTurner === 6) {
        messageDisplayEl.innerHTML = `Would you like to read the rules again?<br />Y/N?`;
        hideConfirmPrompt();
        guessEl.addEventListener("keypress", readingRules);
        pageTurner++;
        divBtnElRed.style.cursor = "pointer";
        setTimeout(() => { divBtnEls.addEventListener("click", readingRules) }, 100);
    }
};

// creates 'click to continue' message and adds it to the maxDisplayEl
const showConfirmPrompt = () => {
    // create and add parent div to format confirm prompt
    const centeringDiv = document.createElement("div");
    centeringDiv.classList.add("centerConfirm");
    maxDisplayEl.appendChild(centeringDiv);
    const confirmBtnDisplay = document.createElement("div");
    confirmBtnDisplay.classList.add("deco-button");
    confirmBtnDisplay.id = "confirm";
    centeringDiv.appendChild(confirmBtnDisplay);
    const confirmPromptP = document.createElement("p");
    confirmPromptP.innerHTML = `Click on<br />to continue`;
    centeringDiv.prepend(confirmPromptP);
};

// removes the 'click to continue' message
const hideConfirmPrompt = () => {
    const centeringDivEls = document.getElementsByClassName("centerConfirm");
    // change to for-of loop to keep consistent results in removing elements
    for (const el of centeringDivEls) {
        el.remove();
    }
};

// resets the message position after the styling changes during custom range setting
const resetMessageFormatting = () => {
    messageDisplayEl.style.textAlign = "center";
    messageDisplayEl.style.alignItems = "center";
    messageDisplayEl.style.justifyContent = "center";
};

// function called on page load to set up game
const introScreen = () => {
    grayButtons();
    messageDisplayEl.innerHTML = `Welcome. This is <span style="color: white; margin: 0 1.5dvw;">The Big O<sub><em>(n)</em></sub></span>number guessing game.`;
    !maxDisplayEl.textContent ? showConfirmPrompt() : "";
    divBtnElGrn.style.cursor = "pointer";
    divBtnElGrn.addEventListener("click", nextMsg)
    resetMessageFormatting();
    startResetContainer.addEventListener("click", startReset);
    guessEl.removeEventListener("keypress", getRange);
    guessEl.type = "text";
    guessEl.value = "";
};

// adds functionality to start and reset div element buttons
const startReset = event => {
    if (event.target.id === "start") {
        startBtnSound.play();
        reset();
        divBtnElGrn.style.cursor = "default";
        divBtnElRed.style.cursor = "default";
        divBtnElGrn.removeEventListener("click", nextMsg)
        const randomMin = Math.floor(Math.random() * 100);
        const randomMax = Math.ceil(Math.random() * 900) + 100;
        minRangeValue = randomMin;
        maxRangeValue = randomMax;
        calcRange(randomMin, randomMax);
        updateRange();
        startRound();
    } else if (event.target.id === "reset") {
        resetBtnSound.play();
        reset();
        introScreen();
    }
};

introScreen();