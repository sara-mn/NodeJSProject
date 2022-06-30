const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        reader: './reader.js',
        chatlib: './chatlib.js',
        main:'./client.js',
    },
    // entry: './client.js',
    output: {
        filename: '[name].js',
        path:  __dirname + '/dist',
    },
    devServer: {
        port: 8001
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: './client.html'
        }),
        new HtmlWebpackPlugin({
            filename: "chart.html",
            template: './chart.html'
        })
    ]
}