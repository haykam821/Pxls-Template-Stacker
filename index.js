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

function calc(pos, item, useMiddle, height) {
	const size = height ? can.height : can.width;
	const imgSize = height ? images[item.url].height : images[item.url].width;

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

	return position; /* - (useMiddle ? imgSize / 2 : 0)*/
}

function isTainted() {
	try {
		ctx.getImageData(0, 0, 1, 1);
		return false;
	} catch (err) {
		return err.code === 18;
	}
}

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

			images[item.url].onload = function() {
				drawThing(item, calc(item.x, item, item.fromCenter), calc(item.y, item, item.fromCenter, true));
			};
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
