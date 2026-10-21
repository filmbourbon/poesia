# AGENTS.md · De nada em nada, tudo.

Documentário sobre a poesia nordestina. Bourbon Films. Lei Rouanet, PRONAC 258413.
Site: https://www.poesia.art.br · Repositório: https://github.com/filmbourbon/poesia
Hospedagem: GitHub Pages, branch `main`, raiz do repositório. Sem build, sem framework, sem npm.

## Estrutura

```
index.html              página única (HTML semântico, todo o texto é texto real)
assets/css/site.css     sistema visual completo (tokens no :root)
assets/js/boot.js       1 linha: adiciona html.js antes da pintura
assets/js/site.js       comportamento (sem dependências)
assets/fonts/           Alfa Slab One, Alegreya, Caveat (woff2, licença OFL incluída)
assets/img/             selos MinC e Lei de Incentivo, logos Bourbon, Podcast Nordestino, Fazenda Coruja
og-image.png / .svg     imagem de compartilhamento (1200x630)
CNAME                   www.poesia.art.br  (NUNCA apagar)
tests/                  test_estrutura.py (sem navegador) e test_navegador.py (Playwright)
```

## Direção de arte

- Conceito: a palavra vira imagem, a imagem vira movimento, o movimento revela uma história.
- Objeto condutor: **a folha e o cordão**. Cordel = folheto pendurado em cordão de feira.
  Aparece como: cordão da abertura, barra de progresso no topo, etiquetas de capítulo,
  cena da dobra (capítulo 6) e varal do acervo (capítulo 7).
- Gancho narrativo (estrutura Vox): a pergunta do mote aparece no capítulo 2 e a resposta
  ("De nada em nada, tudo.") fecha a página em `#fim`.
- Linguagem principal: colagem editorial (recortes de papel, fita adesiva, meio-tom,
  anotações à mão em urucum, diagramas abstratos). Diorama de papel só no capítulo 6.
- Referência de estilo: skill `vox-motion-graphics` (Mixed Media + Paper Diorama), adaptada
  para web: sem vídeo gerado, sem texto em imagem, sem rolagem sequestrada.

### Tokens
| Token | Uso |
|---|---|
| `--papel` #E9E4D6 | fundo padrão (papel jornal) |
| `--tinta` #1B1714 | texto e campos escuros |
| `--amarelo` #ECBC2C | abertura e apoio (capa de folheto), destaque em campos escuros |
| `--anil` #24318A | capítulo da voz |
| `--urucum` #B8361F | SOMENTE anotações à mão, carimbos, foco e progresso |
| `--rosa`, `--verde`, `--anil-claro` | SOMENTE capas de folheto e esquemas de rima |
| `--sepia` #D6C6A0 | SOMENTE o diorama do capítulo 6 |

### Tipografia
- `--f-slab` Alfa Slab One: título, títulos de capítulo, declarações curtas.
- `--f-text` Alegreya: texto corrido e poesia (preservar quebras de verso: um `<span>` por verso).
- `--f-mao` Caveat: anotações curtas à mão (no máximo uma por tela). Nunca para informação essencial.
- Não usar caixa-alta em rótulos. Não usar travessão.

### Movimento (tempos em :root)
`--t-ja` 120ms botões · `--t-ui` 240ms componentes · `--t-revela` 650ms revelações · `--t-cena` 900ms cenas.
Uma única sequência orquestrada na abertura (CSS). No resto, só revelações pontuais.
`prefers-reduced-motion` desliga tudo. Sem `html.js`, nada fica escondido.

## Comportamentos (assets/js/site.js)
| Módulo | O que faz |
|---|---|
| topo | cabeçalho sólido após rolar + barra de progresso |
| indice | `<dialog id="indice">` com os capítulos; atualiza a URL (voltar funciona) |
| revela | adiciona `.on` em `.rv .kin .traco .forma .quem-lista .alcance` (IntersectionObserver + varredura na rolagem para rolagem rápida) |
| anatomia | botões Rimas/Sílabas no capítulo 5 (`aria-pressed`) |
| dobra | cena fixa do capítulo 6, guiada por `.passo[data-passo]` |
| paginas | folheto Cante lá: rolagem horizontal nativa + botões |
| leitor | acervo: `<dialog id="leitor">` lê o conteúdo de `article#txt-<id>` |
| vozes | filtro por tradição |
| video | só cria o iframe (youtube-nocookie) quando a pessoa toca |

## Acervo de cordéis
Cada folheto tem dois pedaços no `index.html`:
1. Capa no varal: `<a class="folheto" href="#txt-ID" data-cordel="ID">`.
2. Texto: `<article class="texto-cordel" id="txt-ID" data-titulo data-autor data-ano data-cor data-verificado>`.
Sem JS, o link leva ao texto na própria página (`:target`). Com JS, abre o leitor.

**Atenção editorial:** só `cante-la` está conferido. Os outros 19 trechos vieram do site
anterior e não correspondem com segurança aos textos originais (exemplo: A Triste Partida).
Estão marcados `data-verificado="nao"`, com selo "provisório" e aviso no leitor.
Ao conferir um trecho com a edição impressa: troque os versos, mude para
`data-verificado="sim"`, apague o `<p class="aviso-provisorio">` e o `<span class="selo">`.

## Conteúdo corrigido em relação ao site anterior
- Rogaciano Leite: nasceu em Itapetim, PE (Diário do Nordeste, centenário). O site antigo dizia Assaré/Caruaru.
- Formas poéticas: galope à beira-mar tem 11 sílabas; quadrão tem 8 versos de 7 sílabas;
  mourão é forma dialogada entre dois cantadores. Exemplos de estrofes inventados foram retirados
  e substituídos por diagramas do esquema de rimas.
- O site anterior tinha erro de sintaxe JS nos `onclick` (`\'`): os cordéis e os tipos de poesia não abriam.

## Segurança
- CSP no `<head>`: scripts só do próprio site; iframe só do youtube-nocookie; imagens externas só i.ytimg.com.
- Sem scripts inline, sem `onclick` no HTML. Se precisar de comportamento, adicione em `site.js`.
- Links externos com `rel="noopener noreferrer"`.

## Testes
```
python3 tests/test_estrutura.py      # rápido, sem dependências
pip install playwright && python -m playwright install chromium
python3 tests/test_navegador.py      # navegador real: 10 larguras, acervo, teclado, sem JS, movimento reduzido
```

## Publicar
Envie para `main` (upload pelo site do GitHub ou git push). O GitHub Pages publica sozinho em 1 a 3 minutos.
Nunca apague `CNAME`. Ver README.md para o passo a passo.

*Bourbon Films · Campina Grande, PB · outubro de 2026*
