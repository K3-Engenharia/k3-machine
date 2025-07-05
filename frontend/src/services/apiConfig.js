// Configuração automática para ambiente local ou produção (Vercel)
let API_URL = 'http://localhost:4000';
if (typeof window !== 'undefined') {
  // Detecta se está rodando no Vercel (produção)
  if (window.location.hostname.endsWith('vercel.app')) {
    API_URL = 'https://k3-machine.onrender.com';
  }
}
// Só tente usar process.env se ele existir (evita erro no navegador)
if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
  API_URL = process.env.REACT_APP_API_URL;
}
export default API_URL;