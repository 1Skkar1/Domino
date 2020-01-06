//----------------------- R E Q U E S T S ----------------------------------------

function register(nickx, passx){
	let jsonStr = JSON.stringify({ nick: nickx , pass: passx });
	fetch(serverURL+'register', { method:"POST" , body: jsonStr } ).
	then( (response) => { console.log(response); return response.json(); } ).
    then( data => {
		if (Object.keys(data).length == 0) return true;
		else return false;
	} ).then((result) => {
		if (result == false)
			window.alert("Invalid Login");
		else
			showGameSearch();
	});
}

function join(groupx, nickx, passx){
	start = false;
	let jsonStr = JSON.stringify( { group: groupx, nick: nickx , pass: passx });
	console.log(jsonStr);
    fetch(serverURL+'join', { method: "POST", body: jsonStr }).
    then( response => response.json()).
	then( (data) => {
		console.log(data);
		if(data.hasOwnProperty("game")){
			gameID = data.game;
		}
		if(data.hasOwnProperty("hand")){
			hand = data.hand;
		}
		update(gameID,nickx);
	})
	.catch( err => {alert(err.message + " - JOIN");location.reload(true);})
}

function leave(nickx, passx, gamex){
    let jsonStr = JSON.stringify( { nick: nickx, pass: passx, game: gamex});
	fetch(serverURL+'leave',{ method:"POST" , body: jsonStr } ).
	then( response => response.json() )
	.catch( err => {alert(err.message);location.reload(true);})
}

async function ranking(){
    console.log('reached ranking fetch');
	let jsonStr = JSON.stringify( {} );
	fetch(serverURL+'ranking',{ method:"POST" , body: jsonStr } ).
	then( response => response.json() ).
	then( data => {
		for(let i = 0; i < data.ranking.length; i++){
			lbNames[i] = data.ranking[i].nick;
			lbGames[i] = data.ranking[i].games;
			lbWins[i] = data.ranking[i].victories;
		}
		updateLeaderBoard(lbNames,lbGames,lbWins);
	})
	.catch( err => {alert(err.message + " - RANKING");location.reload(true)} );
}

async function notify(nickx, passx, gamex, sidex, piecex, skipx){
	let jsonStr;
	if(skipx == 1) //SKIP TURN
		jsonStr = JSON.stringify( { nick: nickx, pass: passx, game: gamex, skip: null });
	else if(piecex == 1) //DRAW PIECE
		jsonStr = JSON.stringify( { nick: nickx, pass: passx, game: gamex, piece: null });
	else  //PLAY
		jsonStr = JSON.stringify( { nick: nickx, pass: passx, game: gamex, side: sidex, piece: piecex });
	
	console.log(jsonStr);
	fetch(serverURL+'notify',{ method:"POST" , body: jsonStr } ).
	then( response => response.json() ).
	then( (data) => { console.log(data); })
	.catch(err => {alert(err.message + " - NOTIFY");location.reload(true)}); 
}

function update(gamex, nickx){
	eventSource = new EventSource(serverURL + "update?nick=" + nickx + "&game=" + gamex);

	eventSource.onmessage = function(event) {
		let data = JSON.parse(event.data);
		console.log(data);

		if(data.hasOwnProperty("error")){
			alert("Error: " + data.error);
		}
		
		if(data.hasOwnProperty("winner")){
			if(data.winner == null){
				eventSource.close();
				displayTie(true);
				return;
			}

			if(data.winner == nickx){
				eventSource.close();
				displayVictory(true);
				return;
			}

			if(data.winner != nickx){
				eventSource.close();
				displayDefeat(true);
				return;
			}	
		}

		if(data.hasOwnProperty("piece") && !data.hasOwnProperty("board")) {
			console.log("DREW TILE");
			console.log(data.piece);
			mainboard.drawOnline(data.piece);
		}

		if(data.length == 0) {
			console.log("SKIPPED TURN");
		}

		if(data.hasOwnProperty("board")){

			if(!start){
				start = true;
				initGame2();
			}

			if(data.board.line.length == 0){
				mainboard.deckCounter = data.board.stock;

				if(data.hasOwnProperty("turn") && data.turn == nickx){
					console.log(data.turn + "'s turn");
					showYourTurn();
					mainboard.currentTurn = 1;
					mainboard.p1Hand = data.board.count[data.turn];
					showClick();
				}

				else if(data.hasOwnProperty("turn") && data.turn != nickx){
					console.log(data.turn + "'s turn");
					showOpponentTurn();
					mainboard.currentTurn = 2;
					mainboard.p2Hand = data.board.count[data.turn];
					hideClick();
				}
			}

			else if(data.board.line.length != 0){
				mainboard.deckCounter = data.board.stock;

				if(data.hasOwnProperty("turn") && data.turn == nickx){
					mainboard.canOnlinePlay();
					console.log(data.turn + "'s turn");
					showYourTurn();
					mainboard.currentTurn = 1;
					mainboard.p1Hand = data.board.count[data.turn];
					console.log(data.board.piece);
					console.log(data.board.place);
					mainboard.moveToOnlineBoard(data.board.piece,data.board.place,2);
					showClick();
				}
				else if(data.hasOwnProperty("turn") && data.turn != nickx){
					console.log(data.turn + "'s turn");
					showOpponentTurn();
					mainboard.currentTurn = 2;
					mainboard.p2Hand = data.board.count[data.turn];
					console.log(data.board.piece);
					console.log(data.board.place);
					mainboard.moveToOnlineBoard(data.board.piece,data.board.place,1);
					hideClick();
				}
			}
		}
	}
}