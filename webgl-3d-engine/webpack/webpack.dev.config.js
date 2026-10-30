const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const webpackConfigBase = require("./webpack.base.config.js");
const openBrowserPlugin = require('open-browser-webpack-plugin');

const webpackConfigDev = {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'API_HOST': '""'
        }),
        new openBrowserPlugin({ url: "http://localhost:8085" }),

    ],
     devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "../public"),
        hot: true,
        host: '0.0.0.0',
        inline: true,
        port: 8085,
        // proxy:{
        //     "/data": {
        //         target: "http://42.192.167.136:80",
        //         changeOrigin: true,
        //         pathRewrite: {
        //             "^/data": "/data/",
        //         },
        //     },
        // }
    }
}
module.exports = merge(webpackConfigBase, webpackConfigDev);