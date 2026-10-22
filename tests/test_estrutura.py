#!/usr/bin/env python3
"""Testes estruturais (sem navegador). Uso: python3 tests/test_estrutura.py
Verifica arquivos, links internos, acessibilidade básica, segurança e conteúdo obrigatório."""
import os, re, sys
from html.parser import HTMLParser

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(RAIZ, 'index.html'), encoding='utf-8').read()
falhas = []

def ok(cond, nome):
    print(('  ✓ ' if cond else '  ✗ ') + nome)
    if not cond:
        falhas.append(nome)

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags = []
    def handle_starttag(self, t, a):
        self.tags.append((t, dict(a)))
p = P(); p.feed(html)
tags = p.tags
ids = [a['id'] for t, a in tags if 'id' in a]

print('\nARQUIVOS')
for f in ['index.html', 'CNAME', 'og-poesia-2026.jpg', 'assets/css/site.css', 'assets/js/site.js', 'assets/js/boot.js']:
    ok(os.path.isfile(os.path.join(RAIZ, f)), f)
ok(open(os.path.join(RAIZ, 'CNAME')).read().strip() == 'www.poesia.art.br', 'CNAME = www.poesia.art.br')
refs = re.findall(r'(?:src|href)="((?:assets/)[^"#?]+)"', html)
css = open(os.path.join(RAIZ, 'assets/css/site.css'), encoding='utf-8').read()
refs += ['assets/css/' + r for r in re.findall(r'url\("(\.\./[^"]+)"\)', css)]
faltando = [r for r in refs if not os.path.isfile(os.path.normpath(os.path.join(RAIZ, r)))]
ok(not faltando, f'todos os {len(refs)} arquivos referenciados existem {faltando}')
ok(len(html.encode()) < 200_000, f'index.html leve ({len(html.encode()) // 1024} KB)')
ok('data:image/png;base64' not in html, 'sem imagens base64 pesadas no HTML')

print('\nLINKS INTERNOS')
ok(len(ids) == len(set(ids)), 'ids únicos')
ancoras = set(re.findall(r'href="#([^"]+)"', html))
quebradas = [a for a in ancoras if a not in ids]
ok(not quebradas, f'{len(ancoras)} âncoras internas resolvem {quebradas}')

print('\nSEO E INSTITUCIONAL')
ok('<link rel="canonical" href="https://www.poesia.art.br/">' in html, 'canonical www')
ok('og:image' in html and 'og-poesia-2026.jpg' in html, 'Open Graph com imagem nova')
ok(html.count('PRONAC 258413') >= 3, 'PRONAC 258413 presente')
ok('Lei de Incentivo' in html and 'Ministério da Cultura' in html, 'selos MinC e Lei de Incentivo')
ok('bourbonfilms@gmail.com' in html and '+5583998683878' in html, 'contatos da produção')
ok(len([t for t, a in tags if t == 'h1']) == 1, 'exatamente um h1')

print('\nCONTEÚDO PRESERVADO')
ok(html.count('class="folheto"') == 20, '20 folhetos no acervo')
ok(html.count('class="texto-cordel"') == 20, '20 textos de cordel (fallback sem JS)')
ok(html.count('data-verificado="nao"') == 19 and html.count('aviso-provisorio') == 19, '19 trechos marcados como provisórios')
for verso in ['Senhores críticos, basta', 'Fazer o côco rodar.', 'Pelo prazer de cantar.', 'E um verso em cada fulô.', 'Ed. Vozes, Petrópolis, 1978']:
    ok(verso in html, f'texto preservado: {verso}')
ok(len(re.findall(r'class="pagina[ "]', html)) == 8, 'folheto Cante lá com 8 páginas')
ok(html.count('data-grupo=') == 16, '16 nomes em As vozes')

print('\nACESSIBILIDADE')
imgs = [a for t, a in tags if t == 'img']
ok(all('alt' in a for a in imgs), f'{len(imgs)} imagens com alt')
ok(all(a.get('width') and a.get('height') for a in imgs), 'imagens com largura e altura (sem salto de layout)')
ok('class="pular"' in html, 'link pular para o conteúdo')
ok('lang="pt-BR"' in html, 'idioma pt-BR')
botoes = [a for t, a in tags if t == 'button']
ok(all(a.get('type') in ('button', 'submit') for a in botoes) and sum(a.get('type') == 'submit' for a in botoes) == 1, 'botões com type explícito (um único submit, o da Carta)')
ok('prefers-reduced-motion' in css, 'CSS respeita movimento reduzido')
ok('html.js .rv' in css and '.rv{opacity:0' not in css.replace('html.js .rv{opacity:0', ''), 'conteúdo só fica oculto quando o JS está ativo')

