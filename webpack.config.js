module.exports = {
  devtool: 'source-map',
  target: 'node',
  entry: ['./src'],
  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js',
    library: 'redux-saga-resources',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'babel!ts' }
    ]
  },
  externals: [
    require('webpack-node-externals')()
  ],
  resolve: {
    extensions: ['', '.webpack.js', '.js', '.ts']
  }
};