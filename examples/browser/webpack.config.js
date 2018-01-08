const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const path = require('path');

const development = process.env.NODE_ENV === 'development';

const MonacoEditorSrc = path.join(__dirname, '..', '..', 'src');

const monacoEditorPath = development ? 'node_modules/monaco-editor-core/dev/vs' : 'node_modules/monaco-editor-core/min/vs';
const monacoLanguagesPath = 'node_modules/monaco-languages/release';
const monacoCssLanguagePath = 'node_modules/monaco-css/release/min';
const monacoJsonLanguagePath = 'node_modules/monaco-json/release/min';
const monacoHtmlLanguagePath = 'node_modules/monaco-html/release/min';

const requirePath = 'node_modules/requirejs/require.js';
const outputPath = path.join(__dirname, './lib/t');

module.exports = {
  entry: './index.js',
  output: {
    path: outputPath,
    filename: 'index.js',
  },
  target: 'web',
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    crypto: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['file?name=[name].[ext]'],
      },
      {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.useable\.css$/,
        loader: 'style-loader/useable!css-loader'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /.(jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash].[ext]',
        }
      },
      {
        // see https://github.com/theia-ide/theia/issues/556
        test: /source-map-support/,
        loader: 'ignore-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'react-hot-loader/webpack' }, { loader: 'babel-loader' }]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      }
    ],
    noParse: /vscode-languageserver-types|vscode-uri|jsonc-parser/
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'react-monaco-editor': MonacoEditorSrc,
      'vs': path.resolve(outputPath, monacoEditorPath)
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.SourceMapDevToolPlugin({ exclude: /node_modules/ }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') },
    }),
    new CopyWebpackPlugin([
      {
        from: requirePath,
        to: '.'
      },
      {
        from: monacoEditorPath,
        to: 'vs'
      },
      {
        from: monacoLanguagesPath,
        to: 'vs/basic-languages'
      },
      {
        from: monacoCssLanguagePath,
        to: 'vs/language/css'
      },
      {
        from: monacoJsonLanguagePath,
        to: 'vs/language/json'
      },
      {
        from: monacoHtmlLanguagePath,
        to: 'vs/language/html'
      }
    ]),
    new CircularDependencyPlugin({
      exclude: /(node_modules|examples)\/./,
      failOnError: false // https://github.com/nodejs/readable-stream/issues/280#issuecomment-297076462
    })
  ],
  devServer: { contentBase: './' }
}
