const socket = io();

function cadastrarUsuario(dados) {
  socket.emit('cadastrar_usuario', dados);
}

socket.on('cadastrar_usuario_sucesso', () => {
  alert('Cadastro realizado com sucesso!');
});

socket.on('cadastrar_usuario_erro', () => {
  alert('Erro no cadastro!');
});

socket.on('usuario_existente', (nome) => {
  alert(`Usuário ${nome} já existe!`);
});

export { cadastrarUsuario };
