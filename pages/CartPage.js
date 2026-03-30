exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.botaoDecrementar = page.getByTestId('product-decrease-quantity');
    this.botaoIncrementar = page.getByTestId('product-increase-quantity');
    
    this.quantidadeItem = page.locator('[data-testid="product-decrease-quantity"] + div, [data-testid="product-decrease-quantity"] + span');
    
    this.tituloCart = page.locator('h1');
    this.botaoLimparLista = page.getByTestId('limparLista');
  }

  async incrementarProduto() {
    await this.botaoIncrementar.click();
  }

  async decrementarProduto() {
    await this.botaoDecrementar.click();
  }

  async limparLista() {
    await this.botaoLimparLista.click();
  }
};