import {
  encontrarDocumento,
  atualizaDocumento,
  obterDocumentos,
  adicionarDocumento,
  excluirDocumento,
} from './documentosDb.js';
import io from './server.js';

io.on('connection', (socket) => {
  socket.on('obter_documentos', async (devolverDocumentos) => {
    const documentos = await obterDocumentos();
    devolverDocumentos(documentos);
  });

  socket.on('adicionar_documento', async (nomeDocumento) => {
    const documentoExiste = (await encontrarDocumento(nomeDocumento)) !== null;
    if (documentoExiste) {
      socket.emit('documento_existente', nomeDocumento);
    } else {
      const resultado = await adicionarDocumento(nomeDocumento);

      if (resultado.acknowledged) {
        io.emit('adicionar_documento_interface', nomeDocumento);
      }
    }
  });

  socket.on('selecionar_documento', async (nomeDocumento, devolverTexto) => {
    /*Adiciona o cliente em uma "sala" com o nome do documento aberto no front.
    Isso serve para agrupar as conexões, para que um grupo não envie as
    informações para o outro. */
    socket.join(nomeDocumento);

    const documento = await encontrarDocumento(nomeDocumento);
    if (documento) {
      /*Com essa abordagem, é necessário fazer um socket.on no front
        para receber esse evento e atualizar o texto
        socket.emit('texto_documento', documento.texto);*/

      /*Recebe uma função por parâmetro dentro do evento selecionar_documento.
      Com isso, o servidor pode chamar essa função e enviar o texto */
      devolverTexto(documento.texto);
    }
  });

  socket.on('texto_editor', async ({ texto, nomeDocumento }) => {
    const atualizacao = await atualizaDocumento(nomeDocumento, texto);
    if (atualizacao.modifiedCount) {
      /*Transmite o texto recebido no evento do front para todos os cliente.
        Utilizar o broadcast garante que o texto não seja enviado para o cliente
        que está escrevendo o texto.*/
      socket.broadcast.to(nomeDocumento).emit('texto_editor_clientes', texto);
    }
  });

  socket.on('excluir_documento', async (nomeDocumento) => {
    const resultado = await excluirDocumento(nomeDocumento);
    if (resultado.deletedCount) {
      io.emit('excluir_documento_sucesso', nomeDocumento);
    }
  });
});
