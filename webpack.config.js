module.exports = {
    context: __dirname + "/src",
    entry: "./javascripts/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
	module: {
		loaders: [
			{test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
			{test: /\.sass$/, loader: 'style!css!sass?indentedSyntax=true'},
			{test: /\.scss$/, loader: 'style!css!sass'},
			{test: /\.css$/, loader: "style-loader!css-loader" },
			{test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,loader: "file-loader"},
		]
	}
}
