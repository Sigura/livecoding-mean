var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  //devtool: 'eval',
  watch: true,
  debug: true,
  entry: {
    app: [
          'webpack-dev-server/client?http://localhost:3000',
          'webpack/hot/dev-server',
          './webapp/scripts/main.js',
          './webapp/styles/main.css'
        ]
  },
  output: {
    path: path.join(__dirname, 'dist', 'scripts'),
    filename: 'scripts/main.js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/vertx/)//, // https://github.com/webpack/webpack/issues/353
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin()//,
    //new webpack.optimize.AggressiveMergingPlugin()
  ],
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss']
  },
  module: {
    loaders: [
      {test: /.*\.json$/, loader: 'json'},
      {test: /.*\.md$/, loader: 'file'},
      {test: /\.less$/, loader: 'style!css!less'},
      {test: /\.styl$/, loader: 'style!css!stylus'},
      {test: /\.css$|\.scss/, loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' +
            (path.resolve(__dirname, './bower_components')) + '&' +
          'includePaths[]=' +
            (path.resolve(__dirname, './node_modules')) },
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'file'},
      //{test: /\.jsx|\.react\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel']},
      {
        test: /\.js$/,
        loader: 'ng-annotate!babel!eslint',
        exclude: /node_modules|bower_components/
      }
    ]
  }
};
