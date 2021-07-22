"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-07-18T23:36:17.929Z",
    "2021-07-21T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];
let curAcc;

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const optionsMoney = {
  style: "currency",
  currency: "EUR",
};

const movesWithDates = function (account) {
  account.moveAndDate = [];
  for (let i = 0; i < account.movements.length; i++) {
    account.moveAndDate.push([account.movements[i], account.movementsDates[i]]);
  }
};
accounts.forEach((account) => movesWithDates(account));

const daysPassed = (date1, date2) =>
  Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const formatCurrency = function (money) {
  return new Intl.NumberFormat(curAcc.locale, optionsMoney).format(
    money.toFixed(2)
  );
};

const getDisplayDate = function (days, date) {
  if (days === 0) {
    return "TODAY";
  } else if (days === 1) {
    return "YESTERDAY";
  } else if (days <= 7) {
    return `${days} DAYS AGO`;
  } else {
    return `${new Intl.DateTimeFormat(curAcc.locale).format(date)}`;
  }
};

const displayMovements = function (moveAndDate) {
  const now = new Date();
  containerMovements.innerHTML = "";
  moveAndDate.forEach(function (move, i) {
    const date = new Date(move[1]);
    const numDays = daysPassed(now, date);
    const dateMessage = getDisplayDate(numDays, date);
    const formatMove = formatCurrency(move[0]);
    const type = move[0] > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${dateMessage}</div>
        <div class="movements__value">${formatMove}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const computeUsername = (account) =>
  (account.username = account.owner
    .toLowerCase()
    .split(" ")
    .map((cur) => cur[0])
    .join(""));

accounts.forEach((cur) => computeUsername(cur));

const calcBalance = function (account) {
  account.balance = account.movements.reduce((accum, cur) => (accum += cur), 0);
};

accounts.forEach(calcBalance);

const singleAccountInOut = function (account) {
  account.in = account.movements
    .filter((mov) => mov > 0)
    .reduce((accum, move) => (accum += move), 0);
  account.out = account.movements
    .filter((mov) => mov < 0)
    .reduce((accum, move) => (accum += Math.abs(move)), 0);
};

accounts.forEach(singleAccountInOut);

const calcDisplaySummary = function (account) {
  singleAccountInOut(account);
  calcBalance(account);
};

const updateUI = function (account) {
  const now = new Date();
  // can grab users locale with this!!!
  // const locale = navigator.language;
  // console.log(locale);
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric", // long as well
    hour: "numeric",
    minute: "numeric",
    // can also add weekday
  };
  calcDisplaySummary(account);
  displayMovements(account.moveAndDate);

  labelDate.innerHTML = `${new Intl.DateTimeFormat(
    curAcc.locale,
    options
  ).format(now)}`;
  labelBalance.innerHTML = `${formatCurrency(account.balance)}`;
  labelSumIn.innerHTML = `${formatCurrency(account.in)}`;
  labelSumOut.innerHTML = `${formatCurrency(account.out)}`;
  labelSumInterest.innerHTML = `${formatCurrency(
    account.movements
      .filter((mov) => mov > 0)
      .map((dep) => (dep * account.interestRate) / 100)
      .filter((interest) => interest >= 1)
      .reduce((acc, cur) => (acc += cur), 0)
  )}`;
};

let logoutTimer;

const startLogoutTimer = function () {
  const tick = function () {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    labelTimer.innerHTML = `${("" + min).padStart(2, "0")}:${(
      "" + sec
    ).padStart(2, "0")}`;
    timer--;
    if (timer === -1) {
      containerApp.style.opacity = 0;
      curAcc = null;
      labelWelcome.innerHTML = `You have been logged out!`;
      clearInterval(logoutTimer);
    }
  };
  // Set time to 5 minutes
  let timer = 5 * 60;
  // call timer every second
  tick();
  logoutTimer = setInterval(tick, 1000);
  // in each call print the remaining time to the UI
  // when time is 0, hide UI
};
// event handlers
// click button or also trigger click with enter key in text box
btnLogin.addEventListener("click", function (event) {
  // prevent form from submitting
  event.preventDefault();
  curAcc = accounts.find((acc) => acc.username === inputLoginUsername.value);
  if (curAcc?.pin === +inputLoginPin.value) {
    // display the account info
    optionsMoney.currency = curAcc.currency;
    clearInterval(logoutTimer);
    startLogoutTimer();
    updateUI(curAcc);
    // display welcome message
    labelWelcome.innerHTML = `Welcome back, ${curAcc.owner.split(" ")[0]}!`;
    // empty input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    // lose focus of fields
    inputLoginPin.blur();
    inputLoginUsername.blur();
    containerApp.style.opacity = 100;
  } else {
    labelWelcome.innerHTML = `Incorrect Login Information!`;
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(logoutTimer);
  startLogoutTimer();
  const transferTo = inputTransferTo.value;
  const transferAmount = +inputTransferAmount.value;
  const foundUser = accounts.find((acc) => acc.username === transferTo);
  if (
    foundUser &&
    transferAmount > 0 &&
    curAcc.balance >= transferAmount &&
    foundUser.username !== curAcc.username
  ) {
    const now = new Date().toISOString();

    curAcc.movementsDates.push(now);
    foundUser.movementsDates.push(now);
    foundUser.movements.push(transferAmount);
    curAcc.movements.push(-transferAmount);
    curAcc.moveAndDate.push([-transferAmount, now]);
    foundUser.moveAndDate.push([transferAmount, now]);
    labelWelcome.innerHTML = `Transferred ${transferAmount}€ to ${
      foundUser.owner.split(" ")[0]
    }!`;
    updateUI(curAcc);
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();
  } else {
    labelWelcome.innerHTML = `Incorrect Transfer Input!`;
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(logoutTimer);
  startLogoutTimer();
  const loan = Math.floor(inputLoanAmount.value);
  if (loan > 0 && curAcc.movements.some((mov) => mov >= loan * 0.1)) {
    setTimeout(function () {
      curAcc.movements.push(loan);
      const now = new Date().toISOString();
      curAcc.movementsDates.push(now);
      curAcc.moveAndDate.push([loan, now]);
      updateUI(curAcc);
      labelWelcome.innerHTML = `You got a loan!`;
    }, 3000);
  } else {
    setTimeout(function () {
      labelWelcome.innerHTML = `You don't have a large enough deposit!`;
    }, 3000);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});
btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;
  if (curAcc.username === user && curAcc.pin === pin) {
    const userIdx = accounts.findIndex((acc) => acc.username === user);
    accounts.splice(userIdx, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = "";
    inputCloseUsername.value = "";
    inputClosePin.blur();
    inputCloseUsername.blur();
    labelWelcome.innerHTML = `Account Closed!`;
    curAcc = null;
  } else {
    labelWelcome.innerHTML = `Incorrect Close Account Input!`;
  }
});

let sorted = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(logoutTimer);
  startLogoutTimer();
  btnSort.blur();
  if (sorted) {
    displayMovements(curAcc.moveAndDate);
    sorted = false;
  } else {
    displayMovements(curAcc.moveAndDate.slice().sort((a, b) => a[0] - b[0]));
    sorted = true;
  }
});
