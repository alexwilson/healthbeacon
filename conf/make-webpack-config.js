var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var template = './app/index.html';
var port = 8123;

function extractForProduction(loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

module.exports = function(options) {
  options.lint = fs.existsSync(path.resolve(__dirname, '..', '.eslintrc')) && options.lint !== false;

  var localIdentName = options.production ? '[hash:base64]' : '[path]-[local]-[hash:base64:5]';
  var postCssString = '!postcss?browsers=last 2 versions';
  var cssLoaderConf = '?module&localIdentName='+localIdentName;
  var cssLoaders = 'style!css'+cssLoaderConf+postCssString;
  var scssLoaders = cssLoaders + '!sass';
  var sassLoaders = scssLoaders + '?indentedSyntax=sass';
  var lessLoaders = cssLoaders + '!less';

  if (options.production) {
    cssLoaders = extractForProduction(cssLoaders);
    sassLoaders = extractForProduction(sassLoaders);
    scssLoaders = extractForProduction(scssLoaders);
    lessLoaders = extractForProduction(lessLoaders);
  }

  return {
    entry: options.production ? './app/index.js' : [
      'webpack-dev-server/client?http://localhost:'+port,
      'webpack/hot/only-dev-server',
      './app/index.js',
    ],
    debug: !options.production,
    devtool: options.devtool,
    output: {
      path: options.production ? './dist' : './build',
      publicPath: options.production ? '' : 'http://localhost:'+port+'/',
      filename: options.production ? 'app.[hash].js' : 'app.js',
    },
    module: {
      preLoaders: options.lint ? [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint',
        },
      ] : [],
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
        {
          test: /\.css$/,
          loader: cssLoaders,
        },
        {
          test: /\.sass$/,
          loader: sassLoaders,
        },
        {
          test: /.scss-global$/, // Force global loaders.
          loader: scssLoaders.replace(cssLoaderConf, '?module=false'),
        },
        {
          test: /\.scss$/,
          loader: scssLoaders,
        },
        {
          test: /\.less$/,
          loader: lessLoaders,
        },
        {
          test: /\.png$/,
          loader: 'url?limit=100000&mimetype=image/png',
        },
        {
          test: /\.svg$/,
          loader: 'url?limit=100000&mimetype=image/svg+xml',
        },
        {
          test: /\.gif$/,
          loader: 'url?limit=100000&mimetype=image/gif',
        },
        {
          test: /\.jpg$/,
          loader: 'file',
        },
      ],
    },
    sassLoader: {
      includePaths: path.join(__dirname, '../', 'node_modules')
    },
    resolve: {
      extensions: ['', '.js', '.sass', '.scss-global', '.scss', '.less', '.css'],
      alias: {
        react: path.join(__dirname, '../', 'node_modules', 'react'),
      },
    },
    plugins: options.production ? [
      // Important to keep React file size down
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new ExtractTextPlugin('app.[hash].css'),
      new HtmlWebpackPlugin({
        template: template,
        production: true,
      }),
    ] : [
      new HtmlWebpackPlugin({
        template: template,
      }),
    ],
    postcss: [autoprefixer],
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    }
  };
};
