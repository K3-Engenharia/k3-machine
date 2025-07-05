// K3-MACHINE/frontend/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const dotenv = require('dotenv'); // <<< REMOVA ESTA LINHA

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  // Remova toda a lógica de dotenv.config()
  // As variáveis de ambiente do Vercel já estão em process.env durante o build.
  // Para desenvolvimento local, você ainda precisará do .env.development ou .env
  // O webpack-dev-server lida com isso em conjunto com o DefinePlugin.

  const environmentVariables = {
    'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL), // <<< MUDANÇA CRUCIAL AQUI
  };

  // Remova os console.log temporários que adicionamos para depuração.
  // console.log('Environment Variables para DefinePlugin:', environmentVariables);
  // console.log('process.env.REACT_APP_API_URL (no ambiente de build):', process.env.REACT_APP_API_URL);

  return {
    mode: argv.mode || 'production',
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
      fallback: {
        "process": require.resolve("process/browser")
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new webpack.DefinePlugin(environmentVariables),
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
  };
};