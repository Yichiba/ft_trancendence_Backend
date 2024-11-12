const initPong8 = () =>{
  class Paddle {
    constructor(paddleElem) {
      this.paddleElem = paddleElem;
      this.reset();
    }
    reset() {
      this.position = 120; //
    }

    get position() {
      return parseFloat(
        getComputedStyle(this.paddleElem).getPropertyValue("--position")
      );
    }

    set position(value) {
      this.paddleElem.style.setProperty("--position", value);
    }
    getInfo() {
      return this.paddleElem.getBoundingClientRect();
    }
  }

  const velacity = 0.2;

  class Ball {
    constructor(ballElem) {
      this.ballElem = ballElem;
      this.reset();
    }
    reset() {
      this.x = 295;
      this.y = 150;
      this.direction = { x: 0, y: 0 };
      while (
        Math.abs(this.direction.x) < 0.3 ||
        Math.abs(this.direction.y) > 0.7
      ) {
        const angle = this.randombetween(0, Math.PI * 2);
        this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
      }
    }
    getInfo() {
      return this.ballElem.getBoundingClientRect();
    }

    get x() {
      return parseFloat(
        getComputedStyle(this.ballElem).getPropertyValue("--x")
      );
    }

    set x(value) {
      this.ballElem.style.setProperty("--x", value);
    }

    get y() {
      return parseFloat(
        getComputedStyle(this.ballElem).getPropertyValue("--y")
      );
    }

    set y(value) {
      this.ballElem.style.setProperty("--y", value);
    }

    update(delta, containerInfo, infos) {
      this.x += this.direction.x * delta * velacity;
      this.y += this.direction.y * delta * velacity;
      const ballInfo = this.getInfo();

      if (
        ballInfo.top <= containerInfo.top ||
        ballInfo.bottom >= containerInfo.bottom
      ) {
        this.direction.y *= -1;
      }
      if (infos.some((r) => isIntercation(r, ballInfo))) {
        this.direction.x *= -1;
      }
    }
    randombetween(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  function isIntercation(rect1, rect2) {
    return (
      rect1.left <= rect2.right &&
      rect1.right >= rect2.left &&
      rect1.top <= rect2.bottom &&
      rect1.bottom >= rect2.top
    );
  }

  class PingPongTournament {
    constructor() {
      this.leftPaddle = new Paddle(document.getElementById("leftPaddle"));
      this.rightPaddle = new Paddle(document.getElementById("rightPaddle"));
      this.ball = new Ball(document.querySelector(".f2 .ball-tourna"));
      this.updatePaddle = this.updatePaddle.bind(this);
      this.startGame = this.startGame.bind(this);
      this.players = [];
      this.currentMatch = 1;
      this.i = 0;
      this.start = undefined;
      this.scores = [0, 0];
      this.winners = {};
      this.gameStarted = false;
      this.pointsToWin = 5;
      this.matchIndex = 0;
      this.gameLoop = null;
      this.keys = {
        ArrowUp: false,
        ArrowDown: false,
        w: false,
        s: false,
      };
      this.initializeGame();
    }

    initializeGame() {
      document
        .getElementById("registerButton")
        .addEventListener("click", () => {
          this.registerPlayers();
        });

      document
        .getElementById("startButton")
        .addEventListener("click", () => {
          this.gameStarted = true;
          document.querySelector(".ping-pong-court").style.display =
            "block";
          document.getElementById("startButton").style.display = "none";
          document.querySelector(".current-match").classList.remove("hide");
          document.querySelector(".score-display-tourna").style.display = "block";
          document
            .querySelector(".tournament-bracket")
            .classList.add("hide");
        });

      document.addEventListener("keydown", (e) => {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
      });

      document.addEventListener("keyup", (e) => {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
      });
      document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    }

    updatePaddle() {
      let p = this.leftPaddle.position;
      let c = this.rightPaddle.position;
      if (this.keys.ArrowDown)
        this.rightPaddle.position = Math.min(225, c + 10);
      if (this.keys.ArrowUp)
        this.rightPaddle.position = Math.max(0, c - 10);
      if (this.keys.w) this.leftPaddle.position = Math.max(0, p - 10);
      if (this.keys.s) this.leftPaddle.position = Math.min(225, p + 10);
      requestAnimationFrame(this.updatePaddle);
    }

    startGame(timestamp) {
      const container = document.querySelector(".ping-pong-court");
      const containerInfo = container.getBoundingClientRect();
      let ballInfo = this.ball.getInfo();
      if (!this.isRun) return;
      if (this.start !== undefined) {
        const delta = timestamp - this.start;
        this.ball.update(delta, containerInfo, [
          this.rightPaddle.getInfo(),
          this.leftPaddle.getInfo(),
        ]);
        if (
          ballInfo.left <= containerInfo.left ||
          ballInfo.right >= containerInfo.right
        ) {
        
          if (Math.floor(ballInfo.left) <= Math.floor(containerInfo.left) && this.ball.x){
            this.scores[1]++;
        }
          if (ballInfo.right >= containerInfo.right) this.scores[0]++;
          this.ball.reset();
          this.leftPaddle.reset();
          this.rightPaddle.reset();
        }
        this.updateDisplay();
        if (
          this.scores[0] >= this.pointsToWin ||
          this.scores[1] >= this.pointsToWin
        ) {
          this.handleWinner();
        }
      }

      this.start = timestamp;
      this.gameLoop = requestAnimationFrame(this.startGame);
      //this.gameLoop = setInterval(() => this.updateGame(), 1000 / 60);
    }

    stopGame() {
      this.isRun = false;
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
      this.start = undefined
    }


    handleKeyPress(e) {
    this.isRun = true;
      if (e.key === " ") {
        if (!this.gameLoopl && this.gameStarted) {
          this.ball.reset();
          this.leftPaddle.reset();
          this.rightPaddle.reset();
          this.updatePaddle();
          this.startGame();
        }
      }
    }

    registerPlayers() {
      document
        .querySelectorAll(".error-message")
        .forEach((el) => el.remove());
      document
        .querySelectorAll("input")
        .forEach((input) => input.classList.remove("error"));

      let hasErrors = false;
      const names = new Set();
      this.players = [];

      for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`player${i}`);
        const name = input.value.trim();

        if (!/^[a-zA-Z0-9]+$/.test(name)) {
          this.showError(
            input,
            "Name must contain only letters and numbers"
          );
          hasErrors = true;
          continue;
        }

        if (name.length < 3 || name.length > 20) {
          this.showError(input, "Name must be between 3 and 20 characters");
          hasErrors = true;
          continue;
        }

        if (names.has(name.toLowerCase())) {
          this.showError(input, "Name must be unique");
          hasErrors = true;
          continue;
        }

        names.add(name.toLowerCase());
        this.players.push(name);
      }

      if (hasErrors) {
        return;
      }

      this.players.forEach((name, index) => {
        const matchNum = Math.floor(index / 2) + 1;
        const playerNum = (index % 2) + 1;
        const playerElement = document.querySelector(
          `#match${matchNum} .player:nth-child(${playerNum})`
        );
        playerElement.textContent = name;
      });

      document.getElementById("registration").classList.add("hide");
      document.getElementById("registerButton").classList.add("hide");
      document
        .querySelector(".tournament-bracket")
        .classList.remove("hide");
      document.getElementById("startButton").classList.remove("hide");

      this.updateDisplay();
    }

    showError(inputElement, message) {
      inputElement.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      inputElement.parentNode.appendChild(errorDiv);
    }

    updateDisplay() {
      this.matchIndex = (this.currentMatch - 1) * 2;
      const player1 = this.getMatchPlayer(this.currentMatch, 0);
      const player2 = this.getMatchPlayer(this.currentMatch, 1);
      document.getElementById(
        "current-players"
      ).textContent = `${player1} vs ${player2}`;
      document.getElementById("leftScore").textContent = this.scores[0];
      document.getElementById("rightScore").textContent = this.scores[1];
    }

    getMatchPlayer(matchIndex, playerIndex) {
      if (matchIndex <= 4) {
        return this.players[matchIndex * 2 - 2 + playerIndex];
      } else {
        return this.players[matchIndex * 2 - 2 + playerIndex] || "TBD";
      }
    }

    updateBallPosition() {
      const ballElem = document.querySelector(".ball");
      ballElem.style.left = `${this.ball.x}px`;
      ballElem.style.top = `${this.ball.y}px`;
    }

    
    toggleViews(showBracket) {
      const bracket = document.querySelector(".tournament-bracket");
      const gameBoard = document.querySelector(".ping-pong-court");
      const currentMatch = document.querySelector(".current-match");
      const scoreDisplay = document.querySelector(".score-display-tourna");

      if (showBracket) {
        bracket.classList.remove("hide");
        gameBoard.style.display = "none";
        scoreDisplay.style.display = "none";
        currentMatch.classList.add("hide");
        this.gameStarted = false;
      } else {
        bracket.classList.add("hide");
        gameBoard.style.display = "block";
        scoreDisplay.style.display = "block";
        currentMatch.classList.remove("hide");
        this.gameStarted = true;
      }
    }

    resetPong() {
      this.scores = [0, 0];
      this.ball.reset();
      this.leftPaddle.reset();
      this.rightPaddle.reset();
    }

    handleWinner() {
      const winner =
              this.scores[0] >= this.pointsToWin
                ? this.players[0 + this.matchIndex]
                : this.players[1 + this.matchIndex];
            const loser = this.scores[0] >= this.pointsToWin
                ? this.players[1 + this.matchIndex]
                : this.players[0 + this.matchIndex];
            const loserScore =  this.scores[0] >= this.pointsToWin ? this.scores[1] : this.scores[0]; 
            // recordMatch(winner , this.pointsToWin , loser , loserScore);
      this.players.push(winner);
      this.stopGame();
      this.gameLoop = false;
      this.resetPong();
      alert(`${winner} wins!`);

      this.winners[`match${this.currentMatch}`] = winner;
      this.updateBracket();

      // Show bracket for 3 seconds
      this.toggleViews(true);
      setTimeout(() => {
        this.currentMatch++;
        if (this.currentMatch <= 7) {
          this.updateDisplay();
          this.toggleViews(false);
        } else {
          alert(`Tournament complete! ${winner} is the champion!`);
        }
      }, 3000);
    }

    updateBracket() {
      if (this.currentMatch <= 8) {
        const semiMatchIndex = Math.ceil(this.currentMatch / 2);
        const semiMatch = document.querySelector(
          `#match${semiMatchIndex + 4} .player:nth-child(${
            (this.currentMatch % 2) + 1
          })`
        );
        semiMatch.textContent = this.winners[`match${this.currentMatch}`];
      } else if (this.currentMatch <= 6) {
        const finalPlayer = document.querySelector(
          `#match7 .player:nth-child(${this.currentMatch - 4})`
        );
        finalPlayer.textContent = this.winners[`match${this.currentMatch}`];
      }
    }
  }

  // Initialize the tournament
  // window.addEventListener('load', connectMetaMask);
  // window.addEventListener("load", () => {
    new PingPongTournament();
  // });
}
export default initPong8;