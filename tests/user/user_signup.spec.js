const { test, expect } = require('@playwright/test');
const { SignUpPage } = require('../../pages/SignUpPage'); // Ajuste o caminho se necessário

test.describe('Suite 01: Cadastro de Usuário Comum', () => {
  let signUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await page.goto('https://front.serverest.dev/cadastrarusuarios'); 
  });

  test('CT01 - Realizar cadastro com sucesso como Usuário Comum', async ({ page }) => {
    const emailDinamico = `comprador_${Date.now()}@qa.com`;

    await signUpPage.preencherNome('Cliente Comum');
    await signUpPage.preencherEmail(emailDinamico);
    await signUpPage.preencherSenha('senha_segura');
    
    await signUpPage.submitForm();

    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('h1:has-text("Serverest Store")')).toBeVisible();
  });

  test('CT02 - Validar roteamento do link "Já é cadastrado? Entrar"', async ({ page }) => {
    await signUpPage.clicarLinkLogin();

    await expect(page).toHaveURL('https://front.serverest.dev/login');
    await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
  });
});