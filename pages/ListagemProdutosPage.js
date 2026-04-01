class ListagemProdutosPage {
  constructor(page) {
    this.page = page;
  }

  async irParaListagem() {
    await this.page.goto('https://front.serverest.dev/admin/listarprodutos');
    await this.page.getByRole('heading', { name: 'Lista dos Produtos' }).waitFor();
  }

  obterLinhaDoProduto(nomeProduto) {
    return this.page.locator('tr').filter({ hasText: nomeProduto });
  }

  async excluirProduto(nomeProduto) {
    const linha = this.obterLinhaDoProduto(nomeProduto);
    await linha.getByRole('button', { name: 'Excluir' }).click();
  }
}

module.exports = { ListagemProdutosPage };