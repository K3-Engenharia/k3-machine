// src/services/apiConfig.js

// Escolha a linha correspondente ao seu framework
// Se for Create React App (CRA):
//const API_URL = process.env.REACT_APP_API_URL;

// Se for Next.js:
/const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Se for Vite:
// const API_URL = import.meta.env.VITE_APP_API_URL;

// Exporte o URL para ser usado em outras partes da aplicação
export { API_URL };

// --- OU ---

// Se você usa Axios e quer que a instância 'api' já venha com o baseURL configurado:
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL; // ou NEXT_PUBLIC_API_URL / VITE_APP_API_URL

// const api = axios.create({
//   baseURL: API_URL, // Use a nova variável aqui
//   headers: {
//     'Content-Type': 'application/json',
//     // Outros cabeçalhos padrão, como autorização, se necessário
//   },
// });

// export { api };