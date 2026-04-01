class ListagemUsuariosPage {
  constructor(page) {
    this.page = page;

    this.btnMenuListarUsuarios = page.getByTestId('listarUsuarios');
    this.tituloListaUsuarios = page.getByRole('heading', { name: 'Lista dos usuários' });
  }

  async irParaListagem() {
    await this.btnMenuListarUsuarios.click();
    await this.tituloListaUsuarios.waitFor(); // Garante que a tela carregou
  }

  obterLinhaDoUsuario(email) {
    return this.page.locator('tr').filter({ hasText: email });
  }

  async excluirUsuario(email) {
    const linha = this.obterLinhaDoUsuario(email);
    await linha.getByRole('button', { name: 'Excluir' }).click();
  }
}

module.exports = { ListagemUsuariosPage };