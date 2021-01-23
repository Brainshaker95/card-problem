const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (_, args) => {
  const productionMode = args.p;
  const hotReload = args.serve ? /dist/ : '';
  const preprocessedPlugins = [];
  const preprocessedRules = [];

  return {
    mode: productionMode ? 'production' : 'development',
    entry: './src/js/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js',
      publicPath: 'dist',
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'index.html',
      }),
      new HtmlWebpackStringReplacePlugin({
        '/dist/': hotReload,
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      ...preprocessedPlugins,
    ],
    module: {
      rules: [{
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader', 'sass-loader'],
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: productionMode,
          },
        }],
      },
      ...preprocessedRules],
    },
  };
};
