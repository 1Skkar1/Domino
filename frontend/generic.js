//---------------------------------  G E N E R I C ---------------------------------------

//-> D I S P L A Y S

function hideLogin(){
	var x = document.getElementById("userlogin");
	x.style.display = "none";
	var sm = document.getElementById("singlemulti");
	sm.style.display = "block";
	var log = document.getElementById("logout");
	log.style.display = "block";
	var lose = document.getElementById("losescreen");
	lose.style.display = "none";
	var win = document.getElementById("winscreen");
	win.style.display = "none";
	var tie = document.getElementById("tiescreen");
	tie.style.display = "none";
}

function showDifficulty(){
	var config = document.getElementById("configmenu");
	config.style.display = "block";
	var sm = document.getElementById("singlemulti");
	sm.style.display = "none";
}

function toggleRules(){
	let rules = document.getElementById("rules");
	if(rules.style.display == "block"){
		rules.style.display = "none";
	}
	else{
		rules.style.display = "block";
	}
}

function toggleLeaderBoard(){
	let leaderboard = document.getElementById("leaderboard");
	if(leaderboard.style.display == "block"){
		leaderboard.style.display = "none";
		return;
	}
	leaderboard.style.display = "block";
	intoLeaderBoard(lbNames,lbGames,lbWins);
}

function hideLB(){
	let lb = document.getElementById("leaderboard");
	let lbButton = document.getElementById("leaderboardButton");
	lb.style.display = "none";
	lbButton.style.display = "none";
}

function hideBG(){
	var sheet = document.getElementById("whitesheet");
	sheet.style.display = "block";
	var body = document.body;
	body.classList.add("stopScroll");
}

function showBG(){
	var sheet = document.getElementById("whitesheet");
	sheet.style.display = "none";
	var body = document.body;
	body.classList.remove("stopScroll");
}

function displayVictory(isOnline){
	var screen = document.getElementById("winscreen");
	screen.style.display = "block";
	var w = document.getElementById("logout");
	w.style.display = "block";
	var y = document.getElementById("leaderboard");
	y.style.display = "block";
	var x = document.getElementById("userlogin");
	x.style.display = "none";
	var z = document.getElementById("configmenu");
	z.style.display = "none";
	var a1 = document.getElementById("mytiles");
	a1.style.display = "none";
	var a2 = document.getElementById("theirtiles");
	a2.style.display = "none";
	var com = document.getElementById("commands");
	com.style.display = "none";
	var p1 = document.getElementById("p1tag");
	p1.style.display = "none";
	var p2 = document.getElementById("p2tag");
	p2.style.display = "none";
	var field = document.getElementById("gamefield");
	field.style.display = "none";
	var deck = document.getElementById("deck");
	deck.style.display = "none";
	var decknumber = document.getElementById("decknumber");
	decknumber.style.display = "none";
	let hourglass = document.getElementById("hourglass");
	hourglass.style.display = "none";
	let yourturn = document.getElementById("yourturn");
	yourturn.style.display = "none";
	let theirturn = document.getElementById("theirturn");
	theirturn.style.display = "none";
	showBG();

	if(isOnline){
		ranking();
	}
}

function displayDefeat(isOnline){
	var screen = document.getElementById("losescreen");
	screen.style.display = "block";
	var w = document.getElementById("logout");
	w.style.display = "block";
	var y = document.getElementById("leaderboard");
	y.style.display = "block";
	var x = document.getElementById("userlogin");
	x.style.display = "none";
	var z = document.getElementById("configmenu");
	z.style.display = "none";
	var a1 = document.getElementById("mytiles");
	a1.style.display = "none";
	var a2 = document.getElementById("theirtiles");
	a2.style.display = "none";
	var com = document.getElementById("commands");
	com.style.display = "none";
	var p1 = document.getElementById("p1tag");
	p1.style.display = "none";
	var p2 = document.getElementById("p2tag");
	p2.style.display = "none";
	var field = document.getElementById("gamefield");
	field.style.display = "none";
	var deck = document.getElementById("deck");
	deck.style.display = "none";
	var decknumber = document.getElementById("decknumber");
	decknumber.style.display = "none";
	let hourglass = document.getElementById("hourglass");
	hourglass.style.display = "none";
	let yourturn = document.getElementById("yourturn");
	yourturn.style.display = "none";
	let theirturn = document.getElementById("theirturn");
	theirturn.style.display = "none";
	showBG();

	if(isOnline){
		ranking();
	}
}

