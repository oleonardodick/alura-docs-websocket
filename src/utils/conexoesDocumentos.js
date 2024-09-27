const conexoesDocumento = [];

function encontrarConexao(nomeDocumento, nomeUsuario) {
  return conexoesDocumento.find((conexao) => {
    return (
      conexao.nomeDocumento === nomeDocumento &&
      conexao.nomeUsuario === nomeUsuario
    );
  });
}

function adicionarConexao(conexao) {
  conexoesDocumento.push(conexao);
}

function obterUsuariosDocumento(nomeDocumento) {
  return conexoesDocumento
    .filter((conexao) => conexao.nomeDocumento === nomeDocumento)
    .map((conexao) => conexao.nomeUsuario);
}

function removerConexao(nomeDocumento, nomeUsuario) {
  const indice = conexoesDocumento.findIndex((conexao) => {
    return (
      conexao.nomeDocumento === nomeDocumento &&
      conexao.nomeUsuario === nomeUsuario
    );
  });
  if (indice !== -1) {
    conexoesDocumento.splice(indice, 1);
  }
}

export {
  encontrarConexao,
  adicionarConexao,
  obterUsuariosDocumento,
  removerConexao,
};
