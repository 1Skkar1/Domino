//---------------------- M U L T I P L A Y E R --------------------------------------------

function BoardOnline(isOnline, hand, gameID) {
	this.isOnline = isOnline;
	this.myHand = hand;
	this.gameID = gameID;
	this.gamelog = ["<b> &#9656 Game has started! <b />"];
	this.field = document.getElementById('gamefield');
	this.p1Deck = document.getElementById('mytiles2');
	this.p2Deck = document.getElementById('theirtiles2');
	this.p1Hand = 7;
	this.p2Hand = 7;
	this.gameTiles = [];
	this.endLeft = 0;
	this.endRight = 0;
	this.deckCounter = 14;
	this.turnCounter = 1;
	this.leftPieces = 1;
	this.rightPieces = 1;
	this.emptyBoard = true;

//---------------------- G A M E  B U T T O N S ---------------------------------------------

	//SKIP TURN
	this.skipButton = document.getElementById("skipbutton");
	this.skipButton.addEventListener("click", () => {
		if(this.deckCounter == 0){
				notify(nickx,passx,this.gameID,undefined,undefined,1);
		}
		else {
			window.alert("You may only skip your turn when the deck contains no tiles to be drawn!");
		}
	});
	//DRAW
	this.drawDeck = document.getElementById("deck");
	this.drawDeck.addEventListener("click", () => {
		if(this.deckCounter > 0){
			notify(nickx,passx,mainboard.gameID,undefined,1,undefined);
		}
		else {
			window.alert("The deck does not contain any tiles. Please skip your turn instead!");
		}
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

//-> M U L T I P L A Y E R

	this.generateOnlineTiles = function() {
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

	this.displayOnlineBoard = function() {
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
		let find = document.getElementById("lookingforgame");
		find.style.display = "none"
		let box = document.getElementById("loadingboxes");
		box.style.display = "none";

		this.displayOnlineDecks();
		updateDeck(this.deckCounter);
		updateLog();
	}

	this.displayOnlineDecks = function() {
		let mydeck = document.getElementById("mytiles");
    	let theirdeck = document.getElementById("theirtiles");
    	let myinnerdeck = document.getElementById("mytiles2");
		let theirinnerdeck = document.getElementById("theirtiles2");
		
		this.gamelog.push("<b>&#9656 Your opponent drew 7 tiles<b />");
		this.gamelog.push("<b>&#9656 You drew: <b />");

		for(let i = 0; i < this.gameTiles.length; i++){
			for(let a = 0; a < hand.length; a++){
				if(this.gameTiles[i].top == hand[a][0] && this.gameTiles[i].bottom == hand[a][1]){
					this.gameTiles[i].owner = 1;
					this.gameTiles[i].currentLocation = LocationEnum.HAND;
					let piece = createDOMPiece(this.gameTiles[i]);
					myinnerdeck.appendChild(piece);
					let bpiece = createDOMBackPiece();
					theirinnerdeck.appendChild(bpiece);
					this.gamelog.push(this.gameTiles[i].entity);
				}
			}
		}
    	mydeck.style.display = 'block';
    	theirdeck.style.display = 'block';
    	myinnerdeck.style.display = 'block';
    	theirinnerdeck.style.display = 'block';
	}

	this.firstToOnlineBoard = function(playernpiece) {
		//Define the first manual move
		if (playernpiece[0] == 1){
			this.p1Deck.removeChild(playernpiece[1].node);
		}
		else {
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
		this.emptyBoard = false;
		updateLog();
	}
	
	this.checkOnlinePlayability = function(piece) {
		//2 -> Both Sides ; 1 -> Left ; -1 -> Right ; 0 -> Invalid
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
    
    this.showPossibleOnlinePlays = function(tile) {
		let _this = this;
		let lrwrapper = document.getElementById("lrbutton");
		let left = document.getElementById("Lbutton");
		let right = document.getElementById("Rbutton");
		
		left.style.display = 'none';
		right.style.display = 'none';
		lrwrapper.style.display = "none";

		removeAllOutline();
		tile.node.classList.add('outline');

		let playability = this.checkOnlinePlayability(tile);
		let chosenTile = [tile.top, tile.bottom];

		if(this.emptyBoard){ //EMPTY BOARD
			tile.currentLocation = LocationEnum.BOARD;
			notify(nickx,passx,mainboard.gameID,"start",chosenTile,undefined);
		}
		
		else {
			console.log(tile);
			console.log(chosenTile);
			if (playability == 0) {
				window.alert('Não é possível jogar com esta peça!');
				removeAllOutline();
			}
			else if (playability == 1) { //LEFT
				tile.currentLocation = LocationEnum.BOARD;
				notify(nickx,passx,mainboard.gameID,"start",chosenTile,undefined);
			}
			else if (playability == -1) { //RIGHT
				tile.currentLocation = LocationEnum.BOARD;
				notify(nickx,passx,mainboard.gameID,"end",chosenTile,undefined);
			}
			else if (playability == 2) {
				tile.currentLocation = LocationEnum.BOARD;
				lrwrapper.style.display = "inline";
				left.style.display = 'inline';
				left.addEventListener("click", () => { lrwrapper.style.display = 'none'; notify(nickx,passx,mainboard.gameID,"start",chosenTile,undefined); });
				right.style.display = 'inline';
				right.addEventListener("click", () => { lrwrapper.style.display = 'none'; notify(nickx,passx,mainboard.gameID,"end",chosenTile,undefined); });
			}
			else {;}
		}
	}	

	this.drawOnline = function(piece) {
		console.log("Pepega");
		console.log(piece[0] + " , " + piece[1]);
		console.log(this.gameTiles);
		for(let i = 0; i < this.gameTiles.length; i++){
			if(this.gameTiles[i].top == piece[0] && this.gameTiles[i].bottom == piece[1]){
				this.gameTiles[i].owner = 1;
				this.gameTiles[i].currentLocation = LocationEnum.HAND;
				let piece = createDOMPiece(this.gameTiles[i]);
				this.p1Deck.appendChild(piece);
				let _this = this;
				let aux = this.gameTiles[i];
				let auxNode = this.gameTiles[i].node;
				auxNode.addEventListener('click', () => { _this.showPossibleOnlinePlays(aux) });
			}
		}
		this.deckCounter--;
		updateDeck(this.deckCounter);
		updateLog();
	}

	this.canOnlinePlay = async function() {
		console.log("CHECKING IF I CAN PLAY...");
		let canPlay = this.canPlay(1);
		var _this = this;
		while(!canPlay) {
			document.getElementById("drawlabel").style.display = "block";
			canPlay = this.canPlay(1);
		}
		document.getElementById("drawlabel").style.display = "none";
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

	this.playOnline = function() {
		for ( let i = 0; i < this.gameTiles.length; i++) {
			if (this.gameTiles[i].owner != null) {
				if (this.gameTiles[i].owner == 1 && this.gameTiles[i].currentLocation == LocationEnum.HAND) {
					let _this = this;
					let aux = this.gameTiles[i];
					let auxNode = this.gameTiles[i].node;
					auxNode.addEventListener('click', () => { _this.showPossibleOnlinePlays(aux) });
				}	
			}
		}
	}

	this.moveToOnlineBoard = function(piece, whereTo, turn) {
		//Left -> "start" ; Right -> "end"
		let xTransform = 0;
		let temp = null;
		let chosenTile;

		for(let i = 0; i < this.gameTiles.length; i++){
			if(this.gameTiles[i].top == piece[0] && this.gameTiles[i].bottom == piece[1]){
				chosenTile = this.gameTiles[i];
				this.gameTiles[i].currentLocation = LocationEnum.BOARD;
				console.log("TOP: "+chosenTile.top);
				console.log("BOT: "+chosenTile.bottom);
				console.log(whereTo);
			}
		}

		if(this.emptyBoard){
			this.firstToOnlineBoard([turn,chosenTile]);	
		}

		else {
			//PLAY LEFT
			if (whereTo == "start") {
				//TILE IS VERTICAL
				if (chosenTile.top == chosenTile.bottom) {

					if (turn == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(temp);
					}
					this.leftPieces++;
					this.endLeft = chosenTile.top;
				} 

				//TILE IS HORIZONTAL - BOTTOM VALUE EQUALS LEFT - MIRROR
				else if (chosenTile.top == this.endLeft) {

					if (turn == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(temp);
					}
					this.leftPieces++;
					this.endLeft = chosenTile.bottom;
				} 

				//TILE IS HORIZONTAL - TOP VALUE EQUALS LEFT - NO MIRROR
				else if (chosenTile.bottom == this.endLeft) {

					if (turn == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						chosenTile.node.innerHTML = mirrorTile[chosenTile.node.innerHTML];
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = -60 * this.leftPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						temp.innerHTML = mirrorTile[temp.innerHTML];
						this.field.appendChild(temp);
					}
					this.leftPieces++;
					this.endLeft = chosenTile.top;
				}
				else {;}
			}

			//PLAY RIGHT
			else {
				//TILE IS VERTICAL
				if (chosenTile.top == chosenTile.bottom) {

					if (turn == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(temp);
					}
					this.rightPieces++;
					this.endRight = chosenTile.top;
				}

				//TILE IS HORIZONTAL - BOTTOM VALUE EQUALS RIGHT - NO MIRROR
				else if (chosenTile.top == this.endRight) {

					if (turn == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						chosenTile.node.innerHTML = mirrorTile[chosenTile.node.innerHTML];
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						temp.innerHTML = mirrorTile[temp.innerHTML];
						this.field.appendChild(temp);
					}
					this.rightPieces++;
					this.endRight = chosenTile.bottom;
				}

				//TILE IS HORIZONTAL - TOP VALUE EQUALS RIGHT - MIRROR
				else if (chosenTile.bottom == this.endRight) {

					if (chosenTile.owner == 1) {
						let aux = chosenTile.node.parentNode.removeChild(chosenTile.node);
						chosenTile.node.classList.remove('opotiles');
						chosenTile.node.classList.remove('outline');
						chosenTile.node.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						chosenTile.node.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(chosenTile.node);
					}
					else {
						this.p2Deck.removeChild(this.p2Deck.childNodes[0]);
						temp = createDOMPiece(chosenTile);
						temp.classList.remove('opotiles');
						temp.classList.add('fieldpiece');
						xTransform = 60 * this.rightPieces;
						temp.style.transform = "translateX(" + xTransform + "px)";
						this.field.appendChild(temp);
					}
					this.rightPieces++;
					this.endRight = chosenTile.top;
				}
				else {;}
			}
		}
		console.log("LEFT: "+this.endLeft);
		console.log("RIGHT: "+this.endRight);

		this.gamelog.push("<b>&#9656 TURN<b /> " + mainboard.turnCounter + ":");
		this.turnCounter++;
		if(turn == 1)
			this.gamelog.push("You played the tile " + chosenTile.entity);
		else
			this.gamelog.push("Your opponent played the tile " + chosenTile.entity);

		if(this.leftPieces > 8 || this.rightPieces > 8){
			this.field.classList.add('shrink');
			this.field.style.top = "14%";
		}
		
		if(this.leftPieces > 12 || this.rightPieces > 12){
			this.field.classList.remove('shrink');
			this.field.classList.add('shrink2');
			this.field.style.top = "16%";
		}
		updateLog();
	}
}