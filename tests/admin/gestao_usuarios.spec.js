const { test, expect } = require('@playwright/test');
const { GestaoUsuariosPage } = require('../../pages/GestaoUsuariosPage');


test.describe('Suite 05: Gestão Interna de Usuários (Painel Admin)', () => {
  let gestaoUsuariosPage;

  test.beforeEach(async ({ page }) => {
    gestaoUsuariosPage = new GestaoUsuariosPage(page);

    await page.goto('https://front.serverest.dev/login');
    await page.getByTestId('email').fill('rodrigoadmin@teste.com'); // Use seu admin
    await page.getByTestId('senha').fill('123'); // Use sua senha
    await page.getByTestId('entrar').click();

    await expect(page.getByRole('heading', { name: 'Bem Vindo' })).toBeVisible();
    await gestaoUsuariosPage.irParaCadastroDeUsuarios();
  });

  test('CT17 - Cadastrar usuário COMUM pelo painel admin com sucesso', async ({ page }) => {
    const emailDinamico = `user_interno_${Date.now()}@qa.com`;
    await gestaoUsuariosPage.preencherFormulario('Usuário Comum', emailDinamico, '12345', false);
    await gestaoUsuariosPage.submeterCadastro();

    await expect(gestaoUsuariosPage.tituloListaUsuarios).toBeVisible();
    await expect(page).toHaveURL(/.*admin\/listarusuarios/);
  });

  test('CT18 - Cadastrar administrador pelo painel admin com sucesso', async ({ page }) => {
    const emailDinamico = `admin_interno_${Date.now()}@qa.com`;
    await gestaoUsuariosPage.preencherFormulario('Novo Admin', emailDinamico, '12345', true);
    await gestaoUsuariosPage.submeterCadastro();

    await expect(gestaoUsuariosPage.tituloListaUsuarios).toBeVisible();
    await expect(page).toHaveURL(/.*admin\/listarusuarios/);
  });

  test('CT19 - Validar obrigatoriedade de campos ao tentar cadastrar usuário comum vazio', async ({ page }) => {
    await gestaoUsuariosPage.submeterCadastro();

    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Password é obrigatório')).toBeVisible();
  });

  test('CT20 - Validar obrigatoriedade de campos ao tentar cadastrar administrador vazio', async ({ page }) => {
    await gestaoUsuariosPage.checkboxAdmin.check();
    await gestaoUsuariosPage.submeterCadastro();

    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Password é obrigatório')).toBeVisible();
  });
});