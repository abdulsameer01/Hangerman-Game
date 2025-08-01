const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Sample word list (you should replace or expand this as needed)

const victorySound = new Audio("sounds/victory.wav");
const lostSound = new Audio("sounds/loser.mp3");
const clickSound = new Audio("sounds/click.mp3"); // optional

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Resetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord
        .split("")
        .map(() => `<li class="letter"></li>`)
        .join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
};

const gameOver = (isVictory) => {
  const modalText = isVictory ? `You found the word:` : "The correct word was:";

  gameModal.querySelector("img").src = isVictory
    ? "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
    : "https://media.giphy.com/media/IwSG1QKOwDjQk/giphy.gif";

  gameModal.querySelector("h4").innerText = isVictory
    ? "Congrats!"
    : "Game Over!";
  gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
  gameModal.classList.add("show");

  // ✅ Play corresponding sound
  isVictory ? victorySound.play() : lostSound.play();
};


const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Check for game end
    const allLettersGuessed = currentWord.split("").every(letter => correctLetters.includes(letter));
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (allLettersGuessed) return gameOver(true);
};

// Create keyboard buttons
const createKeyboard = () => {
  keyboardDiv.innerHTML = ""; // Clear existing buttons

  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.innerText = letter;

    // ✅ Add click sound and game logic
    button.addEventListener("click", (e) => {
      clickSound.play(); // Sound on click
      initGame(e.target, letter);
    });

    keyboardDiv.appendChild(button);
  }
};


createKeyboard();
getRandomWord();



// ✅ Add click sound to play again button
playAgainBtn.addEventListener("click", () => {
  clickSound.play();
  getRandomWord(); // restart the game
});


