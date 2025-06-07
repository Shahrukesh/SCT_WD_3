let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = '';
const statusDisplay = document.getElementById('status');
const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    boardElement.style.display = 'grid';
    document.getElementById('mode-selection').style.display = 'none';
    resetButton.style.display = 'block';
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (cell) cellElement.classList.add(cell.toLowerCase());
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleCellClick(index));
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    if (checkWin()) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    if (checkDraw()) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

    if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    if (emptyCells.length === 0) return;

    // Simple AI: Try to win or block player
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameBoard[a] === 'O' && gameBoard[b] === 'O' && gameBoard[c] === '') return makeMove(c);
        if (gameBoard[a] === 'O' && gameBoard[c] === 'O' && gameBoard[b] === '') return makeMove(b);
        if (gameBoard[b] === 'O' && gameBoard[c] === 'O' && gameBoard[a] === '') return makeMove(a);
        if (gameBoard[a] === 'X' && gameBoard[b] === 'X' && gameBoard[c] === '') return makeMove(c);
        if (gameBoard[a] === 'X' && gameBoard[c] === 'X' && gameBoard[b] === '') return makeMove(b);
        if (gameBoard[b] === 'X' && gameBoard[c] === 'X' && gameBoard[a] === '') return makeMove(a);
    }

    // If no immediate win/block, choose center if available, else random
    if (gameBoard[4] === '') {
        makeMove(4);
    } else {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex);
    }
}

function makeMove(index) {
    gameBoard[index] = 'O';
    renderBoard();
    if (checkWin()) {
        statusDisplay.textContent = `Player O wins!`;
        gameActive = false;
        return;
    }
    if (checkDraw()) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }
    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winningCombinations.some(combo => {
        return combo.every(index => gameBoard[index] === currentPlayer);
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = false;
    boardElement.style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
    resetButton.style.display = 'none';
    statusDisplay.textContent = 'Choose a game mode';
}