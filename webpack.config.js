/*
* @Author: Moltemort
* @Date:   2018-10-14 09:46:24
* @Last Modified by:   Moltemort
* @Last Modified time: 2018-10-14 10:36:10
*/

var webpack           = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

//环境变量的配置 dev/online
var WEBPACK_ENV       = process.env.WEBPACK_ENV || "dev"; //process是nodejs的对象
console.log(WEBPACK_ENV);


//获取html-webpack-plugin的方法，用于处理多个页面模板
var getHtmlConfig = function(folderName) {
    return {
        template: "./src/view/" + folderName + ".html",
        filename: "view/" + folderName + ".html",
        inject  : true,
        hash    : true,
        chunks  : ["common", folderName]
    };
};

// webpack config
 var config = {
    entry: {
        common: ["./src/page/common/index.js"],
        index: ["./src/page/index/index.js"],
    },
    output: {
        path: "./dist", //所有webpack输出文件都是基于这个path
        publicPath: "/dist",
        filename: "js/[name].js"
    },
    node: {
     fs: "empty"
    },
    externals: {
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(gif|png|jpg|woff|svg|ttf|eot)\??.*$/, loader: "url-loader?limit=100&name=/resourse/[name].[ext]"}
        ]
    },  
    resolve: {
        alias: {
            node_modules: __dirname + '/node_modules',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            image: __dirname + '/src/image/'
        }
    },
    plugins: [
        //CommonChunkPlugin插件功能：独立通用模块即common入口文件common打包到到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: "common", //name属性与入口文件中公共模块的名称一致
            filename: "js/base.js"//因为已经配置了path,所以filename都是基于path输出
        }),
        //把css单独打包
        new ExtractTextPlugin("css/[name].css"),
        //html模板处理
        new HtmlWebpackPlugin(getHtmlConfig("index"))
    ]
 };

 if ("dev" === WEBPACK_ENV) {
    config.entry.common.push("webpack-dev-server/client?localhost:8099/");
 }


 module.exports = config;