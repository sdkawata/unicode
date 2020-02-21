const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/Index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          }
        ]
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
          }
        ]
      }
    ]
  }
};