'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (move, i) {
    const type = move > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${move}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const computeUsername = account =>
  (account.username = account.owner
    .toLowerCase()
    .split(' ')
    .map(cur => cur[0])
    .join(''));

accounts.forEach(cur => computeUsername(cur));

const calcBalance = function (account) {
  account.balance = account.movements.reduce((accum, cur) => (accum += cur), 0);
};

accounts.forEach(calcBalance);

const singleAccountInOut = function (account) {
  account.in = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, move) => (accum += move), 0);
  account.out = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, move) => (accum += Math.abs(move)), 0);
};

accounts.forEach(singleAccountInOut);

const calcDisplaySummary = function (account) {
  singleAccountInOut(account);
  calcBalance(account);
};

const updateUI = function (account) {
  calcDisplaySummary(account);
  displayMovements(account.movements);
  labelBalance.innerHTML = `${account.balance}€`;
  labelSumIn.innerHTML = `${account.in}€`;
  labelSumOut.innerHTML = `${account.out}€`;
  labelSumInterest.innerHTML = `${account.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, cur) => (acc += cur), 0)}€`;
};
let curAcc;

// event handlers
// click button or also trigger click with enter key in text box
btnLogin.addEventListener('click', function (event) {
  // prevent form from submitting
  event.preventDefault();
  curAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (curAcc?.pin === Number(inputLoginPin.value)) {
    // display the account info
    updateUI(curAcc);
    // display welcome message
    labelWelcome.innerHTML = `Welcome back, ${curAcc.owner.split(' ')[0]}!`;
    // empty input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    // lose focus of fields
    inputLoginPin.blur();
    inputLoginUsername.blur();
    containerApp.style.opacity = 100;
  } else {
    labelWelcome.innerHTML = `Incorrect Login Information!`;
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const transferTo = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);
  const foundUser = accounts.find(acc => acc.username === transferTo);
  if (
    foundUser &&
    transferAmount > 0 &&
    curAcc.balance >= transferAmount &&
    foundUser.username !== curAcc.username
  ) {
    foundUser.movements.push(transferAmount);
    curAcc.movements.push(-transferAmount);
    labelWelcome.innerHTML = `Transferred ${transferAmount}€ to ${
      foundUser.owner.split(' ')[0]
    }!`;
    updateUI(curAcc);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
  } else {
    labelWelcome.innerHTML = `Incorrect Transfer Input!`;
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && curAcc.movements.some(mov => mov >= loan * 0.1)) {
    curAcc.movements.push(loan);
    updateUI(curAcc);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    labelWelcome.innerHTML = `You don't have a large enough deposit!`;
  }
});
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (curAcc.username === user && curAcc.pin === pin) {
    const userIdx = accounts.findIndex(acc => acc.username === user);
    accounts.splice(userIdx, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = '';
    inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
    labelWelcome.innerHTML = `Account Closed!`;
    curAcc = null;
  } else {
    labelWelcome.innerHTML = `Incorrect Close Account Input!`;
  }
});
/*console.log(containerMovements.innerHTML);
console.log(containerMovements.innerHTML.textContent);*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// slice method
// works just like strings
console.log(arr.slice(0, 2));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
// shallow copies
console.log(arr.slice());
console.log([...arr]);

// SPLICE method
// works in almost the same way as slice but does change the og array
console.log(arr.splice(2));
// og array has changed! it gets the splice remainder
// extracted the elements from the og array and places in the new array
console.log(arr);

// remove last el of an array
arr.splice(-1);
console.log(arr);

// redefine as og arr
arr = ['a', 'b', 'c', 'd', 'e'];
// second arg is acutally the number of elements form the start arg to delete as shown here
console.log(arr.splice(2, 1));
console.log(arr);

// REVERSE
// mutates the original array!
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.reverse());
console.log(arr);

// CONCAT
// does not mutate
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = [1, 2, 3, 4, 5];
console.log(arr.concat(arr2));
console.log(arr);
let saveIT = arr.concat(arr2);
console.log(saveIT);
*/
/*
// forEach method
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// use for of loop first to see diff
for (const move of movements) {
  move > 0
    ? console.log(`You deposited ${move}`)
    : console.log(`You withdrew ${Math.abs(move)}`);
}
// same but with forEach
// needs callback fucntion
// loops through movements and calls the callback fucntion for each
// arg passed is the current position in the array
console.log('-----For Each method-------');
movements.forEach(function (movement) {
  movement > 0
    ? console.log(`You deposited ${movement}`)
    : console.log(`You withdrew ${Math.abs(movement)}`);
});

// can define a func and pass it
// args forEach => curEl, curIdx, entire array!!!
const display = function (movement, i, array) {
  movement > 0
    ? console.log(`Movement ${i + 1}: You deposited ${movement}`)
    : console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
};
console.log('-----For Each with defined func-------');
movements.forEach(display);

// need a counter variable with forEach??
console.log('-----For Each with indexes-------');
// need to define the parameters in the function
// YOU CAN NOT BREAK OUT OF A FOREACH LOOP!!!!

*/
/*
// for each with maps and sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (val, key, map) {
  console.log(`${key}: ${val}`);
});

// for each with set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
console.log(currenciesUnique);

// the second arg is usless but ehh...
// the key is kind of the idx if you think about it since sets and maps are not ordered
// yous _ if you don't need a param
currenciesUnique.forEach(function (val, key, map) {
  console.log(`${key}: ${val}`);
});
*/
/*
// Data 1:
const juliaData1 = [3, 5, 2, 12, 7];
const kateData1 = [4, 1, 15, 8, 3];
// Data 2:
const juliaData2 = [9, 16, 6, 8, 3];
const kateData2 = [10, 5, 6, 1, 4];

function checkDogs(jules, kate) {
  const newJules = jules.slice();
  newJules.splice(0, 1);
  newJules.splice(-2);
  const combined = newJules.concat(kate);
  for (let i = 0; i < combined.length; i++) {
    const dog = combined[i];
    console.log(
      `${
        dog >= 3
          ? `Dog number ${i + 1} is an adult, and is ${dog} years old`
          : `Dog number ${i + 1} is still a puppy`
      }`
    );
  }
}
console.log(`----Data set 1----`);
checkDogs(juliaData1, kateData1);
console.log(`----Data set 2----`);
checkDogs(juliaData2, kateData2);
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const erToUsd = 1.1;
// FUNCTIONAL PROGRAMMING!!!
const newArr = movements.map(
  (cur, i) =>
    `Movement ${i + 1}: You ${cur > 0 ? `deposited` : `withdrew`} ${Math.abs(
      cur
    )}`
);
console.log(newArr);
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);
console.log(deposits);
console.log(withdrawals);

// max value with reduce
const max = movements.reduce(
  (accum, cur) => (cur > accum ? cur : accum),
  movements[0]
);
console.log(max);
*/
/*
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = arr =>
  arr
    .map(cur => (cur <= 2 ? cur * 2 : 16 + cur * 4))
    .filter(cur => cur >= 18)
    .reduce((accum, cur, _, arr) => (accum += cur / arr.length), 0);

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositsUSD = movements
  .filter(move => move > 0)
  .map((move, _, arr) => {
    console.log(arr);
    return (move *= 1.1);
  })
  .reduce((acc, cur) => (acc += cur), 0);
console.log(totalDepositsUSD);
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// returns first element that satisfies the condition
// usually used to find exactly one element
console.log(movements.find(mov => mov < 0));

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/
/*
// some and every
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// include review EQUALITY
console.log(movements.includes(-130));
// use some to see if there are any deposits CONDITION
console.log(movements.some(mov => mov > 0));
// use some to see if there are any deposits above 5000
console.log(movements.some(mov => mov > 5000));

// every method CONDITION
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
*/

// flat and flatMap methods
