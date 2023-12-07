import { domElements } from "./dom-elements.js";
import { TimeFunctions } from "./time-functions.js";
import {
  generateMatchingWordAndColor,
  generateMismatchedWordAndColor,
} from "./word-color-generation.js";

const timeFunctions = new TimeFunctions();

export let numberOfWords;
export let evaluatingMeaningOrColor;

export let matchedTimes = [];
export let mismatchedTimes = [];

let matchingCounter = 0;
let mismatchedCounter = 0;
let firstPhaseCorrect = 0;
let score = 0;
export let incorrectCounter = 0;

const sumOfArray = (array) => array.reduce((a, b) => a + b, 0);
const getButtonText = (button$) => button$.innerHTML;
const toggleDomElementsDisplay = (elements$) =>
  elements$.forEach((el$) => el$.classList.toggle("no-display"));

const getPrintedWordText = () => domElements.wordDisplayArea.innerHTML;
const getPrintedWordColor = () => domElements.wordDisplayArea.style.color;
const getPrintedWordTextTwo = () => domElements.wordDisplayAreaTwo.innerHTML;
const getPrintedWordColorTwo = () => domElements.wordDisplayAreaTwo.style.color;
const isPrintedWordMatching = () =>
  getPrintedWordText() === getPrintedWordColor();

const isPrintedWordMatchingTwo = () =>
  getPrintedWordTextTwo() === getPrintedWordColorTwo();
// const getQuantityFieldValue = () =>
//   domElements.formElements.stimulusNumberField.value;

/** Checks if user wants to evaluate word meaning or word color */
function getRadioButtonChoice() {
  const { wordMeaningRadioButton, wordColorRadioButton } =
    domElements.formElements;

  let generationFunction;

  if (wordMeaningRadioButton.checked) {
    generationFunction = getPrintedWordText;
  } else if (wordColorRadioButton.checked) {
    generationFunction = getPrintedWordColor;
  }

  return generationFunction;
}

/** Turns choice button gray for 0.2 seconds after numpad button press */
function indicateButtonChoice(button$) {
  button$.style.backgroundColor = "#BFBFBF";
  setTimeout(function () {
    button$.style.backgroundColor = "whitesmoke";
  }, 200);
}

function addEventListenersToNumpadKeys() {
  document.addEventListener("keydown", (event) => {
    const { redChoice, greenChoice, blueChoice } = domElements.buttons;

    switch (event.key) {
      case "1":
        handleColorButtonClick(redChoice);
        indicateButtonChoice(redChoice);
        break;
      case "2":
        handleColorButtonClick(greenChoice);
        indicateButtonChoice(greenChoice);
        break;
      case "3":
        handleColorButtonClick(blueChoice);
        indicateButtonChoice(blueChoice);
        break;
    }
  });
}
function addEventListenersToNumpadKeysTwo() {
  document.addEventListener("keydown", (event) => {
    const { redChoiceTwo, greenChoiceTwo, blueChoiceTwo } = domElements.buttons;

    switch (event.key) {
      case "1":
        handleColorButtonClickTwo(redChoiceTwo);
        indicateButtonChoice(redChoiceTwo);
        break;
      case "2":
        handleColorButtonClickTwo(greenChoiceTwo);
        indicateButtonChoice(greenChoiceTwo);
        break;
      case "3":
        handleColorButtonClickTwo(blueChoiceTwo);
        indicateButtonChoice(blueChoiceTwo);
        break;
    }
  });
}

function handleMatchScenario() {
  matchingCounter++;
  matchedTimes.push(timeFunctions.logTime());
}

function handleMismatchScenario() {
  mismatchedCounter++;
  mismatchedTimes.push(timeFunctions.logTime());
}

const handleCorrectButtonAnswer = () =>
  isPrintedWordMatching() ? handleMatchScenario() : handleMismatchScenario();

