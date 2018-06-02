const can = document.getElementById("canvas");
const ctx = can.getContext("2d");

const input = document.getElementById("json");

const images = {};
const debugLabels = false;

if (localStorage && localStorage.savedJSON) {
	input.value = localStorage.savedJSON;
} else {
	input.value = JSON.stringify([{
		"url": "http://file/to/url.png",
		"x": 500,
		"y": 500,
	}, {
		"url": "http://file/to/url.jpg",
		"x": 842,
		"y": 184,
	}], undefined, 4);
}

const baseUnder = document.getElementById("baseUnder");
baseUnder.addEventListener("input", (event) => {
	can.style.background = event.target.checked ? "url('https://pxlsfiddle.com/board')" : "rgba(0, 0, 0, 0.1)";
});

const fallbackPos = 0;

function drawThing(item, x = fallbackPos, y = fallbackPos) {
	if (debugLabels) {
		ctx.fillText(item.label, x, y);
	}
	ctx.drawImage(images[item.url], x, y);
}

function calc(pos, height) {
	const size = height ? can.height : can.width;

	if (pos.toString().endsWith("%")) {
		const percent = parseInt(pos.slice(0, -1));
		if (isNaN(percent)) {
			return fallbackPos;
		} else {
			return percent / 100 * size;
		}
	} else {
		const newPos = parseInt(pos);
		if (isNaN(newPos)) {
			return fallbackPos;
		} else {
			return newPos;
		}
	}
}

function drawAll() {
	json = JSON.stringify(JSON.parse(input.value), undefined, "\t");

	input.value = json;
	localStorage.savedJSON = json;

	ctx.clearRect(0, 0, can.width, can.height);

	for (const item of JSON.parse(input.value).reverse()) {
		if (!images[item.url]) {
			images[item.url] = new Image();
			images[item.url].src = item.url;

			images[item.url].onload = function() {
				drawThing(item, calc(item.x), calc(item.y, true));
			};
		} else {
			drawThing(item, calc(item.x), calc(item.y, true));
		}
	}
}

document.getElementById("clickity").addEventListener("click", drawAll);
document.getElementById("newtabity").addEventListener("click", () => {
	drawAll();
	document.location.href = `https://pxls.space/#template=${encodeURIComponent(document.getElementById("canvas").toDataURL())}&ox=0&oy=0`;
});