function displayTie(isOnline){
	var screen = document.getElementById("losescreen");
	screen.style.display = "block";
	var w = document.getElementById("logout");
	w.style.display = "block";
	var y = document.getElementById("leaderboard");
	y.style.display = "block";
	var x = document.getElementById("userlogin");
	x.style.display = "none";
	var z = document.getElementById("configmenu");
	z.style.display = "none";
	var a1 = document.getElementById("mytiles");
	a1.style.display = "none";
	var a2 = document.getElementById("theirtiles");
	a2.style.display = "none";
	var com = document.getElementById("commands");
	com.style.display = "none";
	var p1 = document.getElementById("p1tag");
	p1.style.display = "none";
	var p2 = document.getElementById("p2tag");
	p2.style.display = "none";
	var field = document.getElementById("gamefield");
	field.style.display = "none";
	var deck = document.getElementById("deck");
	deck.style.display = "none";
	var decknumber = document.getElementById("decknumber");
	decknumber.style.display = "none";
	let hourglass = document.getElementById("hourglass");
	hourglass.style.display = "none";
	let yourturn = document.getElementById("yourturn");
	yourturn.style.display = "none";
	let theirturn = document.getElementById("theirturn");
	theirturn.style.display = "none";
	showBG();

	if(isOnline){
		ranking();
	}
}

function displaySurrender(isOnline){
	if(isOnline){
		leave(nickx,passx,mainboard.gameID);
	}
	displayDefeat();
}

function displayQuit(){
	var screen = document.getElementById("userlogin");
	screen.style.display = "block";
	var y = document.getElementById("leaderboard");
	y.style.display = "none";
	var butlb = document.getElementById("leaderboardButton");
	butlb.style.display = "block";
	var z = document.getElementById("configmenu");
	z.style.display = "none";
	var w = document.getElementById("logout");
	w.style.display = "none";
	var a1 = document.getElementById("mytiles");
	a1.style.display = "none";
	var a2 = document.getElementById("theirtiles");
	a2.style.display = "none";
	var com = document.getElementById("commands");
	com.style.display = "none";
	var p1 = document.getElementById("p1tag");
	p1.style.display = "none";
	var p2 = document.getElementById("p2tag");
	p2.style.display = "none";
	var field = document.getElementById("gamefield");
	field.style.display = "none";
	var deck = document.getElementById("deck");
	deck.style.display = "none";
	var decknumber = document.getElementById("decknumber");
	decknumber.style.display = "none";
	var lookgame = document.getElementById("lookingforgame");
	lookgame.style.display = "none";
	var box = document.getElementById("loadingboxes");
	box.style.display = "none";
	var gamelog = document.getElementById("gamelog");
	gamelog.style.display = "none";
	var lose = document.getElementById("losescreen");
	lose.style.display = "none";
	var win = document.getElementById("winscreen");
	win.style.display = "none";
	var tie = document.getElementById("tiescreen");
	tie.style.display = "none";

	location.reload();
}

function showYourTurn(){
	let hourglass = document.getElementById("hourglass");
	hourglass.style.display = "none";
	let yourturn = document.getElementById("yourturn");
	yourturn.style.display = "block";
	let theirturn = document.getElementById("theirturn");
	theirturn.style.display = "none";
}

function showOpponentTurn(){
	let hourglass = document.getElementById("hourglass");
	hourglass.style.display = "block";
	let yourturn = document.getElementById("yourturn");
	yourturn.style.display = "none";
	let theirturn = document.getElementById("theirturn");
	theirturn.style.display = "block";
}

