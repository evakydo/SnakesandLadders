/* player 1 (red) turn=true, player 2 (white) turn = false*/
var turn, red_pos, white_pos, prev_red_pos, prev_white_pos, diceResult, red_python_effect, white_python_effect,cells,cheat1=false,cheat2=false;

function setPositions() {
	var positions=[];
	var snakePositions   =[13,20,28,44,58,59,65,72,78]
	var snakeNewPositions=[11,10,7,34,48,39,25,52,69]

	var ladderPositions   =[5,16,21,37,42,54,60,67,73]
	var ladderNewPositions=[33,36,61,56,53,64,80,77,76]


	for (var i = 1; i <=80 ; i++) {
	 positions[i]=new Object();
	 positions[i].from=i;
	 
	  
	 if(snakePositions.indexOf(i)!=-1){
	   positions[i].to=snakeNewPositions[snakePositions.indexOf(i)];
	   positions[i].type="Snake";
	 }
	 else if(ladderPositions.indexOf(i)!=-1){
	   positions[i].to=ladderNewPositions[ladderPositions.indexOf(i)];
	   positions[i].type="Ladders";
	 }
	 else if(i===29 || i===46){
		positions[i].to=i;
		positions[i].type="pythonEffect";   
	 }
	 else{
	   positions[i].to=i;
		positions[i].type="Normal";   
	   
	 }
	}
	 return positions; 
}

function newGame() {

	/*get names for tsitsipas case*/
	if (document.getElementById("username").value == "tsitsipas")
		cheat1 = true;
	else
		cheat1 = false;

	if (document.getElementById("username2").value == "tsitsipas")
		cheat2 = true;
	else
		cheat2 = false;

	/*first player turn*/
	firstplayerturn = Math.floor(Math.random() * 2) + 1;
	if (firstplayerturn == 1) turn = true; /*red*/
	else turn = false; /*white*/

	/*initialise infobox*/
	document.getElementById("pre_infobox").style.display = "none";
	document.getElementById("runtime_infobox").style.display = "inline-block";
	if (turn) {
		document.getElementById("player_turn").innerHTML = "red";
		document.getElementById("player_turn").style.color = "#E3735E";
		document.getElementById("infobox").style.borderColor = "#E3735E";
	}
	else {
		document.getElementById("player_turn").innerHTML = "white";
		document.getElementById("infobox").style.borderColor = "darkslategray";
	}
	/*initialise variables*/
	red_pos = 0;
	white_pos = 0;
	prev_red_pos = 0;
	prev_white_pos = 0;
	cells = setPositions();
	red_python_effect = false;
	white_python_effect = false;
	cheatdicerolls = [5, 4, 4];
	cheatdicestage1 = 0;
	cheatdicestage2 = 0;

}

function RollDice() {

	document.getElementById("next_button").style.display = "inline-block";

	if (cheat1 && getPlayerTurn()) {

		diceResult = cheatdicerolls[cheatdicestage1++];
	}
	else if (cheat2 && !getPlayerTurn()) {

		diceResult = cheatdicerolls[cheatdicestage2++];
	}
	else
		diceResult = Math.floor(Math.random() * 6) + 1;

	img_src = "./ImagesDice/" + diceResult + ".png";
	document.getElementById("dice_img_result").src = img_src;
	document.getElementById("dice_img_result").style.display = "inline-block";
	document.getElementById("dicebutton").style.display = "none";
	changePosition();

}

function changePosition() {

	if (turn == true) {

		if (red_pos + diceResult > 80)
			red_pos = 160 - red_pos - diceResult;
		else
			red_pos = red_pos + diceResult;

		if (cells[red_pos].type == "Ladders" || (cells[red_pos].type == "Snake" && !red_python_effect))
			red_pos = cells[red_pos].to;
		else if (cells[red_pos].type == "pythonEffect") 
			red_python_effect = true;						
	}

	else {

		if (white_pos + diceResult > 80)
			white_pos = 160 - white_pos - diceResult;
		else
			white_pos = white_pos + diceResult;

		if (cells[white_pos].type == "Ladders" || (cells[white_pos].type == "Snake" && !white_python_effect))
			white_pos = cells[white_pos].to;
		else if (cells[white_pos].type == "pythonEffect") 
			white_python_effect = true;
	}

	updateGUI();

	hasPlayerWon();

}

