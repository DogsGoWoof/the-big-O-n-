const body = document.body;
const guessEl = document.getElementById("guess");
const minDisplayEl = document.getElementById("min-value");
const maxDisplayEl = document.getElementById("max-value");
const nDisplayEl = document.getElementById("n-value");
const messageDisplayEl = document.getElementById("message");
const highLowBtn = document.getElementById("high-low");
const dividingEndsBtn = document.getElementById("dividends");
const evenOddBtn = document.getElementById("even-odd");


const originalLimits = [];
const currentLimits = [];
let minRangeValue;
let maxRangeValue;
let nValue;
let tries = 0;
let lose = false;
let win = false;

const guess = () => {
    const attempt = event.target.value;
    tries++;
    messageDisplayEl.textContent = verify(parseInt(attempt));
    winLose();
};

const calcRange = (min, max) => {
    const randomRangeValue = Math.floor(Math.random() * max + 1);
    nValue = randomRangeValue;
    minRangeValue = min;
    maxRangeValue = max;
    console.log(nValue);
    return [min, nValue, max];
};

const verify = (number) => {
    return number === nValue ? `On the dot` : `Off the mark ${tries}`;
};

const winLose = () => {
    if (tries === 3) {
        messageDisplayEl.textContent = `No more tries left. Try again?`;
    }
};

const updateRange = () => {
    minDisplayEl.textContent = minRangeValue;
    maxDisplayEl.textContent = maxRangeValue;
};

const highLow = (number)  => {
    console.log(number);
    console.log(nValue);
    if (number <= nValue && number > minRangeValue) {
        messageDisplayEl.textContent = `Within lower range`;
        minRangeValue = number;
        tries++;
    } else if (number >= nValue && number < maxRangeValue) {
        messageDisplayEl.textContent = `Within higher range`;
        maxRangeValue = number;
        tries++;
    }
};

const evenOdd = () => {
    console.log('test0');
    tries++
    nValue % 2 === 0 ? messageDisplayEl.textContent = `Even` : `Odd`;
    evenOddBtn.removeEventListener("click", evenOdd);
}

const dividingEnds = (number) => {
    const dividedValue = nValue / number;
}

guessEl.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        guess();
        guessEl.value = "";
    }
})

highLowBtn.addEventListener("click", () => {
    highLow(parseInt(guessEl.value));
    updateRange();
});

evenOddBtn.addEventListener("click", evenOdd);

const test = (a, b) => {
    const madeRange = calcRange(a, b);
    minDisplayEl.textContent = madeRange[0];
    maxDisplayEl.textContent = madeRange[2];
}

test(1, 100);