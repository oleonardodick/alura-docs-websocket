import { definirCookie } from '../utils/cookies.js';

const socket = io();

function autenticarUsuario(dados) {
  socket.emit('autenticar_usuario', dados);
}

socket.on('autenticar_usuario_sucesso', (tokenJwt) => {
  definirCookie('tokenJwt', tokenJwt);
  alert('Usuário autenticado com sucesso!');
  window.location.href = '/';
});

socket.on('autenticar_usuario_erro', () => {
  alert('Erro na autenticação do usuário!');
});

socket.on('usuario_nao_encontrado', (usuario) => {
  alert(`Usuário ${usuario} não encontrado`);
});

export { autenticarUsuario };
