exports.SignUpPage = class SignUpPage {
  constructor(page) {
    this.page = page;

    // Seletores blindados usando os atributos data-testid do ServeRest
    this.nomeInput = page.getByTestId('nome');
    this.emailInput = page.getByTestId('email');
    this.senhaInput = page.getByTestId('password');
    this.adminCheckbox = page.getByTestId('checkbox');
    this.cadastrarButton = page.getByTestId('cadastrar');
    
    // Navegação
    this.entrarLink = page.getByTestId('entrar');
  }

  async goto() {
    await this.page.goto('https://front.serverest.dev/cadastrarusuarios', { waitUntil: 'domcontentloaded' });
  }

  async fillForm(nome, email, senha, isAdmin = false) {
    // Usamos fill() para injeção ultrarrápida no DOM
    if (nome) await this.nomeInput.fill(nome);
    if (email) await this.emailInput.fill(email);
    if (senha) await this.senhaInput.fill(senha);
    
    if (isAdmin) {
      await this.adminCheckbox.check();
    }
  }

  async submitForm() {
    await this.cadastrarButton.click();
  }
};