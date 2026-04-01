class SignUpPage {
  constructor(page) {
    this.page = page;
    
    // 🎯 Mapeamento de Elementos (Locators)
    this.inputNome = page.getByTestId('nome');
    this.inputEmail = page.getByTestId('email');
    this.inputSenha = page.getByTestId('password');
    this.checkboxAdmin = page.getByTestId('checkbox'); 
    this.btnCadastrar = page.getByTestId('cadastrar');
    this.linkLogin = page.getByTestId('entrar'); 
  }

  async preencherNome(nome) {
    await this.inputNome.fill(nome);
  }

  async preencherEmail(email) {
    await this.inputEmail.fill(email);
  }

  async preencherSenha(senha) {
    await this.inputSenha.fill(senha);
  }

  async marcarComoAdministrador() {
    const isChecked = await this.checkboxAdmin.isChecked();
    if (!isChecked) {
      await this.checkboxAdmin.check();
    }
  }

  async submitForm() {
    await this.btnCadastrar.click();
  }

  async clicarLinkLogin() {
    await this.linkLogin.click();
  }
}

module.exports = { SignUpPage };