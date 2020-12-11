const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	module: {
		rules: [
			/* Transpile all js(x) using babel */
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			/* Load all html files using the html loader */
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			/* Resolve all 'import style from ./style.global.css' as css-modules */
			{
				test: /\.css$/i,
				use: [{
					loader: 'style-loader', options: { injectType: 'styleTag' } },
				{ loader: 'css-loader', options: { modules: true } }],
				exclude: /node_modules|\.global\.css/
			},
			/* Resolve all css that ends in .global.css or is placed under node_modules as global css */
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
				include: /node_modules|\.global\.css/
			},
			/* Configure file-loader for images */
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	plugins: [
		/* Bootstrap the index site from the src/index.html file */
		new HtmlWebPackPlugin({
			template: './src/index.html',
			filename: './index.html'
		})
	],
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'build'),
		filename: 'main.js'
	},
	devServer: {
		historyApiFallback: {
			index: 'build/index.html'
		}
	},
	devtool: 'inline-source-map'
};