const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.getElementById("restartBtn");
const xBtn = document.getElementById("x-start");
const oBtn = document.getElementById("o-start");
const prevMoveBtn = document.getElementById("prevMoveBtn");
const nextMoveBtn = document.getElementById("nextMoveBtn");
const historyBtn = document.querySelector(".his-btn");
const histBtn = document.querySelector(".hist-btn");
const instructionPage = document.getElementById("instruction-page");
const proceedButton = document.getElementById("ins-btn");

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false; //game is not running
let optionsHistory = []; // Array to store the history of moves
let currentMoveIndex = -1; // Index to keep track of the current move
//-1 means no move has been made
let reviewMode = false; //review mode not running

initializeGame();

function initializeGame() {
  //for each cells, i call them cell and and an event listener
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  prevMoveBtn.addEventListener("click", showPreviousMove);
  nextMoveBtn.addEventListener("click", showNextMove);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
  startWith();
  
}


// Add an event listener to the "Proceed" button
proceedButton.addEventListener("click", () => {
  instructionPage.style.display = "none"
});

function startWith() {
  const oBtn = document.getElementById("o-start");
  const xBtn = document.getElementById("x-start");

  // Function to handle the animationend event
  function handleAnimationEnd() {
    const buttonHolders = document.querySelector('.button-holders');
    buttonHolders.remove();
  }

  // Add an event listener to oBtn
  oBtn.addEventListener("click", function () {
    // Change currentPlayer to "O"
    currentPlayer = "O";
    statusText.textContent = `${currentPlayer}'s turn`;

    const buttonHolders = document.querySelector('.button-holders');
    buttonHolders.classList.add('animate-fade-up');

    // Listen for the animationend event to remove the element after the animation is complete
    buttonHolders.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

  // Add an event listener to xBtn
  xBtn.addEventListener("click", function () {
    // Change currentPlayer to "X"
    currentPlayer = "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    const buttonHolders = document.querySelector('.button-holders');
    buttonHolders.classList.add('animate-fade-up');

    // Listen for the animationend event to remove the element after the animation is complete
    buttonHolders.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}


function cellClicked() {
  // Get the cellIndex attribute from the clicked cell
  const cellIndex = this.getAttribute("cellIndex");

  // Check if the game is in review mode or if there are moves in history beyond the current move
  if (optionsHistory.length > currentMoveIndex + 1 || reviewMode) {
    return; // Exit the function if either condition is true
  }
  // Check if the clicked cell is already filled or if the game is not running
  if (options[cellIndex] != "" || !running) {
    return; // Exit the function if either condition is true
  }

  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  //options ko ay empty array,
  options = optionsHistory[currentMoveIndex + 1] || [...options];
  // Update the clicked cell with the current player's symbol
  options[index] = currentPlayer;
  // Add the updated options array to the optionsHistory
  optionsHistory.push([...options]);
  // Move the currentMoveIndex to the new state
  currentMoveIndex++;
  //sets the cell to have an X or O
  cell.textContent = currentPlayer;
  //styling
  if (currentPlayer === "O") {
    cell.style.color = "red";
  } else if (currentPlayer === "X") {
    cell.style.color = "blue";
  }

  console.log(`Cell ${index} was clicked by ${currentPlayer}`);
}

function changePlayer() {
  //changes x to o to x
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;

  //for loop to check through each of win conditions
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];
    // Check if any of the cells in the current win condition are empty
    if (cellA == "" || cellB == "" || cellC == "") {
      continue;  // If any cell is empty, move on to the next win condition
    }
    // Check if all three cells in the current win condition have the same value
    if (cellA == cellB && cellB == cellC) {
      roundWon = true; // Set roundWon to true if all three cells have the same value
      break; // Exit the loop since a win condition has been met
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
    historyBtn.style.display = "block"
    histBtn.style.display = "block"
    //if no more cells are empty, draw
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    historyBtn.style.display = "block"
    histBtn.style.display = "block"
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  optionsHistory = [];
  // Reset the currentMoveIndex to -1
  currentMoveIndex = -1;
  statusText.textContent = `${currentPlayer}'s turn`;
  //reset cells styles
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.color = "";
    cell.style.border = "";
  });
  running = true;
  reviewMode = false; // Reset review mode
  histBtn.style.display = "none"
  historyBtn.style.display = "none"
  startWith();
}

function showPreviousMove() {
    // Check if there is a previous move in the history
  if (currentMoveIndex > 0) {
    // Decrement the currentMoveIndex
    currentMoveIndex--;
    // Set the options array to the state at the currentMoveIndex in the history
    options = optionsHistory[currentMoveIndex];
    updateBoard();
  }
}

function showNextMove() {
    // Check if there is a next move in the history
  if (currentMoveIndex < optionsHistory.length - 1) {
        // Increment the currentMoveIndex
    currentMoveIndex++;
        // Set the options array to the state at the currentMoveIndex in the history
    options = optionsHistory[currentMoveIndex];
    updateBoard();
  }
}

function updateBoard() {
  cells.forEach((cell, index) => {
    // Set the text content of the cell to the value in the options array at the corresponding index
    cell.textContent = options[index];

    if (options[index] === "O") {
      cell.style.color = "red";
    } else if (options[index] === "X") {
      cell.style.color = "blue";
    }
  });
  changePlayer();
}

function enterReviewMode() {
  reviewMode = true;
  //so that the cells are unclickable
  cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
}

// Function to exit review mode
function exitReviewMode() {
  reviewMode = false;
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
}
