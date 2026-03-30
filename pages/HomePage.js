exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;

    this.botoesAdicionarProduto = page.getByTestId('adicionarNaLista');
    
    this.botaoCarrinho = page.getByTestId('carrinho');
  }

  async irParaHome() {
    await this.page.goto('https://front.serverest.dev/home', { waitUntil: 'domcontentloaded' });
  }

  async adicionarPrimeiroProduto() {
    await this.botoesAdicionarProduto.first().click();
  }

  async acessarCarrinho() {
    await this.botaoCarrinho.click();
  }
};