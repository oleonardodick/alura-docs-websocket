import 'dotenv/config';
import io from './server.js';
import registrarEventosInicio from './registrarEventos/inicio.js';
import registrarEventosDocumento from './registrarEventos/documento.js';
import registrarEventosCadastro from './registrarEventos/cadastro.js';
import registrarEventosLogin from './registrarEventos/login.js';

io.on('connection', (socket) => {
  registrarEventosInicio(socket, io);
  registrarEventosDocumento(socket, io);
  registrarEventosCadastro(socket, io);
  registrarEventosLogin(socket, io);
});
