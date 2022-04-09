require("file-loader?name=[name].[ext]!html-minify-loader!./index.html");
require("file-loader?name=[name].[ext]!./index.css");
require("file-loader?name=[name].[ext]!./favicon.ico");


const can = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = can.getContext("2d") as CanvasRenderingContext2D;

const input = document.getElementById("json") as HTMLTextAreaElement;

interface Item {
	label: string;
	url: string;
}

const images: Record<string, HTMLImageElement> = {};
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

const baseUnder = document.getElementById("baseUnder") as HTMLInputElement;
baseUnder.addEventListener("input", () => {
	can.style.background = baseUnder.checked ? "url('https://pxlsfiddle.com/board')" : "rgba(0, 0, 0, 0.1)";
});

const canvasWidth = document.getElementById("canvasWidth") as HTMLInputElement;
canvasWidth.value = can.width + "";

const canvasHeight = document.getElementById("canvasHeight") as HTMLInputElement;
canvasHeight.value = can.height + "";

const fallbackPos = 0;

/**
 * Draws an item to the canvas.
 * @param item An item object.
 * @param x The position of the item.
 * @param y The position of the item.
 */
function drawThing(item: Item, x: number = fallbackPos, y: number = fallbackPos) {
	if (debugLabels) {
		ctx.fillText(item.label, x, y);
	}
	ctx.drawImage(images[item.url], x, y);
}

/**
 * Calculates a position.
 * @param pos The position, in percentage or pixels.
 * @param item The item to get the position of.
 * @param useMiddle Whether to anchor the item's position to its center.
 * @param height Whether the position being calculated is vertical or horizontal.
 * @returns The position.
 */
function calc(pos: string | number, item: Item, useMiddle = false, height = false): number {
	const size = height ? can.height : can.width;
	const imgSize = height ? images[item.url].height : images[item.url].width;

	// TODO
	imgSize;
	useMiddle;

	let position = fallbackPos;

	if (typeof pos === "string" && pos.endsWith("%")) {
		const percent = parseInt(pos.slice(0, -1));
		if (isNaN(percent)) {
			return position;
		} else {
			position = percent / 100 * size;
		}
	} else {
		const newPos = typeof pos === "string" ? parseInt(pos) : pos;
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
 * @returns Whether the canvas is tainted.
 */
function isTainted(): boolean {
	try {
		ctx.getImageData(0, 0, 1, 1);
		return false;
	} catch (error: unknown) {
		return error instanceof DOMException && error.code === 18;
	}
}

const clickity = document.getElementById("clickity") as HTMLButtonElement;
const newtabity = document.getElementById("newtabity") as HTMLButtonElement;

/**
 * Draws all items to the canvas.
 */
function drawAll() {
	can.width = parseInt(canvasWidth.value);
	can.height = parseInt(canvasHeight.value);

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

	newtabity.disabled = isTainted();
}

clickity.addEventListener("click", drawAll);
newtabity.addEventListener("click", () => {
	drawAll();
	if (isTainted()) {
		newtabity.disabled = true;
		alert("You used images from a site that does not allowed Cross-Origin Resource Sharing, so you cannot use this feature.");
	} else {
		newtabity.disabled = false;
		document.location.href = `https://pxls.space/#template=${encodeURIComponent(can.toDataURL())}&ox=0&oy=0`;
	}
});
