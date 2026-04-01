const { test, expect, request } = require('@playwright/test');
const { ListagemProdutosPage } = require('../../pages/ListagemProdutosPage');
const { GestaoProdutosPage } = require('../../pages/GestaoProdutosPage');

test.describe('Suite 08: Listagem e Gestão de Produtos (Painel Admin)', () => {
  let listagemProdutosPage;
  let gestaoProdutosPage;

  test.beforeEach(async ({ page }) => {
    listagemProdutosPage = new ListagemProdutosPage(page);
    gestaoProdutosPage = new GestaoProdutosPage(page);

    const emailAdminLogado = `admin_list_prod_${Date.now()}@qa.com`;
    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Admin Lista Produtos',
        email: emailAdminLogado,
        password: '123',
        administrador: 'true'
      }
    });

    await page.goto('https://front.serverest.dev/login');
    await page.getByTestId('email').fill(emailAdminLogado); 
    await page.getByTestId('senha').fill('123'); 
    await page.getByTestId('entrar').click();
    await expect(page.getByRole('heading', { name: /Bem Vindo/i })).toBeVisible();
  });

  test('CT26 - Validar presença de produto recém-criado na listagem', async ({ page }) => {
    const nomeProdutoDin = `Produto Tabela ${Date.now()}`;

    await gestaoProdutosPage.irParaCadastro();
    await gestaoProdutosPage.preencherFormulario(nomeProdutoDin, 250, 'Validando tabela', 15);
    await gestaoProdutosPage.submeterCadastro();

    await listagemProdutosPage.irParaListagem();
    const linhaProduto = listagemProdutosPage.obterLinhaDoProduto(nomeProdutoDin);
    await expect(linhaProduto).toBeVisible();
  });

  test('CT27 - Excluir produto existente com sucesso da listagem', async ({ page }) => {
    const nomeProdutoDin = `Produto Exclusao ${Date.now()}`;

    await gestaoProdutosPage.irParaCadastro();
    await gestaoProdutosPage.preencherFormulario(nomeProdutoDin, 300, 'Alvo para deletar', 10);
    await gestaoProdutosPage.submeterCadastro();

    await listagemProdutosPage.irParaListagem();
    await listagemProdutosPage.excluirProduto(nomeProdutoDin);

    const linhaProduto = listagemProdutosPage.obterLinhaDoProduto(nomeProdutoDin);
    await expect(linhaProduto).not.toBeVisible();
  });
});