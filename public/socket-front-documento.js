import { alertarERedirecionar, atualizaTextoEditor } from './documento.js';

const socket = io();

function selecionarDocumento(nome) {
  /*Ao emitir o evento, além de mandar o nome do documento também
  é mandada a função que faz a atualização do texto. Com isso não
  é necessário criar um socket.on para receber a resposta do servidor,
  como no código comentado mais abaixo */
  socket.emit('selecionar_documento', nome, (texto) => {
    atualizaTextoEditor(texto);
  });
}

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