const handleCorrectButtonAnswerTwo = () =>
  isPrintedWordMatchingTwo() ? handleMatchScenario() : handleMismatchScenario();

const handleIncorrectButtonAnswer = () => incorrectCounter++;

/** Checks if user's answer was correct */
function handleButtonAnswer(button$) {
  let isCorrect = false;

  if (evaluatingMeaningOrColor === getPrintedWordText) {
    console.log("evaluatingMeaningOrColor === getPrintedWordText");
    console.log("getButtonText(button$)", getButtonText(button$));
    console.log("getPrintedWordText()", getPrintedWordText());
    getButtonText(button$) === getPrintedWordText()
      ? handleCorrectButtonAnswer()
      : handleIncorrectButtonAnswer();
    isCorrect = getButtonText(button$) === getPrintedWordText();
  } else {
    console.log("evaluatingMeaningOrColor === getPrintedWordColor");
    console.log("getButtonText(button$)", getButtonText(button$));
    console.log("getPrintedWordColor()", getPrintedWordColor());
    getButtonText(button$) === getPrintedWordColor()
      ? handleCorrectButtonAnswer()
      : handleIncorrectButtonAnswer();
    isCorrect = getButtonText(button$) === getPrintedWordColor();
  }

  if (isCorrect) {
    handleCorrectButtonAnswer();
    console.log("Correct!");
  } else {
    handleIncorrectButtonAnswer();
    console.log("Incorrect!");
  }
}

function handleButtonAnswerTwo(button$) {
  let isCorrect = false;

  if (evaluatingMeaningOrColor === getPrintedWordTextTwo) {
    console.log("evaluatingMeaningOrColor === getPrintedWordText");
    console.log("getButtonText(button$)", getButtonText(button$));
    console.log("getPrintedWordText()", getPrintedWordTextTwo());
    getButtonText(button$) === getPrintedWordTextTwo()
      ? handleCorrectButtonAnswerTwo()
      : handleIncorrectButtonAnswer();
    isCorrect = getButtonText(button$) === getPrintedWordTextTwo();
  } else {
    console.log("evaluatingMeaningOrColor === getPrintedWordColor");
    console.log("getButtonText(button$)", getButtonText(button$));
    console.log("getPrintedWordColorTwo()", getPrintedWordColorTwo());
    getButtonText(button$) === getPrintedWordColorTwo()
      ? handleCorrectButtonAnswerTwo()
      : handleIncorrectButtonAnswer();
    isCorrect = getButtonText(button$) === getPrintedWordColorTwo();
  }

  if (isCorrect) {
    handleCorrectButtonAnswerTwo();
    console.log("Correct!");
  } else {
    handleIncorrectButtonAnswer();
    console.log("Incorrect!");
  }
}

/** Randomly generates a matching or mismatched word-color pair and displays it */
function displayNewPrintedWord() {
  const { wordDisplayArea } = domElements;

  let generationFunction;

  if (matchingCounter >= numberOfWords && mismatchedCounter < numberOfWords) {
    generationFunction = generateMismatchedWordAndColor;
  } else if (
    mismatchedCounter >= numberOfWords &&
    matchingCounter < numberOfWords
  ) {
    generationFunction = generateMatchingWordAndColor;
  } else {
    generationFunction =
      Math.round(Math.random()) === 0
        ? generateMismatchedWordAndColor
        : generateMatchingWordAndColor;
  }

  const pair = generationFunction();
  wordDisplayArea.innerHTML = pair[0];
  wordDisplayArea.style.color = pair[1];
}

