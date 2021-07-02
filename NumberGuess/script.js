'use strict';

let msgEl = document.querySelector('.message');
let bodyEl = document.querySelector('body');
let numEl = document.querySelector('.number');
let scoreEl = document.querySelector('.score');
let highScoreEl = document.querySelector('.highscore');
let guessEl = document.querySelector('.guess');

let curScore = 20;
let highScore = 0;

const createSecretNum = function () {
  return Math.trunc(Math.random() * 20) + 1;
};

const setMessage = function (msg) {
  msgEl.textContent = msg;
};

const setScore = function (score) {
  scoreEl.textContent = score;
  curScore = score;
};

const setNumber = function (num) {
  numEl.textContent = num;
};

const setHighScore = function (highscore) {
  highScoreEl.textContent = highscore;
};

const setWinStyle = function () {
  bodyEl.style.backgroundColor = '#60b347'; // always use a string for style manipulation
  // also always use camel case for 2 words from css
  numEl.style.width = '30rem';
};
const resetStyle = function () {
  bodyEl.style.backgroundColor = '#222';
  numEl.style.width = '15rem';
  guessEl.value = '';
};

let secretNum = createSecretNum();

const checkNumber = function () {
  const numGuess = Number(guessEl.value);
  // if no input
  if (!numGuess) {
    setMessage('⛔️ No Number!');
  } else if (curScore > 1) {
    if (numGuess === secretNum) {
      setWinStyle();
      highScore = curScore > highScore ? curScore : highScore;
      setHighScore(highScore);
      setMessage('🎉 Correct Number!');
      setNumber(secretNum);
    } else {
      numGuess > secretNum;
      setMessage(
        numGuess > secretNum
          ? '📈 Try again... too high'
          : '📉 Try again... too low'
      );
      setScore(curScore - 1);
    }
  } else {
    setScore(0);
    setMessage('💥 You lost the game!');
  }
};

const resetGame = function () {
  setScore(20);
  curScore = 20;
  setNumber('?');
  setMessage('Start guessing...');
  secretNum = createSecretNum();
  resetStyle();
};

document.querySelector('.check').addEventListener('click', checkNumber);
document.querySelector('.again').addEventListener('click', resetGame);
