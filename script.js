const gameContainer = document.getElementById("game");

const COLORS = [
  ["#F5EA4E", 1],
  ["#FA76B6", 2],
  ["#5AEB8B", 3],
  ["#46D6CB", 4],
  ["#51A7F9", 5],
  ["#F5EA4E", 6],
  ["#FA76B6", 7],
  ["#5AEB8B", 8],
  ["#46D6CB", 9],
  ["#51A7F9", 10]
];

//define variables
let chosenCardsColors = [];
let chosenCardsIDs = [];
let matchedCardsIDs = [];
let guessArr = [];
let lowScore = document.querySelector('#lowscore');
let attempts = document.querySelector("#attempts");


//retrieve low score from local storage
if (localStorage.getItem('lowscore') === null) {
  lowScore.innerText = "";
} else if (localStorage.getItem('lowscore') !== null) {
  let savedScore = localStorage.getItem ('lowscore');
  lowScore.innerText = `${savedScore}`
}

//button functionality to reload new game
let restart = document.querySelector('#restart');
restart.addEventListener('click', function(e) {
  location.reload();
})

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    //assign data attributes for indentification & comparison
    newDiv.classList.add(color[0]);
    newDiv.setAttribute('data-name', 'card')
    newDiv.setAttribute('data-id', color[1]);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    //assign a variable to all cards once the divs are placed
    let allCards = document.querySelectorAll('[data-name="card"]');
  }
}

//function to check if the selected cards match
function checkCardsForMatch () {
  let card1 = document.querySelector(`[data-id=${CSS.escape(chosenCardsIDs[0])}]`)
  let card2 = document.querySelector(`[data-id=${CSS.escape(chosenCardsIDs[1])}]`)
  //if player selects the same card twice, reset selected cards without a match:
  if (chosenCardsIDs[0] === chosenCardsIDs[1]) {
    card1.style.background = 'linear-gradient(#FFFFFF, #000000)';
    card2.style.background = 'linear-gradient(#FFFFFF, #000000)';
    chosenCardsIDs = [];
    chosenCardsColors = [];
  } 
    //if selected cards are not a color match, reset selected cards without a match:
    else if (chosenCardsColors[0] !== chosenCardsColors[1]) {
    card1.style.background = 'linear-gradient(#FFFFFF, #000000)';
    card2.style.background = 'linear-gradient(#FFFFFF, #000000)';
  } 
    //if selected cards match, push the IDs to matched cards array, increment matched score, leave cards face-up
    else {
    matchedCardsIDs.push(chosenCardsIDs);
    let score = document.querySelector("#score")
    score.innerText = (matchedCardsIDs.length)

    //if all matches have been made, check for and set low score, alert 'Won!', reset the game on click
    if (matchedCardsIDs.length === (COLORS.length/2)) {
      let attemptsNumber = parseInt(attempts.innerText);
      if ((localStorage.getItem('lowscore')) === null){
        localStorage.setItem('lowscore', `${attemptsNumber}`)
      } else if (parseInt(localStorage.getItem('lowscore')) > attemptsNumber) {
        localStorage.setItem('lowscore', `${attemptsNumber}`)
      }
      alert('You won the game! Click OK to play again!');
      window.location.reload();
    }
  }
  //no matter what cards are selected, clear the comparison arrays
  chosenCardsIDs = [];
  chosenCardsColors = [];
}

//on card selection
function handleCardClick(event) {
  //check if two cards are selected, if not, assign values to selected arrays for comparison
  if (chosenCardsIDs.length < 2){
  let cardID = event.target.getAttribute('data-id');
  let cardColor = event.target.classList.value;
  //visually change card to face-up
  event.target.style.background = cardColor;
  chosenCardsColors.push(cardColor);
  chosenCardsIDs.push(cardID);
  //if two cards are selected, check for a match, with timeout after 1sec
  if(chosenCardsIDs.length === 2) {
    setTimeout(checkCardsForMatch, 1000)
  }
  //if the cards do not match, increment the guess score per two click (two clicks = one guess)
  if (chosenCardsIDs[0] !== chosenCardsIDs[1]){
    guessArr.push('');
    attempts.innerHTML = (Math.round(guessArr.length/2));
  }
}
}
// when the DOM loads
//create button to start the game/deal the cards
let start = document.querySelector('#start');
start.addEventListener('click', function(e) {
  createDivsForColors(shuffledColors);
  start.disabled = true;
})

//Adapted from the array push and comparison model by Ania Kubow
//discussed at: https://www.youtube.com/watch?v=tjyDOHzKN0w
//accessed on 7.28.2022

/* */