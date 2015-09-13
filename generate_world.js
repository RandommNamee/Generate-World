document.addEventListener('DOMContentLoaded', function () {
	genWorld();
	createChunkAbove();
	movePlayer(Game.playerPos.x, Game.playerPos.y);
	setInterval(function() {
		if (!Game.stopped) {	
			Game.loop();
		}	
	},Game.speed)
});

var Game = {
	playerPos: {
		x: 784 + "px",
		y: 200 + "px",
		z: 0
	},
	stopped: false,
	speed: 1,
	fieldHeight: (800 / 16) - 1,
	fieldLength: (1424 / 16) - 1,
	fieldWidth: (800 / 16) - 1,
	blockCount: 0,
	world: new Array(),
	entitys: [{id: "player", inventory: new Array}],
	playerSize: 16,
	blockId: ["grass", "dirt", "stone", "log", "leaves", "coal_ore", "iron_ore"],
	layers: {
		dirt: 5,
		log: 6
	},
};
Game.loop = function() {
	gravity();
}
var swi = true;
var fallingSpeed = 1;

document.addEventListener("keydown", function(event) {
	if (event.keyIdentifier == "Down"  && swi) {
		if (Game.playerPos.z > 0) {
			document.getElementById("chunk" + Game.playerPos.z).className = "hide";
			Game.playerPos.z -= 1;
			document.getElementById("chunk" + Game.playerPos.z).className = "";
		} else {
			document.getElementById("chat").innerHTML = "You can't go in this direction";
		}
	}
});

document.addEventListener("keydown", function(event) {
	if (event.keyIdentifier == "Up" && swi) {
		if (Game.playerPos.z < Game.world.length - 1) {
			document.getElementById("chunk" + Game.playerPos.z).className = "hide";
			Game.playerPos.z += 1;
			document.getElementById("chunk" + Game.playerPos.z).className = ""
		} else {
			document.getElementById("chat").innerHTML = "You can't go in this direction";
		}
	}
});


document.addEventListener("keydown", function(event) {
	if (event.keyIdentifier == "U+0051") {
		if (swi) {
			document.getElementById("chunk" + Game.playerPos.z).className = "hide";
			document.getElementById("chunkAbove").className = "";
			swi = false;
		} else {
			console.log(Game);
			document.getElementById("chunkAbove").className = "hide";
			document.getElementById("chunk" + Game.playerPos.z).className = "";
			swi = true;
		}
	}
});



function genWorld() {
	for (var w = 0; w <= Game.fieldWidth; w++) {
		Game.world[w] = new Array();
		var c = document.createElement("div");
		document.getElementById("worldContainer").appendChild(c);
		c.id = "chunk" + w;
		if (w >= 1) {
			c.className += "hide"; 	
		}
		genChunk(w);
		genFloor(w);
		genOre(w);
		genTrees(w);
	}
}

function genChunk(w) {	
	for (var h = 0; h <= Game.fieldHeight; h++) {
		Game.world[w][h] = new Array();
		for (var l = 0; l <= Game.fieldLength; l++) {
			var b = document.createElement("div");
			Game.blockCount += 1;
			document.getElementById("chunk" + w).appendChild(b);
			b.className += "block";
			b.id = "blockNr" + Game.blockCount
			b.style.left = (l * 16) + "px";
			b.style.bottom = (h * 16) + "px";
			Game.world[w][h][l] = {id: b.id};
		};
	};	
}

function genFloor(w) {
	var random = Math.round((Game.fieldHeight / 2) + (Math.random() * 10 - 5));
	var h = 0; 
	for (var f = 0; f <= Game.world[w][random].length - 1; f++) {
		random2 = Math.round(Math.random() * 2 - 1);
		if (random2 = 1) {
			Game.world[w][random][f].blockType = "grass";
			random += Math.round(Math.random() * 2 - 1);
		} else if (random2 = -1){
			random += Math.round(Math.random() * 2 - 1);
			Game.world[w][random][f].blockType = "grass";
		}
		document.getElementById(Game.world[w][random][f].id).className += " " + Game.blockId[0];
		for (var d = 1; d <= Game.layers.dirt; d++) {
			if (random >= d) {
				Game.world[w][random - d][f].blockType = "dirt";
				document.getElementById(Game.world[w][random - d][f].id).className += " " + Game.blockId[1];
				var h = d;
			} else {
				Game.world[w][0][f].blockType = "dirt";
				document.getElementById(Game.world[w][0][f].id).className += " " + Game.blockId[1];
				var h = random;
			} 
		}
		for (var s = h + 1; s <= random; s++) {
			Game.world[w][random - s][f].blockType = "stone";
			document.getElementById(Game.world[w][random - s][f].id).className += " " + Game.blockId[2];
		}
	}
}

