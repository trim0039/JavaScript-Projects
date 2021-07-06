"use strict";

//grabbing elements
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const diceEl = document.querySelector(".dice");
const rollBtn = document.querySelector(".btn--roll");
const holdBtn = document.querySelector(".btn--hold");
const newBtn = document.querySelector(".btn--new");
const cur0El = document.querySelector("#current--0");
const cur1El = document.querySelector("#current--1");
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

// setting up local vars to manipulate
const players = [player0El, player1El];
const curText = [cur0El, cur1El];
const scoreText = [score0El, score1El];
const curVal = [0, 0];
const curScore = [0, 0];
let activePlayer = 0;

// function to display particular dice value
const showDice = function (val) {
  diceEl.src = `dice-${val}.png`;
  diceEl.classList.remove("hidden");
};

// random number fucntion for dice roll
const rollDice = function () {
  return Math.trunc(Math.random() * 6 + 1);
};

// switch player function, use xor to flip to/from 0 or 1
const switchPlayer = function () {
  curVal[activePlayer] = 0;
  curText[activePlayer].textContent = curVal[activePlayer];
  players[activePlayer].classList.remove("player--active");
  activePlayer = activePlayer ^ 1;
  players[activePlayer].classList.add("player--active");
};

// roll button event listener function
const rollBtnPress = function () {
  const roll = rollDice();
  showDice(roll);
  if (roll > 1) {
    curVal[activePlayer] += roll;
    curText[activePlayer].textContent = curVal[activePlayer];
  } else {
    switchPlayer();
  }
};

// hold button event lister function
const holdBtnPress = function () {
  curScore[activePlayer] += curVal[activePlayer];
  scoreText[activePlayer].textContent = curScore[activePlayer];
  curVal[activePlayer] = 0;
  curText[activePlayer].textContent = curVal[activePlayer];
  if (curScore[activePlayer] >= 100) {
    // remove button functionality because we have winner
    rollBtn.removeEventListener("click", rollBtnPress);
    holdBtn.removeEventListener("click", holdBtnPress);
    players[activePlayer].classList.add("player--winner");
  } else {
    switchPlayer();
  }
};

// new game button functionality
const newBtnPress = function () {
  curScore[0] = 0;
  curScore[1] = 0;
  curVal[0] = 0;
  curVal[1] = 0;
  score0El.textContent = curScore[0];
  score1El.textContent = curScore[1];
  curText[0].textContent = curVal[0];
  curText[1].textContent = curVal[1];
  players[0].classList.remove("player--winner");
  players[1].classList.remove("player--winner");
  // make sure switch player will switch to player 0
  activePlayer = 1;
  switchPlayer();
  // add back event listeners and hide dice
  rollBtn.addEventListener("click", rollBtnPress);
  holdBtn.addEventListener("click", holdBtnPress);
  diceEl.classList.add("hidden");
};

// initial game set up
rollBtn.addEventListener("click", rollBtnPress);
holdBtn.addEventListener("click", holdBtnPress);
newBtn.addEventListener("click", newBtnPress);
