const { test, expect, request } = require('@playwright/test');
const { SignUpPage } = require('../../pages/SignUpPage'); // Ajuste o caminho se necessário

test.describe('Suite 02: Cadastro de Administrador', () => {
  let signUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await page.goto('https://front.serverest.dev/cadastrarusuarios'); 
  });

  test('CT03 - Realizar cadastro com sucesso como Administrador', async ({ page }) => {
    const emailDinamico = `admin_${Date.now()}@qa.com`;

    await signUpPage.preencherNome('Rodrigo Admin');
    await signUpPage.preencherEmail(emailDinamico);
    await signUpPage.preencherSenha('senha_segura');
    await signUpPage.marcarComoAdministrador(); 
    
    await signUpPage.submitForm();

    await expect(page.getByRole('heading', { name: /Bem Vindo/i })).toBeVisible();
    await expect(page).toHaveURL(/.*admin\/home/);
  });

 test('CT04 - Validar erro de formatação de e-mail inválido (Validação HTML5)', async ({ page }) => {
    await signUpPage.preencherNome('Teste Formato');
    await signUpPage.preencherEmail('email_sem_arroba.com'); 
    await signUpPage.preencherSenha('senha_segura');
    
    await signUpPage.submitForm();

    // 💡 O Pulo do Gato: Avaliamos a propriedade nativa do navegador para aquele campo
    const inputEmail = page.getByTestId('email');
    const validacaoNativa = await inputEmail.evaluate((elemento) => elemento.validationMessage);
    
    // O texto exato da mensagem muda conforme o idioma do navegador do CI, 
    // então a validação mais robusta é apenas garantir que existe uma mensagem de erro (não está vazia)
    expect(validacaoNativa).not.toBe(''); 
  });
  
  test('CT05 - Validar erro de email já cadastrado', async ({ page }) => {
    const emailDuplicado = `duplicado_${Date.now()}@qa.com`;

    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Usuario Existente',
        email: emailDuplicado,
        password: 'senha_segura',
        administrador: 'true'
      }
    });

    await signUpPage.preencherNome('Tentativa Duplicada');
    await signUpPage.preencherEmail(emailDuplicado);
    await signUpPage.preencherSenha('senha_segura');
    await signUpPage.marcarComoAdministrador();
    
    await signUpPage.submitForm();

    const alertErro = page.locator('div.alert > span');
    await expect(alertErro).toBeVisible();
    await expect(alertErro).toContainText('Este email já está sendo usado');
  });

  test('CT06 - Validar obrigatoriedade de campos em branco', async ({ page }) => {
    await signUpPage.submitForm();

    await expect(page.locator('div.alert:has-text("Nome é obrigatório")')).toBeVisible();
    await expect(page.locator('div.alert:has-text("Email é obrigatório")')).toBeVisible();
    await expect(page.locator('div.alert:has-text("Password é obrigatório")')).toBeVisible();
  });
});