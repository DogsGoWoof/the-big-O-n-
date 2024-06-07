const body = document.body;
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

let minRangeValue;
let maxRangeValue;
let nValue;
let tries = 0;
let win = false;

const guess = () => {
    if (event.key === "Enter" && tries < 3) {
        const attempt = event.target.value;
        guessEl.value = "";
        tries++;
        showTries(verify(parseInt(attempt)));
        winLose();
    }
};

const calcRange = (min, max) => {
    const randomRangeValue = Math.floor(Math.random() * (max - min) + 1) + min;
    nValue = randomRangeValue;
    minRangeValue = min;
    maxRangeValue = max;
    return [min, nValue, max];
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
        messageDisplayEl.innerHTML = `No more tries left.<br> Try again?<br> Y/N?`;
        resetPrompt()
    } else if (win) {
        padEl.classList.toggle("spin");
        divBtnEl.classList.toggle("colorFlash");
        messageDisplayEl.innerHTML = `You did it. You figured out a number.<br> Try again?<br> Y/N?`;
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

const setRange = () => {
    const min = 1;
    const max = 3;
    calcRange(min, max);
};

const randomNumbers = () => {
    const randomNumber = Math.floor(Math.random() * (maxRangeValue - minRangeValue) + 1) + minRangeValue;
    nDisplayEl.innerHTML = `<br>${randomNumber}`;
};

const highLow = () => {
    const number = parseInt(guessEl.value);
    if (number <= nValue && number > minRangeValue) {
        showTries(`Within lower range`);
        minRangeValue = number;
        highLowBtn.disabled = true;
    } else if (number >= nValue && number < maxRangeValue) {
        showTries(`Within higher range`);
        maxRangeValue = number;
        highLowBtn.disabled = true;
    }
    updateRange();
    // highLowBtn.removeEventListener("click", highLow);
};

const evenOdd = () => {
    showTries(nValue % 2 === 0 ? `Even` : `Odd`);
    // evenOddBtn.removeEventListener("click", evenOdd);
    evenOddBtn.disabled = true;
};

const maxMin = () => {
    const maxAMinion = maxRangeValue - minRangeValue;
    if (maxAMinion >= nValue) {
        maxRangeValue = maxAMinion;
        showTries(`min-ing max-value`);
    } else {
        minRangeValue = maxAMinion;
        showTries(`max-ing min value`);
    }
    updateRange();
    // maxMinIngBtn.removeEventListener("click", maxMin);
    maxMinIngBtn.disabled = true;
};

const dividingEnds = () => {
    const dividedNValue = nValue / minRangeValue;
    const dividedRangeValue = maxRangeValue / nValue;
    if (dividedNValue > dividedRangeValue) {
        minRangeValue *= Math.floor(dividedNValue / dividedRangeValue);
        showTries(`min:n ratio is wider`);
    } else if (dividedNValue === dividedRangeValue) {
        showTries(`Equal ratios`);
    } else {
        maxRangeValue = Math.ceil(maxRangeValue *(dividedNValue / dividedRangeValue));
        showTries(`n:max ratio is wider`);
    }
    updateRange();
    // dividingEndsBtn.removeEventListener("click", dividingEnds); 
    dividingEndsBtn.disabled = true;
};

const resetPrompt = () => {
    disableButtons();
    guessEl.type = "text";
    guessEl.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            if (guessEl.value === "Y") {
                reset();
            } else if (guessEl.value === "N") {
                for (const element in numberEls) {
                    numberEls[element].textContent = ``;
                };
                messageDisplayEl.textContent = ``;
                guessEl.value = ``;
                clearInterval(interID);
                guessEl.disabled = true;
                nDisplayEl.innerHTML = `<div id="pending">.</div>`;
            }
        }
    });
}

const reset = () => {
    tries = 0;
    guessEl.type = "number";
    guessEl.value = "";
    messageDisplayEl.textContent = "";
    guessEl.addEventListener("keypress", guess);
    highLowBtn.disabled = false;
    dividingEndsBtn.disabled = false;
    evenOddBtn.disabled = false;
    maxMinIngBtn.disabled = false;
    highLowBtn.addEventListener("click", highLow);
    evenOddBtn.addEventListener("click", evenOdd);
    dividingEndsBtn.addEventListener("click", dividingEnds);
    maxMinIngBtn.addEventListener("click", maxMin);
    interID = setInterval(randomNumbers, 100);
    padEl.classList.remove("spin");
    divBtnEl.classList.remove("colorFlash");
};

const disableButtons = () => {
    for (const button in buttonEls) {
        buttonEls[button].disabled = true;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing area
///////////////////////////////////////////////////////////////////////////////////////////////
let interID;
const test = (a, b) => {
    const madeRange = calcRange(a, b);
    minDisplayEl.textContent = madeRange[0];
    maxDisplayEl.textContent = madeRange[2];
}

reset();
test(1, Math.ceil((Math.random() * 1000)));
console.log(nValue);