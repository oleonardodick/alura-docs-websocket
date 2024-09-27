import 'dotenv/config';
import registrarEventosInicio from './registrarEventos/inicio.js';
import registrarEventosDocumento from './registrarEventos/documento.js';
import registrarEventosCadastro from './registrarEventos/cadastro.js';
import registrarEventosLogin from './registrarEventos/login.js';
import io from './server.js';
import autorizarUsuario from './middlewares/autorizarUsuario.js';

const nspUsuarios = io.of('/usuarios');
/*registrando um middleware para bloquear o uso caso o usuário não
esteja conectado.*/
nspUsuarios.use(autorizarUsuario);

/*O of serve para definir um namespace. Quando não utilizado, o socket se 
conectará no principal, ou seja, no '/'.*/
nspUsuarios.on('connection', (socket) => {
  registrarEventosInicio(socket, nspUsuarios);
  registrarEventosDocumento(socket, nspUsuarios);
});

io.on('connection', (socket) => {
  registrarEventosCadastro(socket, io);
  registrarEventosLogin(socket, io);
});
