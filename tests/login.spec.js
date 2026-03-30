const { test, expect, request } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Suite 02: Autenticação (Login)', () => {
  let loginPage;
  let adminValido;
  let userValido;

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    
    adminValido = {
      nome: 'Rodrigo Admin',
      email: `admin_${Date.now()}@teste.com`,
      password: 'senha_segura',
      administrador: 'true' // Flag de Admin
    };

    userValido = {
      nome: 'Rodrigo User',
      email: `user_${Date.now()}@teste.com`,
      password: 'senha_segura',
      administrador: 'false'
    };

    await apiContext.post('https://serverest.dev/usuarios', { data: adminValido });
    await apiContext.post('https://serverest.dev/usuarios', { data: userValido });
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('CT07 - Login de Administrador com Sucesso', async ({ page }) => {
    await loginPage.doLogin(adminValido.email, adminValido.password);

    await expect(page).toHaveURL(/.*admin\/home/);
    await expect(page.locator('h1')).toContainText('Bem Vindo');
  });

  test('CT08 - Login de Usuário Comum com Sucesso', async ({ page }) => {
    await loginPage.doLogin(userValido.email, userValido.password);

    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('h1')).toContainText('Serverest Store');
  });

  test('CT09 - Validar Credenciais Inválidas', async ({ page }) => {
    await loginPage.doLogin('hacker@email.com', 'senhaerrada123');
    const alertErro = page.locator('div.alert');
    await expect(alertErro).toBeVisible();
    await expect(alertErro).toContainText('Email e/ou senha inválidos');
  });

  test('CT10 - Validar Campos Obrigatórios no Login', async ({ page }) => {
    await loginPage.doLogin('', '');
    const alertas = page.locator('div.alert > span');
    await expect(alertas.nth(0)).toContainText('Email é obrigatório');
    await expect(alertas.nth(1)).toContainText('Password é obrigatório');
  });

  test('CT11 - Navegação: Ir para a Tela de Cadastro', async ({ page }) => {
    await loginPage.cadastrarLink.click();
    await expect(page).toHaveURL('https://front.serverest.dev/cadastrarusuarios');
  });
});