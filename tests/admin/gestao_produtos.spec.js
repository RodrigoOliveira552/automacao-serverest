const { test, expect, request } = require('@playwright/test');
const { GestaoProdutosPage } = require('../../pages/GestaoProdutosPage');

test.describe('Suite 07: Cadastro de Produtos (Painel Admin)', () => {
  let gestaoProdutosPage;

  test.beforeEach(async ({ page }) => {
    gestaoProdutosPage = new GestaoProdutosPage(page);

    const emailAdminLogado = `admin_produtos_${Date.now()}@qa.com`;
    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Admin Produtos',
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
    await gestaoProdutosPage.irParaCadastro();
  });

  test('CT23 - Cadastrar novo produto com sucesso', async ({ page }) => {
    const nomeProduto = `Produto QA ${Date.now()}`;

    await gestaoProdutosPage.preencherFormulario(nomeProduto, 150, 'Produto criado via Automação', 50);
    await gestaoProdutosPage.submeterCadastro();

    await expect(page.getByRole('heading', { name: 'Lista dos Produtos' })).toBeVisible();
    await expect(page).toHaveURL(/.*admin\/listarprodutos/);
  });

  test('CT24 - Validar mensagens de erro ao tentar cadastrar produto com campos vazios', async ({ page }) => {
    await gestaoProdutosPage.submeterCadastro();

    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Preco é obrigatório')).toBeVisible();
    await expect(page.getByText('Descricao é obrigatório')).toBeVisible();
    await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
  });

  test('CT25 - Validar erro ao cadastrar produto com nome já existente', async ({ page }) => {
    const nomeDuplicado = `Produto Duplicado ${Date.now()}`;

    await gestaoProdutosPage.preencherFormulario(nomeDuplicado, 100, 'Desc', 10);
    await gestaoProdutosPage.submeterCadastro();
    await expect(page.getByRole('heading', { name: 'Lista dos Produtos' })).toBeVisible();

    await gestaoProdutosPage.irParaCadastro();
    await gestaoProdutosPage.preencherFormulario(nomeDuplicado, 200, 'Nova Desc', 20);
    await gestaoProdutosPage.submeterCadastro();

    await expect(page.locator('div.alert > span')).toHaveText('Já existe produto com esse nome');
  });
});