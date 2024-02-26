const { merge } = require("webpack-merge");
const path = require("path");

const config = require("./webpack.config");
const { ModuleFilenameHelpers } = require("webpack");

module.exports = merge(config, {
  mode: "development",

  devtool: "inline-source-map",

  //devServer property - writeToDisk now requires middleware to work
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },

  output: {
    path: path.resolve(__dirname, "public"),
  },
});
