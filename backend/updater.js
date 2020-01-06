const fs = require('fs');
const headers = require('./config.js').headers;

var games = [];
let stockTiles = [
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false]
];

module.exports.startConnection = function(id, nick, response) {
	for ( let i = 0 ; i < games.length ; i++) {
		if (games[i].game == id) {
			if (games[i].nick1 == nick && games[i].responses.response1 == null) {
				games[i].responses.response1 = response;
				response.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Access-Control-Allow-Origin': '*',
					'Connection': 'keep-alive'
				});
				return 0;
			}
			else if (games[i].nick2 == nick && games[i].responses.response2 == null) {
				games[i].responses.response2 = response;
				response.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Access-Control-Allow-Origin': '*',
					'Connection': 'keep-alive'
				});
				games[i].active = true;
				startGame(i);
				return 0;
			}
			break;
		}
	}
	return 1;
}

module.exports.pushGame = function(nick,id,group) {
	let timeout = setTimeout(
		function() {
			waitIsOver(id);
		},120000);
	games.push({"group": group,
				"nick1": null,
				"nick2": null,
				"game": id,
				"timeout": timeout,
				"responses": {"response1": null, "response2": null},
				"turn": null,
				"active": false,
				"board": null});
}

module.exports.joinGame = function(nick,group) {
	for (let i = 0 ; i < games.length ; i++) {
		if (games[i]["group"] == group && games[i]["active"] == false ) {
			if(games[i]["nick1"] == null) {
				console.log("> " + nick + " JOINED GAME");
				games[i]['nick1'] = nick;
				let gamex = {"line": [], "stock": 14, "count": {}, "piece": [], "place": null, "endLeft": null, "endRight": null, "hand": {}};
				gamex.hand[games[i]["nick1"]] = [];
				gamex.count[games[i]["nick1"]] = 7;
				games[i].board = gamex;
				givePlayerTiles(games[i].board.hand[games[i]["nick1"]]);
				return games[i]["game"];
			}
			else if(games[i]["nick2"] == null) {
				console.log("> " + nick + " JOINED GAME");
				games[i]['nick2'] = nick;
				games[i].board.count[games[i]["nick2"]] = 7;
				games[i].board.hand[games[i]["nick2"]] = [];
				givePlayerTiles(games[i].board.hand[games[i]["nick2"]]);
				return games[i]["game"];
			}
		}
	}
	return null;
}

module.exports.getHand = function(nick,id) {
	for (let i = 0 ; i < games.length ; i++) {
		if(games[i].nick1 == nick && games[i].game == id) {
			return games[i].board.hand[games[i]["nick1"]];
		}
		else if(games[i].nick2 == nick && games[i].game == id) {
			return games[i].board.hand[games[i]["nick2"]];
		}
	}
}

function startGame(selected) {
	console.log("GAME STARTING...");
	games[selected].active = true;
	findFirstPlayer(selected,games[selected].board["hand"][games[selected]["nick1"]],games[selected].board["hand"][games[selected]["nick2"]]);
	updateMessage(JSON.stringify({ turn: games[selected].turn, board: games[selected].board}), games[selected].responses.response1, games[selected].responses.response2);
	return;
}

function findFirstPlayer(selected,hand1,hand2) {
	let maxN1 = 0;
	let maxN2 = 0;

	for(let i = 0; i < hand1.length; i++) {
		if(hand1[i][0] + hand1[i][1] > maxN1) {
			maxN1 = hand1[i][0] + hand1[i][1];
		}
		if(hand2[i][0] + hand2[i][1] > maxN2) {
			maxN2 = hand2[i][0] + hand2[i][1];
		}
	}
	if(maxN1 >= maxN2) {
		games[selected].turn = games[selected].nick1;
	}
	else if(maxN2 > maxN1) {
		games[selected].turn = games[selected].nick2;
	}
	else {;}
	console.log("FIRST PLAYER: " + games[selected].turn);
}

function givePlayerTiles(hand){
	let randI = 0;
	let randJ = 0;
	let owned = 0;

	while(owned < 7) {
		randI = Math.floor(Math.random() * 7);
		randJ = Math.floor(Math.random() * 7);

		if(!stockTiles[randI][randJ] && !stockTiles[randJ][randI]) {
			stockTiles[randI][randJ] = true;
			stockTiles[randJ][randI] = true;
			if(randI >= randJ)
				hand.push([randI,randJ]);
			else
				hand.push([randJ,randI]);
			owned++;
		}
	}
}

