// K3-MACHINE/frontend/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // <<< Importe o webpack
const dotenv = require('dotenv');   // <<< Importe o dotenv

module.exports = (env, argv) => { // <<< Passe `env` e `argv` para o módulo.exports
  const isDevelopment = argv.mode === 'development'; // Checa se está em modo de desenvolvimento ou produção

  // Carrega as variáveis de ambiente do .env
  // Para desenvolvimento local, ele vai procurar por .env.development ou .env
  // Para produção/build, ele vai procurar por .env.production ou .env
  // A Vercel vai INJETAR suas variáveis configuradas no painel, então
  // para o build da Vercel, o dotenv.config() aqui é menos crítico,
  // mas é essencial para o desenvolvimento local.
  const envFilePath = isDevelopment ? '.env.development' : '.env.production';
  const finalEnvPath = path.resolve(__dirname, envFilePath); // Caminho para o .env específico
  const genericEnvPath = path.resolve(__dirname, '.env'); // Caminho para o .env genérico

  // Tenta carregar o .env específico do ambiente, senão, carrega o .env genérico
  const parsedEnv = dotenv.config({ path: finalEnvPath }).parsed || dotenv.config({ path: genericEnvPath }).parsed || {};

  // Formata as variáveis de ambiente para o DefinePlugin
  // Apenas as variáveis que começam com REACT_APP_ serão expostas ao frontend
  const environmentVariables = Object.keys(parsedEnv).reduce((acc, key) => {
    if (key.startsWith('REACT_APP_')) {
      acc[`process.env.${key}`] = JSON.stringify(parsedEnv[key]);
    }
    return acc;
  }, {
    // Também é uma boa prática injetar NODE_ENV
    'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
  });

  return {
    mode: argv.mode, // Use o modo passado pela linha de comando (development/production)
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js', // Para facilitar debug em dev
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
        // Adicione regras para CSS se tiver arquivos CSS
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      // --- ESTE É O PLUGIN CRUCIAL PARA INJETAR process.env ---
      new webpack.DefinePlugin(environmentVariables), // <<< Aplique o DefinePlugin aqui
      // --- FIM DO PLUGIN ---
    ],
    resolve: {
      extensions: ['.js', '.jsx'], // Adicione .jsx se você usa
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'), // Aponte para a pasta public para servir estáticos
      },
      port: 3000,
      historyApiFallback: true,
      open: true, // Abre o navegador automaticamente
    },
  };
};