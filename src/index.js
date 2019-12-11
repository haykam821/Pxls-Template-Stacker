require("file-loader?name=[name].[ext]!html-minify-loader!./index.html");
require("file-loader?name=[name].[ext]!./index.css");
require("file-loader?name=[name].[ext]!./favicon.ico");


const can = document.getElementById("canvas");
const ctx = can.getContext("2d");

const input = document.getElementById("json");

const images = {};
const debugLabels = false;

if (localStorage && localStorage.savedJSON) {
	input.value = localStorage.savedJSON;
} else {
	input.value = JSON.stringify([{
		url: "http://file/to/url.png",
		x: 500,
		y: 500,
	}, {
		url: "http://file/to/url.jpg",
		x: 842,
		y: 184,
	}], undefined, 4);
}

const baseUnder = document.getElementById("baseUnder");
baseUnder.addEventListener("input", event => {
	can.style.background = event.target.checked ? "url('https://pxlsfiddle.com/board')" : "rgba(0, 0, 0, 0.1)";
});

const fallbackPos = 0;

/**
 * Draws an item to the canvas.
 * @param {Object} item An item object.
 * @param {number} [x] The position of the item.
 * @param {number} [y] The position of the item.
 */
function drawThing(item, x = fallbackPos, y = fallbackPos) {
	if (debugLabels) {
		ctx.fillText(item.label, x, y);
	}
	ctx.drawImage(images[item.url], x, y);
}

/**
 * Calculates a position.
 * @param {(string|number)} pos The position, in percentage or pixels.
 * @param {*} item The item to get the position of.
 * @param {*} useMiddle Whether to anchor the item's position to its center.
 * @param {*} height Whether the position being calculated is vertical or horizontal.
 * @returns {number} The position.
 */
function calc(pos, item, useMiddle, height) {
	const size = height ? can.height : can.width;
	const imgSize = height ? images[item.url].height : images[item.url].width;

	// TODO
	imgSize;
	useMiddle;

	let position = fallbackPos;

	if (pos.toString().endsWith("%")) {
		const percent = parseInt(pos.slice(0, -1));
		if (isNaN(percent)) {
			return position;
		} else {
			position = percent / 100 * size;
		}
	} else {
		const newPos = parseInt(pos);
		if (isNaN(newPos)) {
			return position;
		} else {
			position = newPos;
		}
	}

	return position;
}

/**
 * Detects whether the canvas is tained.
 * @returns {boolean} Whether the canvas is tainted.
 */
function isTainted() {
	try {
		ctx.getImageData(0, 0, 1, 1);
		return false;
	} catch (error) {
		return error.code === 18;
	}
}

/**
 * Draws all items to the canvas.
 */
function drawAll() {
	const json = JSON.stringify(JSON.parse(input.value), undefined, "\t");

	input.value = json;
	localStorage.savedJSON = json;

	ctx.clearRect(0, 0, can.width, can.height);

	for (const item of JSON.parse(input.value).reverse()) {
		if (images[item.url]) {
			drawThing(item, calc(item.x, item), calc(item.y, item, true));
		} else {
			images[item.url] = new Image();
			images[item.url].src = item.url;

			images[item.url].addEventListener("load", function() {
				drawThing(item, calc(item.x, item, item.fromCenter), calc(item.y, item, item.fromCenter, true));
			});
		}
	}

	document.getElementById("newtabity").disabled = isTainted();
}

document.getElementById("clickity").addEventListener("click", drawAll);
document.getElementById("newtabity").addEventListener("click", () => {
	drawAll();
	if (isTainted()) {
		document.getElementById("newtabity").disabled = true;
		alert("You used images from a site that does not allowed Cross-Origin Resource Sharing, so you cannot use this feature.");
	} else {
		document.getElementById("newtabity").disabled = false;
		document.location.href = `https://pxls.space/#template=${encodeURIComponent(document.getElementById("canvas").toDataURL())}&ox=0&oy=0`;
	}
});
