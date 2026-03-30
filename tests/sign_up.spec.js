const { test, expect } = require('@playwright/test');
const { SignUpPage } = require('../pages/SignUpPage'); 

test.describe('Suite 01: Cadastro de Usuários (Sign Up)', () => {
  let signUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto(); 
  });

  test('CT01 - Cadastro de Administrador com Sucesso', async ({ page }) => {
    const emailDinamicoAdmin = `admin_${Date.now()}@teste.com`;
    
    await signUpPage.fillForm('Rodrigo Admin', emailDinamicoAdmin, 'senha123', true);
    await signUpPage.submitForm();

    await expect(page.getByRole('heading', { name: /Bem Vindo/i })).toBeVisible();

    await expect(page).toHaveURL(/.*admin\/home/);
  });

 test('CT02 - Cadastro de Usuário Comum com Sucesso', async ({ page }) => {
    const emailUnico = `user${Date.now()}${Math.floor(Math.random() * 1000)}@qa.com`;
    
    await signUpPage.fillForm('Rodrigo Comum', emailUnico, 'senha123', false);
    await signUpPage.submitForm();

    
    const headerHome = page.getByRole('heading', { name: /Serverest Store/i });
    
    await expect(headerHome).toBeVisible({ timeout: 7000 });
    await expect(page).toHaveURL(/.*home/);
  });

  test('CT03 - Validar E-mail Duplicado', async ({ page }) => {
    const emailEstatico = 'rodrigo_duplicado_teste@qa.com';
    
    await signUpPage.fillForm('Rodrigo', emailEstatico, 'senha', false);
    await signUpPage.submitForm();
    
    await page.context().clearCookies();
    await signUpPage.goto(); 
    
    await signUpPage.fillForm('Rodrigo', emailEstatico, 'senha', false);
    await signUpPage.submitForm();

    const alertErro = page.locator('div.alert > span');
    await expect(alertErro).toBeVisible();
    await expect(alertErro).toContainText('Este email já está sendo usado');
  });

  test('CT05 - Validar Formato de E-mail Inválido (Validação Nativa HTML5)', async ({ page }) => {
    await signUpPage.fillForm('Rodrigo Teste', 'email_sem_formato', 'senha123', false);
    await signUpPage.submitForm();

    const isEmailValid = await signUpPage.emailInput.evaluate(el => el.validity.valid);
    expect(isEmailValid).toBeFalsy();
  });
});