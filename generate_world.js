document.addEventListener('DOMContentLoaded', function () {
	genWorld();
	
});

var Game = {
	height: (800 / 16) - 1,
	width: (1920 / 16) - 1,
	blockCount: 0,
	world: new Array(),
	blockId: ["grass", "dirt", "stone", "log", "leaves", "coal_ore", "iron_ore"],
	layers: {
		dirt: 3,
		log: 6,
		leaves: 5
	}
};

function genWorld() {
	for (var h = 0; h <= Game.height; h++) {
		Game.world[h] = new Array();
		for (var l = 0; l <= Game.width; l++) {
			var b = document.createElement("div");
			Game.blockCount += 1;
			document.getElementById("worldContainer").appendChild(b);
			b.className += "block";
			b.id = "blockNr" + Game.blockCount
			b.style.left = (l * 16) + "px";
			b.style.bottom = (h * 16) + "px";
			Game.world[h][l] = {id: b.id};
		};
	};
	genFloor();
	genTrees();
	genOre();
}

function genFloor() {
	var random = Math.round((Game.height / 2) + (Math.random() * 10 - 5));
	var h = 0; 
	for (var f = 0; f <= Game.world[random].length - 1; f++) {
		Game.world[random][f].blockType = "grass"
		random += Math.round(Math.random() * 2 - 1)
		document.getElementById(Game.world[random][f].id).className += " " + Game.blockId[0];
		for (var d = 1; d <= Game.layers.dirt; d++) {
			Game.world[random - d][f].blockType = "dirt";
			document.getElementById(Game.world[random - d][f].id).className += " " + Game.blockId[1];
			var h = d;
		}
		for (var s = h + 1; s <= random; s++) {
			Game.world[random - s][f].blockType = "stone";
			document.getElementById(Game.world[random - s][f].id).className += " " + Game.blockId[2];
		}
	}

}

function genOre() {
	for (var l = 0; l <= Game.width; l++) {
		for (var h = 0; h <= Game.height; h++) {
			var random = Math.random() * 100
			if (random >= 99.5) {
				genIron(h, l);
			} else if (random >= 99) {
				genCoal(h, l);
			}
		}
	}
}

function genCoal(h, l) {
	if (Game.world[h][l].blockType == "stone") {
		Game.world[h][l].blockType = "coal_ore";
		var z = document.getElementById(Game.world[h][l].id);
		z.className = "block " + Game.blockId[5]; 
	}
}

function genIron(h, l) {
	if (Game.world[h][l].blockType == "stone") {
		Game.world[h][l].blockType = "iron_ore";
		var z = document.getElementById(Game.world[h][l].id);
		z.className = "block " + Game.blockId[6]; 
	}	
}

function genTrees() {
	for (var l = 0; l <= Game.width; l++) {
		for (var h = 0; h <= Game.height; h++) {
			tree(l, h);
		}
	}
}

function tree(l, h) {
	var random = Math.round(Math.random() * 100);
	if (random >= 90) {
		if (Game.world[h][l].blockType == "grass") {
			firstLog(l, h);
			for (var c = 0; c <= Game.layers.log + Math.round(Math.random() * 6 - 3); c++) {
				if (c <= Math.round(Math.random() * 2)) {
					genTrunk(l, h, c);
				} else {
					genLeaves(l, h, c);
				}
			}
		}
	}
}

function firstLog(l, h) {
	Game.world[h + 1][l + (-1 || +1)].blockType = "log";
	var b = document.getElementById(Game.world[h + 1][l - 1].id);
	b.className += " " + Game.blockId[3];
}

function genTrunk(l, h, c) {
	Game.world[h + 1 + c][l - 1].blockType = "log";
	b = document.getElementById(Game.world[h + 1 + c][l - 1].id);
	b.className += " " + Game.blockId[3];
}

function genLeaves(l, h, c) {
	Game.world[h + 1 + c][l].blockType = "leaves";
	Game.world[h + 1 + c][l - 2].blockType = "leaves";
	Game.world[h + 1 + c][l - 1].blockType = "leaves";
	var z = document.getElementById(Game.world[h + 1 + c][l].id);
	z.className += " " + Game.blockId[4];
	var y = document.getElementById(Game.world[h + 1 + c][l - 2].id);
	y.className += " " + Game.blockId[4];
	var x = document.getElementById(Game.world[h + 1 + c][l - 1].id);
	x.className += " " + Game.blockId[4];
}