print('\nSEGURANÇA')
blank = [a for t, a in tags if a.get('target') == '_blank']
ok(all('noopener' in a.get('rel', '') for a in blank), f'{len(blank)} links externos com rel=noopener')
ok('Content-Security-Policy' in html, 'CSP declarada')
ok(not re.search(r'\son[a-z]+="', html), 'sem handlers inline (onclick etc.)')
ok(not re.search(r'<script(?![^>]*\bsrc=)[^>]*>', html), 'sem scripts inline')
ok('youtube-nocookie.com' in open(os.path.join(RAIZ, 'assets/js/site.js'), encoding='utf-8').read(), 'vídeo via youtube-nocookie')

print('\nCARTA DA POESIA, 404 E PÁGINAS DE APOIO')
ok('id="carta-form"' in html and 'data-estado="inativo"' in html, 'formulário da Carta começa inativo')
ok(not re.search(r'id="carta-consente(-google)?"[^>]*checked', html), 'autorização nunca vem marcada')
ok('Seu melhor e-mail' in html and 'Quero receber' in html and 'Continuar com Google' in html, 'textos do formulário')
ok('privacidade/' in html, 'link para a política de privacidade')
cfg = open(os.path.join(RAIZ, 'assets/js/carta-config.js'), encoding='utf-8').read()
ok('firebase: null' in cfg and not re.search(r'private_key|service_account|re_[A-Za-z0-9]{10,}|sk_', cfg), 'config pública vazia e sem segredos')
p404 = open(os.path.join(RAIZ, '404.html'), encoding='utf-8').read()
ok('noindex' in p404 and 'http-equiv="refresh"' not in p404 and 'location' not in p404, '404 com noindex e sem redirecionamento')
ok('href="/assets/css/site.css"' in p404 and 'href="/"' in p404, '404 com caminhos absolutos e link ao início')
ok('Este verso se perdeu pelo caminho.' in p404, 'texto do 404')
for f in ['privacidade/index.html', 'carta/confirmada/index.html', 'carta/link-invalido/index.html', 'carta/cancelar/index.html']:
    ok(os.path.exists(os.path.join(RAIZ, f)), f'existe {f}')

print('\nPROPOSTA REDECOMPRAS (página não listada)')
prop = open(os.path.join(RAIZ, 'parceria-redecompras/index.html'), encoding='utf-8').read()
ok('noindex, nofollow' in prop, 'proposta com noindex, nofollow')
publicas = [os.path.join(r, a) for r, _, fs in os.walk(RAIZ) if '.git' not in r and 'parceria-redecompras' not in r for a in fs if a.endswith(('.html', '.xml', '.txt'))]
ok(not any('parceria-redecompras' in open(f, encoding='utf-8').read() for f in publicas), 'nenhuma página pública aponta para a proposta')
ok(not os.path.exists(os.path.join(RAIZ, 'parcerias')), 'caminho antigo parcerias/ removido')
todos = [os.path.join(r, a) for r, _, fs in os.walk(RAIZ) if '.git' not in r and 'vendor' not in r for a in fs if a.endswith(('.html', '.js', '.css', '.md'))]
errados = [os.path.relpath(f, RAIZ) for f in todos if re.search(r'RedeCompras|Redecompras|Rede Compras|\b(a|da|na|pela|para a) REDECOMPRAS', re.sub(r'<[^>]+>', ' ', open(f, encoding='utf-8').read()))]
ok(not errados, f'nome REDECOMPRAS em maiúsculas e no masculino {errados}')
ok(not re.search(r'Duas propostas|duas conversas', prop, re.I), 'sem linguagem de duas propostas')
ok(not re.search(r'[—–]', re.sub(r'<[^>]+>', ' ', prop + p404 + html)), 'sem travessão')

print('\n' + ('TODOS OS TESTES PASSARAM' if not falhas else f'FALHAS: {len(falhas)}'))
sys.exit(1 if falhas else 0)
