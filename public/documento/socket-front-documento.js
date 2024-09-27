import { obterCookie } from '../utils/cookies.js';
import {
  alertarERedirecionar,
  atualizarInterfaceUsuarios,
  atualizaTextoEditor,
  tratarAutorizacaoSucesso,
} from './documento.js';

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

socket.on('autorizacao_sucesso', tratarAutorizacaoSucesso);

function selecionarDocumento(dadosEntrada) {
  /*Ao emitir o evento, além de mandar o nome do documento também
  é mandada a função que faz a atualização do texto. Com isso não
  é necessário criar um socket.on para receber a resposta do servidor,
  como no código comentado mais abaixo */
  socket.emit('selecionar_documento', dadosEntrada, (texto) => {
    atualizaTextoEditor(texto);
  });
}

socket.on('usuario_ja_no_documento', () => {
  alert('Documento já aberto em outra página');
  window.location.href = '/';
});

socket.on('usuarios_no_documento', atualizarInterfaceUsuarios);

function emitirTextoEditor(dados) {
  socket.emit('texto_editor', dados);
}

// socket.on('texto_documento', (texto) => {
//   atualizaTextoEditor(texto);
// });

socket.on('texto_editor_clientes', (texto) => {
  atualizaTextoEditor(texto);
});

function excluirDocumento(nome) {
  socket.emit('excluir_documento', nome);
}

socket.on('excluir_documento_sucesso', (nome) => {
  alertarERedirecionar(nome);
});

export { emitirTextoEditor, selecionarDocumento, excluirDocumento };
