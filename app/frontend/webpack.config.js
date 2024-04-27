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
      "process.env": JSON.stringify("production"),
      "process.env.VAULT_ADDR": JSON.stringify(process.env.VAULT_ADDR),
      "process.env.VAULT_ROLE_ID": JSON.stringify(process.env.VAULT_ROLE_PATH),
      "process.env.VAULT_SECRET_ID": JSON.stringify(process.env.VAULT_SECRET_PATH)
    }),
    new NodePolyfillPlugin()
  ],
  devtool: 'inline-source-map',
  resolve: {
    fallback: {
      "fs": require.resolve("browserify-fs"),
      "tls": false,
      "net": false
    }
  }
};