//-> L E A D E R B O A R D
/*
function reorderLeaderboard(player){
	updateLeaderBoard();
}
*/

function intoLeaderBoard(){
	if(typeof(Storage) !== "undefined"){
		for(let i = 0; i < 10; i++){
			document.getElementById("rp" + i).innerHTML = localStorage.getItem("rp" + i);
			document.getElementById("rg" + i).innerHTML = localStorage.getItem("rg" + i);
			document.getElementById("rw" + i).innerHTML = localStorage.getItem("rw" + i);
		}
	}
	else {
		console.log("Your browser does not support this functionality! - (WebStorage)");
	}
}

function updateLeaderBoard(a, b, c){
	console.log(lbNames);
	console.log(lbGames);
	console.log(lbWins);
	if(typeof(Storage) !== "undefined"){
		for(let i = 0; i < 10; i++){
			localStorage.setItem("rp" + i, a[i]);
			localStorage.setItem("rg" + i, b[i]);
			localStorage.setItem("rw" + i, c[i]);
			document.getElementById("rp" + i).innerHTML = localStorage.getItem("rp" + i);
			document.getElementById("rg" + i).innerHTML = localStorage.getItem("rg" + i);
			document.getElementById("rw" + i).innerHTML = localStorage.getItem("rw" + i);
		}
	}
	else {
		console.log("Your browser does not support this functionality! - (WebStorage)");
	}
}

//-> E N A B L E  P L A Y

function hideClick() {
	document.getElementById("noclick").style.display = "block";
}
  
function showClick() {
	document.getElementById("noclick").style.display = "none";
}

//-> O T H E R . . .

function checkFields(){
	let userField = document.getElementById("uname").value.length;
	let passField = document.getElementById("passwd").value.length;

	if(userField == 0 || passField == 0){
		window.alert("Please fill Username/Password fields");
		location.reload();
		return true;
	}
	return false;
}

function updateDeck(counter){
	if(counter == 0) {
		console.log("EMPTY DECK");
		document.getElementById("deck").style.display = "none";
		document.getElementById("decknumber").style.display = "none";
	}
	else {
		document.getElementById("decknumber").innerHTML = "<b>" + counter + "<b />";
	}
}

function restartGame(){
	if(mainboard.isOnline){
		showGameSearch();
	}
	else{
		initGame();
	}
}

function cleanBoard(){
    let board = document.getElementById("gamefield");
    let hand1 = document.getElementById("mytiles2");
    let hand2 = document.getElementById("theirtiles2");
    mainboard.field.classList.remove('shrink');
    mainboard.field.classList.remove('shrink2');

    while(hand1.firstChild)
        hand1.removeChild(hand1.firstChild);
    
    while(hand2.firstChild)
        hand2.removeChild(hand2.firstChild);

    while(board.firstChild)
        board.removeChild(board.firstChild);
}

function updateScroll(){
    var fixSB = document.getElementById("gamelog");
    fixSB.scrollTop = fixSB.scrollHeight;
}

function updateLog(){
    while(mainboard.gamelog.length > 0){
        var toLog = mainboard.gamelog.shift();
        if(mainboard.logCT == true)
            document.getElementById("gamelog").innerHTML += "<br>"+"<hr>"+toLog;
        else{
            document.getElementById("gamelog").innerHTML = toLog;
            mainboard.logCT = true;
        }
    }
    updateScroll();
}

function haveDelay(){
	let delay = 2000;
	let before = Date.now();
	while(Date.now() < before + delay){};
}

function removeAllOutline() {
    for (let i = 0 ; i < mainboard.gameTiles.length ; i++) {
        if (mainboard.gameTiles[i].owner == 1) {
            if (mainboard.gameTiles[i].node.classList.contains('outline'))
                mainboard.gameTiles[i].node.classList.remove('outline');
        }
    }
}
