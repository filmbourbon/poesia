# AGENTS.md — De nada em nada, tudo.

Projeto: Documentário sobre poesia nordestina  
PRONAC 258413 · Bourbon Films  
Repositório: https://github.com/filmbourbon/poesia  
Site: https://www.poesia.art.br

---

## Estrutura do projeto

```
poesia-main/
├── index.html      # Arquivo único — todo o site (HTML + CSS + JS + SVGs inline)
├── CNAME           # www.poesia.art.br
└── AGENTS.md       # Este arquivo
```

O site é hospedado via **GitHub Pages** como arquivo HTML único monolítico.  
Não há build step, bundler, framework, nem dependências npm.  
Fontes carregadas via Google Fonts. Sem CDN externo além do YouTube embed.

---

## Decisões de arquitetura

| Decisão | Motivo |
|---|---|
| HTML monolítico | GitHub Pages estático; zero configuração de deploy |
| CSS/JS inline | Sem latência de requisições extras; funciona offline |
| Imagens em base64 | Logo Bourbon Films (~140 KB) embutida; sem requisição extra |
| Sem framework JS | Vanilla JS; mínimo de KBs; sem dependências |

---

## Funções JavaScript críticas

```js
abrirCordel(id)         // Abre modal do cordel — busca id em CORDEIS_DB
fecharCordelModal()     // Fecha modal, restaura foco e scroll
abrirSanfona(el)        // Não utilizado atualmente (legado)
fecharSanfona(el)       // Não utilizado atualmente (legado)
```

### CORDEIS_DB
Objeto JS com 20 entradas. Cada chave corresponde exatamente ao `data-id` de um `.cg-card`.  
Se adicionar um card novo, adicionar entrada correspondente em CORDEIS_DB.

### Accordion (#tipos)
Classe `tp-active` no `.tp-item` controla expansão.  
**Atenção**: NÃO usar classe `on` para accordion — conflita com IntersectionObserver  
(que adiciona `.on` nos elementos `.rv`, `.rl`, `.rr`, `.rs` ao revelar).

---

## Acessibilidade (WCAG 2.2 AA)

- Skip nav link: `<a class="skip-nav" href="#hero">`
- Modal: foco trapped dentro do `#cg-modal`; Escape fecha; foco retorna ao opener
- Accordions: `role="button"` + `tabindex="0"` + `aria-expanded` + Enter/Space
- Cards de cordel: `role="button"` + `tabindex="0"` + Enter/Space
- prefers-reduced-motion: todas animações desabilitadas via CSS media query
- Alvos de toque: mínimo 44×44 px

---

## Segurança

- `rel="noopener noreferrer"` em todos os `target="_blank"`
- Sem inputs de usuário; sem backend; sem localStorage com dados sensíveis
- Canonical URL: `https://www.poesia.art.br` (CNAME: `www.poesia.art.br`)

---

## Como editar

### Alterar texto de uma seção
Editar `index.html` diretamente. Seções por ID: `#hero`, `#porque`, `#senhores`,  
`#poesia`, `#tipos`, `#cordel`, `#cordeis-galeria`, `#podcast`, `#entregaveis`,  
`#progresso`, `#apoio`, `#bourbon`, `#apoiadores`.

### Adicionar um cordel à galeria
1. Adicionar entrada em `CORDEIS_DB` no bloco `<script>` (final do body)
2. Adicionar `<div class="cg-card rv" role="button" tabindex="0" onclick="_modalOpener=this;abrirCordel('SEU_ID')">`

### Modificar estilos
Todo o CSS está no único `<style>` no `<head>`. Variáveis CSS em `:root`:
- `--K`: preto (#1A0A06)
- `--C`: creme (#F5EDD8)
- `--Alt`: âmbar (#E08A1A)
- `--Km`: marrom escuro (#2A1208)

---

## Deploy

Push para `main` do repositório `filmbourbon/poesia` → GitHub Pages publica automaticamente.  
Sem CI/CD adicional configurado.

### Verificar após deploy
```
curl -I https://www.poesia.art.br
# Deve retornar 200 com Content-Type: text/html
```

---

## Testes manuais obrigatórios após mudanças

- [ ] Modal abre ao clicar em card da galeria (desktop + mobile)
- [ ] Modal fecha com botão ✕, clique no overlay e tecla Escape
- [ ] Foco retorna ao card após fechar modal
- [ ] Accordions de #tipos abrem/fecham com click, Enter e Space
- [ ] Scroll do site não trava após fechar modal
- [ ] Navegação por teclado: Tab percorre todos os elementos interativos
- [ ] Skip nav aparece ao focar via teclado
- [ ] Animações de reveal funcionam ao scroll
- [ ] Site responsivo em 375px (iPhone SE) e 390px (iPhone 14)

---

## Pendências conhecidas

- Playwright / testes automatizados: não implementados (arquivo HTML monolítico  
  com assets inline; setup requer servidor local + instância Chromium)
- Imagens dos cordéis: placeholders com SVG. URLs reais de imagens não configuradas.
- Video embed #senhores: URL `qshEZpJTwwE` deve ser atualizada quando vídeo final for publicado.

---

*Bourbon Films · Campina Grande, PB*  
*Atualizado em outubro/2026*
