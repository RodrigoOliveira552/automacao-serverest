const { test, expect, request } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Módulo 02: Autenticação (Login)', () => {
  let loginPage;
  let usuarioValido;

  // O PULO DO GATO: Preparamos a massa de dados via API antes de tudo
  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    usuarioValido = {
      nome: 'Rodrigo QA',
      email: `rodrigo_qa_${Date.now()}@teste.com`,
      password: 'senha_segura',
      administrador: 'true'
    };

    // Criando o usuário silenciosamente pela API
    await apiContext.post('https://serverest.dev/usuarios', {
      data: usuarioValido
    });
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('CT07/08 - Login com Sucesso (Usando massa da API)', async ({ page }) => {
    // Usamos o usuário que a API criou para nós no beforeAll
    await loginPage.doLogin(usuarioValido.email, usuarioValido.password);

    // Valida se entrou no sistema
    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('h1')).toBeVisible(); // Confirma que a página carregou
  });

  test('CT09 - Validar Credenciais Inválidas', async ({ page }) => {
    await loginPage.doLogin('hacker@email.com', 'senhaerrada123');

    // Valida a mensagem de erro genérica (Regra de Segurança)
    const alertErro = page.locator('div.alert');
    await expect(alertErro).toBeVisible();
    await expect(alertErro).toContainText('Email e/ou senha inválidos');
  });

  test('CT10 - Validar Campos Obrigatórios no Login', async ({ page }) => {
    // Tenta logar vazio
    await loginPage.doLogin('', '');

    // Captura os alertas de obrigatoriedade
    const alertas = page.locator('div.alert > span');
    await expect(alertas.nth(0)).toContainText('Email é obrigatório');
    await expect(alertas.nth(1)).toContainText('Password é obrigatório');
  });

  test('CT11 - Navegação: Ir para a Tela de Cadastro', async ({ page }) => {
    await loginPage.cadastrarLink.click();
    await expect(page).toHaveURL('https://front.serverest.dev/cadastrarusuarios');
  });
});