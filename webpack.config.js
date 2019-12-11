const path = require("path");

const ManifestPlugin = require("webpack-pwa-manifest");

module.exports = {
	entry: "./src/index.js",
	mode: process.env.WEBPACK_MODE || "production",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "./dist"),
	},
	plugins: [
		new ManifestPlugin({
			/* eslint-disable camelcase */
			display: "standalone",
			fingerprints: false,
			inject: false,
			name: "Pxls Template Stacker",
			short_name: "Template Stacker",
			/* eslint-enable camelcase */
		}),
	],
};