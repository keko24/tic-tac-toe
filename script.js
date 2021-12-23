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
	const scoreBoard = container.querySelector('#score-board');
	const restartButton = container.querySelector('#restart-button');
	const player1Score = document.createElement('p');
	player1Score.setAttribute('id', 'player-one-score');
	const player2Score = document.createElement('p');
	player2Score.setAttribute('id', 'player-two-score');
	const playerTurn = document.createElement('p');
	playerTurn.setAttribute('id', 'player-turn');
	scoreBoard.appendChild(player1Score);
	scoreBoard.appendChild(playerTurn);
	scoreBoard.appendChild(player2Score);

	const startNewGame = function(player1, player2) {
		player1Score.innerHTML = `${player1.getName()}:<br>${player2.getScore()}`;
		playerTurn.textContent = `${player1.getMyTurn() ? player1.getName() : player2.getName()} is first to play!`;
		player2Score.innerHTML = `${player2.getName()}:<br>${player2.getScore()}`;
		displayScreen();
	}
	const startNewRound = function(player1, player2) {
		playerTurn.textContent = `${player1.getMyTurn() ? player1.getName() : player2.getName()} is first to play!`;
		displayScreen();
	}
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
		if (line[0] === 'j' || line[0] === 'i')
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
		else if (line === 'anti')
		{
			const squares = [gameBoard.getElementsByClassName('i=0 j=2'), gameBoard.getElementsByClassName('i=1 j=1'), gameBoard.getElementsByClassName('i=2 j=0')];
			for (let i = 0; i < 3; i++)
				strike(squares[i][0], line);
		}
		const newGameBtn = document.createElement('button');
		newGameBtn.textContent = "New Game";
		newGameBtn.setAttribute('id', 'new-game-button');
		container.lastElementChild.lastElementChild.appendChild(newGameBtn);
		newGameBtn.addEventListener('click', newGame);
	}
	const newGame = function(e) {
		ticTacToe.startNewRound();
		container.lastElementChild.lastElementChild.removeChild(e.target);
	}
	const markSquare = function(e) {
		const nameAndSign = ticTacToe.checkTurn();
		GameBoard.mark(e.target.classList[0][2], e.target.classList[1][2], nameAndSign[1]);
		e.target.textContent = nameAndSign[1];
		let finish = GameBoard.checkWinner();
		if (!finish)
		{
			if (ticTacToe.getTurn() === 10)
			{	
				finishGame('draw');
				playerTurn.textContent = 'Draw!!!';
				stopMarking();
				return;
			}
			playerTurn.textContent = `It's ${nameAndSign[0]}'s turn!`;
			return;
		}
		finishGame(finish);
		updateScore();
		stopMarking();
	}
	const updateScore = function() {
		const players = ticTacToe.addScoreToWinner();
		player1Score.innerHTML = `${players[0].getName()}:<br>${players[0].getScore()}`;
		player2Score.innerHTML = `${players[1].getName()}:<br>${players[1].getScore()}`;
		playerTurn.textContent = `${players[0].getMyTurn() ? players[1].getName() : players[0].getName()} is the winner!!!`;
	}
	const restartGame = function(e) {
		ticTacToe.startNewGame();
		container.lastElementChild.lastElementChild.removeChild(container.lastElementChild.lastElementChild.firstElementChild);
	}
	restartButton.addEventListener('click', restartGame);
	return {startNewGame, startNewRound};
})();

const ticTacToe = (function() {
	let player1, player2, turn;
	const startNewGame = function() {
		turn = 1;
		const sign = pickSign();
		const name1 = prompt('Enter your name Player 1:');
		const name2 = prompt('Enter your name Player 2:');
		player1 = player(name1, sign);
		player2 = player(name2, !sign);
		displayController.startNewGame(player1, player2);
	}
	const startNewRound = function() {
		turn = 1;
		if (player1.getSign() === 'X')
		{
			player1.setSign(false);
			player1.setMyTurn(false);
			player2.setSign(true);
			player2.setMyTurn(true);
		}
		else
		{
			player1.setSign(true);
			player1.setMyTurn(true);
			player2.setSign(false);
			player2.setMyTurn(false);
		}
		displayController.startNewRound(player1, player2);
	}
	const checkTurn = function() {
		++turn;
		if (player1.getMyTurn())
		{
			player1.setMyTurn(false);
			player2.setMyTurn(true);
			return [player2.getName(), player1.getSign()];
		}
		else
		{
			player1.setMyTurn(true);
			player2.setMyTurn(false);
			return [player1.getName(), player2.getSign()];
		}
	}
	const addScoreToWinner = function() {
		if (player1.getMyTurn())
		{
			player2.addScore();
		}
		else
		{
			player1.addScore();
		}
		return [player1, player2];
	}
	const getTurn = function() {
		return turn;
	}
	const pickSign = function() {
		return Math.floor(Math.random() * 2);
	}
	const getPlayers = function() {
		return [player1, player2];
	}
	return {startNewGame, startNewRound, addScoreToWinner, checkTurn, getTurn, getPlayers};
})();

const player = function(name, turn) {
	let myName = name, sign = turn ? 'X' : 'O', myTurn = turn, score = 0;
	const getScore = function() {
		return score;
	}
	const addScore = function() {
		score++;
	}
	const setSign = function(s) {
		sign = s ? 'X' : 'O';
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
	const setName = function(name) {
		myName = name;
	}
	const getName = function() {
		return myName;
	}
	return {getScore, addScore, setName, getName, getSign, setSign, getMyTurn, setMyTurn};
};

const computer = (function() {

})();

ticTacToe.startNewGame();
