const url = require("url");
const fs = require("fs");
const crypto = require('crypto');
const headers = require('./config.js').headers;
const updater = require('./updater.js');

module.exports.doGet = function(request, response) {
	let body = '';
	let parsedURL = url.parse(request.url,true);
	let pathname = parsedURL.pathname;
	let query = parsedURL.query;

	request.on('data', chunk => { body += chunk; });

	request.on('end', function() {
		switch(pathname) {
			case "/update":
				if (query['game'] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Null Game"}));
					response.end();
					break;
				}
				if (query['nick'] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Null nick"}));
					response.end();
					break;
				}
				let auth = updater.startConnection(query['game'],query['nick'],response);

				if (auth == 1) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid game"}));
					response.end();
				}
				break;
			default:
				response.writeHead(404, headers['plain']);
				response.end();
				break;
		}
	})
}

module.exports.doPost = function(request, response) {
	let body = '';
	let parsedURL = url.parse(request.url, true);
	let pathname = parsedURL.pathname;

	request.on('data', chunk => { body += chunk; } );

	request.on('end', function() {
		let query = '';
		let authResult = null;

		try {
			query = JSON.parse(body);
		}
		catch(err) {
			console.log(err);
			response.writeHead(400,headers["plain"]);
			response.write(JSON.stringify( { error: "JSON error (" + err + ")"} ));
			response.end();
			return;
		}

		switch(pathname) {
			case "/register":
				if (query['nick'] == null || query['pass'] == null) {
					response.writeHead(400,headers["plain"]);
					response.write(JSON.stringify( { error: "Username or Password is empty"} ));
					response.end();
				}

				authResult = checkUserPass(query['nick'],query['pass']);
				if (authResult == 0) {
					response.writeHead(500, headers["plain"]);
					response.end();
				}
				else if (authResult == 1) {
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}
				else {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Incorrect Password"}));
					response.end();
				}
				break;
			
			case "/join":
				if (query['group'] == null || !(Number.isInteger(parseInt(query['group']))) ) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid Group"}));
					response.end();
					break;
				}
				if (query['nick'] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "null Nick"}));
					response.end();
					break;
				}
				if (query['pass'] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "null Pass"}));
					response.end();
					break;
				}

				authResult = checkUserPass(query['nick'],query['pass']);
				if(authResult!=1) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({"error": "Password error"}));
					response.end();
				}
		    	if (updater.nickAlreadyWaiting(query['group'],query['nick']) == true ) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({"error": "You cannot play against yourself!"}));
					response.end();
					break;
		    	}
		    	else if (updater.groupAlreadyWaiting(query["group"]) == true) {
                    let id = updater.joinGame(query["nick"], query["group"]);
                    let hand = updater.getHand(query["nick"],id);
		    		if(id != null) {
						response.writeHead(200, headers["plain"]);
						response.write(JSON.stringify({"game": id, "hand": hand}));
						response.end();
					}
					else {
						console.log("JOINED NEW GAME");
						let date = new Date();
						date = date.getTime();
						let idx = crypto.createHash('md5').update(date.toString()).digest('hex');
						updater.pushGame(query["nick"],idx, query["group"]);
						response.writeHead(200, headers["plain"]);
						response.write(JSON.stringify({"game": idx}));
						response.end();
					}
		    	}
		    	else {
		    		let date = new Date();
					date = date.getTime();
					console.log("GAME CREATED");
					let idx = crypto.createHash('md5').update(date.toString()).digest('hex');
                    updater.pushGame(query["nick"],idx,query["group"]);
                    
                    let id = updater.joinGame(query["nick"], query["group"]);
                    let hand = updater.getHand(query["nick"],idx);
                
					let jsonx = JSON.stringify( {"game": id, "hand": hand});
					response.writeHead(200, headers["plain"]);
					response.write(jsonx);
					response.end();
		    	}
		    	break;

		    case '/notify':
				if (query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "null Nick"}));
					response.end();
					break;
				}
				if (query["pass"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "null Pass"}));
					response.end();
					break;
				}
		    	if (query["game"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "null Game"}));
					response.end();
					break;
				}

				authResult = checkUserPass(query['nick'],query['pass']);
				if (authResult == 0) {
					response.writeHead(500, headers["plain"]);
					response.end();
				}
				else if (authResult == 1) {
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}
				else {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Password incorrect"}));
					response.end();
				}

				if(query.hasOwnProperty("piece") && query["piece"] == null) {
					console.log('time to draw');
					// 1 -> Wrong Turn
					// 2 -> Game Issues
					// Array of Drawn Tile -> No Issues
					let action = updater.drawTile(query['game'],query['nick']);
					console.log(action);

					if(action == 0){
						//response.writeHead(200, headers["plain"]);
						//response.write(JSON.stringify({}));
						//response.end();
					}
					else if(action == 1){
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Invalid turn"}));
						response.end();
					}
					else{
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Game not found"}));
						response.end();
					}
				}

				else if(query.hasOwnProperty("skip")) {
					console.log('time to skip');
					// 0 -> No problems
					// 1 -> Wrong Turn
					// 2 -> Game Issues
					let action = updater.changeTurn(query['game'],query['nick']);
					console.log(action);

					if(action == 0){
						//response.writeHead(200, headers["plain"]);
						//response.write(JSON.stringify({}));
						//response.end();
					}
					else if(action == 1){
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Invalid turn"}));
						response.end();
					}
					else{
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Game not found"}));
						response.end();
					}
				}

				else if(query.hasOwnProperty("piece") && query["piece"] != null) {
					console.log('time to play');
					// 0 -> No problems
					// 1 -> Wrong Turn
					// 2 -> Invalid Tile
					// 3 -> Game Issues
					let action = updater.play(query['game'],query['nick'],query['piece'],query['side']);
					
					if(action == 0){
						//response.writeHead(200, headers["plain"]);
						//response.write(JSON.stringify({}));
						//response.end();
					}
					else if(action == 1){
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Invalid turn"}));
						response.end();
					}
					else if(action == 2){
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Invalid tile"}));
						response.end();
					}
					else{
						response.writeHead(400, headers["plain"]);
						response.write(JSON.stringify({error: "Game not found"}));
						response.end();
					}
				}			
                break;
            
            case '/leave':
                if(query["nick"]==null) {
                    response.writeHead(400, headers["plain"]);
                    response.write(JSON.stringify({error: "null Nick"}));
                    response.end();
                    break;
                }
                if(query["pass"]==null){
                    response.writeHead(400, headers["plain"]);
                    response.write(JSON.stringify({error: "null Pass"}));
                    response.end();
                    break;
                }
                if(query["game"]==null){
                    response.writeHead(400, headers["plain"]);
                    response.write(JSON.stringify({error: "null Game"}));
                    response.end();
                    break;
                }
    
                authResult = checkUserPass(query['nick'],query['pass']);
                if (authResult == 0) {
                    response.writeHead(500, headers["plain"]);
                    response.end();
                }
                else if (authResult == 1) {
                    response.writeHead(200, headers["plain"]);
                    response.write(JSON.stringify({}));
                    response.end();
                }
                else {
                    response.writeHead(400, headers["plain"]);
                    response.write(JSON.stringify({error: "Incorrect Password"}));
                    response.end();
                }
    
                let leaver = updater.leaveGame(query['game'], query['nick']);
                if(leaver == 1){
                    response.writeHead(400, headers["plain"]);
                    response.write(JSON.stringify({error: "Invalid Game"}));
                    response.end();
                }
                else{
                    //response.writeHead(200, headers["plain"]);
                    //response.write(JSON.stringify({}));
                    //response.end();
                }
                break;
            
            case "/ranking":
                let file;
                try {
					file = fs.readFileSync("users.json");
					file = JSON.parse(file.toString())['users'];
				}
				catch (err) {
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}
				let rankings = [];
				for (let i = 0; i < file.length; i++) {    
				    rankings.push({ "nick": file[i]['nick'], "games": file[i]['games'], "victories": file[i]['victories'], "winrate": file[i]['winrate']});	
                }
                rankings = rankings.sort(sortByProperty('winrate'));
                rankings = rankings.slice(0,10);
                console.log(rankings);

				let jsonx;
				if (rankings.length > 0)
					jsonx = { ranking: rankings };
				else
					jsonx = {};
				response.writeHead(200, headers['plain']);
				response.write(JSON.stringify(jsonx));
				response.end();
				break;

		    default:
		    	response.writeHead(404, headers['plain']);
		    	response.end();
		    	break;   	
		}
	});
	request.on("error", function(err){
		response.writeHead(400, headers["plain"]);
		response.end();
	});
}

function sortByProperty(property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? -1 : 1));
    };
};

function checkUserPass(nick, pass) {
	let file = undefined;

	if (nick == "" || pass == "")
		return 0;
		
	pass = crypto.createHash('md5').update(pass).digest('hex');

	try {
		file = fs.readFileSync("users.json");
		file = JSON.parse(file.toString())['users']; 
	}
	catch (err) {
		return 0;
	}

	let found = false;
	let i = 0;
	for ( i = 0 ; i < file.length ; i++ ) {
		if (file[i]['nick'] == nick) {
			found = true;
			break;
		}
	}
	
	if (found == true) {
		if (file[i]['pass'] == pass)
			return 1;
		else
			return 2;
	}
	else {
		let jsonx = { "nick": nick , "pass": pass, "games": 0, "victories": 0, "winrate": 0};
		file.push( jsonx );
		file = {"users": file};
		try {
			fs.writeFileSync("users.json", JSON.stringify(file));
			return 1;
		}
		catch(err) {
			return 0;
		}
	}
}