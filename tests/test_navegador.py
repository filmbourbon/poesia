#!/usr/bin/env python3
"""Testes em navegador real (Chromium via Playwright).
Instalação: pip install playwright && python -m playwright install chromium
Uso:        python3 tests/test_navegador.py
Sobe um servidor local temporário na pasta do site e testa interações reais."""
import asyncio, functools, http.server, os, sys, threading
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
falhas = []
def ok(cond, nome):
    print(('  ✓ ' if cond else '  ✗ ') + nome)
    if not cond: falhas.append(nome)

def servidor():
    class Silencioso(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Silencioso, directory=RAIZ)
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, f'http://127.0.0.1:{s.server_address[1]}/'

EXTERNO = ('ytimg.com', 'youtube')  # rede externa pode estar indisponível no ambiente de teste

async def pagina(b, url, w=390, h=844, **kw):
    mob = w < 800
    ctx = await b.new_context(viewport={'width': w, 'height': h}, is_mobile=mob, has_touch=mob, **kw)
    pg = await ctx.new_page()
    erros = []
    pg.on('pageerror', lambda e: erros.append(str(e)))
    pg.on('console', lambda m: erros.append(m.text) if m.type == 'error' and not any(x in m.text for x in EXTERNO) and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
    await pg.goto(url, wait_until='networkidle')
    return ctx, pg, erros

async def main():
    srv, URL = servidor()
    async with async_playwright() as p:
        b = await p.chromium.launch()

        print('\nCARREGAMENTO E LARGURAS')
        for w, h in [(320, 568), (360, 740), (375, 667), (390, 844), (430, 932), (768, 1024), (1024, 768), (1440, 900), (1920, 1080), (844, 390)]:
            ctx, pg, erros = await pagina(b, URL, w, h)
            ov = await pg.evaluate('document.documentElement.scrollWidth - innerWidth')
            ok(ov <= 0 and not erros, f'{w}x{h}: sem rolagem horizontal ({ov}px) e sem erros JS {erros[:2]}')
            await ctx.close()

        ctx, pg, erros = await pagina(b, URL, 1440, 900)
        fontes = await pg.evaluate("document.fonts.ready.then(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family))")
        ok('Slab' in fontes and 'Alegreya' in fontes, f'fontes auto-hospedadas carregam {sorted(set(fontes))}')

        print('\nÍNDICE DE CAPÍTULOS')
        await pg.click('[data-abre-indice]')
        ok(await pg.evaluate("document.getElementById('indice').open"), 'índice abre')
        await pg.click('#indice a[href="#acervo"]')
        await pg.wait_for_timeout(900)
        ok(not await pg.evaluate("document.getElementById('indice').open"), 'índice fecha ao escolher capítulo')
        ok(pg.url.endswith('#acervo'), 'URL recebe o capítulo (histórico do navegador)')
        top = await pg.evaluate("document.getElementById('acervo').getBoundingClientRect().top")
        ok(-5 < top < 120, f'rola até o capítulo (topo em {top:.0f}px)')
        ok(await pg.evaluate("!document.documentElement.classList.contains('travado')"), 'rolagem destravada após fechar')
        await pg.go_back(); await pg.wait_for_timeout(300)
        ok(not pg.url.endswith('#acervo'), 'botão voltar funciona')

        print('\nACERVO: 20 FOLHETOS')
        n = await pg.locator('a.folheto').count()
        abertos = 0
        for i in range(n):
            card = pg.locator('a.folheto').nth(i)
            titulo_esperado = await pg.evaluate("id=>document.getElementById('txt-'+id).dataset.titulo", await card.get_attribute('data-cordel'))
            await card.scroll_into_view_if_needed(); await card.click()
            aberto = await pg.evaluate("document.getElementById('leitor').open")
            titulo = await pg.inner_text('#leitor-titulo')
            estrofes = await pg.locator('#leitor .estrofe').count()
            if aberto and titulo == titulo_esperado and estrofes >= 1: abertos += 1
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(60)
            foco = await pg.evaluate("document.activeElement === document.querySelectorAll('a.folheto')[%d]" % i)
            if not foco: print('    foco não voltou no folheto', i)
        ok(abertos == n == 20, f'{abertos}/{n} folhetos abrem com título e versos corretos')
        ok(await pg.evaluate("!document.documentElement.classList.contains('travado')"), 'Esc fecha e destrava a rolagem')
        ok(await pg.evaluate("document.activeElement.classList.contains('folheto')"), 'foco volta ao folheto de origem')
        await pg.locator('a.folheto').nth(4).click()
        ok(await pg.locator('#leitor .aviso-provisorio').count() == 1, 'trecho não conferido mostra aviso provisório')
        await pg.mouse.click(5, 5)
        ok(not await pg.evaluate("document.getElementById('leitor').open"), 'clique fora fecha o leitor')
        await pg.locator('a.folheto').nth(0).focus(); await pg.keyboard.press('Enter')
        ok(await pg.evaluate("document.getElementById('leitor').open"), 'Enter no teclado abre o folheto')
        ok(await pg.evaluate("document.activeElement.classList.contains('leitor-fechar')"), 'foco vai para o botão fechar')
        await pg.click('.leitor-fechar')
        ok(not await pg.evaluate("document.getElementById('leitor').open"), 'botão fechar funciona')

        print('\nANATOMIA DO VERSO, VOZES, PÁGINAS')
        await pg.click('.chave[data-chave="rimas"]')
        ok(await pg.get_attribute('.anatomia', 'data-rimas') == '1' and await pg.get_attribute('.chave[data-chave="rimas"]', 'aria-pressed') == 'true', 'botão Rimas liga destaque')
        await pg.click('.chave[data-chave="silabas"]')
        vis = await pg.evaluate("getComputedStyle(document.querySelector('.v-sil')).display")
        ok(vis == 'flex', 'botão Sílabas mostra a contagem')
        ok('Sete sílabas' in await pg.inner_text('.anatomia-nota'), 'explicação muda com o modo')
        await pg.click('.filtro[data-filtro="cordel"]')
        await pg.wait_for_timeout(400)
        op = await pg.evaluate("[...document.querySelectorAll('.nomes li')].map(l=>+getComputedStyle(l).opacity)")
        ok(sum(1 for o in op if o > .9) == 4, f'filtro Cordel destaca os 4 cordelistas ({sum(1 for o in op if o > .9)})')
        await pg.locator('.paginas').scroll_into_view_if_needed()
        await pg.click('[data-pag="prox"]'); await pg.wait_for_timeout(900)
        ok('Página 2 de 8' in await pg.inner_text('.paginador output'), 'botão próxima página folheia')
        await pg.click('[data-pag="ant"]'); await pg.wait_for_timeout(900)
        ok('Página 1 de 8' in await pg.inner_text('.paginador output'), 'botão página anterior volta')

        print('\nVÍDEO SOB DEMANDA')
        ok(await pg.locator('#voz iframe').count() == 0, 'nenhum iframe carregado antes do clique')
        await pg.locator('.video-play').scroll_into_view_if_needed(); await pg.click('.video-play')
        src = await pg.get_attribute('#voz iframe', 'src')
        ok(src and 'youtube-nocookie.com/embed/qshEZpJTwwE' in src, 'clique carrega o player do YouTube (nocookie)')

        print('\nREVELAÇÕES')
        H = await pg.evaluate('document.documentElement.scrollHeight')
        for y in range(0, H, 2500):  # rolagem rápida de propósito
            await pg.evaluate(f'scrollTo(0,{y})'); await pg.wait_for_timeout(16)
        await pg.evaluate('scrollTo(0,document.documentElement.scrollHeight)'); await pg.wait_for_timeout(1200)
        invis = await pg.evaluate("[...document.querySelectorAll('.rv,.kin,.forma,.quem-lista,.alcance')].filter(e=>!e.classList.contains('on')).length")
        ok(invis == 0, f'nada fica invisível após rolagem rápida ({invis} pendentes)')
        ok(not erros, f'nenhum erro JS durante os testes {erros[:3]}')
        await ctx.close()

        print('\nLINK DIRETO PARA UM CORDEL')
        ctx, pg, _ = await pagina(b, URL + '#txt-o-dinheiro', 390, 844)
        await pg.wait_for_timeout(400)
        ok(await pg.evaluate("document.getElementById('leitor').open") and await pg.inner_text('#leitor-titulo') == 'O Dinheiro', 'URL #txt-o-dinheiro abre o leitor')
        await ctx.close()

        print('\nMOVIMENTO REDUZIDO')
        ctx, pg, _ = await pagina(b, URL, 390, 844, reduced_motion='reduce')
        await pg.evaluate("document.getElementById('filme').scrollIntoView()")
        await pg.wait_for_timeout(100)
        op = await pg.evaluate("+getComputedStyle(document.querySelector('.quem-lista li')).opacity")
        ok(op == 1, 'conteúdo visível sem animação')
        await ctx.close()

        print('\nSEM JAVASCRIPT')
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, java_script_enabled=False)
        pg = await ctx.new_page(); await pg.goto(URL + '#txt-triste-partida', wait_until='networkidle')
        el = pg.locator('#txt-triste-partida')
        ok(await el.is_visible(), 'sem JS: o link do folheto mostra o texto na própria página')
        ok(await pg.locator('.forma').first.is_visible() and await pg.locator('#oralidade h2').is_visible(), 'sem JS: todo o conteúdo visível')
        await ctx.close()

        await b.close()
    srv.shutdown()
    print('\n' + ('TODOS OS TESTES PASSARAM' if not falhas else f'FALHAS: {len(falhas)}'))
    sys.exit(1 if falhas else 0)

asyncio.run(main())
