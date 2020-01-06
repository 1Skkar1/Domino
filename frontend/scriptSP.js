//---------------------- S I N G L E P L A Y E R --------------------------------------------

function Board() {
	this.isOnline = false;
	this.gamelog = ["<b> &#9656 Game has started! <b />"];
	this.gameTiles = [];
	this.CPUmode = 1;
	this.currentTurn = 1;
	this.field = document.getElementById('gamefield');
	this.endLeft = null;
	this.endRight = null;
	this.leftPieces = 1;
	this.rightPieces = 1;
	this.playedVals = [0,0,0,0,0,0,0];
	this.deckCounter = 14;
	this.turnCounter = 1;
	this.p1Deck = document.getElementById('mytiles2');
	this.p2Deck = document.getElementById('theirtiles2');
	this.p1Score = 0;
	this.p2Score = 0;
	this.p1Hand = 0;
	this.p2Hand = 0;
	this.newDomDraw = null;

//---------------------- G A M E  B U T T O N S ---------------------------------------------

	//SKIP TURN
	this.skipButton = document.getElementById("skipbutton");
	this.skipButton.addEventListener("click", () => {
		if(this.deckCounter == 0){
			this.gamelog.push("Your opponent skipped his turn");
			//0 continues ; 1 P1 wins ; 2 P1 loses ; 3 tie
			let result = this.checkEnd();
			if (result == 0) {
				this.turnCounter++;
				this.gamelog.push("<b>&#9656 TURN<b /> " + this.turnCounter + ":");
				if (this.currentTurn == 1)
					this.currentTurn = 2;
				else
					this.currentTurn = 1;
			}
			if (this.currentTurn == 2){
				if(opponent == 1){
					this.playCPU1();
				}
				else if(opponent == 2){
					this.changeMode();
					this.playCPU2();
				}
				else if(opponent == 3){
					this.playCPU3();
				}
			}
		}
		else {
			window.alert("You may only skip your turn when the deck contains no tiles to be drawn!");
		}
	});
	//DRAW
	this.drawDeck = document.getElementById("deck");
	this.drawDeck.addEventListener("click", () => {
		for (let i = 0 ; i < this.gameTiles.length; i++) {
			if (this.gameTiles[i].owner == null) {
				this.gameTiles[i].owner = this.currentTurn;
				this.gameTiles[i].currentLocation = LocationEnum.HAND;
				createDOMPiece(this.gameTiles[i]);
				if (this.currentTurn == 1) {
					this.p1Hand++;
					this.p1Deck.appendChild(this.gameTiles[i].node);
					this.gamelog.push("You drew the tile: " + this.gameTiles[i].entity);
				}
				else {
					this.p2Hand++;
					this.p2Deck.appendChild(createDOMBackPiece());
					this.gamelog.push("Your opponent drew a tile");
				}
				this.newDomDraw = this.gameTiles[i];
				break;
			}	
		}
		let _this = this;
		let aux = this.newDomDraw;
		let auxNode = this.newDomDraw.node;
		auxNode.addEventListener('click', () => { _this.showPossiblePlays(aux) });

		console.log("P1:"+this.p1Hand);
		console.log("P2:"+this.p2Hand);
		this.deckCounter--;
		updateDeck(this.deckCounter);
		updateLog();
	});
	//SURRENDER
	this.surrenderButton = document.getElementById("surrenderbutton");
	this.surrenderButton.addEventListener("click", displaySurrender);
	//PLAY AGAIN - FROM WIN
	this.replayWButton = document.getElementById("replayWbutton"); 
	this.replayWButton.addEventListener("click", restartGame);
	//EXIT - FROM WIN
	this.quitWButton = document.getElementById("quitWbutton"); 
	this.quitWButton.addEventListener("click", displayQuit);
	//PLAY AGAIN - FROM LOSS
	this.replayLButton = document.getElementById("replayLbutton"); 
	this.replayLButton.addEventListener("click", restartGame);
	//QUIT - FROM LOSS
	this.quitLButton = document.getElementById("quitLbutton"); 
	this.quitLButton.addEventListener("click", displayQuit);
	
//--------------------- M E T H O D S --------------------------------------------------

//-> S I N G L E P L A Y E R 

	this.findMode = function(){
		nickx = document.getElementById("uname").value;
		document.getElementById("p1tag").innerHTML = "<h4><b>" + nickx + "<b /><h4 />";

		if(document.getElementById("cpu1").checked == true){
			cpuHandle = document.getElementById("cpu1").value;
			opponent = 1;
		}
		else if(document.getElementById("cpu2").checked == true){
			cpuHandle = document.getElementById("cpu2").value;
			opponent = 2;
		}
		else if(document.getElementById("cpu3").checked == true){
			cpuHandle = document.getElementById("cpu3").value;
			opponent = 3;
		}

		document.getElementById("p2tag").innerHTML = "<h3><b />" + cpuHandle + "<b /><h3 />";

		this.gamelog.push("<b>"+ nickx + " vs " + cpuHandle + "<b />");
	}

	this.searchFirstPlayer = function() {
		let maxPlayer = 1;
		let maxPieceVal = 0;
		let maxPiece = this.gameTiles[0];
		for (let i = 0 ; i < this.gameTiles.length ; i++) {
			if (this.gameTiles[i].owner != null) {
				if ( (this.gameTiles[i].top + this.gameTiles[i].bottom) > maxPieceVal ) {
					maxPlayer = this.gameTiles[i].owner;
					maxPieceVal = (this.gameTiles[i].top + this.gameTiles[i].bottom);
					maxPiece = this.gameTiles[i];
				}
			}
		}
		if(maxPlayer == 1)
			this.gamelog.push("<b> You have the highest tile! <b />");
		else
			this.gamelog.push("<b> Your opponent has the highest tile! <b />");

		//[0] -> player ; [1] -> piece Object
		return [maxPlayer,maxPiece];
	}

	this.firstToBoard = function(playernpiece) {
		//Define the first manual move
		if (playernpiece[0] == 1){
			this.currentTurn = 1;
			this.p1Hand--;
			this.p1Deck.removeChild(playernpiece[1].node);
		}
		else {
			this.currentTurn = 2;
			this.p2Hand--;
			this.p2Deck.removeChild(this.p2Deck.firstChild);
		}

		//Put the max piece on the board
		playernpiece[1].changeLocation(LocationEnum.BOARD);
		let piece = createDOMPiece(playernpiece[1]);

		this.endRight = playernpiece[1].top;
		this.endLeft = playernpiece[1].bottom;

		piece.classList.remove('opotiles');
		piece.classList.add('fieldpiece');
		this.field.appendChild(piece);
		this.gamelog.push("<b>&#9656 TURN 1:<b />");
		if(this.currentTurn == 1)
			this.gamelog.push("You played the tile " + playernpiece[1].entity);
		else
			this.gamelog.push("Your opponent played the tile " + playernpiece[1].entity);
		updateLog();
		this.changeTurn();
	}

	this.canPlay = function(player){
		for (let i = 0 ; i < this.gameTiles.length; i++) {
			if (this.gameTiles[i].owner == player && this.gameTiles[i].currentLocation == LocationEnum.HAND) {
				if (this.gameTiles[i].top == this.endLeft || this.gameTiles[i].bottom == this.endLeft || this.gameTiles[i].top == this.endRight || this.gameTiles[i].bottom == this.endRight) {
					return true;
				}	
			}
		}
		return false;
	}

	this.play = function() {
		let canPlay = this.canPlay(this.currentTurn);
		var _this = this;
		while (!canPlay) {
			console.log("Please draw!");
			document.getElementById("drawlabel").style.display = "block";
			canPlay = this.canPlay(this.currentTurn);
		}
		document.getElementById("drawlabel").style.display = "none";
		console.log("CAN USER PLAY? "+ canPlay);
		for ( let i = 0; i < this.gameTiles.length; i++) {
			if (this.gameTiles[i].owner != null) {
				if (this.gameTiles[i].owner == 1 && this.gameTiles[i].currentLocation == LocationEnum.HAND) {
					let aux = this.gameTiles[i];
					let auxNode = this.gameTiles[i].node;
					auxNode.addEventListener('click', () => { _this.showPossiblePlays(aux) });
				}	
			}
		}
	}

	this.showPossiblePlays = function(tile) {
		let _this = this;
		let lrwrapper = document.getElementById("lrbutton");
		let left = document.getElementById("Lbutton");
		let right = document.getElementById("Rbutton");
		
		left.style.display = 'none';
		right.style.display = 'none';
		lrwrapper.style.display = "none";

		removeAllOutline();
		tile.node.classList.add('outline');

		let playability = this.checkPlayability(tile);
		let chosenTile = [tile.top, tile.bottom];

		if(this.emptyBoard){ //EMPTY BOARD
			tile.currentLocation = LocationEnum.BOARD;
			notify(nickx,passx,mainboard.gameID,"start",chosenTile,undefined);
		}
		
		else {
			if (playability == 0) {
				window.alert('Não é possível jogar com esta peça!');
				removeAllOutline();
			}
			else if (playability == 1) {
				tile.currentLocation = LocationEnum.BOARD;
				this.moveToBoard(tile,1);
			}
			else if (playability == -1) {
				tile.currentLocation = LocationEnum.BOARD;
				this.moveToBoard(tile,2);
			}
			else if (playability == 2) {
				tile.currentLocation = LocationEnum.BOARD;
				lrwrapper.style.display = "inline";
				left.style.display = 'inline';
				left.addEventListener("click", () => { lrwrapper.style.display = 'none'; _this.moveToBoard(tile,1); });
				right.style.display = 'inline';
				right.addEventListener("click", () => { lrwrapper.style.display = 'none'; _this.moveToBoard(tile,2); });
			}
			else {;}
		}	
	}

	this.checkPlayability = function(piece) {
		//2 -> Both Sides ; 1 -> Left ; -1 -> Right ; 0 -> Invalid
        let option = 0;
        if (piece.top == this.endLeft || piece.bottom == this.endLeft) {
        	if (piece.top == this.endRight || piece.bottom == this.endRight) {
        		return 2;
        	}
        	else {
        		return 1;
        	}
        }
        else {
        	if (piece.top == this.endRight || piece.bottom == this.endRight) {
        		return -1;
        	}
        	else {
        		return 0;
        	}
        }
    }

	this.moveToBoard = function(piece, whereTo) {
		//Left -> 1 ; Right -> 2
		let xTransform = 0;
		let temp = null;

		if(this.currentTurn == 1)
			this.p1Hand--;
		else if(this.currentTurn == 2)
			this.p2Hand--;

		this.playedVals[piece.top]++;
		this.playedVals[piece.bottom]++;

		console.log("TOP: "+piece.top);
		console.log("BOT: "+piece.bottom);
		
		//PLAY LEFT
		if (whereTo == 1) {
			//TILE IS VERTICAL
			if (piece.top == piece.bottom) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(temp);
				}
				this.leftPieces++;
				this.endLeft = piece.top;
			
			} 
			//TILE IS HORIZONTAL - BOTTOM VALUE EQUALS LEFT - MIRROR
			else if (piece.bottom == this.endLeft) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					piece.node.innerHTML = mirrorTile[piece.node.innerHTML];
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					temp.innerHTML = mirrorTile[temp.innerHTML];
					this.field.appendChild(temp);
				}
				this.leftPieces++;
				this.endLeft = piece.top;
				
			} 
			//TILE IS HORIZONTAL - TOP VALUE EQUALS LEFT - NO MIRROR
			else if (piece.top == this.endLeft) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = -60 * this.leftPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(temp);
				}
				this.leftPieces++;
				this.endLeft = piece.bottom;
			}
			else {;}
		}
		//PLAY RIGHT
		else {
			//TILE IS VERTICAL
			if (piece.top == piece.bottom) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(temp);
				}
				this.rightPieces++;
				this.endRight = piece.top;

			} 
			//TILE IS HORIZONTAL - BOTTOM VALUE EQUALS RIGHT - NO MIRROR
			else if (piece.bottom == this.endRight) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					this.field.appendChild(temp);
				}
				this.rightPieces++;
				this.endRight = piece.top;
	
			} 
			//TILE IS HORIZONTAL - TOP VALUE EQUALS RIGHT - MIRROR
			else if (piece.top == this.endRight) {

				if (piece.owner == 1) {
					let aux = piece.node.parentNode.removeChild(piece.node);
					piece.node.classList.remove('opotiles');
					piece.node.classList.remove('outline');
					piece.node.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					piece.node.style.transform = "translateX(" + xTransform + "px)";
					piece.node.innerHTML = mirrorTile[piece.node.innerHTML];
					this.field.appendChild(piece.node);
				}
				else {
					this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
					temp = createDOMPiece(piece);
					temp.classList.remove('opotiles');
					temp.classList.add('fieldpiece');
					xTransform = 60 * this.rightPieces;
					temp.style.transform = "translateX(" + xTransform + "px)";
					temp.innerHTML = mirrorTile[temp.innerHTML];
					this.field.appendChild(temp);
				}
				this.rightPieces++;
				this.endRight = piece.bottom;
			}
			else {;}
		}
		if(this.currentTurn == 1)
			this.gamelog.push("You played the tile " + piece.entity);
		else
			this.gamelog.push("Your opponent played the tile " + piece.entity);

		if(this.leftPieces > 9 || this.rightPieces > 9){
			this.field.classList.add('shrink');
			this.field.style.top = "14%";
		}
		
		if(this.leftPieces > 12 || this.rightPieces > 12){
			this.field.classList.remove('shrink');
			this.field.classList.add('shrink2');
			this.field.style.top = "16%";
		}
		updateLog();
		this.changeTurn();
	}

	this.changeTurn = function() {
		//0 continues ; 1 P1 wins ; 2 P1 loses ; 3 tie
		let result = this.checkEnd();
		console.log("LEFT: "+this.endLeft);
		console.log("RIGHT: "+this.endRight);
		console.log("RESULT: "+result);
		if ( result == 0) {
			this.turnCounter++;
			this.gamelog.push("<b>&#9656 TURN<b /> " + this.turnCounter + ":");
			if (this.currentTurn == 1)
				this.currentTurn = 2;
			else
				this.currentTurn = 1;
		}
		if (this.currentTurn == 2){
			if(opponent == 1){
				this.playCPU1();
			}
			else if(opponent == 2){
				this.changeMode();
				this.playCPU2();
			}
			else if(opponent == 3){
				this.playCPU3();
			}
		}
		else if(this.currentTurn == 1){
			let canPlay = this.canPlay(this.currentTurn);
			while (!canPlay) {
				document.getElementById("drawlabel").style.display = "block";
				canPlay = this.canPlay(this.currentTurn);
				//let _this = this;
				//let aux = this.newDomDraw;
				//let auxNode = this.newDomDraw.node;
				//auxNode.addEventListener('click', () => { _this.showPossiblePlays(aux) });
			}	
			document.getElementById("drawlabel").style.display = "none";		
		}
	}

	this.draw = function() {
		for (let i = 0 ; i < this.gameTiles.length; i++) {
			if (this.gameTiles[i].owner == null) {
				this.gameTiles[i].owner = this.currentTurn;
				this.gameTiles[i].currentLocation = LocationEnum.HAND;
				createDOMPiece(this.gameTiles[i]);
				if (this.currentTurn == 1) {
					this.p1Hand++;
					this.p1Deck.appendChild(this.gameTiles[i].node);
					this.gamelog.push("You drew the tile: " + this.gameTiles[i].entity);
				}
				else {
					this.p2Hand++;
					this.p2Deck.appendChild(createDOMBackPiece());
					this.gamelog.push("Your opponent drew a tile");
				}
				this.newDomDraw = this.gameTiles[i];
				break;
			}	
		}
		console.log("P1:"+this.p1Hand);
		console.log("P2:"+this.p2Hand);
		if(this.p1Hand > 12){
			shrinkTiles(1);
			this.p1Deck.classList.add('shrink2');
		}
		if(this.p2Hand > 12){
			shrinkTiles(2);
			this.p2Deck.classList.add('shrink2');
		}

		this.deckCounter--;
		updateDeck(this.deckCounter);
		updateLog();
	}

	this.playCPU1 = function() {
		let canPlay = this.canPlay(this.currentTurn)
		//2 -> dois lados; 1 -> esquerda ; -1 -> direita
		if(this.deckCounter == 0 && !canPlay) {
			this.gamelog.push("Your opponent skipped his turn");
		}

		else {
			while (!canPlay) {
				this.draw();
				canPlay = this.canPlay(this.currentTurn);
			}
			for (let i = 0 ; i < this.gameTiles.length; i++) {
				if (this.gameTiles[i].owner == 2 && this.gameTiles[i].currentLocation == LocationEnum.HAND) {
					let result = this.checkPlayability(this.gameTiles[i]);
					if (result == 2 || result == 1 || result == -1) {
						this.gameTiles[i].currentLocation = LocationEnum.BOARD;
						if (result == 2)
							this.moveToBoard(this.gameTiles[i],1);
						else if (result == 1)
							this.moveToBoard(this.gameTiles[i],1);
						else
							this.moveToBoard(this.gameTiles[i],2);
						break;
					}
				}
			}
		}	
	}

	this.playCPU2 = function() {
		if(this.CPUmode == 1){
			this.playCPU1();
		}
		else if(this.CPUmode == 2){
			this.playCPU3();
		}
		else {;}
	}

	this.playCPU3 = function() {
		let canPlay = this.canPlay(this.currentTurn);
		//2 - dois lados; 1 - esquerda ; -1 - direita
		if(this.deckCounter == 0 && !canPlay) {
			this.gamelog.push("Your opponent skipped his turn");
		}

		else {
			while (!canPlay) {
				this.draw();
				canPlay = this.canPlay(this.currentTurn);
			}
			console.log("CAN CPU PLAY: "+canPlay);
			let maxInHand = 0;
			let maxTile;
			for (let i = 0 ; i < this.gameTiles.length; i++) {
				if (this.gameTiles[i].owner == 2 && this.gameTiles[i].currentLocation == LocationEnum.HAND) {
					let result = this.checkPlayability(this.gameTiles[i]);
					if (result == 2 || result == 1 || result == -1) {
						if((this.gameTiles[i].top + this.gameTiles[i].bottom) > maxInHand){
							maxInHand = this.gameTiles[i].top + this.gameTiles[i].bottom;
							maxTile = this.gameTiles[i];
						}
					}
				}
			}
			let result = this.checkPlayability(maxTile);
			if (result == 2 || result == 1 || result == -1) {
				maxTile.currentLocation = LocationEnum.BOARD;
				if (result == 2)
					this.moveToBoard(maxTile,1);
				else if (result == 1)
					this.moveToBoard(maxTile,1);
				else
					this.moveToBoard(maxTile,2);
			}
		}
	}

	this.changeMode = function(){
		if(this.CPUmode == 1)
			this.CPUmode = 2;
		else
			this.CPUmode = 1;	
	}

	this.checkEnd = function() {
		console.log("CHECKING...");
		//0 continues ; 1 P1 wins ; 2 P1 loses ; 3 tie

		console.log("P1 TILES: "+this.p1Hand);
		console.log("P2 TILES: "+this.p2Hand);
		if (this.p1Hand == 0){
			console.log("WIN");
			displayVictory(false);
		}

		else if (this.p2Hand == 0){
			console.log("LOSE");
			displayDefeat(false);
		}
		
		else{
			for( let i = 0; i < 7; i++){
				if(this.playedVals[i] == 7 && i == this.endLeft && i == this.endRight){
					console.log("TIE");
					displayTie(false);
				}
			}
		}
		return 0;
	}

	this.generateTiles = function() {
		let tile = null;
		let topValue = null;
		let bottomValue = null;
		Object.keys(tiles).forEach( (key) => {
			topValue = tiles[key][0];
			bottomValue = tiles[key][1];
    		tile = new Piece(key,topValue,bottomValue);
    		console.log('Generating:' + key + " | Values: " + tiles[key]);
    		this.gameTiles.push(tile);
		});
	}

	this.giveBothPlayersTiles = function() {
		this.giveTiles(1);
		this.giveTiles(2);
	}

	this.giveTiles = function(player) {
		let rand = 0;
		let owned = 0;
		while (owned < 7) {
			rand = Math.floor(Math.random() * 28);
			if (this.gameTiles[rand].owner == null) {
				this.gameTiles[rand].owner = player;
				this.gameTiles[rand].currentLocation = LocationEnum.HAND;
				owned++;
				if(player == 1)
					this.p1Hand++;
				else if(player == 2)
					this.p2Hand++;
			}
		}
	}

	this.displayBoard = function() {
		this.field.style.display = "block";
		let lboard = document.getElementById("leaderboard");
		lboard.style.display = "none";
		let wrapper = document.getElementById("mytiles");
		wrapper.style.display = "block";
		let wrapper2 = document.getElementById("theirtiles");
		wrapper2.style.display = "block";
		let diffmenu = document.getElementById("configmenu");
		diffmenu.style.display = "none";
		let tag1 = document.getElementById("p1tag");
		tag1.style.display = "block";
		let tag2 = document.getElementById("p2tag");
		tag2.style.display = "block";
		let com = document.getElementById("commands");
		com.style.display = "block";
		let log = document.getElementById("gamelog");
		log.style.display = "block";
		let deck = document.getElementById("deck");
		deck.style.display = "block";
		let decknumber = document.getElementById("decknumber");
		decknumber.style.display = "block";
		let sm = document.getElementById("singlemulti");
		sm.style.display = "none";

		this.displayDecks();
		updateDeck(this.deckCounter);
		updateLog();
	}

	this.displayDecks = function() {
		let mydeck = document.getElementById("mytiles");
    	let theirdeck = document.getElementById("theirtiles");
    	let myinnerdeck = document.getElementById("mytiles2");
		let theirinnerdeck = document.getElementById("theirtiles2");
		
		this.gamelog.push("<b>&#9656 Your opponent drew 7 tiles<b />");
		this.gamelog.push("<b>&#9656 You drew: <b />");
    	
    	for (let i = 0 ; i < this.gameTiles.length ; i++) {
    		if (this.gameTiles[i].owner != null) {
    			if ( (this.gameTiles[i].owner == 1) && (this.gameTiles[i].currentLocation == LocationEnum.HAND) ) {
    				let piece = createDOMPiece(this.gameTiles[i]);
					myinnerdeck.appendChild(piece);
					this.gamelog.push(this.gameTiles[i].entity);
    			}
    			else if ( (this.gameTiles[i].owner == 2) && (this.gameTiles[i].currentLocation == LocationEnum.HAND)) {
    				let bpiece = createDOMBackPiece();
					theirinnerdeck.appendChild(bpiece);
    			}
    			else {;}
    		}
		}

    	mydeck.style.display = 'block';
    	theirdeck.style.display = 'block';
    	myinnerdeck.style.display = 'block';
    	theirinnerdeck.style.display = 'block';
	}
}