/** Randomly generates a matching or mismatched word-color pair and displays it */
function displayNewPrintedWordTwo() {
  console.log("displayNewPrintedWordTwo");
  const { wordDisplayAreaTwo } = domElements;

  let generationFunction;

  if (matchingCounter >= numberOfWords && mismatchedCounter < numberOfWords) {
    console.log(
      "matchingCounter >= numberOfWords && mismatchedCounter < numberOfWords"
    );
    generationFunction = generateMismatchedWordAndColor;
  } else if (
    (console.log(
      "mismatchedCounter >= numberOfWords && matchingCounter < numberOfWords"
    ),
    mismatchedCounter >= numberOfWords && matchingCounter < numberOfWords)
  ) {
    console.log(
      "mismatchedCounter >= numberOfWords && matchingCounter < numberOfWords"
    );
    generationFunction = generateMatchingWordAndColor;
  } else {
    console.log("else");
    generationFunction =
      Math.round(Math.random()) === 0
        ? generateMismatchedWordAndColor
        : generateMatchingWordAndColor;
  }

  const pair = generationFunction();
  wordDisplayAreaTwo.innerHTML = pair[0];
  wordDisplayAreaTwo.style.color = pair[1];
}

function displayNewWordAndRestartTimer() {
  displayNewPrintedWord();
  timeFunctions.restartTimer();
}
function displayNewWordAndRestartTimerTwo() {
  console.log("displayNewWordAndRestartTimerTwo");
  displayNewPrintedWordTwo();
  timeFunctions.restartTimer();
}

/** Validates number input, hides start button, shows color buttons, displays printed word and (re)starts timer */
function handleStartClick() {
  numberOfWords = 20;
  evaluatingMeaningOrColor = getPrintedWordText; // phase 2: getPrintedWordText

  const {
    form,
    buttons: { start, redChoice, greenChoice, blueChoice },
  } = domElements;

  toggleDomElementsDisplay([form, start, redChoice, greenChoice, blueChoice]);
  domElements.containers.starting.remove();

  addEventListenersToNumpadKeys();

  displayNewWordAndRestartTimer();

  setTimeout(endTest, 45000);
}

function handleStartClick2() {
  numberOfWords = 20;
  evaluatingMeaningOrColor = getPrintedWordColor; // phase 2

  // Clear counters for the second phase
  matchedTimes = [];
  mismatchedTimes = [];
  matchingCounter = 0;
  mismatchedCounter = 0;
  incorrectCounter = 0;

  const {
    form,
    buttons: { startTwo, redChoiceTwo, greenChoiceTwo, blueChoiceTwo },
  } = domElements;
  toggleDomElementsDisplay([
    form,
    startTwo,
    redChoiceTwo,
    greenChoiceTwo,
    blueChoiceTwo,
  ]);

  domElements.containers.end.remove();

  addEventListenersToNumpadKeysTwo();
  console.log("addEventListenersToNumpadKeysTwo");
  displayNewWordAndRestartTimerTwo();

  setTimeout(endTest2, 45000);
}

function handleLearnClick() {
  const {
    wordDisplayAreaTwo,
    wordDisplayAreaThree,
    containers: { result },
    buttons: { redChoiceTwo, greenChoiceTwo, blueChoiceTwo },
  } = domElements;

  toggleDomElementsDisplay([
    wordDisplayAreaTwo,
    wordDisplayAreaThree,
    result,
    redChoiceTwo,
    greenChoiceTwo,
    blueChoiceTwo,
  ]);
  domElements.containers.endTwo.remove();

  const { wordDisplayAreaFour } = domElements;
  wordDisplayAreaFour.innerHTML = "Your Score: " + score.toString();
  wordDisplayAreaFour.style.color = "white";
}

function handleColorButtonClick(buttonClicked$) {
  handleButtonAnswer(buttonClicked$);
  displayNewWordAndRestartTimer();
  logInfo();
}
function handleColorButtonClickTwo(buttonClicked$) {
  console.log("handleColorButtonClickTwo");
  handleButtonAnswerTwo(buttonClicked$);
  console.log("handleButtonAnswer(buttonClicked$);");
  displayNewWordAndRestartTimerTwo();
  logInfo();
}

