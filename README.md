# Automação E2E - ServeRest com Playwright

Este repositório possui uma suíte de testes automatizados para o e-commerce [ServeRest](https://front.serverest.dev/), focada em validações de Front-end e integração com API.

## Decisões Arquiteturais:
- **Page Object Model (POM):** Separação clara entre a lógica de negócio (locators) e a execução dos testes.
- **Testes Híbridos (UI + API):** No módulo de Login, a massa de dados (usuários) é criada via API no bloco `beforeAll`. Isso garante que a automação de UI seja rápida e não dependa de dados voláteis do banco.
- **Locators Blindados:** Uso prioritário de `data-testid` para garantir que os testes não quebrem com mudanças de CSS.

## Tecnologias Utilizadas
- **JavaScript**
- **Playwright**

## Como Executar
1. Clone este repositório.
2. Instale as dependências: `npm install`
3. Execute a suíte de testes visualmente: `npx playwright test --ui`