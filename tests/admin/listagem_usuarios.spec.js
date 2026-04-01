const { test, expect, request } = require('@playwright/test');
const { ListagemUsuariosPage } = require('../../pages/ListagemUsuariosPage');

test.describe('Suite 06: Listagem e Gestão de Usuários (Painel Admin)', () => {
  let listagemPage;

  test.beforeEach(async ({ page }) => {
    listagemPage = new ListagemUsuariosPage(page);

    const emailAdminLogado = `admin_sessao_${Date.now()}@qa.com`;
    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Admin Blindado',
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

  test('CT21 - Validar presença de usuário recém-criado na listagem', async ({ page }) => {
    const emailDinamico = `para_listagem_${Date.now()}@qa.com`;

    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Usuario Listagem',
        email: emailDinamico,
        password: 'senha',
        administrador: 'false'
      }
    });

    await listagemPage.irParaListagem();

    const linhaUsuario = listagemPage.obterLinhaDoUsuario(emailDinamico);
    await expect(linhaUsuario).toBeVisible();
  });

  test('CT22 - Excluir usuário existente com sucesso', async ({ page }) => {
    const emailDinamico = `para_exclusao_${Date.now()}@qa.com`;

    const apiContext = await request.newContext();
    await apiContext.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Alvo Exclusao',
        email: emailDinamico,
        password: 'senha',
        administrador: 'false'
      }
    });

    await listagemPage.irParaListagem();
    await listagemPage.excluirUsuario(emailDinamico);

    const linhaUsuario = listagemPage.obterLinhaDoUsuario(emailDinamico);
    await expect(linhaUsuario).not.toBeVisible();
  });
});