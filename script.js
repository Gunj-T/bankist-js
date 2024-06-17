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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
          </div>

`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(
      int => int >= 1
      // console.log(arr);
    )

    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// EVENT HANDLERS

//------- LOGIN --------
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// --------TRANSFERS--------

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // prevents default behaviour of form
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

// -----REQUESTING A LOAN -------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// -----DELETING THE ACCOUNT -----

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1); // splice mutates the original array

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(0, -1));
// console.log(arr.slice());
// console.log([...arr]);

// //SPLICE
// // arr.splice(-1);
// arr.splice(0, 2);
// console.log(arr);

// //REVERSE
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);

// //JOIN

// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// console.log(arr.at(-1));

// console.log(arr);
// console.log('jonas'.at(0));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`${i + 1} : You deposited the ${movement}`);
//   } else {
//     console.log(`${i + 1} : You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('-------FOREACH------');
// movements.forEach(function (movement, i, array) {
//   if (movement > 0) {
//     console.log(`You deposited the ${i} : ${movement}`);
//   } else {
//     console.log(`You withdrew ${i} : ${Math.abs(movement)} ${array}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EURO']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (v, k, m) {
//   console.log(`${k} : ${v}`);
// });

// const julia = [3, 5, 2, 12, 7];
// const kate = [9, 16, 6, 8, 3];

// const juliaCorrected = julia.slice(2, -1);
// console.log(juliaCorrected);

// juliaCorrected.forEach(function (age) {
//   console.log(`The age of the dog is ${age} and is an adult`);
// });
// kate.forEach(function (age) {
//   console.log(`The age of the dog is ${age} and is an adult`);
// });

// the map method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// const movementsUsdFor = [];
// for (const mov of movements) movementsUsdFor.push(mov * euroToUsd);
// console.log(movementsUsdFor);

// const movementsUsd = movements.map(mov => mov * euroToUsd);
// console.log(movementsUsd);

// const movementDescriptions = movements.map(function (mov, i) {
//   if (mov > 0) {
//     return `You deposited the ${i + 1} : ${mov}`;
//   } else {
//     return `You withdrew ${i} : ${Math.abs(mov)} `;
//   }
// });

// console.log(movementDescriptions);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const withdrawal = movements.filter(function (movs) {
//   return movs < 0;
// });
// console.log(withdrawal);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// const reducedMov = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(reducedMov);

// let balance = 0;
// for (const mov of movements) balance += mov;
// console.log(balance);

// maximum value of the movements

// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// const ages1 = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAvgHuman = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAge.filter(age => age >= 18);
//   console.log(humanAge);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   return average;
// };

// const avg1 = calcAvgHuman([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAvgHuman([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

// chaining methods

// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const ages1 = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAvgHuman = ages => {
//   const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAge.filter(age => age >= 18);
//   console.log(humanAge);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   return average;
// };

// const avg1 = calcAvgHuman([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAvgHuman([16, 6, 10, 5, 6, 1, 4]);

// const findMov = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(findMov);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let accObject;
// for (const acc of accounts) {
//   if (acc.owner === 'Sarah Smith') accObject = acc;
// }
// console.log(accObject);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(-130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(4));

// const accountMov = accounts.map(acc => acc.movements);
// console.log(accountMov);

// const allMov = accountMov.flat();
// console.log(allMov);

// const overallBal = allMov.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBal);

// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// sorting arrays
// with strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // NUmbers

// console.log(movements);

// return < 0 , A ,B
// return > 0 , B , A
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

// movements.sort((a, b) => a - b);
// console.log(movements);

// const x = new Array(7);
// console.log(x);

// x.fill(1, 4, 5);
// console.log(x);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// arr.fill(23, 4, 6);
// console.log(arr);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// // const dice = Array.from({ length: 200 }, () => Math.trunc(Math.random() * 100));
// // console.log(dice);
// // console.log(dice.length);

// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(document.querySelectorAll('.movements__value'));

//   console.log(movementUI);
// });
