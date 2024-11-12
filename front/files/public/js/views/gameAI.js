export function renderGameAI(appContainer) {
    if (!appContainer) {
        throw new Error('App container element is required');
    }

    const mainContentHTML = `
        <div id="score">Player 1: 0 | Player 2: 0</div>
        <div id="gameOver"></div>
        <div id="startPrompt">Press SPACE to Start</div>
        <canvas id="gameCanvas" width="800" height="400"></canvas>
        <div class="controls">
            Player 1: W/S keys | Player 2: Up/Down arrows
        </div>
    `;

    // Create mainContent if it doesn't exist
    let mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        mainContent = document.createElement('div');
        mainContent.id = 'mainContent';
        appContainer.appendChild(mainContent);
    }
    
    mainContent.innerHTML = mainContentHTML;

    // Initialize game after DOM elements are created
    initGame();
}

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get 2D context');
    }

    const gameState = {
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 5,
            maxSpeed: 15  // Add speed limit
        },
        player1: {
            x: 20,
            y: canvas.height / 2 - 40,
            width: 10,
            height: 80,
            speed: 8,
            score: 0
        },
        player2: {
            x: canvas.width - 30,
            y: canvas.height / 2 - 40,
            width: 10,
            height: 80,
            speed: 5,
            score: 0
        },
        controls: {
            player1Up: false,
            player1Down: false
        },
        settings: {
            winningScore: 10,
            gameActive: false,
            framerate: 1000 / 60,  // 60 FPS
            lastFrameTime: 0
        }
    };

    // Event listeners with error handling
    function handleKeydown(event) {
        try {
            if (event.key === 'w') gameState.controls.player1Up = true;
            if (event.key === 's') gameState.controls.player1Down = true;
            if (event.code === 'Space' && !gameState.settings.gameActive) {
                gameState.settings.gameActive = true;
                const startPrompt = document.getElementById('startPrompt');
                if (startPrompt) startPrompt.style.display = 'none';
                requestAnimationFrame((timestamp) => gameLoop(timestamp, gameState, ctx, canvas));
            }
            if (event.key === 'q') {
                quitGame(gameState);
            }
        } catch (error) {
            console.error('Error in keydown handler:', error);
        }
    }

    function handleKeyup(event) {
        try {
            if (event.key === 'w') gameState.controls.player1Up = false;
            if (event.key === 's') gameState.controls.player1Down = false;
        } catch (error) {
            console.error('Error in keyup handler:', error);
        }
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    // Cleanup function
    return function cleanup() {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('keyup', handleKeyup);
    };
}

function gameLoop(timestamp, gameState, ctx, canvas) {
    try {
        // Control frame rate
        if (timestamp - gameState.settings.lastFrameTime < gameState.settings.framerate) {
            if (gameState.settings.gameActive) {
                requestAnimationFrame((t) => gameLoop(t, gameState, ctx, canvas));
            }
            return;
        }
        gameState.settings.lastFrameTime = timestamp;

        update(gameState, canvas);
        draw(gameState, ctx, canvas);

        if (gameState.settings.gameActive) {
            requestAnimationFrame((t) => gameLoop(t, gameState, ctx, canvas));
        }
    } catch (error) {
        console.error('Error in game loop:', error);
        gameState.settings.gameActive = false;
    }
}

function update(gameState, canvas) {
    const { ball, player1, player2, controls } = gameState;

    // Update Player 1 position with bounds checking
    if (controls.player1Up && player1.y > 0) {
        player1.y = Math.max(0, player1.y - player1.speed);
    }
    if (controls.player1Down && player1.y < canvas.height - player1.height) {
        player1.y = Math.min(canvas.height - player1.height, player1.y + player1.speed);
    }

    // Improved AI logic with prediction
    const predictedBallY = ball.y + (ball.speedY * (player2.x - ball.x) / ball.speedX);
    const targetY = Math.min(Math.max(predictedBallY - player2.height / 2, 0), 
                            canvas.height - player2.height);
    
    if (ball.speedX > 0) {  // Only move when ball is coming towards AI
        if (player2.y < targetY) {
            player2.y = Math.min(player2.y + player2.speed, targetY);
        } else if (player2.y > targetY) {
            player2.y = Math.max(player2.y - player2.speed, targetY);
        }
    }

    // Update ball position with speed limits
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Ball collision with paddles with angle modification
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.speedX = Math.min(Math.abs(ball.speedX) * 1.1, ball.maxSpeed);
        const relativeIntersectY = (player1.y + (player1.height / 2)) - ball.y;
        const normalizedIntersectY = relativeIntersectY / (player1.height / 2);
        ball.speedY = -normalizedIntersectY * Math.abs(ball.speedX) * 0.75;
        ball.x = player1.x + player1.width + ball.radius;
    }

    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.speedX = -Math.min(Math.abs(ball.speedX) * 1.1, ball.maxSpeed);
        const relativeIntersectY = (player2.y + (player2.height / 2)) - ball.y;
        const normalizedIntersectY = relativeIntersectY / (player2.height / 2);
        ball.speedY = -normalizedIntersectY * Math.abs(ball.speedX) * 0.75;
        ball.x = player2.x - ball.radius;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        player2.score++;
        checkWinCondition(gameState);
        resetBall(ball, canvas);
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        checkWinCondition(gameState);
        resetBall(ball, canvas);
    }
}

function resetBall(ball, canvas) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = (Math.random() - 0.5) * 10; // Add randomness to vertical direction
}

function checkWinCondition(gameState) {
    if (gameState.player1.score >= gameState.settings.winningScore || 
        gameState.player2.score >= gameState.settings.winningScore) {
        gameState.settings.gameActive = false;
        const winner = gameState.player1.score >= gameState.settings.winningScore ? "Player 1 Wins!" : "AI Wins!";
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.innerText = winner;
            gameOverElement.style.display = 'block';
        }
        setTimeout(() => {
            location.reload(); // Refresh the current page
        }, 2000);
    }
}

function quitGame(gameState) {
    gameState.settings.gameActive = false;
    const gameOverElement = document.getElementById('gameOver');
    if (gameOverElement) {
        gameOverElement.innerText = "Game Quit";
        gameOverElement.style.display = 'block';
    }

    setTimeout(() => {
        location.reload();
    }, 2000); 
}

function draw(gameState, ctx, canvas) {
    const { ball, player1, player2 } = gameState;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw ball with shadow
    ctx.beginPath();
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 10;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Update score display
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `Player 1: ${player1.score} | AI: ${player2.score}`;
    }
}
