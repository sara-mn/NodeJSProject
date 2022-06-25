const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'main.js'
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
    plugins:[
        new HtmlWebpackPlugin({
            template: './client.html'
        })
    ]
}