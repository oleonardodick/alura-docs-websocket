import io from './server.js';

const documentos = [
  {
    nome: 'JavaScript',
    texto: 'texto de javascript...',
  },
  {
    nome: 'Node',
    texto: 'texto de node...',
  },
  {
    nome: 'Socket.io',
    texto: 'texto de socket.io...',
  },
];

io.on('connection', (socket) => {
  console.log('Um cliente se conectou! ID:', socket.id);

  socket.on('selecionar_documento', (nomeDocumento, devolverTexto) => {
    /*Adiciona o cliente em uma "sala" com o nome do documento aberto no front.
    Isso serve para agrupar as conexões, para que um grupo não envie as
    informações para o outro. */
    socket.join(nomeDocumento);

    const documento = encontrarDocumento(nomeDocumento);
    if (documento) {
      /*Com essa abordagem, é necessário fazer um socket.on no front
        para receber esse evento e atualizar o texto
        socket.emit('texto_documento', documento.texto);*/

      /*Recebe uma função por parâmetro dentro do evento selecionar_documento.
      Com isso, o servidor pode chamar essa função e enviar o texto */
      devolverTexto(documento.texto);
    }
  });

  socket.on('texto_editor', ({ texto, nomeDocumento }) => {
    const documento = encontrarDocumento(nomeDocumento);
    if (documento) {
      documento.texto = texto;
      /*Transmite o texto recebido no evento do front para todos os cliente.
        Utilizar o broadcast garante que o texto não seja enviado para o cliente
        que está escrevendo o texto.*/
      socket.broadcast.to(nomeDocumento).emit('texto_editor_clientes', texto);
    }
  });
});

function encontrarDocumento(nome) {
  const documento = documentos.find((documento) => {
    return documento.nome === nome;
  });

  return documento;
}
