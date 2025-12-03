# Projeto de Testes Automatizados — Front

**O que foi feito**
- Adicionado `.env` com `BASE_URL` e `STORIES_URL` (valores padrão).
- Adicionados scripts Node para validação de links do menu e um teste Cypress de Web Stories (esqueleto).
- Atualizado `package.json` (ou criado se inexistente) com scripts úteis: `install`, `test`, `validate-links`, `story-test`.
- Adicionado workflow GitHub Actions para executar os testes em CI (`.github/workflows/ci.yml`).
- Incluído `README` com instruções para execução local e em CI (Linux/Windows/MacOS).

---

## Requisitos (avaliador)
- Node.js >= 16 (recomendado) e npm (ou yarn)
- npx (vem com npm)
- Se for utilizar Cypress em modo gráfico: navegador Chrome/Chromium/Edge ou Firefox.
- (Opcional) Docker / Runner para CI

## Como usar (local)

1. Abra um terminal na raiz do projeto (onde está `package.json`).
2. Instale dependências:
```bash
npm install
```

3. Configure variáveis (opcional): edite `.env` se quiser testar outro site.
```env
BASE_URL=https://blogdoagi.com.br/
STORIES_URL=https://blog.agibank.com.br/web-stories/
```

4. Executar validação de links do menu (script Node que percorre o menu principal e valida status HTTP):
```bash
npm run validate-links
```

5. Executar testes Cypress (headless):
```bash
npm test
# ou
npx cypress run
```

6. Executar teste de Web Stories (esqueleto — abre a página e tenta clicar no primeiro item):
```bash
npm run story-test
```

## Estrutura adicionada
- `.env` — variáveis de ambiente usadas pelos scripts.
- `scripts/validate-links.js` — verifica links do menu principal a partir de `BASE_URL`.
- `cypress/e2e/web-stories.spec.js` — teste Cypress que visita `STORIES_URL` e tenta abrir/fechar uma story. ***ESSE TESTE FOI ADICIONADO COM ERRO, POIS FOI UM BUG ENCONTRADO DURANTE A CRIAÇÃO DO PROJETO!***
- `.github/workflows/ci.yml` — workflow para CI (Node + Cypress headless).

## Observações técnicas
- O script `validate-links.js` depende de `node-fetch`, `cheerio` e `dotenv`. Essas dependências foram adicionadas no `package.json`.
- O teste de Web Stories é um **ponto de partida**: dependendo do HTML real da página (selectores), pode ser necessário ajustar os seletores em `cypress/e2e/web-stories.spec.js`.
- O projeto foi mantido cross-platform (scripts npm) e a execução em Windows/Linux/Mac deve funcionar conforme instruções.

## Pipeline (exemplo GitHub Actions)
O workflow `.github/workflows/ci.yml` instala dependências e roda `npm test` em ubuntu-latest. Veja o arquivo no repositório para os detalhes.

---

Se quiser, faço os ajustes finos nos seletores do Cypress e melhoro a validação dos links com relatórios (Allure / HTML) — diga quais arquivos do projeto você já possui e eu ajusto diretamente para o avaliador.
