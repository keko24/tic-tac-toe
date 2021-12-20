const GameBoard = (function() {
	let gameBoard = [[], [], []];
	const newGame = function() {
		gameBoard = [[], [], []];
	}
	const mark = function(i, j, sign) {
		gameBoard[i][j] = sign;
	}
	const checkWinner = function() {
		for (let i = 0; i < 3; i++)
		{
			let column = gameBoard[0][i], columnWinner = true;
			let row = gameBoard[i][0], rowWinner = true;
			for (let j = 1; j < 3; j++)
			{
				if (columnWinner === false && rowWinner === false)
					break;
				if (column !== gameBoard[j][i] || !gameBoard[j][i])
					columnWinner = false;
				if (row !== gameBoard[i][j] || !gameBoard[i][j])
					rowWinner = false;
			}
			if (columnWinner === true || rowWinner === true)
			{
				console.log(`Winner on ${i}`);
				return true;
			}
		}
		if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2] && gameBoard[0][0] && gameBoard[1][1] && gameBoard[2][2])
		{
			console.log(`Winner on main diagonal`);
			return true;
		}
		if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0] && gameBoard[0][2] && gameBoard[1][1] && gameBoard[2][0])
		{
			console.log('Winner on not main diagonal');
			return true;
		}
		return false;
	}
	return {newGame, mark, checkWinner};
})();

const displayController = (function() {
	const gameBoard = document.querySelector('#game-board');
	const displayScreen = function() {
		GameBoard.newGame();
		cleanScreen();
		for (let i = 0; i < 3; i++)
		{
			for (let j = 0; j < 3; j++)
			{
				const square = document.createElement('div');
				square.classList.add(`i=${i}`, `j=${j}`, 'square');
				gameBoard.appendChild(square);
				square.addEventListener('click', markSquare);
			}
		}
	}
	const cleanScreen = function() {
		if (gameBoard.innerHTML.length <= 3)
			return;
		for (let i = 0; i < 9; i++)
		{
			gameBoard.removeChild(gameBoard.lastElementChild);
		}
	}
	const markSquare = function(e) {
		if (e.target.textContent !== "")
			return;
		const sign = ticTacToe.checkTurn();
		GameBoard.mark(e.target.classList[0][2], e.target.classList[1][2], sign);
		e.target.textContent = sign;
		if (GameBoard.checkWinner())
			alert(`${sign} is the winner!!!`);
	}
	return {displayScreen};
})();

const ticTacToe = (function() {
	let player1, player2, turn;
	const startNewGame = function() {
		turn = 0;
		const sign = pickSign();
		player1 = player(sign);
		player2 = player(!sign);
		displayController.displayScreen();
	}
	const checkTurn = function() {
		++turn;
		if (player1.myTurn)
		{
			player1.myTurn = false;
			player2.myTurn = true;
			return player1.playerSign;
		}
		else
		{
			player1.myTurn = true;
			player2.myTurn = false;
			return player2.playerSign;
		}
	}
	const pickSign = function() {
		return Math.floor(Math.random() * 2);
	}
	return {startNewGame, checkTurn};
})();

const player = function(turn) {
	let playerSign = turn ? 'X' : 'O';
	let myTurn = turn;
	let points = 0;
	return {playerSign, myTurn, points};
};

ticTacToe.startNewGame();
