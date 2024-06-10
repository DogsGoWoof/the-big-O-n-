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

let minRangeValue;
let maxRangeValue;
let nValue;
let tries = 0;
let win = false;
let isRangeSet = false;
let interID;

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
        return `On the dot`;
    } else if (number > nValue && (number - nValue) < 3) {
        return `Apro-sO close`;
    } else if (number < nValue && (nValue - number) < 3) {

    } else {
        return `Off the mark`;
    }
};

const winLose = () => {
    if (tries === 3 && !win) {
        clearInterval(interID);
        nDisplayEl.innerHTML = "No O<sub>(n)</sub>";
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
    minDisplayEl.textContent = minRangeValue;
    maxDisplayEl.textContent = maxRangeValue;
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
    if (nMinDif < nValue || maxMinDif < maxRangeValue) {
        if (nMinDif > minRangeValue) {
            minRangeValue = nMinDif;
            showTries(`min-ing max-value`);0
        } else if (maxMinDif > nValue) {
            maxRangeValue = maxMinDif;
            showTries(`max-ing min value`);
        }
        updateRange();
        maxMinIngBtn.disabled = true;
        maxMinIngBtn.style.filter = `grayscale(200%)`;
        maxMinIngBtn.classList.toggle("bigSmall");
    } else {
        showTries(`Comparison results in no change`);
    };
}

const dividingEnds = () => {
    const dividedNValue = nValue / minRangeValue;
    const dividedRangeValue = maxRangeValue / nValue;
    const dividedRatio = (dividedRangeValue / dividedNValue);
    const tempMin = Math.floor(minRangeValue * dividedRatio);
    const tempMax = Math.ceil(maxRangeValue / dividedRatio);
    if (minRangeValue > 0 && (tempMin > minRangeValue || tempMax < maxRangeValue)) {
        if (dividedRatio < 1) {
            minRangeValue *= Math.floor(dividedNValue / dividedRangeValue);
            showTries(`min:n ratio is wider`);
        } else if (dividedRatio === 1) {
            showTries(`Equal ratios`);
        } else {
            maxRangeValue = Math.ceil(maxRangeValue * (dividedNValue / dividedRangeValue));
            showTries(`n:max ratio is wider`);
        }
        updateRange();
        dividingEndsBtn.disabled = true;
        dividingEndsBtn.style.filter = `grayscale(200%)`;
        dividingEndsBtn.classList.toggle("colorFlashHov");
    }
    showTries(`Comparison results in no change`);
};

const calcRange = (min, max) => {
    nValue = Math.ceil(Math.random() * (max - min)) + min;
    console.log(nValue);
};

const getRange = event => {
    if (event.key === "Enter") {
        if (!guessEl.value) {
            messageDisplayEl.innerText = `
            ㄟ( ▔, ▔ )ㄏ
            Please enter a valid number`;
            guessEl.value = ``;
        } else if (!isRangeSet && typeof minRangeValue !== "number" && guessEl.value >= 0) {
            minRangeValue = parseInt(guessEl.value);
            minDisplayEl.textContent = minRangeValue;
            messageDisplayEl.style.textAlign = "right";
            messageDisplayEl.innerText = `
            (づ￣ 3￣)づ
            Please enter range of [n]'s max-value`;
            messageDisplayEl.style.justifyContent = "end";
            guessEl.value = ``;
        } else if (typeof maxRangeValue !== "number" && guessEl.value > minRangeValue) {
            maxRangeValue = parseInt(guessEl.value);
            maxDisplayEl.textContent = maxRangeValue;
            calcRange(minRangeValue, maxRangeValue);
            isRangeSet = true;
            interID = setInterval(randomNumbers, 100);
            guessEl.value = ``;
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
        }
    }
};

const setRange = () => {
    disableButtons();
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
    disableButtons();
    removeBtnAnimations();
    removeHelpBtnFunc();
    highLowBtn.style.filter = `grayscale(200%)`;
    evenOddBtn.style.filter = `invert(30%)`;
    maxMinIngBtn.style.filter = `grayscale(200%)`;
    dividingEndsBtn.style.filter = `grayscale(200%)`;
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
    messageDisplayEl.textContent = `Please enter range of [n]'s min-value`;
    removeWinAnim();
    setRange();
    // divBtnEl.classList.remove("grayOut");
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
    const randomNumber = Math.ceil(Math.random() * (maxRangeValue - minRangeValue)) + minRangeValue;
    nDisplayEl.innerHTML = `<br>${randomNumber}`;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing area
///////////////////////////////////////////////////////////////////////////////////////////////
let isStart = false;
let isReadRules = false;
let pageTurner = 0;

const readingRules = event => {
    if (event.key === "Enter") {
        if (guessEl.value === "Y"){
            isReadRules = true;
            messageDisplayEl.innerHTML = `The point of the game is to find n's point between the range of a min and max.`;
            guessEl.removeEventListener("keypress", readingRules);
            showConfirmPrompt();
            divBtnElGrn.addEventListener("click", nextMsg);
        } else if (guessEl.value === "N") {
            guessEl.removeEventListener("keypress", readingRules);
            setRange();
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
        messageDisplayEl.innerHTML = `First, set a range in which n will be between.`;
        pageTurner++;
    } else if (pageTurner === 1) {
        messageDisplayEl.innerHTML = `Choose the minimum and maximum range values by entering them in the input followed by pressing "Enter".`;
    } else if (pageTurner === 2) {
        messageDisplayEl.innerHTML = `Then try to guess what the generated n-value is using the same input for your guesses.`;
    } else if (pageTurner === 2) {
        messageDisplayEl.innerHTML = `Then try to guess what the generated n-value is using the same input for your guesses.`;
    }
};

const showConfirmPrompt = () => {
    const confirmBtnDisplay = document.createElement("div");
    confirmBtnDisplay.classList.add("deco-button");
    confirmBtnDisplay.id = "confirm";
    maxDisplayEl.appendChild(confirmBtnDisplay);
    const confirmPromptP = document.createElement("p");
    confirmPromptP.innerHTML = `Click on<br />to continue`;
    maxDisplayEl.prepend(confirmPromptP);
};

const hideConfirmPrompt = () => {
    const firstChildOfDisp = maxDisplayEl.childNodes[0];
    const secondChildOfDisp = maxDisplayEl.childNodes[1]
    secondChildOfDisp.remove();
    firstChildOfDisp.remove();
};

const introScreen = () => {
    messageDisplayEl.innerHTML = `Welcome. This is the Big O<sub><em>(n)</em></sub>number guessing game.`;
    showConfirmPrompt();
    divBtnElGrn.addEventListener("click", nextMsg)
};

introScreen();

// reset();