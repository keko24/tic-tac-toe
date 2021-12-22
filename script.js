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
			if (columnWinner === true)
			{
				console.log(`Winner on column ${i}`);
				return `j=${i}`;
			}
			else if (rowWinner === true)
			{
				console.log(`Winner on row ${i}`);
				return `i=${i}`;
			}
		}
		if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2] && gameBoard[0][0] && gameBoard[1][1] && gameBoard[2][2])
		{
			console.log(`Winner on main diagonal`);
			return 'main';
		}
		if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0] && gameBoard[0][2] && gameBoard[1][1] && gameBoard[2][0])
		{
			console.log('Winner on not main diagonal');
			return 'anti';
		}
		return false;
	}
	return {newGame, mark, checkWinner};
})();

const displayController = (function() {
	const container = document.querySelector('#container');
	const gameBoard = container.querySelector('#game-board');
	const restartButton = container.querySelector('#restart-button');
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
				square.addEventListener('click', markSquare, {once: true});
			}
		}
	}
	const cleanScreen = function() {
		if (gameBoard.innerHTML.length <= 5)
			return;
		for (let i = 0; i < 9; i++)
		{
			gameBoard.removeChild(gameBoard.lastElementChild);
		}
	}
	const stopMarking = function() {
		let square = gameBoard.lastElementChild;
		for (let i = 0; i < 9; i++)
		{
			square.removeEventListener('click', markSquare);
			square = square.previousSibling;
		}
	}
	const strike = function(square, path) {
		if (path === 'i')
			square.classList.add('strike-row');
		else if (path === 'j')
			square.classList.add('strike-column');
		else if (path === 'main')
			square.classList.add('strike-main');
		else
			square.classList.add('strike-anti');

	}
	const finishGame = function(line) {
		if (line === 'draw')
		{
		}
		else if (line[0] === 'j' || line[0] === 'i')
		{
			const squares = gameBoard.getElementsByClassName(line);
			for (let i = 0; i < 3; i++)
				strike(squares[i], line[0]);
		}
		else if (line === 'main')
		{
			const squares = [gameBoard.getElementsByClassName('i=0 j=0'), gameBoard.getElementsByClassName('i=1 j=1'), gameBoard.getElementsByClassName('i=2 j=2')];
			for (let i = 0; i < 3; i++)
				strike(squares[i][0], line);
		}
		else
		{
			const squares = [gameBoard.getElementsByClassName('i=0 j=2'), gameBoard.getElementsByClassName('i=1 j=1'), gameBoard.getElementsByClassName('i=2 j=0')];
			for (let i = 0; i < 3; i++)
				strike(squares[i][0], line);
		}
		const newGameBtn = document.createElement('button');
		newGameBtn.textContent = "New Game";
		newGameBtn.setAttribute('id', 'new-game-button');
		container.appendChild(newGameBtn);
		newGameBtn.addEventListener('click', newGame);
	}
	const newGame = function(e) {
		ticTacToe.startNewGame();
		container.removeChild(e.target);
	}
	const markSquare = function(e) {
		const sign = ticTacToe.checkTurn();
		GameBoard.mark(e.target.classList[0][2], e.target.classList[1][2], sign);
		e.target.textContent = sign;
		if (ticTacToe.getTurn() === 10)
		{
			finishGame('draw');
			alert('Draw!!');
			stopMarking();
			return;
		}
		let finish = GameBoard.checkWinner();
		if (!finish)
			return;
		finishGame(finish);
		alert(`${sign} is the winner!!!`);
		stopMarking();
	}
	const restartGame = function(e) {
		ticTacToe.startNewGame();
	}
	restartButton.addEventListener('click', restartGame);
	return {displayScreen};
})();

const ticTacToe = (function() {
	let player1, player2, turn;
	const startNewGame = function() {
		turn = 1;
		const sign = pickSign();
		player1 = player(sign);
		player2 = player(!sign);
		displayController.displayScreen();
	}
	const checkTurn = function() {
		++turn;
		if (player1.getMyTurn())
		{
			player1.setMyTurn(false);
			player2.setMyTurn(true);
			return player1.getSign();
		}
		else
		{
			player1.setMyTurn(true);
			player2.setMyTurn(false);
			return player2.getSign();
		}
	}
	const getTurn = function() {
		return turn;
	}
	const pickSign = function() {
		return Math.floor(Math.random() * 2);
	}
	return {startNewGame, checkTurn, getTurn};
})();

const player = function(turn) {
	let name, sign = turn ? 'X' : 'O', myTurn = turn, points = 0;
	const getPoints = function() {
		return points;
	}
	const addPoints = function() {
		points++;
	}
	const setSign = function(s) {
		sign = s;
	}
	const getSign = function() {
		return sign;
	}
	const setMyTurn = function(turn) {
		myTurn = turn;
	}
	const getMyTurn = function() {
		return myTurn;
	}
	const setName = function(n) {
		name = n;
	}
	const getName = function() {
		return name;
	}
	return {getPoints, addPoints, setName, getName, getSign, setSign, getMyTurn, setMyTurn};
};

ticTacToe.startNewGame();