function getPlayerTurn() {

	if (turn) return true;
	else return false;

}

function changePlayerTurn() {

	if (diceResult != 6) {
		if (turn) turn = false;
		else turn = true;
	}

}

function hasPlayerWon() {

	if (turn) {
		if (red_pos == 80) {
			document.getElementById("runtime_infobox").style.display = "none";
			document.getElementById("endgame_infobox").style.display = "inline-block";
			document.getElementById("end_text").innerHTML = "Winner : RED";
			return true;
		}
	}
	else {
		if (white_pos == 80) {
			document.getElementById("runtime_infobox").style.display = "none";
			document.getElementById("endgame_infobox").style.display = "inline-block";
			document.getElementById("end_text").innerHTML = "Winner : WHITE";
			return true;
		}
	}
	return false;
}

function updateGUI() {

	if (turn == true) {

		console.log("dice roll: " + diceResult + " red prev pos: " + prev_red_pos + " new pos: " + red_pos + " type: " + cells[red_pos].type);

		if (prev_red_pos != 0 && prev_red_pos != white_pos)
			document.getElementById("position" + prev_red_pos).innerHTML = "<img  src='images/" + prev_red_pos + ".png'  height=70 width=70></div>";
		else if (prev_red_pos != 0)
			document.getElementById("position" + prev_red_pos).innerHTML = "<img  src='imagesWhite/" + prev_red_pos + ".png'  height=70 width=70></div>";

		if (red_pos != white_pos)
			document.getElementById("position" + red_pos).innerHTML = "<img  src='imagesRed/" + red_pos + ".png'  height=70 width=70></div>";
		else
			document.getElementById("position" + red_pos).innerHTML = "<img  src='imagesBoth/" + red_pos + ".png'  height=70 width=70></div>";

		prev_red_pos = red_pos;

	}
	else {

		console.log("dice roll: " + diceResult + " white prev pos: " + prev_white_pos + " new pos: " + white_pos + " type: " + cells[white_pos].type);

		if (prev_white_pos != 0 && prev_white_pos != red_pos)
			document.getElementById("position" + prev_white_pos).innerHTML = "<img  src='images/" + prev_white_pos + ".png'  height=70 width=70></div>";
		else if (prev_white_pos != 0)
			document.getElementById("position" + prev_white_pos).innerHTML = "<img  src='imagesRed/" + prev_white_pos + ".png'  height=70 width=70></div>";

		if (red_pos != white_pos)
			document.getElementById("position" + white_pos).innerHTML = "<img  src='imagesWhite/" + white_pos + ".png'  height=70 width=70></div>";
		else
			document.getElementById("position" + red_pos).innerHTML = "<img  src='imagesBoth/" + white_pos + ".png'  height=70 width=70></div>";

		prev_white_pos = white_pos;

	}

}

function NextMove() {

	changePlayerTurn();
	document.getElementById("dicebutton").style.display = "inline-block";
	document.getElementById("next_button").style.display = "none";
	document.getElementById("dice_img").src = "./ImagesDice/dice.gif";
	document.getElementById("dice_img_result").style.display = "none";
	if (getPlayerTurn()) {

		document.getElementById("player_turn").innerHTML = "red";
		document.getElementById("player_turn").style.color = "#E3735E";
		document.getElementById("infobox").style.borderColor = "#E3735E";
		if (red_python_effect) document.getElementById("python_effect").style.display = "inline-block";
		else document.getElementById("python_effect").style.display = "none";
	}
	else {

		document.getElementById("player_turn").innerHTML = "white";
		document.getElementById("player_turn").style.color = "White";
		document.getElementById("infobox").style.borderColor = "darkslategray";
		if (white_python_effect) document.getElementById("python_effect").style.display = "inline-block";
		else document.getElementById("python_effect").style.display = "none";
	}



}
