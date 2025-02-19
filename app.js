const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('#score');
const difficultySelect = document.querySelector('#difficulty');

let gameOver = false;
let foodX, foodY;
let snakeX = 20, snakeY = 14;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let speed;
let gameStarted = false; // Flag to check if the game has started

// Sound effects
const directionSound = new Audio('./sounds/snakegamedirection.wav');
const gameOverSound = new Audio('./sounds/snakegameloosing.wav');
const foodSound = new Audio('./sounds/snakegameeat.wav');
const backgroundMusic = new Audio('./sounds/The Snake Charmer.mp3');
backgroundMusic.loop = true;

// Define speed values for different difficulty levels
const speeds = {
    easy: 200,   // 200ms interval (slow speed)
    medium: 100, // 100ms interval (medium speed)
    hard: 50     // 50ms interval (fast speed)
};

// Function to set difficulty and start the game
const setDifficulty = (difficulty) => {
    if (!difficulty) return; // Do nothing if no difficulty is selected
    speed = speeds[difficulty]; // Set speed based on difficulty
    gameStarted = true; // Mark the game as started
    clearInterval(setIntervalId); // Clear any existing interval
    setIntervalId = setInterval(initGame, speed); // Start the game with the new speed
    backgroundMusic.play(); // Play background music
};

// Event listener for difficulty selection
difficultySelect.addEventListener('change', (e) => {
    const selectedDifficulty = e.target.value;
    setDifficulty(selectedDifficulty);
});

// Function to handle game over
const handleGameOver = () => {
    backgroundMusic.pause(); // Pause background music
    gameOverSound.play(); // Play game over sound
    clearInterval(setIntervalId); // Stop the game loop
    alert("Game Over! Refresh the page to play again.");
    location.reload(); // Reload the page to restart the game
};

// Function to change food position
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Function to handle keyboard input for snake direction
const changeDirection = (e) => {
    if (!gameStarted) return; // Ignore input if the game hasn't started
    directionSound.play(); // Play direction change sound
    if ((e.key === "w" || e.key === "W" || e.key === "ArrowUp") && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if ((e.key === "s" || e.key === "S" || e.key === "ArrowDown") && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if ((e.key === "a" || e.key === "A" || e.key === "ArrowLeft") && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if ((e.key === "d" || e.key === "D" || e.key === "ArrowRight") && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Function to handle mobile button clicks for snake direction
const moveSnake = (direction) => {
    if (!gameStarted) return; // Ignore input if the game hasn't started
    directionSound.play(); // Play direction change sound
    switch (direction) {
        case 'up':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'down':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'left':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'right':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
};

// Main game loop
const initGame = () => {
    if (!gameStarted) return; // Do not run the game logic if the game hasn't started
    if (gameOver) return handleGameOver();

    // Check if the snake has eaten the food
    if (snakeX === foodX && snakeY === foodY) {
        foodSound.play(); // Play food eating sound
        changeFoodPosition(); // Move the food to a new position
        snakeBody.push([snakeX, snakeY]); // Add a new segment to the snake's body
        score++;
        scoreElement.innerText = score; // Update the score display
    }

    // Update the snake's body positions
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    // Update the head of the snake
    snakeBody[0] = [snakeX, snakeY];

    // Move the snake's head based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Check for collisions with walls
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Check for collisions with the snake's body
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    // Render the food and the snake
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    playBoard.innerHTML = htmlMarkup;
};

// Initialize the game
changeFoodPosition(); // Set the initial food position
document.addEventListener("keydown", changeDirection); // Add keyboard event listener
