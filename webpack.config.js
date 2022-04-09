/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const ManifestPlugin = require("webpack-pwa-manifest");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
	entry: "./src/index.ts",
	mode: process.env.WEBPACK_MODE || "production",
	module: {
		rules: [{
			include: path.resolve(__dirname, "./src"),
			loader: "ts-loader",
			options: {
				transpileOnly: true,
			},
			test: /\.ts$/,
		}],
	},
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
		new ForkTsCheckerWebpackPlugin(),
	],
	resolve: {
		extensions: [
			".js",
			".ts",
		],
	},
};
