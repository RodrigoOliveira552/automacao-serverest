class GestaoUsuariosPage {
  constructor(page) {
    this.page = page;

    this.btnMenuCadastrarUsuarios = page.getByTestId('cadastrarUsuarios');
    this.tituloListaUsuarios = page.getByRole('heading', { name: 'Lista dos usuários' });

    this.inputNome = page.getByTestId('nome');
    this.inputEmail = page.getByTestId('email');
    this.inputSenha = page.getByTestId('password');
    this.checkboxAdmin = page.getByTestId('checkbox');
    this.btnCadastrar = page.getByTestId('cadastrarUsuario'); 
  }

  async irParaCadastroDeUsuarios() {
    await this.btnMenuCadastrarUsuarios.click();
  }

  async preencherFormulario(nome, email, senha, isAdmin = false) {
    await this.inputNome.fill(nome);
    await this.inputEmail.fill(email);
    await this.inputSenha.fill(senha);
    
    if (isAdmin) {
      const isChecked = await this.checkboxAdmin.isChecked();
      if (!isChecked) await this.checkboxAdmin.check();
    }
  }

  async submeterCadastro() {
    await this.btnCadastrar.click();
  }
}

module.exports = { GestaoUsuariosPage };