const maxScore = 5;

const buttons = document.querySelectorAll(".choice");
const resultText = document.getElementById("result-text");
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");
const restartBtn = document.getElementById("restart-btn");
const historyList = document.getElementById("history-list");

const winSound = document.getElementById("sound-win");
const loseSound = document.getElementById("sound-lose");
const drawSound = document.getElementById("sound-draw");

let playerScore = 0;
let computerScore = 0;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    if (playerScore < maxScore && computerScore < maxScore) {
      playRound(button.id);
    }
  });
});

restartBtn.addEventListener("click", resetGame);

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const outcome = determineWinner(playerChoice, computerChoice);

  if (outcome === "win") playerScore++;
  else if (outcome === "lose") computerScore++;

  updateScores();
  animateResult(outcome, playerChoice, computerChoice);
  playSound(outcome);
  addHistory(outcome, playerChoice, computerChoice);

  if (playerScore === maxScore || computerScore === maxScore) {
    endGame();
  }
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(player, computer) {
  if (player === computer) return "draw";

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper" && computer === "rock")
  ) {
    return "win";
  }
  return "lose";
}

function updateScores() {
  playerScoreElem.textContent = `Player: ${playerScore}`;
  computerScoreElem.textContent = `Computer: ${computerScore}`;
}

function animateResult(outcome, playerChoice, computerChoice) {
  buttons.forEach(btn => btn.classList.remove("winner"));

  if (outcome === "draw") {
    resultText.style.color = "#ffeaa7";
    resultText.textContent = `It's a draw! Both chose ${capitalize(playerChoice)}.`;
  } else if (outcome === "win") {
    resultText.style.color = "#00b894";
    resultText.textContent = `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
    document.getElementById(playerChoice).classList.add("winner");
  } else {
    resultText.style.color = "#d63031";
    resultText.textContent = `You lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}.`;
    document.getElementById(computerChoice).classList.add("winner");
  }
}

function playSound(outcome) {
  if (outcome === "win") {
    winSound.volume = 1.0;
    winSound.play();
  } else if (outcome === "lose") {
    loseSound.volume = 1.0;
    loseSound.play();
  } else {
    drawSound.volume = 1.0;
    drawSound.play();
  }
}

function addHistory(outcome, playerChoice, computerChoice) {
  const li = document.createElement("li");
  li.classList.add(outcome);

  let text;
  if (outcome === "draw") {
    text = `Draw: Both chose ${capitalize(playerChoice)}`;
  } else if (outcome === "win") {
    text = `You won: ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}`;
  } else {
    text = `You lost: ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}`;
  }

  li.textContent = text;
  historyList.prepend(li);

  // Keep only latest 10 entries
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

function endGame() {
  let winner = playerScore > computerScore ? "You win the game!" : "Computer wins the game!";
  resultText.textContent = winner;
  resultText.style.color = "#fdcb6e";
  buttons.forEach(btn => btn.disabled = true);
  restartBtn.style.display = "inline-block";
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  updateScores();
  resultText.textContent = "Choose Rock, Paper, or Scissors to start!";
  resultText.style.color = "white";
  buttons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("winner");
  });
  restartBtn.style.display = "none";
  historyList.innerHTML = "";
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
