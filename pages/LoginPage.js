exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByTestId('email');
    this.senhaInput = page.getByTestId('senha'); // Aqui o dev usou 'senha' em vez de 'password'
    this.entrarButton = page.getByTestId('entrar');
    this.cadastrarLink = page.getByTestId('cadastrar');
  }

  async goto() {
    await this.page.goto('https://front.serverest.dev/login', { waitUntil: 'domcontentloaded' });
  }

  async doLogin(email, senha) {
    if (email) await this.emailInput.fill(email);
    if (senha) await this.senhaInput.fill(senha);
    await this.entrarButton.click();
  }
};