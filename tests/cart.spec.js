const { test, expect, request } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { CartPage } = require('../pages/CartPage'); // Importamos a nova página

test.describe('Suite 03: Produtos e Carrinho de Compras', () => {
  let homePage;
  let cartPage;
  let tokenDeAcesso;
  let usuarioComprador;

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    usuarioComprador = {
      nome: 'Rodrigo Comprador',
      email: `comprador_${Date.now()}@qa.com`,
      password: 'senha_segura',
      administrador: 'false'
    };

    await apiContext.post('https://serverest.dev/usuarios', { data: usuarioComprador });
    const respostaLogin = await apiContext.post('https://serverest.dev/login', {
      data: { email: usuarioComprador.email, password: usuarioComprador.password }
    });
    const corpoResposta = await respostaLogin.json();
    tokenDeAcesso = corpoResposta.authorization;
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page); // Instanciamos o CartPage
    
    await page.goto('https://front.serverest.dev/');
    await page.evaluate((token) => {
      localStorage.setItem('serverest/userToken', token);
    }, tokenDeAcesso);

    await homePage.irParaHome();
  });

  test('CT12 - Adicionar Produto à Lista com Sucesso', async ({ page }) => {
    await homePage.adicionarPrimeiroProduto();
    await expect(page).toHaveURL(/.*minhaListaDeProdutos/);
    await expect(cartPage.tituloCart).toContainText('Lista de Compras');
  });

  test('CT14 - Incrementar (+) quantidade de um item no carrinho', async () => {
    await homePage.adicionarPrimeiroProduto();
    
    await expect(cartPage.quantidadeItem).toHaveText('1');
    
    await cartPage.incrementarProduto();
    
    await expect(cartPage.quantidadeItem).toHaveText('2');
  });

  test('CT15 - Decrementar (-) quantidade de um item no carrinho', async () => {
    await homePage.adicionarPrimeiroProduto();
    
    await cartPage.incrementarProduto();
    await expect(cartPage.quantidadeItem).toHaveText('2');
    
    await cartPage.decrementarProduto();
    
    await expect(cartPage.quantidadeItem).toHaveText('1');
  });

  test('CT16 - Limpar a Lista de Compras', async ({ page }) => {
    await homePage.adicionarPrimeiroProduto();
    await cartPage.limparLista();
    
    const mensagemVazia = page.locator('p[data-testid="shopping-cart-empty-message"]');
    await expect(mensagemVazia).toBeVisible();
  });
});