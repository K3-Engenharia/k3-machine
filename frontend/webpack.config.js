// K3-MACHINE/frontend/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
  // Use 'production' como fallback seguro se argv.mode não estiver disponível
  const isDevelopment = argv.mode === 'development';

  const envFilePath = isDevelopment ? '.env.development' : '.env.production';
  const finalEnvPath = path.resolve(__dirname, envFilePath);
  const genericEnvPath = path.resolve(__dirname, '.env');

  const parsedEnv = dotenv.config({ path: finalEnvPath }).parsed || dotenv.config({ path: genericEnvPath }).parsed || {};

  const environmentVariables = Object.keys(parsedEnv).reduce((acc, key) => {
    if (key.startsWith('REACT_APP_')) {
      acc[`process.env.${key}`] = JSON.stringify(parsedEnv[key]);
    }
    return acc;
  }, {
    // Garanta que NODE_ENV esteja SEMPRE definido para o browser
    'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
  });

  return {
    mode: argv.mode || 'production', // << Use 'production' como fallback aqui também
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: { // <<< ADICIONE ESTE BLOCO
        "process": require.resolve("process/browser")
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new webpack.DefinePlugin(environmentVariables),
      // <<< ADICIONE ESTE PLUGIN AQUI TAMBÉM
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      port: 3000,
      historyApiFallback: true,
      open: true,
    },
    // Remova o bloco 'node' se existir. No Webpack 5, 'node' tem um comportamento diferente.
    // Se você tinha algo como 'node: { fs: "empty" }', remova.
  };
};