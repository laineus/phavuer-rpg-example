'use strict'

const webpack = require('webpack')
const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin')
const TileSetPlugin = require('./build/TileSetPlugin')
const AssetPlugin = require('./build/AssetPlugin')

const assetSettings = require('./build/assetSettings')

module.exports = (_env, argv) => ({
  entry: {
    app: './src/index.js',
    vendor: ['phaser']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/'),
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { targets: { node: 'current' } }]
          ]
        }
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 8080
  },
  plugins: [
    new WriteFilePlugin(),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(argv.mode),
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),
    new TileSetPlugin({ size: 32, input: './public/img/map/tilesets', output: './public/img/map/extruded_tilesets' }),
    new AssetPlugin(assetSettings),
    new webpack.ProvidePlugin({
      t: [path.resolve(__dirname, 'src/locales/t'), 'default']
    })
  ],
  externals: {},
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  performance: { hints: false }
})
