const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify("production")
    }),
    new NodePolyfillPlugin()
  ],
  devtool: 'inline-source-map',
  resolve: {
    fallback: {
      "fs": require.resolve("browserify-fs"),
      "tls": require.resolve("tls-browserify"),
      "net": require.resolve("net-browserify")
    }
  }
};
