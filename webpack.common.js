const path = require('path');
const babelrc = JSON.parse(require('fs').readFileSync('.babelrc').toString());
const pkg = require('./package.json');
const version = require('fs').readFileSync(path.resolve(`${__dirname}/deployer/VERSION`)).toString();
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IconfontPlugin = require('iconfont-plugin-webpack');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CopyFilePlugin = require('./CopyFilePlugin.js');

module.exports = {
  entry: [pkg.main, './app/styles/main.scss'],
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[hash].js', chunkFilename: '[name].bundle.[chunkhash].js', publicPath: '/' },
  stats: { colors: true },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        query: babelrc
      },
      {
        test: /pdf\.worker(\.min)?\.js$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff2?$|\.woff?$|\.ttf$|\.eot$|\.otf$/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules(?!(\/|\\)pdfjs-dist)/,
        loader: 'babel-loader',
        options: {
            'presets': ['@babel/preset-env'],
            'plugins': ['@babel/plugin-proposal-optional-chaining']
        }
      },
      {
        test: /\.(png|jpg|gif|svg|cur)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.coffee$/,
        use: ['coffee-loader']
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            minimize: {
              minifyFontValues: false
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(`${__dirname}/app/index.html`),
      filename: 'index.html',
      favicon: path.resolve(`${__dirname}/app/assets/favicon-32x32.png`),
      inject: true
    }),
    new webpack.ProvidePlugin({
      Config: path.resolve(`${__dirname}/app/config.json`),
      OpenSeadragon: 'openseadragon',
      PropTypes: 'prop-types',
    }),
    new webpack.EnvironmentPlugin({
      OASIS_ENV: process.env.OASIS_ENV || 'cc-api.dev', // use 'development' unless process.env.OASIS_ENV is defined
      OASIS_ADMIN : process.env.OASIS_ADMIN || 'cc-adminportal.dev',
      OASIS_AUTH : process.env.OASIS_AUTH || 'cc-auth.dev',
      PREVIEW : process.env.PREVIEW || 'false',
      VERSION: version
    }),
    new IconfontPlugin({
      src: './app/assets/src-svg',
      family: 'svg-icons',
      dest: {
          font: './app/assets/fonts/[family].[type]',
          css: './app/styles/_font_[family].scss'
      },
      watch: {
          pattern: './app/assets/src-svg/**/*.svg',
      },
  }),
    new MomentLocalesPlugin(),    

    // This is a custom plugin created to copy files during build, it does not accept parameters.
    // Instead it internally contains the files to be copied.
    // If you need to copy file(s) define them inside this plugin.
    new CopyFilePlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.html', '.css', '.scss']
  },
  externals: {
    fs: '{}',
    tls: '{}',
    net: '{}',
    console: '{}'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        shared: {
          test: /auth0-js|oasis-client-lib/,
          name: 'shared',
          enforce: true,
          chunks: 'initial'
        },
        utils: {
          test: /app[\\/]scripts[\\/](utils|geometry|infrastructure|Entities|dataAccess|auth)/,
          name: 'utils',
          enforce: true,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        react: {
          test: /react/,
          name: 'react',
          enforce: true,
          chunks: 'initial'
        },
        pdf: {
          test: /jspdf|pdfjs/,
          name: 'pdf',
          enforce: true,
          chunks: 'initial'
        },
        vendors: {
          test: /node_modules[\\/](?!jspdf|pdfjs|react|oasis-client-lib|auth0-js|tiff.js)/,
          name: 'vendors',
          enforce: true
        }
      }
    }
  }
};
