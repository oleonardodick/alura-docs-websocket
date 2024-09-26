import { cadastrarUsuario, encontrarUsuario } from '../db/usuariosDb.js';

function registrarEventosCadastro(socket, io) {
  socket.on('cadastrar_usuario', async (dados) => {
    const usuarioExiste = (await encontrarUsuario(dados.usuario)) !== null;

    if (usuarioExiste) {
      socket.emit('usuario_existente', dados.usuario);
    } else {
      const resultado = await cadastrarUsuario(dados);
      if (resultado.acknowledged) {
        socket.emit('cadastrar_usuario_sucesso');
      } else {
        socket.emit('cadastrar_usuario_erro');
      }
    }
  });
}

export default registrarEventosCadastro;
