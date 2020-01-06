//---------------------- M A I N --------------------------------------------
var mainboard = null;

var start = false;
const serverURL = "http://localhost:8119/";
const groupx = 19;
var nickx;
var passx;
var gameID;
var hand;

var cpuHandle;
var opponent;

let lbNames = Array(10).fill("&lt;empty&gt;");
let lbGames = Array(10).fill(0);
let lbWins = Array(10).fill(0);

const tileToHori = {
	"🁪":"🀲", "🁱":"🀳", "🁸":"🀴", "🁿":"🀵", "🂆":"🀶", "🂍":"🀷",
	"🁲":"🀺", "🁹":"🀻", "🂀":"🀼", "🂇":"🀽", "🂎":"🀾",
	"🁺":"🁂", "🂁":"🁃", "🂈":"🁄", "🂏":"🁅",
	"🂂":"🁊", "🂉":"🁋", "🂐":"🁌",
	"🂊":"🁒", "🂑":"🁓",
	"🂒":"🁚"
};

//top -> right
//bot -> left

const mirrorTile = {
	"🀲":"🀸", "🀳":"🀿", "🀴":"🁆", "🀵":"🁍", "🀶":"🁔", "🀷":"🁛",
	"🀺":"🁀", "🀻":"🁇", "🀼":"🁎", "🀽":"🁕", "🀾":"🁜",
	"🁂":"🁈", "🁃":"🁏", "🁄":"🁖", "🁅":"🁝",
	"🁊":"🁐", "🁋":"🁗", "🁌":"🁞",
	"🁒":"🁘", "🁓":"🁟",
	"🁚":"🁠"
};

const tiles = {
    "🁣":[0,0], "🁪":[1,0], "🁱":[2,0], "🁸":[3,0], "🁿":[4,0], "🂆":[5,0], "🂍":[6,0],
    "🁫":[1,1], "🁲":[2,1], "🁹":[3,1], "🂀":[4,1], "🂇":[5,1], "🂎":[6,1],
    "🁳":[2,2], "🁺":[3,2], "🂁":[4,2], "🂈":[5,2], "🂏":[6,2],
    "🁻":[3,3], "🂂":[4,3], "🂉":[5,3], "🂐":[6,3],
    "🂃":[4,4], "🂊":[5,4], "🂑":[6,4],
    "🂋":[5,5], "🂒":[6,5],
    "🂓":[6,6]
};


const OrientationEnum = {"HORIZONTAL":1, "VERTICAL":2}
Object.freeze(OrientationEnum)

const LocationEnum = {"HAND":1, "BOARD":2}
Object.freeze(LocationEnum)

const PositionEnum = {"LEFT":1, "RIGHT":2,"CENTER":3}
Object.freeze(PositionEnum)

//document.oncontextmenu = () => {return false;};

//------------------------ G E N E R A L  B U T T O N S ---------------------------------

//LEADERBOARD
let leaderboard = document.getElementById("leaderboardButton");
leaderboard.addEventListener("click", toggleLeaderBoard);
//RULES
let rulesbutton = document.getElementById("rulesbutton");
rulesbutton.addEventListener("click", toggleRules);
//LOGIN
let loginbutton = document.getElementById("loginbutton");
loginbutton.addEventListener("click", hideLogin);
//SINGLEPLAYER
let singlebutton = document.getElementById("singlebutton");
singlebutton.addEventListener("click", showDifficulty);
//MULTIPLAYER
let multibutton = document.getElementById("multibutton");
multibutton.addEventListener("click", getLogin);
//LOGOUT
let logoutbutton = document.getElementById("logoutbutton");
logoutbutton.addEventListener("click", displayQuit);
//START VS CPU
let gamestart = document.getElementById("gamestart");
gamestart.addEventListener("click", initGame);

//----------------- D O M I N O -------------------------------------

function Piece(entityCode,topValue,bottomValue) {
	this.entity = entityCode;
	this.node = undefined;
	this.owner = null;
	this.orientation = undefined; // true -- ; false |
	this.currentLocation = undefined; // 0 -- Ma
	this.top = topValue;
	this.bottom = bottomValue;

	this.changeLocation = function(newLocation) {
		this.currentLocation = newLocation;
	}
}

function createDOMPiece(piece) {
    let pNode = document.createElement('h1');
    
    pNode.id = piece.entity;
    pNode.classList.add('opotiles');
    if (piece.top != piece.bottom) {
        pNode.innerHTML = tileToHori[piece.entity];
        piece.orientation = OrientationEnum.HORIZONTAL;
    } 
    else {
        pNode.innerHTML = piece.entity;
        piece.orientation = OrientationEnum.VERTICAL;
    }
    piece.node = pNode;

    return piece.node;
}	

function createDOMBackPiece() {
    const backPiece = "&#127074";
    let pNode = document.createElement('h1');
    
    //pNode.id = backPiece;
    pNode.innerHTML = backPiece;

    pNode.classList.add('opotiles');
    return pNode;
}

//------------------ M A I N ----------------------------------------

async function getLogin(){
	opponent = 4;
	nickx = document.getElementById("uname").value;
	passx = document.getElementById("passwd").value;

	register(nickx,passx);
}

function showGameSearch(){
	hideLogin();
	let x = document.getElementById("singlemulti");
	x.style.display = "none";
	let y = document.getElementById("lookingforgame");
	y.style.display = "block";
	let box = document.getElementById("loadingboxes");
	box.style.display = "block";

	join(groupx,nickx,passx);
}

function initGame(){ //SINGLEPLAYER
	hideLogin();
	hideLB();
	hideBG();
	mainboard = new Board();
	cleanBoard();
	mainboard.findMode();
	mainboard.generateTiles();
	mainboard.giveBothPlayersTiles();
	mainboard.displayBoard();
	mainboard.firstToBoard(mainboard.searchFirstPlayer());
	mainboard.play();
	if (mainboard.currentTurn == 2) {
		if(mainboard.opponent == 1)
			mainboard.playCPU1();
		else if(mainboard.opponent == 2)
			mainboard.playCPU2();
		else if(mainboard.opponent == 3)
			mainboard.playCPU3();
	}
}

function initGame2(){ //MULTIPLAYER
	hideLogin();
	hideLB();
	hideBG();
	mainboard = new BoardOnline(true,hand,gameID);
	cleanBoard();
	mainboard.generateOnlineTiles();
	mainboard.displayOnlineBoard();
	mainboard.playOnline();
}