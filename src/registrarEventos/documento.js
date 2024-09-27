import {
  encontrarDocumento,
  atualizaDocumento,
  excluirDocumento,
} from '../db/documentosDb.js';
import {
  adicionarConexao,
  encontrarConexao,
  obterUsuariosDocumento,
  removerConexao,
} from '../utils/conexoesDocumentos.js';

function registrarEventosDocumento(socket, io) {
  socket.on(
    'selecionar_documento',
    async ({ nomeDocumento, nomeUsuario }, devolverTexto) => {
      const documento = await encontrarDocumento(nomeDocumento);
      if (documento) {
        const conexaoEncontrada = encontrarConexao(nomeDocumento, nomeUsuario);

        if (!conexaoEncontrada) {
          /*Adiciona o cliente em uma "sala" com o nome do documento aberto no front.
        Isso serve para agrupar as conexões, para que um grupo não envie as
        informações para o outro. */
          socket.join(nomeDocumento);

          adicionarConexao({ nomeDocumento, nomeUsuario });
          socket.data = {
            usuarioEntrou: true,
          };
          emiteUsuariosNoDocumento(nomeDocumento, io);

          /*Recebe uma função por parâmetro dentro do evento selecionar_documento.
          Com isso, o servidor pode chamar essa função e enviar o texto */
          devolverTexto(documento.texto);
        } else {
          socket.emit('usuario_ja_no_documento');
        }
      }

      socket.on('texto_editor', async ({ texto, nomeDocumento }) => {
        const atualizacao = await atualizaDocumento(nomeDocumento, texto);
        if (atualizacao.modifiedCount) {
          /*Transmite o texto recebido no evento do front para todos os cliente.
                Utilizar o broadcast garante que o texto não seja enviado para o cliente
                que está escrevendo o texto.*/
          socket.broadcast
            .to(nomeDocumento)
            .emit('texto_editor_clientes', texto);
        }
      });

      socket.on('excluir_documento', async (nomeDocumento) => {
        const resultado = await excluirDocumento(nomeDocumento);
        if (resultado.deletedCount) {
          io.emit('excluir_documento_sucesso', nomeDocumento);
        }
      });

      /*Cada página possui o seu socket. Ao sair da página, esse socket emite um
      evento de disconnect que pode ser utilizado para realizar tratamentos de
      desconexão. Como os sockets estão por namespace, foi necessário colocar
      a emissão dentro desse evento dentro do evento de selecionar_documento,
      com isso é garantido que somente será emitido esse evento ao sair do
      documento.*/
      socket.on('disconnect', () => {
        if (socket.data.usuarioEntrou) {
          removerConexao(nomeDocumento, nomeUsuario);
          emiteUsuariosNoDocumento(nomeDocumento, io);
        }
      });
    }
  );
}

function emiteUsuariosNoDocumento(nomeDocumento, io) {
  const usuariosNoDocumento = obterUsuariosDocumento(nomeDocumento);
  //envia para todos, inclusive para o usuário que está conectado no socket
  io.to(nomeDocumento).emit('usuarios_no_documento', usuariosNoDocumento);
}

export default registrarEventosDocumento;
