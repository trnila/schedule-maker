var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    context: __dirname + "/src",
    entry: "./javascripts/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
	module: {
		loaders: [
			{test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
			{test: /\.sass$/, loader: ExtractTextPlugin.extract('style-loader', 'css!sass?indentedSyntax=true')},
			{test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!sass')},
			{test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,loader: "file-loader"},
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle-[hash].css"),
		new HtmlWebpackPlugin({
			'template': 'index.html'
		})
	]
}
