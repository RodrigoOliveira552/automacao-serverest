const { test, expect } = require('@playwright/test');
const { SignUpPage } = require('../pages/SignUpPage');

test.describe('Módulo 01: Cadastro de Usuários (Sign Up)', () => {
  let signUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto();
  });

  test('CT01 - Cadastro de Administrador com Sucesso', async ({ page }) => {
    const emailDinamico = `admin_${Date.now()}@qa.com`;
    await signUpPage.fillForm('Rodrigo Admin', emailDinamico, 'senha123', true);
    await signUpPage.submitForm();

    // Valida o redirecionamento e a mensagem de boas-vindas na tela de Admin
    await expect(page).toHaveURL(/.*admin\/home/);
    await expect(page.locator('h1')).toContainText('Bem Vindo');
  });

  test('CT02 - Cadastro de Usuário Comum com Sucesso', async ({ page }) => {
    const emailDinamico = `user_${Date.now()}@qa.com`;
    await signUpPage.fillForm('Rodrigo User', emailDinamico, 'senha123', false);
    await signUpPage.submitForm();

    // Valida o redirecionamento para a Home de compras
    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('h1')).toContainText('Serverest Store');
  });

  test('CT03 - Validar E-mail Duplicado', async ({ page }) => {
    const emailDuplicado = `duplicado_${Date.now()}@qa.com`;
    
    // 1. Cadastra o usuário a primeira vez
    await signUpPage.fillForm('Usuário Original', emailDuplicado, 'senha123', false);
    await signUpPage.submitForm();
    await expect(page).toHaveURL(/.*home/); // Garante que criou

    // 2. Desloga (Limpando o state) e volta pra tela de cadastro
    await page.context().clearCookies();
    await signUpPage.goto();

    // 3. Tenta cadastrar de novo com o mesmo e-mail
    await signUpPage.fillForm('Usuário Clone', emailDuplicado, 'senha123', false);
    await signUpPage.submitForm();

    // 4. Valida a mensagem de erro do ServeRest
    const mensagemErro = page.locator('div.alert > span');
    await expect(mensagemErro).toBeVisible();
    await expect(mensagemErro).toContainText('Este email já está sendo usado');
  });

  test('CT04 - Validar Campos Obrigatórios no Cadastro', async ({ page }) => {
    // Tenta submeter direto sem preencher nada
    await signUpPage.submitForm();

    // O ServeRest exibe os erros em múltiplos alertas
    const alertas = page.locator('div.alert > span');
    await expect(alertas.nth(0)).toContainText('Nome é obrigatório');
    await expect(alertas.nth(1)).toContainText('Email é obrigatório');
    await expect(alertas.nth(2)).toContainText('Password é obrigatório');
  });

  test('CT06 - Navegação: Retornar para a Tela de Login', async ({ page }) => {
    await signUpPage.entrarLink.click();
    await expect(page).toHaveURL('https://front.serverest.dev/login');
  });
});