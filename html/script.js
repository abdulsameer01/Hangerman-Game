const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector(".play-again");
const scoreText = document.querySelector(".score-text"); // ✅ New live score display
const reviewListDiv = document.querySelector("#reviewList"); // ✅ Review section container

// Sounds
const victorySound = new Audio("sounds/victory.wav");
const lostSound = new Audio("sounds/loser.mp3");

// Game variables
let currentWord, correctLetters, wrongGuessCount;
let score = 0;
const maxGuesses = 6;

const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = "images/hangman-0.svg";
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  scoreText.innerText = `Score: ${score}`; // keep score across rounds
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  keyboardDiv
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));
  gameModal.classList.remove("show");
};

const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

const gameOver = (isVictory) => {
  if (isVictory) {
    score += 50; // bonus points
    scoreText.innerText = `Score: ${score}`;
  }

  const modalText = isVictory ? `You found the word:` : "The correct word was:";
  gameModal.querySelector("img").src = isVictory
    ? "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
    : "https://media.giphy.com/media/IwSG1QKOwDjQk/giphy.gif";

  gameModal.querySelector("h4").innerText = isVictory
    ? "Congrats!"
    : "Game Over!";
  gameModal.querySelector("p").innerHTML = `
    ${modalText} <b>${currentWord}</b><br>
    <b>Score:</b> ${score}
  `;

  gameModal.classList.add("show");
  isVictory ? victorySound.play() : lostSound.play();
};

const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    let letterCount = 0;
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        letterCount++;
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
    score += letterCount * 10;
    scoreText.innerText = `Score: ${score}`;
  } else {
    wrongGuessCount++;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  const allLettersGuessed = currentWord
    .split("")
    .every((letter) => correctLetters.includes(letter));
  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (allLettersGuessed) return gameOver(true);
};

const createKeyboard = () => {
  keyboardDiv.innerHTML = "";
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.innerText = letter;
    button.addEventListener("click", (e) => {
      new Audio("sounds/click.mp3").play();
      initGame(e.target, letter);
    });
    keyboardDiv.appendChild(button);
  }
};

// ✅ Feedback Submission
document.getElementById("submitFeedback").addEventListener("click", () => {
  const rating = document.getElementById("userRating").value;
  const review = document.getElementById("userReview").value.trim();

  if (!rating || !review) {
    alert("Please provide both a rating and review!");
    return;
  }

  const feedbackList = JSON.parse(
    localStorage.getItem("hangmanFeedback") || "[]"
  );
  feedbackList.push({ rating, review, date: new Date().toLocaleString() });
  localStorage.setItem("hangmanFeedback", JSON.stringify(feedbackList));

  alert("✅ Thanks for your feedback!");
  document.querySelector(".feedback").style.display = "none";
  loadReviews(); // refresh review section
});

// ✅ Load Reviews into the Review Section
function loadReviews() {
  const feedbackList = JSON.parse(
    localStorage.getItem("hangmanFeedback") || "[]"
  );
  if (feedbackList.length === 0) {
    reviewListDiv.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
    return;
  }
  reviewListDiv.innerHTML = feedbackList
    .map(
      (f) => `
      <div class="review-item">
        <p>⭐ ${f.rating} — ${f.review}</p>
        <small>${f.date}</small>
      </div>
    `
    )
    .join("");
}

// Play again button
playAgainBtn.addEventListener("click", () => {
  getRandomWord();
  document.querySelector(".feedback").style.display = "block";
});

// Initialize game
createKeyboard();
getRandomWord();
loadReviews();