module.exports.drawTile = function(id,nick) {
	// 1 -> Wrong Turn
	// 2 -> Game Issues
	// Array of Drawn Tile -> No Issues
	let randI = 0;
	let randJ = 0;
	let owned = 0;
	let tile;

	for (let i = 0; i < games.length ; i++ ) {
		if (games[i].game == id && games[i].active == true) {
			clearTimeout(games[i].timeout);

			if(games[i].turn != nick)
				return 1;

			else {
				while(owned < 1){
					randI = Math.floor(Math.random() * 7);
					randJ = Math.floor(Math.random() * 7);
			
					if(!stockTiles[randI][randJ] && !stockTiles[randJ][randI]) {
						stockTiles[randI][randJ] = true;
						stockTiles[randJ][randI] = true;
						owned++;
						games[i].board.stock--;
						games[i].board.count[nick]++;
						if(randI >= randJ)
							tile = [randI,randJ];
						else
							tile = [randJ,randI];	
						games[i].board.hand[nick].push(tile);
						updateMessage(JSON.stringify({piece: tile}),games[i].responses.response1,games[i].responses.response2);
						//games[i].responses.response1.end();
						//games[i].responses.response2.end();
						return 0;
					}
				}
			}
		}
	}
	return 2;
}

module.exports.changeTurn = function(id,nick) {
	// 0 -> No problems
	// 1 -> Wrong Turn
	// 2 -> Game Issues
	for (let i = 0; i < games.length ; i++ ) {
		if (games[i].game == id && games[i].active == true) {
			clearTimeout(games[i].timeout);

			if(games[i].turn != nick)
				return 1;

			else {
				if(games[i].turn == games[i].nick1) {
					games[i].turn = games[i].nick2;
				}
				else if(games[i].turn == games[i].nick2) {
					games[i].turn = games[i].nick1;
				}
				return 0;
			}
		}
	}
	return 2;
}

module.exports.play = function(id,nick,tile,side) {
	// 0 -> No problems
	// 1 -> Wrong Turn
	// 2 -> Invalid Tile
	// 3 -> Game Issues
	console.log('someone played');
	console.log(nick);
	console.log(tile);
	console.log(side);

	for (let i = 0; i < games.length ; i++ ) {
		if (games[i].game == id && games[i].active == true) {
			console.log(games[i].turn);
			clearTimeout(games[i].timeout);

			if(games[i].turn != nick)
				return 1;

			if(games[i].board.line.length != 0) {
				if(side == "start") {
					if(games[i].board.endLeft != tile[0] && games[i].board.endLeft != tile[1])
						return 2;
				}
				else if(side == "end") {
					if(games[i].board.endRight != tile[0] && games[i].board.endRight != tile[1])
						return 2;
				}
			}

			if(side == "start") { //place left
				if(games[i].board.line.length == 0) {
					games[i].board.endLeft = tile[1];
					games[i].board.endRight = tile[0];	
				}
				else {
					if(tile[0] == games[i].board.endLeft)
						games[i].board.endLeft = tile[1];
					else if(tile[1] == games[i].board.endLeft)
						games[i].board.endLeft = tile[0];	
				}
				games[i].board.count[nick]--;
				games[i].board.piece = tile;
				games[i].board.place = "start";
				games[i].board.line.unshift(tile);
			}
			else if(side == "end") { //place right
				games[i].board.count[nick]--;
				games[i].board.piece = tile;
				games[i].board.place = "end";
				games[i].board.line.push(tile);

				if(games[i].board.line.length == 0) {
					games[i].board.endLeft = tile[1];
					games[i].board.endRight = tile[0];	
				}
				else {
					if(tile[0] == games[i].board.endRight)
						games[i].board.endRight = tile[1];
					else if(tile[1] == games[i].board.endRight)
						games[i].board.endRight = tile[0];	
				}
			}
			console.log(games[i].board.line);
			console.log(games[i].board.piece);
			console.log(games[i].board.place);
			console.log("LEFT: "+games[i].board.endLeft);
			console.log("RIGHT: "+games[i].board.endRight);

			// 0 -> Game Not Over
			// 1 -> Nick Wins
			// 2 -> Tie
			// 3 -> Game Issues
			let win = checkEnd(games[i].board,nick);
		
			if (win == 0) {	
				console.log('No Winner Yet');
				if (games[i].turn == games[i].nick1)
					games[i].turn = games[i].nick2;
				else {
					games[i].turn = games[i].nick1;
				}
				let timeout = setTimeout(function() { waitIsOver(id); },120000);
				games[i].timeout = timeout;
				updateMessage(JSON.stringify({turn: games[i].turn, board: games[i].board}),games[i].responses.response1,games[i].responses.response2);
				//games[i].responses.response1.end();	
				//games[i].responses.response2.end();	
			}
			else if (win == 1) {
				console.log(nick + ' Won');
				updateMessage(JSON.stringify({winner: nick, board: games[i].board}),games[i].responses.response1,games[i].responses.response2);
				games[i].responses.response1.end();
				games[i].responses.response2.end();
				if (nick == games[i].nick1)
					updateRanking(nick, games[i].nick2);
				else
					updateRanking(nick, games[i].nick1);
				games.splice(i,1);
			}
			else {
				console.log('Tie');
				updateMessage(JSON.stringify({winner: null, board: games[i].board}),games[i].responses.response1,games[i].responses.response2);
				games[i].responses.response1.end();
				games[i].responses.response2.end();
				if (nick == games[i].nick1)
		 			updateRanking(nick, games[i].nick2);
				else
					updateRanking(nick, games[i].nick1);
				games.splice(i,1);	
			}
			return 0;
		}	
	}
	return 3;
}

