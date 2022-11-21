const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

// const PATHS = {
// 	// src must be src
// 	src: path.join(__dirname, '../src'),
// 	// dist to public
// 	dist: path.join(__dirname, '../public'),
// 	// assets to static
// 	assets: 'static/'
// };

const PATHS = {
	src: path.join(__dirname, 'src'),
	dist: path.join(__dirname, 'dist'),
};

for (p in PATHS) {
	console.log(p);
}


const PAGES_DIR = `${PATHS.src}/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => `[name].${ext}`;
const cssFilename = () => `css/${filename('css')}`;

const optimization = () => {
	const configObj = {};
	if (isProd) {
		configObj.minimizer = [
			new CssMinimizerWebpackPlugin(),
			new TerserWebpackPlugin()
		];
	}
	return configObj;
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	devServer: {
		static: {
			directory: path.join(__dirname, (isProd) ? 'public' : 'dev'),
		},
		compress: false,
		port: 9000,
		client: {
			progress: true,
		},
		hot: true,
		open: true
	},
	plugins: [
		new CleanWebpackPlugin(),
		...PAGES.map(page => new HtmlWebpackPlugin({
			template: `${PAGES_DIR}/${page}`,
			filename: `./${page.replace(/\.pug/, '.html')}`,
			minify: {
				collapseWhitespace: false
			}
		})),
		//   new HtmlWebpackPlugin({
		// 	template: `${PAGES_DIR}/index.pug`,
		// 	filename: './index.html',
		// 	inject: true
		//   }),
		// new HtmlWebpackPugPlugin({
		// 	adjustIndent: true
		// }),
		new MiniCssExtractPlugin({
			filename: cssFilename()
		}),
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		{
		// 			from: path.resolve(__dirname, 'src/assets'),
		// 			to: path.resolve(__dirname, (isProd) ? 'public/assets' : 'dev/assets'),
		// 		},
		// 	]
		// }),
	],
	devtool: isProd ? false : 'source-map',
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: ['pug-loader']
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								return path.relative(path.dirname(resourcePath), context) + '/'
							}
						}
					}, 'css-loader', 'postcss-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|svg|ico)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			}
		],
	}
};

