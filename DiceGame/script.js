'use strict';
//grabbing elements
const score0El = document.querySelector('#score--0'); // selector for id!!!
const score1El = document.getElementById('score--1'); // another way to do it, this is a little faster
const diceEl = document.querySelector('.dice');
const rollBtn = document.querySelector('.btn--roll');
const holdBtn = document.querySelector('.btn--hold');
const newBtn = document.querySelector('.btn--new');
const cur0El = document.querySelector('#current--0');
const cur1El = document.querySelector('#current--1');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden');
let curVal0 = 0;
let curVal1 = 0;
let curScore0 = 0;
let curScore1 = 0;
let p0turn = true;

const showDice = function (val) {
  diceEl.src = `dice-${val}.png`;
  diceEl.classList.remove('hidden');
};

const rollDice = function () {
  return Math.trunc(Math.random() * 6 + 1);
};
const switchPlayer = function () {
  if (p0turn) {
    p0turn = false;
    curVal0 = 0;
    cur0El.textContent = curVal0;
    player0El.classList.remove('player--active');
    player1El.classList.add('player--active');
  } else {
    p0turn = true;
    curVal1 = 0;
    cur1El.textContent = curVal1;
    player1El.classList.remove('player--active');
    player0El.classList.add('player--active');
  }
};

const rollBtnPress = function () {
  const roll = rollDice();
  showDice(roll);
  if (p0turn) {
    if (roll > 1) {
      curVal0 += roll;
      cur0El.textContent = curVal0;
    } else {
      switchPlayer();
    }
  } else {
    if (roll > 1) {
      curVal1 += roll;
      cur1El.textContent = curVal1;
    } else {
      switchPlayer();
    }
  }
};

const holdBtnPress = function () {
  if (p0turn) {
    curScore0 += curVal0;
    score0El.textContent = curScore0;
    curVal0 = 0;
    cur0El.textContent = curVal0;
    if (score0El.textContent >= 100) {
      rollBtn.removeEventListener('click', rollBtnPress);
      holdBtn.removeEventListener('click', holdBtnPress);
      player0El.classList.add('player--winner');
    } else {
      switchPlayer();
    }
  } else {
    curScore1 += curVal1;
    score1El.textContent = curScore1;
    curVal1 = 0;
    cur1El.textContent = curVal1;
    if (score1El.textContent >= 100) {
      rollBtn.removeEventListener('click', rollBtnPress);
      holdBtn.removeEventListener('click', holdBtnPress);
      player1El.classList.add('player--winner');
    } else {
      switchPlayer();
    }
  }
};

const newBtnPress = function () {
  curScore0 = 0;
  curScore1 = 0;
  curVal0 = 0;
  curVal1 = 0;
  score0El.textContent = curScore0;
  score1El.textContent = curScore1;
  cur0El.textContent = curVal0;
  cur1El.textContent = curVal1;
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  p0turn = false;
  switchPlayer();
  rollBtn.addEventListener('click', rollBtnPress);
  holdBtn.addEventListener('click', holdBtnPress);
  diceEl.classList.add('hidden');
};

rollBtn.addEventListener('click', rollBtnPress);
holdBtn.addEventListener('click', holdBtnPress);
newBtn.addEventListener('click', newBtnPress);
