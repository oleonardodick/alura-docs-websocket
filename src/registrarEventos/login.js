import { encontrarUsuario } from '../db/usuariosDb.js';
import autenticarUsuario from '../utils/autenticarUsuario.js';
import gerarJwt from '../utils/gerarJwt.js';

function registrarEventosLogin(socket, io) {
  socket.on('autenticar_usuario', async ({ usuario, senha }) => {
    const usuarioBuscado = await encontrarUsuario(usuario);
    if (usuarioBuscado) {
      const autenticado = autenticarUsuario(senha, usuarioBuscado);
      if (autenticado) {
        const tokenJwt = gerarJwt({ nomeUsuario: usuario });
        socket.emit('autenticar_usuario_sucesso', tokenJwt);
      } else {
        socket.emit('autenticar_usuario_erro');
      }
    } else {
      socket.emit('usuario_nao_encontrado', usuario);
    }
  });
}

export default registrarEventosLogin;