function genOre(w) {
	for (var l = 0; l <= Game.fieldLength; l++) {
		for (var h = 0; h <= Game.fieldHeight; h++) {
			var random = Math.random() * 100
			if (random >= 99.5) {
				genIron(w, h, l);
			} else if (random >= 99) {
				genCoal(w, h, l);
			}
		}
	}
}

function genCoal(w, h, l) {
	if (Game.world[w][h][l].blockType == "stone") {
		Game.world[w][h][l].blockType = "coal_ore";
		var z = document.getElementById(Game.world[w][h][l].id);
		z.className = "block " + Game.blockId[5]; 
	}
}

function genIron(w, h, l) {
	if (Game.world[w][h][l].blockType == "stone") {
		Game.world[w][h][l].blockType = "iron_ore";
		var z = document.getElementById(Game.world[w][h][l].id);
		z.className = "block " + Game.blockId[6]; 
	}	
}

function genTrees(w) {
	for (var l = 0; l <= Game.fieldLength; l++) {
		for (var h = 0; h <= Game.fieldHeight; h++) {
			tree(w, l, h);
		}
	}
}


function tree(w, l, h) {
	var random = Math.round(Math.random() * 100);
	if (random >= 98 && Game.world[w][h][l].blockType == "grass" && l > 1 && l < Game.fieldLength - 2) {
		firstLog(w, l, h);
		for (var c = 0; c <= Game.layers.log + Math.round(Math.random() * 6 - 3); c++) {
			if (c <= Math.round(Math.random() * 2)) {
				genTrunk(w, l, h, c);
			} else {
				genLeaves(w, l, h, c);
			}
		}
	}
}

function firstLog(w, l, h) {
	Game.world[w][h + 1][l].blockType = "log";
	var b = document.getElementById(Game.world[w][h + 1][l - 1].id);
	b.className += " " + Game.blockId[3];
}

function genTrunk(w, l, h, c) {
	hl = h + 1 + c;
	if (hl <= 49) {
		Game.world[w][hl][l - 1].blockType = "log";
		b = document.getElementById(Game.world[w][hl][l - 1].id);
		b.className += " " + Game.blockId[3];
	} else {
		Game.world[w][49][l - 1].blockType = "log";
		b = document.getElementById(Game.world[w][49][l - 1].id);
		b.className += " " + Game.blockId[3];
	}
}

function genLeaves(w, l, h, c) { 
	var hl = h + 1 + c;
	if (hl <= 49) { 
		Game.world[w][hl][l].blockType = "leaves";
		Game.world[w][hl][l - 2].blockType = "leaves";
		Game.world[w][hl][l - 1].blockType = "leaves";
		document.getElementById(Game.world[w][hl][l].id).className += " " + Game.blockId[4];
		document.getElementById(Game.world[w][hl][l - 2].id).className += " " + Game.blockId[4];
		document.getElementById(Game.world[w][hl][l - 1].id).className += " " + Game.blockId[4];
	} else {
		Game.world[w][49][l].blockType = "leaves";
		Game.world[w][49][l - 2].blockType = "leaves";
		Game.world[w][49][l - 1].blockType = "leaves";
		document.getElementById(Game.world[w][49][l].id).className += " " + Game.blockId[4];
		document.getElementById(Game.world[w][49][l - 2].id).className += " " + Game.blockId[4];
		document.getElementById(Game.world[w][49][l - 1].id).className += " " + Game.blockId[4];
	}
}

function movePlayer(x, y) {
	var p = document.getElementById("player");
	p.style.bottom = x;
	p.style.left = y;
}

function gravity() { 
	for (var i = 0; i <= Game.entitys.length - 1; i++) {
		var ent = document.getElementById(Game.entitys[i].id);
		var pos = Game.world[Game.playerPos.z][Math.round((parseInt(ent.style.bottom) - Game.playerSize / 2) / 16)][Math.round(parseInt(ent.style.left) / 16)];
		var c = parseInt(ent.style.bottom);
		if (!pos.blockType) {	
			if (fallingSpeed <= 6) {
				c -= fallingSpeed;
				fallingSpeed += fallingSpeed / 80;
			} else {
				c -= fallingSpeed;
			}
		} else {
			c += Math.round(fallingSpeed) - 1;
			fallingSpeed = 1;
		}
		c += "px"
		ent.style.bottom = c;
	}
}

function createChunkAbove() {
	for (var w = 0; w <= Game.fieldWidth; w++) { 
		for (var l = 0; l <= Game.fieldLength; l++) {
			var blockHTML = 0;
			for (var h = Game.fieldHeight - 1;blockHTML == 0; h--) {
				var blockJS = Game.world[w][h][l];
				if (blockJS.blockType) {
					blockHTML = document.createElement("div");
					document.getElementById("chunkAbove").appendChild(blockHTML);
					blockHTML.id = blockJS.id;
					blockHTML.className += "block " + blockJS.blockType;
					blockHTML.style.bottom = (w * 16) + "px";
					blockHTML.style.left = (l * 16) + "px";
				}
			}
		}
	}
}









