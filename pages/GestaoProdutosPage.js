class GestaoProdutosPage {
  constructor(page) {
    this.page = page;
    
    this.inputNome = page.getByTestId('nome');
    this.inputPreco = page.getByTestId('preco');
    this.inputDescricao = page.getByTestId('descricao');
    this.inputQuantidade = page.getByTestId('quantity');
    
    this.btnCadastrar = page.getByTestId('cadastarProdutos'); 
  }

 async irParaCadastro() {
    await this.page.goto('https://front.serverest.dev/admin/cadastrarprodutos');
  }

  async preencherFormulario(nome, preco, descricao, quantidade) {
    await this.inputNome.fill(nome);
    await this.inputPreco.fill(preco.toString());
    await this.inputDescricao.fill(descricao);
    await this.inputQuantidade.fill(quantidade.toString());
  }

  async submeterCadastro() {
    await this.btnCadastrar.click();
  }
}

module.exports = { GestaoProdutosPage };