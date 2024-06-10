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
const divBtnEl = document.getElementById("button-container");
const divBtnElBlu = document.getElementById("but-one");
const divBtnElGrn = document.getElementById("but-two");
const divBtnElRed = document.getElementById("but-three");
const startResetContainer = document.getElementById("start-reset");

let minRangeValue;
let maxRangeValue;
let nValue;
let tries = 0;
let win = false;
let isRangeSet = false;
let interID; // stores the random number visual change as a setInterval()
let isSwitch = false; // switch to allow for different randomNumber range generation
let isStart = false;
let isReadRules = false;
let pageTurner = 0;

const guess = () => {
    if (event.key === "Enter") {
        if (guessEl.value < minRangeValue || guessEl.value > maxRangeValue) {
            messageDisplayEl.innerHTML = `Please enter a valid number<br/> ${3 - tries} attempt(s) left`;
        } else if (tries < 3 && guessEl.value) {
            const attempt = event.target.value;
            tries++;
            showTries(verify(parseInt(attempt)));
            winLose();
        }
        guessEl.value = "";
    }
};

const verify = (number) => {
    if (number === nValue) {
        win = true;
    } else if (number < nValue) {
        return "Underestimated";
    } else if (number > nValue) {
        return "Overestimated"
    }
};

const winLose = () => {
    if (tries === 3 && !win) {
        clearInterval(interID);
        nDisplayEl.innerHTML = "(´。＿。｀)";
        messageDisplayEl.innerHTML = `No more tries left.<br> Try again?<br> Y/N?`;
        resetPrompt()
    } else if (win) {
        clearInterval(interID);
        nDisplayEl.innerText = `
        *★,°*:.☆(￣▽￣)/$:*.°★* 。
        n was ${nValue}`;
        messageDisplayEl.innerHTML = `You did it. You figured out a number.<br> Try again?<br> Y/N?`;
        addWinAnim();
        resetPrompt();
    }
};

const showTries = (message) => {
    messageDisplayEl.innerHTML = message += `<br/> ${3 - tries} attempt(s) left`;
}

