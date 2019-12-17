'use strict'

const { spawn } = require('child_process')

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  output: {
    path: `${__dirname}/static`,
    publicPath: `http://localhost:${port}/dist/`,
    filename: 'bundle.js'
  },

  mode: 'development',

  target: 'electron-renderer',

  entry: `${__dirname}/app/index.js`,

  node: {
    __dirname: false,
    __filename: false
  },

  devServer: {
    port,
    publicPath,
    contentBase: `${__dirname}/static`,
    before () {
      console.log('Starting Main Process...')
      spawn('npm', ['run', 'start:main'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', code => process.exit(code))
        .on('error', err => console.error(err))
    }
  }
}
