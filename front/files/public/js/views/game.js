export function renderGame(appContainer){
    const mainContentHTML = `
    <div id="usernamePrompt">
    <div class="player-input game">
          <input type="text" id="username" placeholder="username" />
        </div>
    <div id="usernameError" class="error-message"></div>
    <button class="btn-game">Start Game</button>
    </div>
    <div id="score">Host player: 0 | Guest player: 0</div>
    <div id="gameOver"></div>
    <div id="startPrompt"></div>
    <canvas id="gameCanvas" width="800" height="400"></canvas>
    <div class="controls">
        Player 1: W/S keys | Player 2: Up/Down arrows
    </div>
    </div>
    `;
    document.getElementById('mainContent').innerHTML = mainContentHTML;
    const checkBtn = document.querySelector(".btn-game")

    checkBtn.addEventListener("click", checkUsername);

    
}


export async function fetch_users(username) {

    const response = await fetch(`/backend/users/${username}`,
      {   
        method: 'GET',
        credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      return (data);
    }
    return data;
  }
  

async function checkUsername() {
    const usernameInput = document.getElementById("username").value.trim();
    const errorDisplay = document.getElementById("usernameError");

    if (usernameInput === "") {
        errorDisplay.textContent = "Username cannot be empty.";
        return false;
    }
    const data = await fetch_users(usernameInput);
    if (!data.success) {
        errorDisplay.textContent = "player not exist.";
        return false;
    } else {
        errorDisplay.textContent = "";
        // Hide the username prompt and proceed to start the game
        document.getElementById("usernamePrompt").style.display = "none";
        document.getElementById("startPrompt").textContent = "Press SPACE to Start";
        // You can save the username or proceed with further initialization
        window.pongGame = new PongGame(usernameInput);
    }
    return true;
}



class PongGame {
    constructor(unsername) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');;
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');
        this.startPromptElement = document.getElementById('startPrompt');
        this.gameStatsElement = document.getElementById('gameStats');

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            speedX: 4,
            speedY: 4,
            color: '#ffff00'
        };
        this.unsername = unsername;
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.paddle1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            color: '#ff0000'
        };
        this.paddle2 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            color: '#0000ff'
        };

        this.keys = {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false
        };

        this.gameEnded = false;
        this.gameStarted = false;
        this.winner = null;
        this.loser = null;

        this.initializeEventListeners();
        this.gameLoop();
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !this.gameStarted && !this.gameEnded) {
                this.gameStarted = true;
                this.startPromptElement.style.display = 'none';
            }
            if (e.key in this.keys) {
                this.keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    getGameResult() {
        const player1 = JSON.parse(localStorage.getItem("me"));
        const player2 = this.unsername;

        if(this.winner === "Player 1"){
            return {
                winner: player1.username,
                loser: player2,
                winnerScore: this.paddle1.score,
                loserScore: this.paddle2.score
            };
        }
        return {
            winner: player2,
            loser: player1.username,
            winnerScore: this.paddle2.score,
            loserScore: this.paddle1.score
        };
    }

    updatePaddles() {
        if (this.gameEnded || !this.gameStarted) return;
        
        if (this.keys.w && this.paddle1.y > 0) {
            this.paddle1.y -= 8;
        }
        if (this.keys.s && this.paddle1.y < this.canvas.height - this.paddleHeight) {
            this.paddle1.y += 8;
        }
        if (this.keys.ArrowUp && this.paddle2.y > 0) {
            this.paddle2.y -= 8;
        }
        if (this.keys.ArrowDown && this.paddle2.y < this.canvas.height - this.paddleHeight) {
            this.paddle2.y += 8;
        }
    }

    checkGameEnd() {
        if (this.paddle1.score >= 10 || this.paddle2.score >= 10) {
            const scoreDiff = Math.abs(this.paddle1.score - this.paddle2.score);
            if (scoreDiff >= 2) {
                this.gameEnded = true;
                this.winner = this.paddle1.score > this.paddle2.score ? "Player 1" : "Player 2";
                this.loser = this.paddle1.score > this.paddle2.score ? "Player 2" : "Player 1";
                const winnerScore = this.paddle1.score > this.paddle2.score ? this.paddle1.score : this.paddle2.score;
                const loserScore = this.paddle1.score > this.paddle2.score ? this.paddle2.score : this.paddle1.score;
                
                this.gameOverElement.style.display = "block";
                this.gameOverElement.textContent = `${this.winner} Wins!`;
                //console.log("game end >>>>>>", this.getGameResult());
                /*this.gameStatsElement.style.display = "block";
                this.gameStatsElement.innerHTML = `Winner: ${this.winner} (${winnerScore} points)<br>
                                            Loser: ${this.loser} (${loserScore} points)`;
                */
               
               
                setTimeout(() => {
                    location.reload();
                }, 3000);
                
            }

        }
    }

    updateBall() {
        if (this.gameEnded || !this.gameStarted) return;
        
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
            this.ball.speedY = -this.ball.speedY;
        }

        if (this.ball.x - this.ball.radius < this.paddleWidth && 
            this.ball.y > this.paddle1.y && 
            this.ball.y < this.paddle1.y + this.paddleHeight) {
            this.ball.speedX = -this.ball.speedX;
        }

        if (this.ball.x + this.ball.radius > this.canvas.width - this.paddleWidth && 
            this.ball.y > this.paddle2.y && 
            this.ball.y < this.paddle2.y + this.paddleHeight) {
            this.ball.speedX = -this.ball.speedX;
        }

        if (this.ball.x < 0) {
            this.paddle2.score++;
            this.resetBall();
            this.checkGameEnd();
        } else if (this.ball.x > this.canvas.width) {
            this.paddle1.score++;
            this.resetBall();
            this.checkGameEnd();
        }

        this.scoreElement.textContent = `Player 1: ${this.paddle1.score} | Player 2: ${this.paddle2.score}`;
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX = this.ball.speedX > 0 ? 4 : -4;
        this.ball.speedY = (Math.random() * 6 - 3);
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = this.paddle1.color;
        this.ctx.fillRect(0, this.paddle1.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = this.paddle2.color;
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.paddle2.y, this.paddleWidth, this.paddleHeight);

        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ball.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    gameLoop() {
        this.updatePaddles();
        this.updateBall();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}