const updateRange = () => {
    if (minRangeValue > 999) {
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
    const randomMinRangeValue = nMinDif - Math.floor((Math.random() * nMinDif));
    if (randomMinRangeValue < minRangeValue && maxMinDif < nValue) {
        showTries(`max-min-ing comparison results in no change in range`);
    } else if (nMinDif < nValue || maxMinDif > nValue) {
        if (randomMinRangeValue > minRangeValue) {
            // add some randomness to change of new min-value to make it harder to determine n-value from the change
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

const calcRange = (min, max) => {
    nValue = Math.ceil(Math.random() * (max - min)) + min;
    console.log(nValue);
};

const startRound = () => {
    interID = setInterval(randomNumbers, 100);
    guessEl.value = "";
    messageDisplayEl.innerHTML = `n is between ${minRangeValue} and ${maxRangeValue}
    <br />Tries left: ${3 - tries}`;
    messageDisplayEl.style.textAlign = "center";
    messageDisplayEl.style.alignItems = "center";
    messageDisplayEl.style.justifyContent = "center";
    guessEl.removeEventListener("keypress", getRange);
    guessEl.addEventListener("keypress", guess);
    addHelpBtnFunc();
    addBtnAnimations();
    colorInBtn();
    enableButtons();
};

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


const resetCall = event => {
    if (event.key === "Enter") {
        if (guessEl.value === "Y") {
            reset()
            setRange();
        } else if (guessEl.value === "N") {
            for (const element in numberEls) {
                numberEls[element].textContent = ``;
            };
            messageDisplayEl.textContent = ``;
            guessEl.value = ``;
            clearInterval(interID);
            guessEl.disabled = true;
            nDisplayEl.innerHTML = `<div id="pending">.</div>`;
            removeWinAnim();
            removeBtnAnimations();
        }
    }
};

const resetPrompt = () => {
    guessEl.removeEventListener("keypress", guess);
    grayButtons();
    guessEl.type = "text";
    guessEl.addEventListener("keypress", resetCall);
}

const reset = event => {
    guessEl.removeEventListener("keypress", resetCall);
    minRangeValue = "";
    maxRangeValue = "";
    isRangeSet = false;
    win = false;
    tries = 0;
    nValue = 0;
    nDisplayEl.innerHTML = `<div id="pending">.</div>`;
    minDisplayEl.textContent = "";
    maxDisplayEl.textContent = "";
    guessEl.value = "";
    guessEl.type = "number";
    guessEl.disabled = false;
    removeWinAnim();
    setRange();
    divBtnElGrn.removeEventListener("click", nextMsg)
    clearInterval(interID);
};

const disableButtons = () => {
    //  removes style for game ending
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
    divBtnEl.classList.add("colorFlash");
}

const removeWinAnim = () => {
    padEl.classList.remove("spin");
    divBtnEl.classList.remove("colorFlash");
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

const bwGrayOut = () => {
    event.target.style.filter = `invert(30%)`;
};

const colorInBtn = () => {
    highLowBtn.style.filter = ``;
    evenOddBtn.style.filter = ``;
    maxMinIngBtn.style.filter = ``;
    dividingEndsBtn.style.filter = ``;
};

const addGrayOut = () => {
    highLowBtn.addEventListener("click", grayOut);
    evenOddBtn.addEventListener("click", bwGrayOut);
    maxMinIngBtn.addEventListener("click", grayOut);
    dividingEndsBtn.addEventListener("click", grayOut);
};

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
    if (event.key === "Enter") {
        if (guessEl.value === "Y") {
            pageTurner = 0;
            isReadRules = true;
            messageDisplayEl.innerHTML = `The point of the game is to find n's point between the range of a min and max.`;
            guessEl.removeEventListener("keypress", readingRules);
            showConfirmPrompt();
            divBtnElGrn.addEventListener("click", nextMsg);
        } else if (guessEl.value === "N") {
            guessEl.removeEventListener("keypress", readingRules);
            setRange();
            divBtnElGrn.removeEventListener("click", nextMsg)
        }
        guessEl.value = "";
    }
};

const nextMsg = () => {
    if (!isReadRules) {
        divBtnElGrn.removeEventListener("click", nextMsg)
        hideConfirmPrompt();
        messageDisplayEl.innerHTML = `Would you like to read the rules?<br />Y/N?`;
        guessEl.type = "text";
        guessEl.addEventListener("keypress", readingRules);
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
        messageDisplayEl.innerHTML = `If you'd like to know more on what the buttons do refer to the README.`;
        pageTurner++;
    } else if (pageTurner === 5) {
        messageDisplayEl.innerHTML = `Would you like to read the rules again?<br />Y/N?`;
        hideConfirmPrompt();
        guessEl.addEventListener("keypress", readingRules);
    }
};

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

const hideConfirmPrompt = () => {
    const centeringDivEls = document.getElementsByClassName("centerConfirm");
    // change to for-of loop to keep consistent results in removing elements
    for (const el of centeringDivEls) {
        el.remove();
    }
};

const introScreen = () => {
    grayButtons();
    messageDisplayEl.innerHTML = `Welcome. This is the Big O<sub><em>(n)</em></sub>number guessing game.`;
    !maxDisplayEl.textContent ? showConfirmPrompt() : "";
    divBtnElGrn.addEventListener("click", nextMsg)
    messageDisplayEl.style.textAlign = "center";
    messageDisplayEl.style.alignItems = "center";
    messageDisplayEl.style.justifyContent = "center";
    startResetContainer.addEventListener("click", startReset);
    guessEl.removeEventListener("keypress", getRange);
    guessEl.type = "text";
};

const startReset = event => {
    if (event.target.id === "start") {
        reset();
        divBtnElGrn.removeEventListener("click", nextMsg)
        const randomMin = Math.floor(Math.random() * 100);
        const randomMax = Math.ceil(Math.random() * 900) + 100;
        minRangeValue = randomMin;
        maxRangeValue = randomMax;
        calcRange(randomMin, randomMax);
        updateRange();
        startRound();
    } else if (event.target.id === "reset") {
        reset();
        introScreen();
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing area
///////////////////////////////////////////////////////////////////////////////////////////////



introScreen();
// reset();