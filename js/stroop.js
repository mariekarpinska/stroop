import { domElements } from "./dom-elements.js";
import { TimeFunctions } from "./time-functions.js";
import {
  generateMatchingWordAndColor,
  generateMismatchedWordAndColor,
} from "./word-color-generation.js";
import { createFile } from "./download-file.js";

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
const getPrintedWordColor = () => domElements.wordDisplayAreaTwo.style.color;
const isPrintedWordMatching = () =>
  getPrintedWordText() === getPrintedWordColor();
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

  setTimeout(endTest, 4500);
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

  setTimeout(endTest2, 4500);
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

  const { wordDisplayAreaFour, wordDisplayAreaFive } = domElements;
  wordDisplayAreaFour.innerHTML = "Your Score: " + score.toString();
  wordDisplayAreaFour.style.color = "white";

  const entireText = `\n\n\n
You have just completed a Stroop test, where you saw a list of words on a computer screen. The words were all names of colors, such as “red”, “blue”, “green”, and so on. However, the words were printed in different colors than their meanings. For example, you might have seen the word “red” in blue ink, or the word “green” in yellow ink. Your task was to either name the word or the color of the ink, depending on the instructions. How did you do?
If you are like most people, you probably found it easier to name the word than the color of the ink, especially when the word and the color did not match. You might have also noticed that you were slower and more prone to errors when you had to name the color of the ink than when you had to name the word itself. This is because reading is a more automatic and dominant process than color naming, and it interferes with your ability to focus on the less familiar task. This phenomenon is known as the Stroop effect, and it is one of the most widely studied effects in cognitive psychology.\n\n
The Stroop effect is named after John Ridley Stroop, an American psychologist who published the first paper on this topic in English in 1935. However, the effect was actually discovered earlier by a German psychologist named Erich Rudolf Jaensch in 1929. Jaensch was interested in the differences between people who had a strong or weak “eidetic” memory, which is the ability to recall images vividly and accurately. He devised a test where he presented words that were either congruent or incongruent with their meanings, and asked the participants to either read the word or name the color. He found that people with a weak eidetic memory had more difficulty in naming the color than reading the word, while people with a strong eidetic memory had less difficulty in both tasks. He interpreted this as a sign of different levels of “mental rigidity” or “mental flexibility” among the participants.\n\n
Stroop, on the other hand, was more interested in the general aspects of cognitive functioning, such as attention, perception, and memory. He replicated Jaensch’s experiment with some modifications, and added a third condition where the words were not color names, but neutral words, such as “dog”, “cat”, “house”, and so on. He also measured the reaction time and accuracy of the participants in each condition. He found that the incongruent condition was the most difficult and slowest, followed by the neutral condition, and then the congruent condition. He explained this as a result of the interference between the two processes of word reading and color naming, which competed for the same mental resources. He also suggested that the interference could be reduced by increasing the practice, motivation, or attention of the participants.\n\n
Since then, the Stroop test has become one of the most popular and versatile tests in psychology, and it has been used for various purposes, such as assessing cognitive functioning, detecting brain damage, diagnosing mental disorders, evaluating interventions, and exploring individual differences. The Stroop test has also been adapted to different languages, formats, and stimuli, such as numbers, shapes, emotions, and pictures. For example, one version of the Stroop test involves presenting pictures of faces that express different emotions, such as happiness, sadness, anger, and fear, and asking the participants to either name the emotion or the gender of the face. Another version of the Stroop test involves presenting numbers that are either larger or smaller than their font size, and asking the participants to either name the number or the size. These variations of the Stroop test can reveal how different types of information can interfere with each other, and how different factors can modulate the interference.\n\n
One interesting and local applications of the Stroop test is related to the Neurofeedback Recidivism Reduction Project (NRR) in Santa Barbara, California. This project aims to improve the lives of formerly incarcerated persons and test whether neurofeedback can significantly reduce recidivism (relapse into criminal behavior). Neurofeedback is a form of biofeedback for the brain, where the participants receive feedback on their brainwave patterns and learn to modify them through training. The NRR project is a collaboration between Community Solutions, Inc. (CSI) and the Wuttke Institute for Neurotherapy, and it involves a four-year randomized control study with 360 high-risk parolees. The Stroop test is used in the NRR project as a measure of cognitive functioning before and after neurofeedback training. \n\n
There are many different ways to calculate a score for the Stroop test, but the one used today is inspired by one of the most widely used methods proposed by Golden in 1978. This method involves computing the interference score, which is the difference in performance between the color and meaning conditions. The interference score reflects the degree of difficulty in inhibiting the automatic word reading and focusing on the color naming. The formula for the interference score is:\n
Interference score = C * W / (C + W)\n
where C is the number of correct responses selecting the color of the word and W is the number of correct responses selecting the meaning of the word in 45 seconds.\n\n
The Stroop test is a useful tool for measuring cognitive functioning and detecting signs of impairment or improvement. It can reveal how well a person can control their attention, suppress irrelevant information, and cope with interference. It can also indicate the presence or absence of brain damage, mental disorders, or cognitive decline. The Stroop test can also be used to evaluate the effectiveness of interventions, such as neurofeedback, that aim to enhance cognitive functioning and reduce recidivism.\n\n
`;

  wordDisplayAreaFive.innerHTML = entireText;
  wordDisplayAreaFive.style.color = "white";
}

function handleColorButtonClick(buttonClicked$) {
  handleButtonAnswer(buttonClicked$);
  displayNewWordAndRestartTimer();
  logInfo();
}
function handleColorButtonClickTwo(buttonClicked$) {
  console.log("handleColorButtonClickTwo");
  handleButtonAnswer(buttonClicked$);
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
