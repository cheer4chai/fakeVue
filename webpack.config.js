
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    watch: true,
    entry: {
        index: ['./src/index.js'],
        example: ['./example/index.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './example/index.html'}
        ], {})
    ]

};