function updateMessage(message,response1,response2 ) {
	if (response1 != null) {
		response1.write('data: '+message+"\n\n");
	}
	if (response2 != null) {
		response2.write('data: '+message+"\n\n");
	}
	return;
}

function waitIsOver(id) {
	console.log('entered on waitIsOver');
	for (let i = 0 ; i < games.length ; i++) {
		if (games[i].game == id) {
			if (games[i].nick2 == null)
				updateMessage(JSON.stringify({winner: null}),games[i].responses.response1,games[i].responses.response2);
			else if (games[i].turn == games[i].nick1)
				updateMessage(JSON.stringify({winner: games[i].nick2}), games[i].responses.response1,games[i].responses.response2);			
			else
				updateMessage(JSON.stringify({winner: games[i].nick1}), games[i].responses.response1,games[i].responses.response2);
	
			if (games[i].responses.response1 != null) {
				games[i].responses.response1.end();
			}
			if (games[i].responses.response2 != null) {
				games[i].responses.response2.end();
			}
			games.splice(i,1);
			break;
		}
	}
}

module.exports.leaveGame = function(id,nick) {
	// 0 -> No Problems
	// 1 -> Game Error
	let win;
	let lose;
	for (let i = 0 ; i < games.length ; i++) {
		if (games[i].game == id) {
			if (games[i].nick1 != nick && games[i].nick2 != nick)
				return 1;
			clearTimeout(games[i].timeout);

			if (games[i].nick2 == null) {
				win = null;
			}
			else {
				if (games[i].nick1 == nick) {
					lose = games[i].nick1;
					win = games[i].nick2;
				}
				else {
					lose = games[i].nick2;
					win = games[i].nick1;
				}
				updateRanking(win,lose);
			}
			updateMessage(JSON.stringify({winner: win}), games[i].responses.response1, games[i].responses.response2);
			if (games[i].responses.response1 != null)
				games[i].responses.response1.end();
			if (games[i].responses.response2 != null)	
				games[i].responses.response2.end();
			games.splice(i,1);
			return 0;
		}
	}
	return 1;
}

module.exports.nickAlreadyWaiting = function(group,nick) {
	for (let i = 0 ; i < games.length ; i++) {
		if (games[i].group == group && games[i].nick1 == nick && games[i].active == false)
			return true;
	}
	return false;
}

module.exports.groupAlreadyWaiting = function(group) {
	for (let i = 0; i < games.length ; i++) {
		if (games[i].group == group && games[i].active == false)
			return true;
	}
	return false;
}

function checkEnd(board,nick) {
	// 0 -> Game Not Over
	// 1 -> Nick Wins
	// 2 -> Tie
	// 3 -> Game Issues
	let playedVals = [0,0,0,0,0,0,0];
	console.log(nick);
	console.log(board.count[nick]);

	for(let i = 0; i < board.line.length; i++) {
		playedVals[board.line[i][0]]++;
		playedVals[board.line[i][1]]++;
	}
	if(board.endLeft == board.endRight && playedVals[board.endLeft] == 7)
		return 2;
	else if(board.count[nick] == 0)
		return 1;
	else if(board.count[nick] > 0)
		return 0;
	return 3;
}

function updateRanking(win,lose) {
	let file;
	try {
		file = fs.readFileSync("users.json");
		file = JSON.parse(file.toString())['users'];
	}
	catch (err) {
		return 1;
	}
	
	for (let i = 0 ; i < file.length ; i++) {
		if (file[i]['nick'] == win) {
			file[i]['games']++;
			file[i]['victories']++;
			file[i]['winrate'] = file[i]['games'] / file[i]['victories'];
		}

		else if (file[i]['nick'] == lose) {
			file[i]['games']++;
			if(file[i]['victories'] == 0)
				file[i]['winrate'] = 0;
			else
				file[i]['winrate'] = file[i]['games'] / file[i]['victories'];
		}
	}
	let final = {users: file};
	try {
		fs.writeFileSync("users.json",JSON.stringify(final));
	}
	catch(err) {
		return 2;
	}
	return 0;
}