/** Logs reaction times and number of words in the console */
function logInfo() {
  console.log("Matched times", matchedTimes);
  console.log("Mismatched times", mismatchedTimes);
  console.log("Matches", matchingCounter);
  console.log("Mismatches", mismatchedCounter);
}

/** Removes test container with choice buttons and displays end information counters */
function endTest() {
  const {
    wordDisplayArea,
    containers: { result },
    buttons: { redChoice, greenChoice, blueChoice },
  } = domElements;

  toggleDomElementsDisplay([
    wordDisplayArea,
    result,
    redChoice,
    greenChoice,
    blueChoice,
  ]);
  domElements.containers.test.remove();

  firstPhaseCorrect = matchingCounter / 2 + mismatchedCounter / 2;

  addEndTestCounters();

  const { startTwo, redChoiceTwo, greenChoiceTwo, blueChoiceTwo } =
    domElements.buttons;
  startTwo.addEventListener("click", () => handleStartClick2());

  redChoiceTwo.addEventListener("click", () =>
    handleColorButtonClickTwo(redChoiceTwo)
  );
  greenChoiceTwo.addEventListener("click", () =>
    handleColorButtonClickTwo(greenChoiceTwo)
  );
  blueChoiceTwo.addEventListener("click", () =>
    handleColorButtonClickTwo(blueChoiceTwo)
  );
}

/** Removes test container with choice buttons and displays end information counters */
function endTest2() {
  const {
    wordDisplayAreaTwo,
    containers: { result },
    buttons: { redChoiceTwo, greenChoiceTwo, blueChoiceTwo },
  } = domElements;

  toggleDomElementsDisplay([
    wordDisplayAreaTwo,
    result,
    redChoiceTwo,
    greenChoiceTwo,
    blueChoiceTwo,
  ]);
  domElements.containers.testTwo.remove();
  const { wordDisplayAreaThree } = domElements;

  addEndTestCountersTwo();

  let secondPhaseCorrect = matchingCounter / 2 + mismatchedCounter / 2;

  score =
    (firstPhaseCorrect * secondPhaseCorrect) /
    (firstPhaseCorrect + secondPhaseCorrect);

  wordDisplayAreaThree.innerHTML = "Your Score: " + score.toString();
  wordDisplayAreaThree.style.color = "white";

  const { learn } = domElements.buttons;
  learn.addEventListener("click", () => handleLearnClick());
}

/** Displays matching & mismatched time averages and incorrect counter */
function addEndTestCounters() {
  // # of matched correct words
  // # of mismatched correct words
  // # of incorrect
  let num_matching_correct = matchingCounter / 2;
  let num_mismatching_correct = mismatchedCounter / 2;
  let incorrectCount = incorrectCounter / 2;
  domElements.timeDivs.matched.innerHTML = num_matching_correct;
  domElements.timeDivs.mismatched.innerHTML = num_mismatching_correct;
  domElements.incorrectDiv.innerHTML = incorrectCount;
}
function addEndTestCountersTwo() {
  // # of matched correct words
  // # of mismatched correct words
  // # of incorrect
  let num_matching_correct = matchingCounter / 2;
  let num_mismatching_correct = mismatchedCounter / 2;
  let incorrectCount = incorrectCounter / 2;
  domElements.timeDivs.matchedScore.innerHTML = num_matching_correct;
  domElements.timeDivs.mismatchedScore.innerHTML = num_mismatching_correct;
  domElements.incorrectScore.innerHTML = incorrectCount;
}

/** Adds event handlers to buttons */
function init() {
  const { start, redChoice, greenChoice, blueChoice } = domElements.buttons;
  start.addEventListener("click", () => handleStartClick());
  redChoice.addEventListener("click", () => handleColorButtonClick(redChoice));
  greenChoice.addEventListener("click", () =>
    handleColorButtonClick(greenChoice)
  );
  blueChoice.addEventListener("click", () =>
    handleColorButtonClick(blueChoice)
  );
}

init();
