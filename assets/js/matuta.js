/* Simulador de parceria: Cachaça Matuta × De nada em nada, tudo.
   Sem dependências. Tudo roda no navegador; nada é enviado a servidor.
   Para mudar faixas, valores ou contrapartidas, edite FAIXAS e GRUPOS abaixo. */
(function () {
  'use strict';

  var TOTAL = 865701.10;            /* valor aprovado do projeto (PRONAC 258413) */
  var MIN = 10000;
  var WHATS = '5583998683878';

  var FAIXAS = [
    { id: 'verso',    nome: 'Verso',    de: 20000,  cor: '#F5F1E6', txt: 'A Matuta assina o filme nos créditos e na comunicação.', sub: 'presença essencial' },
    { id: 'estrofe',  nome: 'Estrofe',  de: 60000,  cor: '#E5A79E', txt: 'A marca abre o filme e ganha voz nas redes.', sub: 'presença ampliada' },
    { id: 'cantoria', nome: 'Cantoria', de: 120000, cor: '#8CB698', txt: 'A Matuta entra na roda: pré-estreia, bastidores, lançamento.', sub: 'presença protagonista' },
    { id: 'mote',     nome: 'Mote',     de: 250000, cor: '#ECBC2C', txt: 'A Matuta é o tema. O filme começa com o nome dela.', sub: 'presença de legado', nota: 'a que fica na memória' }
  ];

  /* nivel: índice da faixa mínima (0 verso ... 3 mote). tipo: inc = contrapartida do patrocínio; bou = Bourbon, à parte.
     onde: peça ou ponto onde a marca aparece. peso: contribuição para a presença. */
  var GRUPOS = [
    { id: 'A', t: 'Contrapartidas protocolares', s: 'Presença institucional prevista no projeto aprovado.', tipo: 'inc', itens: [
      { id: 'a1', t: 'Logomarca nos créditos finais', d: 'No bloco de patrocínio, junto às marcas da Lei Rouanet.', nivel: 0, onde: 'creditos', peso: 3 },
      { id: 'a2', t: 'Marca em cartazes, banners e impressos', d: 'Na faixa de patrocínio de todo material gráfico.', nivel: 0, onde: 'cartaz', peso: 3 },
      { id: 'a3', t: 'Marca no site oficial do filme', d: 'Área de patrocinadores do poesia.art.br.', nivel: 0, onde: 'site', peso: 2 },
      { id: 'a4', t: 'Citação nas publicações do projeto', d: 'Menção à patrocinadora nas redes do documentário.', nivel: 0, onde: 'post', peso: 2 },
      { id: 'a5', t: 'Certificado de patrocinador cultural', d: 'Reconhecimento formal da participação.', nivel: 0, onde: 'certificado', peso: 1 },
      { id: 'a6', t: 'Relatório final de execução', d: 'Alcance, público e resultados do projeto.', nivel: 0, onde: 'relatorio', peso: 1 },
      { id: 'a7', t: 'Agradecimento institucional nos créditos', d: 'Uma linha de dedicatória à Matuta.', nivel: 1, onde: 'creditos', peso: 2 }
    ]},
    { id: 'B', t: 'Presença de marca ampliada', s: 'Mais destaque nos espaços que o projeto permite.', tipo: 'inc', itens: [
      { id: 'b1', t: 'Logomarca na abertura do filme', d: 'A marca antes do título, na tela grande.', nivel: 1, onde: 'abertura', peso: 5 },
      { id: 'b2', t: 'Posts em colaboração com a Matuta', d: 'Publicações conjuntas nos perfis do filme e da marca.', nivel: 1, onde: 'post', peso: 3 },
      { id: 'b3', t: 'Marca nos episódios e conteúdos derivados', d: 'Cortes, episódios e peças que nascem do filme.', nivel: 1, onde: 'post', peso: 3 },
      { id: 'b4', t: 'Página da patrocinadora no site', d: 'Espaço próprio contando por que a Matuta está aqui.', nivel: 2, onde: 'site', peso: 3 },
      { id: 'b5', t: 'Destaque na imprensa e na divulgação', d: 'Rádio, televisão, portais e material de imprensa.', nivel: 2, onde: 'imprensa', peso: 4 },
      { id: 'b6', t: 'Vinheta "Cachaça Matuta apresenta"', d: 'O filme começa com o nome dela.', nivel: 3, onde: 'abertura', peso: 8 },
      { id: 'b7', t: 'Exclusividade no segmento de bebidas', d: 'Nenhuma outra marca de bebida patrocina o filme.', nivel: 3, onde: 'exclusividade', peso: 6 }
    ]},
    { id: 'C', t: 'Experiências exclusivas', s: 'Para clientes, parceiros e equipe da Matuta.', tipo: 'inc', itens: [
      { id: 'c1', t: 'Convites para as exibições', d: 'Lugares reservados para convidados da marca.', nivel: 0, onde: 'convite', peso: 2 },
      { id: 'c2', t: 'Acesso antecipado ao documentário', d: 'A Matuta assiste antes do público.', nivel: 1, onde: 'convite', peso: 2 },
      { id: 'c3', t: 'Sessão especial para colaboradores', d: 'Uma exibição só para a equipe da Matuta.', nivel: 1, onde: 'convite', peso: 3 },
      { id: 'c4', t: 'Pré-estreia exclusiva', d: 'Noite de estreia com convidados da marca.', nivel: 2, onde: 'convite', peso: 4 },
      { id: 'c5', t: 'Lançamento ao vivo com o Podcast Nordestino', d: 'Participação e destaque da marca na transmissão.', nivel: 2, onde: 'live', peso: 4 },
      { id: 'c6', t: 'Visita aos bastidores e às gravações', d: 'Ver o filme acontecendo de perto.', nivel: 2, onde: 'bastidores', peso: 3 },
      { id: 'c7', t: 'Encontro com equipe e participantes', d: 'Conversa com quem faz e com quem é o filme.', nivel: 2, onde: 'bastidores', peso: 2 },
      { id: 'c8', t: 'Sarau Matuta', d: 'Noite de cantoria com poetas do filme. Para maiores de 18.', nivel: 3, onde: 'sarau', peso: 6 },
      { id: 'c9', t: 'Espaço de ativação nos eventos do filme', d: 'Presença física da marca nas exibições, conforme as regras de bebidas.', nivel: 3, onde: 'ativacao', peso: 4 }
    ]},
    { id: 'D', t: 'Conteúdo do projeto para a marca', s: 'Derivado do próprio filme, no que o plano aprovado prevê.', tipo: 'inc', itens: [
      { id: 'd1', t: 'Registro fotográfico da participação', d: 'A presença da Matuta documentada.', nivel: 1, onde: 'bastidores', peso: 2 },
      { id: 'd2', t: 'Indicadores para comunicação ESG', d: 'Dados de impacto cultural prontos para relatórios.', nivel: 1, onde: 'relatorio', peso: 2 },
      { id: 'd3', t: 'Vídeos de bastidores para os canais da Matuta', d: 'Cenas do processo, com crédito à patrocinadora.', nivel: 2, onde: 'post', peso: 3 },
      { id: 'd4', t: 'Banco de imagens do projeto', d: 'Fotos do filme para comunicação institucional.', nivel: 2, onde: 'bastidores', peso: 2 },
      { id: 'd5', t: 'Exemplares e edição especial numerada', d: 'Materiais do projeto para presentear.', nivel: 2, onde: 'certificado', peso: 2 }
    ]},
    { id: 'E', t: 'Produções Bourbon sob medida', s: 'Negociadas com a Bourbon Films como produtora, em proposta e orçamento próprios.', tipo: 'bou', itens: [
      { id: 'e1', t: 'Vídeo institucional da Matuta', d: 'A história da marca contada pela equipe do filme.', nivel: 0 },
      { id: 'e2', t: 'Minidocumentário sobre a marca', d: 'Formato curto, linguagem de cinema.', nivel: 0 },
      { id: 'e3', t: 'VTs publicitários', d: 'Peças para TV e digital.', nivel: 0 },
      { id: 'e4', t: 'Conteúdo audiovisual para redes', d: 'Séries e cortes para os perfis da Matuta.', nivel: 0 },
      { id: 'e5', t: 'Captações e fotografia de produto', d: 'Diárias específicas de câmera e foto.', nivel: 0 },
      { id: 'e6', t: 'Motion e peças especiais', d: 'Animações e formatos sob demanda.', nivel: 0 }
    ], nota: 'Estas produções não saem dos recursos incentivados do filme. A Bourbon prepara orçamento e contrato separados, conforme o interesse da Matuta.' }
  ];

  var ONDE = {
    abertura: 'Abertura do filme', creditos: 'Créditos', cartaz: 'Cartaz e impressos', site: 'Site oficial', post: 'Redes sociais',
    convite: 'Convites e sessões', live: 'Lançamento ao vivo', bastidores: 'Bastidores', sarau: 'Sarau', ativacao: 'Ativação de marca',
    imprensa: 'Imprensa', certificado: 'Certificado', relatorio: 'Relatórios', exclusividade: 'Exclusividade no segmento'
  };
  var CHIPS = ['abertura', 'creditos', 'cartaz', 'site', 'post', 'convite', 'live', 'imprensa', 'bastidores', 'sarau', 'ativacao', 'exclusividade', 'certificado', 'relatorio'];
  var VISIVEIS = { abertura: 1, creditos: 1, cartaz: 1, site: 1, post: 1, imprensa: 1, exclusividade: 1, ativacao: 1 };

  /* sugestão de pacote por faixa: tudo o que a faixa alcança nos grupos A a D */
  var ITENS = {}, ORDEM = [];
  GRUPOS.forEach(function (g) { g.itens.forEach(function (it) { it.g = g; ITENS[it.id] = it; ORDEM.push(it.id); }); });
  var PESO_MAX = ORDEM.reduce(function (s, id) { return s + (ITENS[id].peso || 0); }, 0);

  var doc = document;
  var $ = function (s, el) { return (el || doc).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  var num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  function rs(v) { return brl.format(Math.round(v)); }
  function lerNumero(txt) { var n = String(txt || '').replace(/[^\d,]/g, '').replace(',', '.'); return n ? parseFloat(n) : 0; }

  var estado = { valor: FAIXAS[3].de, sel: {}, irpj: 0, discreto: false };

  function faixaDe(v) { var i = 0; FAIXAS.forEach(function (f, k) { if (v >= f.de) i = k; }); return i; }
  function nivelAtual() { return estado.valor >= FAIXAS[0].de ? faixaDe(estado.valor) : -1; }
  function disponivel(it) { if (it.g.tipo === 'bou') return true; if (estado.discreto && VISIVEIS[it.onde]) return false; return nivelAtual() >= it.nivel; }

  /* escala do controle deslizante: progressiva, mais precisão nos valores menores */
  function deSlider(p) { var t = p / 1000; var v = MIN * Math.pow(TOTAL / MIN, t); return v >= TOTAL - 1 ? TOTAL : Math.round(v / 5000) * 5000; }
  function paraSlider(v) { return Math.round(1000 * Math.log(Math.max(MIN, v) / MIN) / Math.log(TOTAL / MIN)); }

  /* ---------- montagem da interface ---------- */
  var elFaixas = $('#m-faixas'), elGrupos = $('#m-grupos'), elSlider = $('#m-valor-faixa'), elNum = $('#m-valor-num'), elIrpj = $('#m-irpj');
  if (!elFaixas || !elGrupos) return;

  FAIXAS.forEach(function (f, i) {
    var b = doc.createElement('button');
    b.type = 'button'; b.className = 'm-faixa' + (f.id === 'mote' ? ' m-faixa-mote' : '');
    b.setAttribute('role', 'radio'); b.dataset.i = i; b.style.setProperty('--cor', f.cor);
    b.innerHTML = '<span class="m-faixa-sel" aria-hidden="true"></span>' + (f.nota ? '<span class="m-faixa-nota" aria-hidden="true">' + f.nota + '</span>' : '') +
      '<span class="m-faixa-nome">' + f.nome + '</span><span class="m-faixa-de">a partir de ' + rs(f.de) + '</span><span class="m-faixa-txt">' + f.txt + '</span>';
    b.addEventListener('click', function () { escolherFaixa(i, true); });
    elFaixas.appendChild(b);
  });
  elFaixas.addEventListener('keydown', function (e) {
    var at = nivelAtual(), novo = at;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') novo = Math.min(3, at + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') novo = Math.max(0, at - 1);
    else return;
    e.preventDefault(); escolherFaixa(novo, true); elFaixas.children[novo].focus();
  });

  var cadeado = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="8" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  GRUPOS.forEach(function (g) {
    var sec = doc.createElement('div');
    sec.className = 'm-grupo' + (g.tipo === 'bou' ? ' m-grupo-bou' : '');
    var h = '<div class="m-grupo-cab"><span class="m-grupo-letra" aria-hidden="true">' + g.id + '</span><h4 class="m-grupo-t">' + g.t + '<span class="m-grupo-s">' + g.s + '</span></h4></div><div class="m-itens">';
    g.itens.forEach(function (it) {
      h += '<button type="button" class="m-item" data-id="' + it.id + '" aria-pressed="false"><span class="m-item-caixa" aria-hidden="true"></span>' +
        '<span><span class="m-item-t">' + it.t + '</span><span class="m-item-d">' + it.d + '</span></span><span class="m-item-tag"></span></button>';
    });
    h += '</div>' + (g.nota ? '<p class="m-grupo-nota">' + g.nota + '</p>' : '');
    sec.innerHTML = h;
    elGrupos.appendChild(sec);
  });
  elGrupos.addEventListener('click', function (e) {
    var b = e.target.closest('.m-item'); if (!b) return;
    alternar(b.dataset.id);
  });

  /* mesa do palco: cópias das peças da galeria, em escala menor */
  var mesa = $('#m-mesa');
  $$('#m-galeria .m-peca').forEach(function (p) {
    var c = p.cloneNode(true);
    $$('img', c).forEach(function (im) { im.alt = ''; im.loading = 'eager'; });
    mesa.appendChild(c);
  });
  var chips = $('#p-chips');
  CHIPS.forEach(function (k) { var li = doc.createElement('li'); li.dataset.onde = k; li.textContent = ONDE[k]; chips.appendChild(li); });

  /* ---------- ações ---------- */
  function escolherFaixa(i, sugerir) {
    var antes = nivelAtual();
    estado.valor = Math.max(FAIXAS[i].de, i === nivelAtual() ? estado.valor : FAIXAS[i].de);
    if (i < 3 && estado.valor >= FAIXAS[i + 1].de) estado.valor = FAIXAS[i].de;
    if (sugerir) sugerirPacote(i, antes);
    atualizar(antes);
  }
  function sugerirPacote(i, antes) {
    /* subir de faixa liga o que a nova faixa destrava; descer não liga nada */
    if (i <= antes) return;
    ORDEM.forEach(function (id) {
      var it = ITENS[id];
      if (it.g.tipo === 'inc' && it.nivel <= i && it.nivel > antes) { if (!(estado.discreto && VISIVEIS[it.onde])) { estado.sel[id] = true; marcar(id, 'ganhou'); } }
    });
  }
  function alternar(id) {
    var it = ITENS[id], antes = nivelAtual();
    if (estado.sel[id]) { delete estado.sel[id]; atualizar(antes); return; }
    if (it.g.tipo === 'inc' && estado.discreto && VISIVEIS[it.onde]) { avisar('Com o patrocínio discreto ligado, a marca não aparece em peças. Desligue a opção para escolher este item.'); return; }
    estado.sel[id] = true;
    if (it.g.tipo === 'inc' && antes < it.nivel) {
      estado.valor = FAIXAS[it.nivel].de;
      sugerirPacote(it.nivel, antes);
      avisar('Para incluir “' + it.t + '”, a parceria sobe para a faixa ' + FAIXAS[it.nivel].nome + ': ' + rs(FAIXAS[it.nivel].de) + '.');
    }
    marcar(id, 'ganhou');
    atualizar(antes);
  }
  function definirValor(v, deTexto) {
    var antes = nivelAtual();
    estado.valor = Math.min(TOTAL, Math.max(MIN, v || MIN));
    var agora = nivelAtual();
    if (agora > antes) sugerirPacote(agora, antes);
    atualizar(antes, deTexto);
  }
  function marcar(id, cls) {
    if (reduz) return;
    var b = $('.m-item[data-id="' + id + '"]'); if (!b) return;
    b.classList.remove('ganhou', 'perdido'); void b.offsetWidth; b.classList.add(cls);
  }
  var avisoEl = null, avisoT = 0;
  function avisar(t) {
    var st = $('#m-calc-saida');
    if (!avisoEl) { avisoEl = doc.createElement('p'); avisoEl.className = 'm-aviso'; avisoEl.setAttribute('role', 'status'); doc.body.appendChild(avisoEl); }
    avisoEl.textContent = t; avisoEl.classList.add('on');
    clearTimeout(avisoT); avisoT = setTimeout(function () { avisoEl.classList.remove('on'); }, 4200);
  }

  elSlider.addEventListener('input', function () { definirValor(deSlider(+elSlider.value)); });
  elNum.addEventListener('change', function () { definirValor(lerNumero(elNum.value)); });
  elNum.addEventListener('focus', function () { elNum.select(); });
  elNum.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); elNum.blur(); } });
  elIrpj.addEventListener('input', function () { estado.irpj = lerNumero(elIrpj.value); atualizarFiscal(); });
  elIrpj.addEventListener('blur', function () { if (estado.irpj) elIrpj.value = num.format(estado.irpj); });
  $('#m-discreto').addEventListener('change', function (e) {
    estado.discreto = e.target.checked;
    if (estado.discreto) ORDEM.forEach(function (id) { var it = ITENS[id]; if (it.g.tipo === 'inc' && VISIVEIS[it.onde]) delete estado.sel[id]; });
    atualizar(nivelAtual());
  });
  $('#m-calc-saida').addEventListener('click', function (e) {
    if (!e.target.closest('.m-usar')) return;
    definirValor(Math.floor(estado.irpj * 0.04 / 1000) * 1000);
    $('#m-valor-faixa').focus();
  });

  /* ---------- atualização de tudo ---------- */
  function atualizar(antes, deTexto) {
    var n = nivelAtual();
    /* itens que a faixa atual não alcança saem do pacote */
    ORDEM.forEach(function (id) { if (estado.sel[id] && !disponivel(ITENS[id])) { delete estado.sel[id]; marcar(id, 'perdido'); } });

    elSlider.value = paraSlider(estado.valor);
    elSlider.style.setProperty('--pct', (elSlider.value / 10) + '%');
    elSlider.setAttribute('aria-valuetext', rs(estado.valor));
    if (doc.activeElement !== elNum || !deTexto) elNum.value = num.format(Math.round(estado.valor));

    $$('.m-faixa', elFaixas).forEach(function (b, i) {
      b.setAttribute('aria-checked', i === n ? 'true' : 'false');
      b.tabIndex = i === Math.max(0, n) ? 0 : -1;
      b.classList.toggle('alcancada', i < n);
    });

    $$('.m-item', elGrupos).forEach(function (b) {
      var it = ITENS[b.dataset.id], ok = disponivel(it), on = !!estado.sel[it.id];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('trancado', !ok);
      var tag = $('.m-item-tag', b);
      if (it.g.tipo === 'bou') tag.textContent = on ? 'vamos conversar' : 'à parte';
      else if (estado.discreto && VISIVEIS[it.onde]) tag.textContent = 'fora no modo discreto';
      else if (!ok) tag.innerHTML = cadeado + 'pede ' + FAIXAS[it.nivel].nome;
      else tag.textContent = on ? 'incluído' : FAIXAS[it.nivel].nome;
    });

    var sel = ORDEM.filter(function (id) { return estado.sel[id]; });
    var inc = sel.filter(function (id) { return ITENS[id].g.tipo === 'inc'; });
    var bou = sel.filter(function (id) { return ITENS[id].g.tipo === 'bou'; });
    var peso = inc.reduce(function (s, id) { return s + (ITENS[id].peso || 0); }, 0);
    var pres = Math.round(100 * peso / PESO_MAX);
    var onde = {}; inc.forEach(function (id) { onde[ITENS[id].onde] = true; });

    var f = n >= 0 ? FAIXAS[n] : null;
    $('#p-faixa-nome').textContent = f ? f.nome : 'Abaixo de Verso';
    $('#p-faixa-sub').textContent = f ? f.sub : 'mínimo sugerido ' + rs(FAIXAS[0].de);
    $('#p-valor').textContent = rs(estado.valor);
    $('#p-pct').textContent = 'Equivale a ' + (100 * estado.valor / TOTAL).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '% do filme.';
    $('#p-barra').style.width = pres + '%';
    $('#p-presenca').textContent = pres + '%';
    $('#p-n-inc').textContent = inc.length;
    $('#p-n-bou').textContent = bou.length;
    $('#b-faixa').textContent = f ? f.nome : 'Abaixo de Verso';
    $('#b-valor').textContent = rs(estado.valor);

    $$('.m-peca', mesa).forEach(function (p) {
      var k = p.dataset.onde, liga = !!onde[k];
      if (liga && p.classList.contains('off') && !reduz) { p.classList.remove('acende'); void p.offsetWidth; p.classList.add('acende'); }
      p.classList.toggle('on', liga); p.classList.toggle('off', !liga);
    });
    $$('li', chips).forEach(function (li) { li.classList.toggle('on', !!onde[li.dataset.onde]); });
    var ab = $('.m-peca[data-onde="abertura"]', mesa); if (ab) ab.classList.toggle('sem-vinheta', !estado.sel.b6);

    atualizarFiscal();
    resumo(f, inc, bou, onde, pres);
    salvar();
  }

  function atualizarFiscal() {
    var out = $('#m-calc-saida'), pf = $('#p-fiscal');
    if (!estado.irpj) {
      out.innerHTML = 'Informe o IRPJ para ver até quanto a Matuta pode direcionar sem custo.';
      pf.className = 'm-palco-fiscal';
      pf.textContent = 'Para direcionar ' + rs(estado.valor) + ' sem custo, o IRPJ anual da Matuta precisa ser de pelo menos ' + rs(estado.valor / 0.04) + ' (Lucro Real).';
      return;
    }
    var teto = estado.irpj * 0.04;
    out.innerHTML = 'Teto de dedução estimado: <b>' + rs(teto) + '</b> por ano. <button type="button" class="m-usar">Usar esse valor</button>';
    if (estado.valor <= teto) {
      pf.className = 'm-palco-fiscal';
      pf.textContent = 'Cabe no teto de 4%: custo líquido estimado de R$ 0 para a Matuta, com dedução de 100% no Art. 18.';
    } else {
      pf.className = 'm-palco-fiscal alerta';
      pf.textContent = 'Acima do teto em ' + rs(estado.valor - teto) + '. Essa parte não seria deduzida. O aporte pode ser dividido em mais de um ano, se o prazo de captação permitir.';
    }
  }

  /* ---------- resumo, WhatsApp e PDF ---------- */
  function lista(ids) { return ids.map(function (id) { return ITENS[id].t; }); }
  function porGrupo(ids) {
    var m = {}; ids.forEach(function (id) { var g = ITENS[id].g; (m[g.id] = m[g.id] || { g: g, it: [] }).it.push(ITENS[id].t); }); return m;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function resumo(f, inc, bou, onde, pres) {
    var grupos = porGrupo(inc);
    var lugares = Object.keys(onde).map(function (k) { return ONDE[k]; });
    var h = '<div class="m-rs-topo"><div><p class="m-rs-faixa">' + (f ? 'Faixa ' + f.nome + ', ' + f.sub : 'Abaixo da faixa Verso') + '</p><p class="m-rs-valor">' + rs(estado.valor) + '</p>' +
      '<p class="m-rs-faixa">Presença da marca: ' + pres + '%' + (estado.discreto ? ' · patrocínio discreto' : '') + '</p></div>' +
      '<img src="../assets/img/parceria-matuta/matuta-tinta.png" alt="Cachaça Matuta" width="900" height="694"></div><div class="m-rs-colunas">';
    ['A', 'B', 'C', 'D'].forEach(function (k) {
      var g = GRUPOS.filter(function (x) { return x.id === k; })[0];
      h += '<div class="m-rs-bloco"><h4>' + g.t + '</h4>' + (grupos[k] ? '<ul>' + grupos[k].it.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<p class="vazio">Nada escolhido.</p>') + '</div>';
    });
    h += '</div><div class="m-rs-colunas"><div class="m-rs-bloco"><h4>Onde a marca aparece</h4>' + (lugares.length ? '<p>' + esc(lugares.join(', ')) + '.</p>' : '<p class="vazio">Sem exposição de marca.</p>') + '</div>' +
      '<div class="m-rs-bloco bou"><h4>Para negociar com a Bourbon</h4>' + (bou.length ? '<ul>' + lista(bou).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<p class="vazio">Nenhuma produção sob medida por enquanto.</p>') + '</div></div>';
    $('#m-resumo-corpo').innerHTML = h;

    var msg = 'Olá, Raul. Montei a parceria da *Cachaça Matuta* com o documentário *De nada em nada, tudo.*\n\n' +
      '*Faixa:* ' + (f ? f.nome : 'abaixo de Verso') + '\n*Valor simulado:* ' + rs(estado.valor) + '\n*Presença da marca:* ' + pres + '%\n\n' +
      (inc.length ? '*Contrapartidas escolhidas*\n' + lista(inc).map(function (t) { return '- ' + t; }).join('\n') + '\n\n' : '') +
      (bou.length ? '*Produções Bourbon para conversar*\n' + lista(bou).map(function (t) { return '- ' + t; }).join('\n') + '\n\n' : '') +
      (estado.irpj ? '_IRPJ anual estimado: ' + rs(estado.irpj) + '_\n\n' : '') + 'Podemos conversar?';
    var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
    ['#m-wa', '#m-wa-fim'].forEach(function (s) { var a = $(s); if (a) a.href = url; });
    var topoBtn = $('.topo .topo-btn'); if (topoBtn && topoBtn.getAttribute('href') !== '#montar') topoBtn.href = url;

    montarPdf(f, inc, bou, lugares, pres);
  }

  function montarPdf(f, inc, bou, lugares, pres) {
    var grupos = porGrupo(inc);
    var hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    var h = '<header class="pdf-cab"><div class="pdf-cab-txt"><span class="pdf-rot">proposta de parceria</span><div><p class="pdf-tit">De nada em nada, <span>tudo.</span></p>' +
      '<p class="pdf-sub">Documentário · Lei Rouanet · PRONAC 258413 · ' + hoje + '</p></div></div>' +
      '<img src="../assets/img/parceria-matuta/matuta-branca.png" alt="Cachaça Matuta"></header><div class="pdf-faixa"></div>' +
      '<div class="pdf-num"><div><span>Valor simulado</span><b>' + rs(estado.valor) + '</b></div><div><span>Faixa</span><b>' + (f ? f.nome : 'Abaixo de Verso') + '</b></div><div><span>Presença da marca</span><b>' + pres + '%</b></div></div>';
    ['A', 'B', 'C', 'D'].forEach(function (k) {
      if (!grupos[k]) return;
      h += '<section class="pdf-sec"><h2>' + grupos[k].g.t + '</h2><ul>' + grupos[k].it.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    });
    if (lugares.length) h += '<section class="pdf-sec"><h2>Onde a Matuta aparece</h2><p>' + esc(lugares.join(', ')) + '.</p></section>';
    if (bou.length) h += '<section class="pdf-sec bou"><h2>Produções Bourbon sob medida (proposta à parte)</h2><ul>' + lista(bou).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><p>Não saem dos recursos incentivados do filme. Orçamento e contrato próprios.</p></section>';
    h += '<section class="pdf-sec"><h2>O que a Matuta ganha</h2><ul><li>Cultural: ajuda a preservar a poesia nordestina</li><li>Marca: presença dentro de um filme</li><li>Reputação: associação à memória do Nordeste</li><li>Institucional: certificado, relatórios e indicadores ESG</li><li>Conteúdo: imagens e histórias para os canais da marca</li><li>Relacionamento: sessões e experiências com convidados</li><li>Fiscal: dedução de até 100% no Art. 18, dentro do teto de 4% do IRPJ</li></ul></section>' +
      '<section class="pdf-sec"><h2>Próximos passos</h2><ul class="pdf-passos"><li>Conversa para ajustar valor e contrapartidas</li><li>Contabilidade da Matuta confirma Lucro Real e teto</li><li>Termo de patrocínio com as entregas acordadas</li><li>Depósito na conta oficial do projeto no Banco do Brasil</li><li>Recibo de Mecenato e início das contrapartidas</li></ul></section>' +
      '<p class="pdf-nota">Proposta personalizada e sujeita a alinhamento final. Simulação de intenção: não é contrato e não confirma patrocínio. Contrapartidas seguem o plano aprovado pelo Ministério da Cultura e as regras de publicidade de bebidas alcoólicas.</p>' +
      '<footer class="pdf-pe"><span><b>Bourbon Films Ltda</b>, proponente e realizadora. CNPJ 65.711.903/0001-26. Campina Grande, PB.</span><span><b>Raul Lafayette</b> · (83) 99868-3878 · bourbonfilms@gmail.com · poesia.art.br</span></footer>';
    $('#m-pdf').innerHTML = h;
  }

  $$('[data-pdf]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = doc.title;
      doc.title = 'Parceria Cachaça Matuta - De nada em nada, tudo.';
      window.print();
      setTimeout(function () { doc.title = t; }, 1000);
    });
  });

  /* ---------- palco no celular ---------- */
  var folha = $('#m-folha'), slot = $('#m-folha-slot'), palco = $('#m-palco'), casaPalco = palco.parentNode, ultimoFoco = null;
  function abrirPalco() {
    ultimoFoco = doc.activeElement; slot.appendChild(palco); folha.hidden = false;
    doc.body.style.overflow = 'hidden'; $('.m-folha-fechar', folha).focus();
  }
  function fecharPalco() {
    folha.hidden = true; casaPalco.appendChild(palco); doc.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  $$('[data-abre-palco]').forEach(function (b) { b.addEventListener('click', abrirPalco); });
  $$('[data-fecha-palco]').forEach(function (b) { b.addEventListener('click', fecharPalco); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !folha.hidden) fecharPalco(); });
  $('.m-palco-ir', palco).addEventListener('click', function () { if (!folha.hidden) fecharPalco(); });

  var barra = $('#m-barra'), sim = $('#montar');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { barra.classList.toggle('visivel', e.isIntersecting); barra.setAttribute('aria-hidden', e.isIntersecting ? 'false' : 'true'); }); }, { rootMargin: '-30% 0px -30% 0px' }).observe(sim);
    var abertura = $('#m-galeria .m-peca[data-onde="abertura"]');
    if (abertura) new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on-view'); o.disconnect(); } }); }, { threshold: .5 }).observe(abertura);
  }

  /* ---------- memória local (só neste navegador) e link compartilhável ---------- */
  function salvar() {
    var cod = Math.round(estado.valor) + '.' + ORDEM.filter(function (id) { return estado.sel[id]; }).join('-') + (estado.discreto ? '.d' : '');
    try { localStorage.setItem('parceria-matuta', cod); } catch (e) {}
    try { history.replaceState(null, '', '#p=' + cod); } catch (e) {}
  }
  function restaurar() {
    var cod = (location.hash.match(/#p=([\w.\-]+)/) || [])[1];
    if (!cod) { try { cod = localStorage.getItem('parceria-matuta'); } catch (e) {} }
    if (!cod) return false;
    var p = cod.split('.');
    var v = parseInt(p[0], 10); if (!v) return false;
    estado.valor = Math.min(TOTAL, Math.max(MIN, v));
    (p[1] || '').split('-').forEach(function (id) { if (ITENS[id]) estado.sel[id] = true; });
    estado.discreto = p[2] === 'd'; $('#m-discreto').checked = estado.discreto;
    return true;
  }

  /* começa na faixa mais alta, com o pacote completo dela */
  if (!restaurar()) { estado.valor = FAIXAS[3].de; sugerirPacote(3, -1); }
  atualizar(nivelAtual());
})();
