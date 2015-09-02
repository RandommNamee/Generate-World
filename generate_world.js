document.addEventListener('DOMContentLoaded', function () {
	genWorld();
	movePlayer(Game.playerStart.x, Game.playerStart.y);
	setInterval(function() {
		if (!Game.stopped) {	
			Game.loop();
		}	
	},Game.speed)
});

var Game = {
	playerStart: {
		x: 784 + "px",
		y: 200 + "px",
		z: 0
	},
	stopped: false,
	speed: 10,
	fallingSpeed: 1,
	height: (800 / 16) - 1,
	length: (1424 / 16) - 1,
	width: (800 / 16) - 1,
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

function genWorld() {
	for (var w = 0; w <= Game.width; w++) {
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
	for (var h = 0; h <= Game.height; h++) {
		Game.world[w][h] = new Array();
		for (var l = 0; l <= Game.length; l++) {
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
	var random = Math.round((Game.height / 2) + (Math.random() * 10 - 5));
	var h = 0; 
	for (var f = 0; f <= Game.world[w][random].length - 1; f++) {
		Game.world[w][random][f].blockType = "grass"
		random += Math.round(Math.random() * 2 - 1)
		document.getElementById(Game.world[w][random][f].id).className += " " + Game.blockId[0];
		for (var d = 1; d <= Game.layers.dirt; d++) {
			Game.world[w][random - d][f].blockType = "dirt";
			document.getElementById(Game.world[w][random - d][f].id).className += " " + Game.blockId[1];
			var h = d;
		}
		for (var s = h + 1; s <= random; s++) {
			Game.world[w][random - s][f].blockType = "stone";
			document.getElementById(Game.world[w][random - s][f].id).className += " " + Game.blockId[2];
		}
	}

}

function genOre(w) {
	for (var l = 0; l <= Game.length; l++) {
		for (var h = 0; h <= Game.height; h++) {
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
	for (var l = 0; l <= Game.length; l++) {
		for (var h = 0; h <= Game.height; h++) {
			tree(w, l, h);
		}
	}
}


function tree(w, l, h) {
	var random = Math.round(Math.random() * 100);
	if (random >= 90 && Game.world[w][h][l].blockType == "grass" && l > 1 && l < Game.length - 2) {
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
	Game.world[w][h + 1 + c][l - 1].blockType = "log";
	b = document.getElementById(Game.world[w][h + 1 + c][l - 1].id);
	b.className += " " + Game.blockId[3];
}

function genLeaves(w, l, h, c) { 
	Game.world[w][h + 1 + c][l].blockType = "leaves";
	Game.world[w][h + 1 + c][l - 2].blockType = "leaves";
	Game.world[w][h + 1 + c][l - 1].blockType = "leaves";
	document.getElementById(Game.world[w][h + 1 + c][l].id).className += " " + Game.blockId[4];
	document.getElementById(Game.world[w][h + 1 + c][l - 2].id).className += " " + Game.blockId[4];
	document.getElementById(Game.world[w][h + 1 + c][l - 1].id).className += " " + Game.blockId[4];
}

function movePlayer(x, y) {
	var p = document.getElementById("player");
	p.style.bottom = x;
	p.style.left = y;
}

function gravity() { 
	for (var i = 0; i <= Game.entitys.length - 1; i++) {
		var p = document.getElementById(Game.entitys[i].id);
		var b = Game.world[Game.playerStart.z][Math.round((parseInt(p.style.bottom) - Game.playerSize / 2) / 16)][Math.round(parseInt(p.style.left) / 16)];
		var c = parseInt(p.style.bottom);
		if (!b.blockType) {	
			if (Game.fallingSpeed <= 8) {
				c -= Game.fallingSpeed;
				Game.fallingSpeed += Game.fallingSpeed / 80;
			} else {
				c -= Game.fallingSpeed;
			}
		} else {
			c += Math.round(Game.fallingSpeed - 1);
			Game.fallingSpeed = 1;
		}
		c += "px"
		p.style.bottom = c;
	};
}
 










