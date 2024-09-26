import { scryptSync, timingSafeEqual } from 'crypto';

function autenticarUsuario(senhaDigitada, registroUsuario) {
  const hashTeste = scryptSync(senhaDigitada, registroUsuario.salSenha, 64);
  const hashReal = Buffer.from(registroUsuario.hashSenha, 'hex');
  const autenticado = timingSafeEqual(hashTeste, hashReal);
  return autenticado;
}

export default autenticarUsuario;
