import { inserirLinkDocumento, removerLinkDocumento } from './index.js';
import { obterCookie } from './utils/cookies.js';

const socket = io('/usuarios', {
  auth: {
    token: obterCookie('tokenJwt'),
  },
});

//Caso o backend dispare um erro de conexão, irá disparar esse código
socket.on('connect_error', (erro) => {
  alert(erro);
  window.location.href = '/login/index.html';
});

socket.emit('obter_documentos', (documentos) => {
  documentos.forEach((documento) => {
    inserirLinkDocumento(documento.nome);
  });
});

function adicionarDocumento(nome) {
  socket.emit('adicionar_documento', nome);
}

socket.on('adicionar_documento_interface', (nome) => {
  inserirLinkDocumento(nome);
});

socket.on('documento_existente', (nome) => {
  alert(`O documento ${nome} já existe!`);
});

socket.on('excluir_documento_sucesso', (nome) => {
  removerLinkDocumento(nome);
});

export { adicionarDocumento };
