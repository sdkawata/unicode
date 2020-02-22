const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/Index.tsx',
    worker: './src/worker.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader"},
        ]
      },
    ]
  }
};