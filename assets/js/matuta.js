/* Configurador de parceria: Cachaça Matuta + De nada em nada, tudo.
   Sem dependências e sem servidor: tudo roda no navegador.
   Para atualizar o saldo de captação, edite CAPTADO e SALDO_EM.
   Para mudar faixas ou contrapartidas, edite NIVEIS e GRUPOS (o campo "min" é o aporte de referência que destrava o item). */
(function () {
  'use strict';

  /* ---------- números do projeto ---------- */
  var VALOR_APROVADO = 865701.10;   /* PRONAC 258413 */
  var CAPTADO = 0;                  /* recursos já captados: atualize quando houver */
  var SALDO_EM = '20/11/2026';      /* data da última atualização do saldo */
  var SALDO = Math.round((VALOR_APROVADO - CAPTADO) * 100) / 100;
  var MIN = 10000;
  var WHATS = '5583998683878';
  var INICIO = 400000;              /* a página abre em Cantoria */
  var INT = 'integral';

  /* faixas de referência comercial (não são cotas nem direitos automáticos) */
  var NIVEIS = [
    { nome: 'Verso',    de: MIN,    sub: 'participação institucional', faixa: 'até R$ 250 mil',          txt: 'Presença institucional e contrapartidas selecionadas.' },
    { nome: 'Estrofe',  de: 250000, sub: 'presença ampliada',          faixa: 'R$ 250 mil a R$ 400 mil', txt: 'Comunicação diferenciada e novas formas de relacionamento.' },
    { nome: 'Cantoria', de: 400000, sub: 'protagonismo',               faixa: 'R$ 400 mil a R$ 600 mil', txt: 'Experiências especiais e conteúdo personalizado.' },
    { nome: 'Mote',     de: 600000, sub: 'máxima relevância',          faixa: 'R$ 600 mil até o saldo',  txt: 'Reconhecimento destacado e ativações negociáveis.' },
    { nome: 'Integral', de: SALDO,  sub: 'patrocinadora integral',     faixa: '100% do saldo',           txt: 'A Matuta viabiliza o filme inteiro. Tratamento exclusivo.' }
  ];

  var COND = {
    prev: 'Contrapartida prevista no projeto aprovado.',
    plano: 'Segue o plano de divulgação aprovado no SALIC.',
    acordo: 'Proposta sujeita a aprovação e formalização no termo de patrocínio.',
    disp: 'Proposta sujeita a disponibilidade, autorizações e formalização.',
    jur: 'A avaliar: depende das regras do projeto aprovado, dos demais patrocinadores, de contratos e de exigências do MinC.',
    bebida: 'Segue as regras de publicidade de bebidas alcoólicas. Para maiores de 18.',
    bou: 'Serviço independente da Bourbon Films: orçamento, contrato e nota próprios. Não entra na dedução fiscal.'
  };

  /* min: aporte de referência que destrava o item (ou INT). onde: peça da visualização. peso: força da presença. */
  var GRUPOS = [
    { id: 'I', t: 'Patrocinador integral', s: 'Só para quem viabiliza todo o saldo do filme', tipo: 'inc', integral: true, itens: [
      { id: 'i1', t: 'Reconhecimento institucional máximo', d: 'A Matuta como patrocinadora integral nos materiais elegíveis.', min: INT, onde: 'cartaz', peso: 7, cond: 'acordo' },
      { id: 'i2', t: 'Assinatura de patrocínio integral nos créditos', d: 'Um cartão próprio nos créditos permitidos.', min: INT, onde: 'creditos', peso: 6, cond: 'acordo' },
      { id: 'i3', t: 'Comunicação especial da parceria', d: 'Peças editoriais sobre o apoio da Matuta à poesia nordestina.', min: INT, onde: 'post', peso: 5, cond: 'plano' },
      { id: 'i4', t: 'Sessão de gala da Matuta', d: 'Exibição especial do filme para convidados da marca.', min: INT, onde: 'sessao', peso: 5, cond: 'disp' },
      { id: 'i5', t: 'Experiência cultural personalizada', d: 'Uma roda com artistas e realizadores pensada para a Matuta.', min: INT, onde: 'evento', peso: 5, cond: 'disp' },
      { id: 'i6', t: 'Acervo exclusivo de bastidores', d: 'Material da produção reservado à Matuta.', min: INT, onde: 'bastidores', peso: 4, cond: 'disp' },
      { id: 'i7', t: 'Documentação da parceria', d: 'Registro editorial e audiovisual da contribuição da Matuta.', min: INT, onde: 'legado', peso: 4, cond: 'acordo' },
      { id: 'i8', t: 'Prioridade na negociação de ativações', d: 'A Matuta discute primeiro as oportunidades de ativação, sem exclusividade indevida.', min: INT, onde: 'evento', peso: 3, cond: 'acordo' },
      { id: 'i9', t: 'Reconhecimento de legado', d: 'Apresentação editorial da contribuição da Matuta para a obra.', min: INT, onde: 'legado', peso: 5, cond: 'acordo' },
      { id: 'i10', t: 'Exclusividade por segmento (a avaliar)', d: 'Nenhuma outra marca de bebida no projeto, se for possível.', min: INT, onde: 'site', peso: 3, cond: 'jur' }
    ]},
    { id: 'A', t: 'Benefícios institucionais', s: 'A base de toda parceria', tipo: 'inc', itens: [
      { id: 'a1', t: 'Logomarca nos créditos finais', d: 'No bloco de patrocínio do filme.', min: MIN, onde: 'creditos', peso: 3, cond: 'prev' },
      { id: 'a2', t: 'Marca em cartazes e impressos', d: 'Na faixa de patrocínio do material gráfico.', min: MIN, onde: 'cartaz', peso: 3, cond: 'prev' },
      { id: 'a3', t: 'Marca no site oficial', d: 'Área de patrocinadores do poesia.art.br.', min: MIN, onde: 'site', peso: 2, cond: 'prev' },
      { id: 'a4', t: 'Citação nas redes do filme', d: 'Menção à patrocinadora nas publicações.', min: MIN, onde: 'post', peso: 2, cond: 'plano' },
      { id: 'a5', t: 'Certificado de patrocinador cultural', d: 'Reconhecimento formal da participação.', min: MIN, onde: 'reconhecimento', peso: 1, cond: 'prev' },
      { id: 'a6', t: 'Relatório final de execução', d: 'Público, alcance e resultados.', min: MIN, onde: 'reconhecimento', peso: 1, cond: 'prev' }
    ]},
    { id: 'B', t: 'Ampliação de destaque', s: 'Mais presença nas peças pertinentes', tipo: 'inc', itens: [
      { id: 'b2', t: 'Posts em colaboração', d: 'Publicações conjuntas nos perfis do filme e da Matuta.', min: 100000, onde: 'post', peso: 3, cond: 'bebida' },
      { id: 'b3', t: 'Agradecimento nos créditos', d: 'Uma dedicatória à Matuta.', min: 100000, onde: 'creditos', peso: 2, cond: 'prev' },
      { id: 'b1', t: 'Logomarca na abertura do filme', d: 'A marca antes do título, na tela grande.', min: 250000, onde: 'abertura', peso: 5, cond: 'plano' },
      { id: 'b4', t: 'Página da patrocinadora no site', d: 'Espaço próprio contando por que a Matuta está aqui.', min: 250000, onde: 'site', peso: 3, cond: 'acordo' },
      { id: 'b5', t: 'Destaque na imprensa', d: 'Rádio, televisão, portais e material de imprensa.', min: 250000, onde: 'imprensa', peso: 4, cond: 'plano' },
      { id: 'b7', t: 'Comunicação dedicada à parceria', d: 'Peças e release próprios sobre a entrada da Matuta.', min: 250000, onde: 'imprensa', peso: 3, cond: 'plano' },
      { id: 'b8', t: 'Destaque reforçado nos créditos e materiais', d: 'Posição de maior aporte no bloco de patrocínio.', min: 600000, onde: 'creditos', peso: 4, cond: 'acordo' },
      { id: 'b6', t: 'Vinheta "Cachaça Matuta apresenta"', d: 'O filme começa com o nome dela.', min: 600000, onde: 'abertura', peso: 7, cond: 'acordo' }
    ]},
    { id: 'C', t: 'Experiências culturais', s: 'Para clientes, parceiros e equipe', tipo: 'inc', itens: [
      { id: 'c1', t: 'Convites para as exibições', d: 'Lugares reservados para convidados da marca.', min: MIN, onde: 'sessao', peso: 2, cond: 'prev' },
      { id: 'c2', t: 'Acesso antecipado ao filme', d: 'A Matuta assiste antes do público.', min: 50000, onde: 'sessao', peso: 1, cond: 'acordo' },
      { id: 'c3', t: 'Sessão para colaboradores', d: 'Uma exibição só para a equipe da Matuta.', min: 150000, onde: 'sessao', peso: 3, cond: 'acordo' },
      { id: 'c4', t: 'Pré-estreia exclusiva', d: 'Noite de estreia com convidados da marca.', min: 250000, onde: 'sessao', peso: 4, cond: 'acordo' },
      { id: 'c5', t: 'Lançamento ao vivo com o Podcast Nordestino', d: 'Presença da marca na transmissão.', min: 250000, onde: 'live', peso: 4, cond: 'acordo' },
      { id: 'c6', t: 'Visita aos bastidores', d: 'Ver o filme acontecendo de perto.', min: 400000, onde: 'bastidores', peso: 2, cond: 'disp' },
      { id: 'c7', t: 'Encontro com equipe e poetas', d: 'Conversa com quem faz e com quem é o filme.', min: 400000, onde: 'bastidores', peso: 3, cond: 'disp' },
      { id: 'c8', t: 'Sarau Matuta', d: 'Noite de cantoria com poetas do filme.', min: 600000, onde: 'evento', peso: 5, cond: 'bebida' }
    ]},
    { id: 'D', t: 'Conteúdos autorizados', s: 'Material do projeto para a comunicação da Matuta', tipo: 'inc', itens: [
      { id: 'd1', t: 'Registro fotográfico da participação', d: 'A presença da Matuta documentada.', min: MIN, onde: 'bastidores', peso: 1, cond: 'prev' },
      { id: 'd2', t: 'Indicadores para comunicação ESG', d: 'Dados de impacto cultural prontos para relatórios.', min: 100000, onde: 'reconhecimento', peso: 2, cond: 'prev' },
      { id: 'd3', t: 'Vídeos de bastidores', d: 'Cenas do processo para os canais da Matuta.', min: 400000, onde: 'bastidores', peso: 3, cond: 'plano' },
      { id: 'd4', t: 'Banco de imagens do projeto', d: 'Fotos do filme para comunicação institucional.', min: 400000, onde: 'bastidores', peso: 2, cond: 'disp' },
      { id: 'd6', t: 'Série de bastidores assinada pela Matuta', d: 'Conteúdo derivado do filme com a assinatura da marca.', min: 400000, onde: 'post', peso: 4, cond: 'acordo' },
      { id: 'd5', t: 'Edição especial numerada', d: 'Materiais do projeto para presentear.', min: 400000, onde: 'reconhecimento', peso: 2, cond: 'acordo' }
    ]},
    { id: 'N', t: 'Ativações negociáveis', s: 'Presença física da marca, dentro das regras de bebidas', tipo: 'inc', itens: [
      { id: 'n2', t: 'Relacionamento com clientes nas exibições', d: 'Convidados da Matuta recebidos como anfitriões.', min: 400000, onde: 'sessao', peso: 3, cond: 'acordo' },
      { id: 'n1', t: 'Ativação de marca nos eventos do filme', d: 'Espaço da Matuta nas exibições e no lançamento.', min: 600000, onde: 'evento', peso: 4, cond: 'bebida' }
    ]},
    { id: 'E', t: 'Produção audiovisual negociável', s: 'Serviços da Bourbon Films, à parte do patrocínio', tipo: 'bou', itens: [
      { id: 'e1', t: 'VT institucional da Matuta', d: 'A história da marca contada pela equipe do filme.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e2', t: 'Minidocumentário da marca', d: 'Formato curto, linguagem de cinema.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e3', t: 'VTs publicitários', d: 'Peças para TV e digital, dentro das regras de bebidas.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e4', t: 'Conteúdo para redes', d: 'Séries e cortes para os perfis da Matuta.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e5', t: 'Captação e foto de produto', d: 'Diárias específicas de câmera e foto.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e6', t: 'Motion e peças especiais', d: 'Animações e formatos sob demanda.', min: MIN, onde: 'producao', cond: 'bou' },
      { id: 'e7', t: 'Campanha audiovisual complementar', d: 'Uma campanha própria da Matuta, planejada junto com o filme.', min: INT, onde: 'producao', cond: 'bou' }
    ]}
  ];

  var PECAS = {
    abertura: 'Abertura do filme', cartaz: 'Cartaz e impressos', creditos: 'Créditos', sessao: 'Sessões especiais', post: 'Redes sociais',
    site: 'Site oficial', evento: 'Experiências e ativações', reconhecimento: 'Reconhecimento', live: 'Lançamento ao vivo', imprensa: 'Imprensa',
    bastidores: 'Bastidores e conteúdo', producao: 'Produção audiovisual', legado: 'Reconhecimento de legado'
  };
  var VISIVEL = { abertura: 1, cartaz: 1, creditos: 1, post: 1, site: 1, imprensa: 1, live: 1, evento: 1, legado: 1 };
  var ICONES = {
    abertura: '<rect x="3" y="6" width="26" height="18" rx="1"/><path d="M13 11l7 4-7 4z" fill="currentColor"/>',
    cartaz: '<rect x="8" y="3" width="16" height="26"/><path d="M11 22h10M11 25h6"/>',
    creditos: '<rect x="5" y="4" width="22" height="24"/><path d="M10 10h12M12 14h8M10 18h12M13 22h6"/>',
    sessao: '<path d="M4 9h24v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6z"/><path d="M12 9v16" stroke-dasharray="2 2"/>',
    post: '<rect x="6" y="4" width="20" height="24" rx="2"/><circle cx="11" cy="9" r="2"/><rect x="9" y="13" width="14" height="10"/>',
    site: '<rect x="3" y="5" width="26" height="22"/><path d="M3 10h26"/>',
    evento: '<path d="M16 4v6M10 7l2 4M22 7l-2 4"/><path d="M8 14h16l-2 14H10z"/>',
    reconhecimento: '<circle cx="16" cy="13" r="8"/><path d="M11 20l-3 9 8-4 8 4-3-9"/>',
    live: '<circle cx="16" cy="13" r="5"/><path d="M8 13a8 8 0 0 0 16 0M16 21v6M11 27h10"/>',
    imprensa: '<rect x="4" y="5" width="24" height="22"/><path d="M8 10h16M8 15h7M8 19h7M8 23h7"/><rect x="18" y="15" width="6" height="8"/>',
    bastidores: '<rect x="4" y="9" width="20" height="16"/><path d="M24 14l5-3v12l-5-3"/><circle cx="14" cy="17" r="4"/>',
    producao: '<rect x="3" y="8" width="8" height="6"/><rect x="12" y="8" width="8" height="6"/><rect x="21" y="8" width="8" height="6"/><path d="M5 19h22M5 23h14"/>',
    legado: '<path d="M6 27V9l10-5 10 5v18"/><path d="M11 27V15h10v12M6 27h20"/>'
  };

  /* ---------- índices ---------- */
  var ITENS = {}, ORDEM = [];
  GRUPOS.forEach(function (g) { g.itens.forEach(function (it) { it.g = g; ITENS[it.id] = it; ORDEM.push(it.id); }); });
  var INC = ORDEM.filter(function (id) { return ITENS[id].g.tipo === 'inc'; });
  var PESO_MAX = INC.reduce(function (s, id) { return s + ITENS[id].peso; }, 0);

  var doc = document;
  var $ = function (s, el) { return (el || doc).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var celular = window.matchMedia ? window.matchMedia('(max-width: 1020px)') : { matches: false };
  var fmtInt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var fmtCts = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var fmtNum = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
  var fmtNum2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function rs(v) { v = Math.round(v * 100) / 100; return (Math.round(v * 100) % 100 ? fmtCts : fmtInt).format(v).replace(/ /g, ' '); }
  function mil(v) { return v >= 1000 && v % 1000 === 0 ? 'R$ ' + (v / 1000) + ' mil' : rs(v); }
  function pctDe(v) { var p = 100 * v / VALOR_APROVADO; return v >= SALDO - 0.005 && !CAPTADO ? 100 : Math.round(p * 10) / 10; }
  function pctTxt(v) { return pctDe(v).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'; }
  function lerNumero(t) { t = String(t || '').trim(); if (!t) return 0; if (/,\d{1,2}$/.test(t)) t = t.replace(/\./g, '').replace(',', '.'); else t = t.replace(/[.,]/g, ''); t = t.replace(/[^\d.]/g, ''); return parseFloat(t) || 0; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function minDe(it) { return it.min === INT ? SALDO : Math.min(it.min, SALDO); }
  function piso(n) { return n === 4 ? SALDO : Math.min(SALDO, NIVEIS[n].de); }

  var estado = { valor: 0, sel: {}, discreto: false, irpj: 0, etapa: 1, presenca: 0, msgEditada: false };
  var historico = [];

  function nivelDe(v) { if (v >= SALDO - 0.005) return 4; var n = 0; for (var i = 1; i < 4; i++) if (NIVEIS[i].de < SALDO && v >= NIVEIS[i].de) n = i; return n; }
  function nivel() { return nivelDe(estado.valor); }
  function integral() { return estado.valor >= SALDO - 0.005; }
  function liberado(it, v) { return it.min === INT ? v >= SALDO - 0.005 : v >= minDe(it) - 0.005; }
  function disponivel(it) {
    if (it.g.tipo === 'inc' && estado.discreto && VISIVEL[it.onde]) return false;
    return liberado(it, estado.valor);
  }
  function rotuloMin(it) { return it.min === INT ? 'patrocínio integral' : 'a partir de ' + mil(minDe(it)); }

  /* ---------- montagem ---------- */
  var elSlider = $('#m-valor-faixa'), elNum = $('#m-valor-num'), elIrpj = $('#m-irpj'), mesa = $('#m-mesa');
  if (!elSlider || !mesa) return;

  var cadeado = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="8" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  function icone(k) { return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">' + ICONES[k] + '</svg>'; }

  $$('.m-cartoes').forEach(function (box) {
    box.dataset.grupos.split(',').forEach(function (gid) {
      var g = GRUPOS.filter(function (x) { return x.id === gid; })[0];
      var sec = doc.createElement('div');
      sec.className = 'm-grupo' + (g.tipo === 'bou' ? ' m-grupo-bou' : '') + (g.integral ? ' m-grupo-int' : '');
      var h = '<div class="m-grupo-cab"><h4 class="m-grupo-t">' + g.t + '</h4><span class="m-grupo-s">' + g.s + '</span></div><div class="m-grupo-lista">';
      g.itens.forEach(function (it) {
        h += '<button type="button" class="m-cartao" data-id="' + it.id + '" aria-pressed="false">' +
          '<span class="m-cartao-icone">' + icone(it.onde) + '</span>' +
          '<span><span class="m-cartao-t">' + it.t + '</span><span class="m-cartao-d">' + it.d + '</span></span>' +
          '<span class="m-cartao-pe"><span>' + PECAS[it.onde] + '</span><span class="m-cartao-tag"></span></span>' +
          '<span class="m-cartao-check" aria-hidden="true"></span></button>';
      });
      h += '</div>' + (g.tipo === 'bou' ? '<p class="m-grupo-nota">Estas produções não saem dos recursos incentivados do filme e não geram dedução fiscal. A Bourbon prepara orçamento e contrato separados, conforme o interesse da Matuta.</p>' : '') +
        (g.integral ? '<p class="m-grupo-nota m-grupo-nota-int">Propostas para negociação. Só viram compromisso depois de aprovadas e formalizadas no termo de patrocínio.</p>' : '');
      sec.innerHTML = h; box.appendChild(sec);
    });
    box.addEventListener('click', function (e) { var b = e.target.closest('.m-cartao'); if (b) alternar(b.dataset.id, b); });
  });

  var elFaixas = $('#m-faixas');
  NIVEIS.forEach(function (n, i) {
    if (i > 0 && i < 4 && n.de >= SALDO) return;
    var b = doc.createElement('button');
    b.type = 'button'; b.className = 'm-faixa m-faixa-' + i; b.dataset.n = i;
    b.innerHTML = '<span class="m-faixa-nome">' + n.nome + '</span><span class="m-faixa-de">' + n.faixa + '</span><span class="m-faixa-txt">' + n.txt + '</span>';
    b.addEventListener('click', function () { definirValor(i === 0 ? Math.min(estado.valor, NIVEIS[1].de - 10000) : piso(i), 'nivel'); });
    elFaixas.appendChild(b);
  });

  var elMarcos = $('#m-marcos');
  [250000, 400000, 600000, SALDO].forEach(function (v, k) {
    if (v > SALDO) return;
    var s = doc.createElement('span'); s.dataset.v = v; s.style.left = (100 * (v - MIN) / (SALDO - MIN)) + '%';
    s.textContent = k === 3 ? '100%' : (v / 1000) + ' mil'; elMarcos.appendChild(s);
  });
  var SUG = [{ r: 'R$ 100 mil', v: 100000 }, { r: 'R$ 250 mil', v: 250000 }, { r: 'R$ 400 mil', v: 400000 }, { r: 'R$ 600 mil', v: 600000 }, { r: '100% do saldo', v: SALDO }];
  var elSug = $('#m-sugeridos');
  SUG.forEach(function (s) {
    if (s.v > SALDO || s.v < MIN) return;
    var b = doc.createElement('button'); b.type = 'button'; b.textContent = s.r; b.dataset.v = s.v; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { definirValor(s.v, 'sugerido'); }); elSug.appendChild(b);
  });
  $('#m-saldo').textContent = 'Valor aprovado: ' + rs(VALOR_APROVADO) + '. Saldo disponível para captação: ' + rs(SALDO) + (CAPTADO ? ' (já captados ' + rs(CAPTADO) + ')' : '') + ', atualizado em ' + SALDO_EM + '. As faixas são referências comerciais para a conversa, não cotas nem direitos automáticos.';

  /* peças da visualização: as da galeria + extras */
  var fontes = $$('#m-galeria .m-peca');
  var tpl = $('#m-pecas-extras'); if (tpl && tpl.content) fontes = fontes.concat($$('.m-peca', tpl.content));
  var ordemMesa = ['abertura', 'cartaz', 'creditos', 'post', 'site', 'imprensa', 'sessao', 'live', 'evento', 'bastidores', 'reconhecimento', 'legado', 'producao'];
  var modelo = {};
  fontes.forEach(function (p) { modelo[p.dataset.onde] = p; });
  function clonar(k) {
    var c = modelo[k].cloneNode(true);
    c.removeAttribute('tabindex'); c.removeAttribute('role'); c.removeAttribute('aria-label');
    $$('img', c).forEach(function (im) { im.alt = ''; im.loading = 'eager'; });
    return c;
  }
  ordemMesa.forEach(function (k) {
    if (!modelo[k]) return;
    var c = clonar(k);
    var fc = $('figcaption', c); if (fc) fc.innerHTML = '<b>' + PECAS[k] + '</b>';
    c.setAttribute('role', 'listitem'); c.tabIndex = 0; c.setAttribute('aria-label', PECAS[k] + '. Toque para ampliar.');
    c.addEventListener('click', function () { focar(k, null, 'ver'); ampliar(k); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focar(k, null, 'ver'); ampliar(k); } });
    mesa.appendChild(c);
  });

  /* galeria pública: tocar amplia */
  $$('#m-galeria .m-peca').forEach(function (p) {
    p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', (PECAS[p.dataset.onde] || 'Peça') + '. Ampliar.');
    p.addEventListener('click', function () { ampliar(p.dataset.onde, true); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ampliar(p.dataset.onde, true); } });
  });

  /* ---------- ampliar peça (galeria, mesa e resumo) ---------- */
  var zoom = $('#m-zoom'), zoomVolta = null;
  function ampliar(k, daGaleria) {
    if (!modelo[k]) return;
    zoomVolta = doc.activeElement;
    var box = $('#m-zoom-peca'); box.innerHTML = '';
    var c = clonar(k); var fc = $('figcaption', c); var legenda = fc ? fc.textContent : PECAS[k]; if (fc) fc.remove();
    box.className = daGaleria ? '' : classesPresencaTxt();
    box.appendChild(c);
    $('#m-zoom-legenda').textContent = (daGaleria ? legenda : PECAS[k]) + ' · simulação ilustrativa';
    zoom.hidden = false; doc.body.classList.add('m-travado');
    $('.m-zoom-fechar', zoom).focus();
  }
  function fecharZoom() { zoom.hidden = true; if (folha.hidden) doc.body.classList.remove('m-travado'); if (zoomVolta) zoomVolta.focus(); }
  $$('[data-fecha-zoom]').forEach(function (b) { b.addEventListener('click', fecharZoom); });

  /* ---------- foco: a peça que acabou de mudar ---------- */
  var focoAtual = 'abertura', iniciado = false;
  function focar(k, it, acao, extra) {
    focoAtual = k;
    var box = $('#m-foco-peca'); box.innerHTML = '';
    if (modelo[k]) { var c = clonar(k); c.addEventListener('click', function () { ampliar(k); }); box.appendChild(c); }
    box.classList.toggle('removida', acao === 'menos');
    if (!reduz) { box.classList.remove('troca'); void box.offsetWidth; box.classList.add('troca'); }
    var rot = { mais: 'Adicionado', menos: 'Removido', ver: 'Pré-visualização', nivel: 'Nova faixa', desfeito: 'Desfeito', integral: 'Patrocínio integral' }[acao] || 'Pré-visualização';
    if (acao !== 'ver' && iniciado) avisoCelular(k, it ? it.t : (extra && extra.t) || PECAS[k], acao);
    var a = $('#m-foco-acao'); a.textContent = rot; a.classList.toggle('menos', acao === 'menos');
    $('#m-foco-t').textContent = it ? it.t : (extra && extra.t) || PECAS[k];
    $('#m-foco-cond').textContent = it ? COND[it.cond] : (extra && extra.cond != null ? extra.cond : 'Toque nas peças abaixo para ampliar cada uma.');
    $('#m-desfazer').hidden = !historico.length || acao === 'ver';
    aplicarEstilos();
  }

  /* no celular, a visualização fica abaixo: um aviso com miniatura mostra cada mudança */
  var toast = doc.createElement('div'); toast.className = 'm-toast'; toast.setAttribute('role', 'status'); doc.body.appendChild(toast);
  var toastT = 0;
  function avisoCelular(k, titulo, acao) {
    if (!celular.matches) return;
    toast.innerHTML = '';
    var mini = doc.createElement('div'); mini.className = 'mk-mini ' + classesPresencaTxt();
    if (modelo[k]) mini.appendChild(clonar(k));
    var t = doc.createElement('p'); t.className = 'm-toast-t';
    t.innerHTML = '<b>' + ({ mais: 'Adicionado', menos: 'Removido', nivel: 'Nova faixa', desfeito: 'Desfeito', integral: 'Patrocínio integral' }[acao] || '') + '</b>' + esc(titulo);
    toast.appendChild(mini); toast.appendChild(t);
    if (acao !== 'desfeito' && historico.length) { var b = doc.createElement('button'); b.type = 'button'; b.textContent = 'Desfazer'; b.addEventListener('click', desfazer); toast.appendChild(b); }
    toast.classList.toggle('menos', acao === 'menos'); toast.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 3800);
  }

  /* ---------- ações com histórico ---------- */
  function guardar() {
    historico.push(JSON.stringify({ valor: estado.valor, sel: estado.sel, discreto: estado.discreto }));
    if (historico.length > 40) historico.shift();
  }
  function desfazer() {
    if (!historico.length) return;
    var h = JSON.parse(historico.pop());
    estado.valor = h.valor; estado.sel = h.sel; estado.discreto = h.discreto; $('#m-discreto').checked = h.discreto;
    atualizar(); focar(focoAtual, null, 'desfeito', { t: 'A última escolha foi desfeita.', cond: '' });
  }
  function destravar(de, ate) {
    var novos = 0;
    INC.forEach(function (id) {
      var it = ITENS[id];
      if (!liberado(it, de) && liberado(it, ate) && !(estado.discreto && VISIVEL[it.onde]) && !estado.sel[id]) { estado.sel[id] = true; novos++; }
    });
    return novos;
  }
  function podar() {
    var fora = 0;
    ORDEM.forEach(function (id) { if (estado.sel[id] && !disponivel(ITENS[id])) { delete estado.sel[id]; fora++; } });
    return fora;
  }
  function msgNivel(antes, agora, n, subiu) {
    var N = NIVEIS[agora];
    if (agora === 4 && subiu) return { t: 'A Matuta viabiliza o filme inteiro', cond: 'Surgiram ' + n + ' novas oportunidades, incluindo as exclusivas do patrocínio integral. Todas são propostas de negociação até a formalização.' };
    if (subiu) return { t: N.nome + ': ' + N.sub, cond: n ? (n === 1 ? 'Mais 1 contrapartida entrou' : 'Mais ' + n + ' contrapartidas entraram') + ' na proposta. Desmarque o que não quiser.' : 'Faixa alcançada.' };
    return { t: N.nome + ': ' + N.sub, cond: n ? (n === 1 ? '1 contrapartida saiu porque pede' : n + ' contrapartidas saíram porque pedem') + ' aporte maior.' : 'Faixa ajustada.' };
  }
  function pecaDoNivel(n) { return n === 4 ? 'cartaz' : n >= 3 ? 'abertura' : n >= 2 ? 'bastidores' : n >= 1 ? 'abertura' : 'creditos'; }
  function mudouValor(antesV) {
    var antes = nivelDe(antesV), agora = nivel(), subiu = estado.valor > antesV, n = 0;
    if (subiu) n = destravar(antesV, estado.valor); else n = podar();
    return { antes: antes, agora: agora, subiu: subiu, n: n };
  }
  function avisarMudanca(r) {
    if (r.agora !== r.antes || r.n) focar(pecaDoNivel(r.agora), null, r.agora === 4 && r.subiu ? 'integral' : 'nivel', msgNivel(r.antes, r.agora, r.n, r.subiu));
  }

  function alternar(id, botao) {
    var it = ITENS[id];
    if (estado.sel[id]) {
      guardar(); delete estado.sel[id];
      atualizar(); focar(it.onde, it, 'menos'); return;
    }
    if (it.g.tipo === 'inc' && estado.discreto && VISIVEL[it.onde]) {
      focar(it.onde, it, 'ver');
      $('#m-foco-cond').textContent = 'O patrocínio discreto está ligado: a marca não aparece em peças. Desligue a opção para escolher este item.';
      return;
    }
    guardar();
    var extra = '';
    if (!liberado(it, estado.valor)) {
      var antesV = estado.valor;
      estado.valor = minDe(it);
      var r = mudouValor(antesV);
      extra = ' O aporte subiu para ' + rs(estado.valor) + ' (' + pctTxt(estado.valor) + ', ' + NIVEIS[r.agora].nome + ')' + (r.n > 1 ? ' e liberou mais ' + (r.n - 1) + (r.n - 1 === 1 ? ' contrapartida.' : ' contrapartidas.') : '.');
    }
    estado.sel[id] = true;
    atualizar();
    focar(it.onde, it, 'mais');
    if (extra) $('#m-foco-cond').textContent = COND[it.cond] + extra;
    if (botao && !reduz) { botao.classList.remove('pulsa'); void botao.offsetWidth; botao.classList.add('pulsa'); }
  }

  function definirValor(v, origem) {
    v = Math.round(Math.min(SALDO, Math.max(MIN, v || MIN)) * 100) / 100;
    if (Math.abs(v - estado.valor) < 0.005) { atualizar(origem === 'texto'); return; }
    guardar();
    var antesV = estado.valor;
    estado.valor = v;
    var r = mudouValor(antesV);
    atualizar(origem === 'texto');
    avisarMudanca(r);
  }

  /* ---------- eventos ---------- */
  function deSlider(p) { if (p >= 1000) return SALDO; return Math.round((MIN + (SALDO - MIN) * p / 1000) / 5000) * 5000; }
  function paraSlider(v) { return Math.round(1000 * (v - MIN) / (SALDO - MIN)); }
  var arrastando = false;
  elSlider.addEventListener('input', function () {
    if (!arrastando) { guardar(); arrastando = true; }
    var antesV = estado.valor;
    estado.valor = Math.min(SALDO, deSlider(+elSlider.value));
    var r = mudouValor(antesV);
    atualizar();
    if (r.agora !== r.antes) avisarMudanca(r);
  });
  elSlider.addEventListener('change', function () { arrastando = false; });
  elNum.addEventListener('change', function () {
    var v = lerNumero(elNum.value);
    if (v > SALDO) { definirValor(SALDO, 'texto'); focar('cartaz', null, 'integral', { t: 'Limite do saldo disponível', cond: 'O saldo disponível para captação é ' + rs(SALDO) + '. O valor foi ajustado para o patrocínio integral.' }); }
    else definirValor(v, 'texto');
  });
  elNum.addEventListener('focus', function () { elNum.select(); });
  elNum.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); elNum.blur(); } });
  $('#m-integral-btn').addEventListener('click', function () { definirValor(integral() ? 400000 : SALDO, 'integral'); });
  elIrpj.addEventListener('input', function () { estado.irpj = lerNumero(elIrpj.value); atualizarFiscal(); montarProposta(); });
  elIrpj.addEventListener('blur', function () { if (estado.irpj) elIrpj.value = fmtNum.format(estado.irpj); });
  $('#m-calc-saida').addEventListener('click', function (e) { if (e.target.closest('.m-usar')) definirValor(Math.floor(estado.irpj * 0.04 / 1000) * 1000, 'irpj'); });
  $('#m-discreto').addEventListener('change', function (e) {
    guardar(); estado.discreto = e.target.checked;
    var f = podar(); atualizar();
    focar(estado.discreto ? 'reconhecimento' : 'abertura', null, 'nivel', { t: estado.discreto ? 'Patrocínio discreto' : 'Marca visível de novo', cond: estado.discreto ? 'A marca sai das peças públicas' + (f ? ' (' + f + ' itens removidos)' : '') + '. Ficam certificado, relatórios e experiências.' : 'Escolha de novo onde a marca aparece.' });
  });
  $('#m-desfazer').addEventListener('click', desfazer);
  $('#m-integral-revela').addEventListener('click', function (e) {
    if (e.target.closest('[data-integral]')) definirValor(SALDO, 'integral');
    var v = e.target.closest('[data-ir-etapa]'); if (v) irEtapa(+v.dataset.irEtapa, true);
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!zoom.hidden) fecharZoom(); else if (!folha.hidden) fecharFolha(); }
    var a = doc.activeElement;
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !(a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'range' && a.type !== 'checkbox'))) { e.preventDefault(); desfazer(); }
  });

  /* ---------- etapas ---------- */
  var etapas = $$('.m-etapa[data-etapa]'), trilha = $$('#m-trilha-passos li'), bVoltar = $('#m-voltar'), bAvancar = $('#m-avancar');
  var NOMES_ETAPA = ['Quanto investir?', 'Como participar?', 'Onde sua marca aparece?', 'O que mais podemos produzir?', 'Sua proposta Matuta'];
  function irEtapa(n, rolar) {
    estado.etapa = Math.max(1, Math.min(5, n));
    etapas.forEach(function (el) {
      var on = +el.dataset.etapa === estado.etapa;
      if (on && el.hidden && !reduz) { el.classList.remove('entra'); void el.offsetWidth; el.classList.add('entra'); }
      el.hidden = !on;
    });
    trilha.forEach(function (li, i) {
      li.classList.toggle('feito', i + 1 < estado.etapa); li.classList.toggle('atual', i + 1 === estado.etapa);
      var b = $('button', li); if (i + 1 === estado.etapa) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    $('#m-trilha-feito').style.strokeDashoffset = 100 - 25 * (estado.etapa - 1);
    bVoltar.disabled = estado.etapa === 1;
    bAvancar.hidden = estado.etapa === 5;
    bAvancar.textContent = estado.etapa === 4 ? 'Ver minha proposta' : 'Continuar';
    if (rolar) {
      var topo = $('.m-trilha').getBoundingClientRect().top;
      if (topo < 0 || topo > window.innerHeight * .5) window.scrollTo({ top: window.scrollY + topo - 80, behavior: reduz ? 'auto' : 'smooth' });
      var h = $('.m-etapa-h', etapas[estado.etapa - 1]); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    }
    atualizarProximo(); salvar();
  }
  trilha.forEach(function (li, i) { $('button', li).addEventListener('click', function () { irEtapa(i + 1, true); }); });
  bVoltar.addEventListener('click', function () { irEtapa(estado.etapa - 1, true); });
  bAvancar.addEventListener('click', function () { irEtapa(estado.etapa + 1, true); });

  /* ---------- atualização ---------- */
  function sel(tipo) { return ORDEM.filter(function (id) { return estado.sel[id] && (!tipo || ITENS[id].g.tipo === tipo); }); }
  function classesPresenca() {
    var amplo = ['b1', 'b2', 'b4', 'b5', 'b6', 'b8'].some(function (id) { return estado.sel[id]; });
    return { amplo: amplo, integral: !!(estado.sel.i1 || estado.sel.i2), vinheta: !!estado.sel.b6 };
  }
  function classesPresencaTxt() { var c = classesPresenca(); return (c.amplo ? 'amplo ' : '') + (c.integral ? 'integral-on ' : '') + (c.vinheta ? '' : 'sem-vinheta'); }
  function aplicarEstilos() {
    var c = classesPresenca();
    [mesa, $('#m-foco-peca')].forEach(function (el) {
      el.classList.toggle('amplo', c.amplo); el.classList.toggle('integral-on', c.integral); el.classList.toggle('sem-vinheta', !c.vinheta);
    });
  }

  function atualizar(deTexto) {
    podar();
    var n = nivel(), N = NIVEIS[n], v = estado.valor;
    elSlider.value = paraSlider(v);
    elSlider.style.setProperty('--pct', (elSlider.value / 10) + '%');
    elSlider.setAttribute('aria-valuetext', rs(v) + ', ' + pctTxt(v) + ' do projeto, faixa ' + N.nome);
    if (doc.activeElement !== elNum || !deTexto) elNum.value = v % 1 ? fmtNum2.format(v) : fmtNum.format(v);
    $('#m-valor-pct').textContent = pctTxt(v);
    $$('span', elMarcos).forEach(function (s) { s.classList.toggle('ok', v >= +s.dataset.v - 0.005); });
    $$('button', elSug).forEach(function (b) { b.setAttribute('aria-pressed', Math.abs(+b.dataset.v - v) < 1 ? 'true' : 'false'); });
    $$('.m-faixa', elFaixas).forEach(function (b) { var i = +b.dataset.n; b.setAttribute('aria-current', i === n ? 'true' : 'false'); b.classList.toggle('passou', i < n); });
    $('#m-integral-btn').setAttribute('aria-pressed', n === 4 ? 'true' : 'false');
    $('#m-integral-sub').textContent = n === 4 ? 'Selecionado: ' + rs(SALDO) + ', todo o saldo disponível. Toque de novo para voltar a R$ 400 mil.' : 'Todo o saldo disponível: ' + rs(SALDO) + '. A Matuta como patrocinadora integral do filme.';
    doc.body.classList.toggle('m-modo-integral', n === 4);

    $$('.m-cartao').forEach(function (b) {
      var it = ITENS[b.dataset.id], ok = disponivel(it), on = !!estado.sel[it.id];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('trancado', !ok);
      var tag = $('.m-cartao-tag', b);
      if (estado.discreto && it.g.tipo === 'inc' && VISIVEL[it.onde]) tag.textContent = 'fora no modo discreto';
      else if (!ok) tag.innerHTML = cadeado + rotuloMin(it);
      else if (it.g.tipo === 'bou') tag.textContent = on ? 'para orçar' : 'à parte';
      else if (it.cond === 'jur') tag.textContent = on ? 'a avaliar' : 'disponível';
      else tag.textContent = on ? (it.cond === 'prev' ? 'previsto' : 'proposta') : 'disponível';
      b.setAttribute('aria-label', it.t + '. ' + (on ? 'Selecionado' : ok ? 'Disponível' : 'Bloqueado, ' + rotuloMin(it)) + '.');
    });

    var inc = sel('inc'), bou = sel('bou');
    var onde = {}; inc.forEach(function (id) { onde[ITENS[id].onde] = true; }); if (bou.length) onde.producao = true;
    estado.presenca = Math.round(100 * inc.reduce(function (s, id) { return s + ITENS[id].peso; }, 0) / PESO_MAX);

    $('#p-pct').textContent = pctTxt(v);
    $('#p-valor').textContent = rs(v);
    $('#p-faixa-nome').textContent = N.nome;
    $('#p-faixa-sub').textContent = N.sub;
    $('#p-part').style.width = Math.min(100, 100 * v / SALDO) + '%';
    $('#p-integral').hidden = n !== 4;
    $('#m-palco').classList.toggle('integral', n === 4);
    $('#p-n-inc').textContent = inc.length;
    $('#p-n-bou').textContent = bou.length;
    $('#p-n-mais').textContent = INC.filter(function (id) { return !liberado(ITENS[id], v); }).length;

    $$('.m-peca', mesa).forEach(function (p) {
      var k = p.dataset.onde, liga = !!onde[k];
      if (liga && p.classList.contains('off') && !reduz) { p.classList.remove('acende'); void p.offsetWidth; p.classList.add('acende'); }
      p.classList.toggle('on', liga); p.classList.toggle('off', !liga);
    });
    aplicarEstilos();
    $('#b-pct').textContent = pctTxt(v); $('#b-valor').textContent = rs(v);
    atualizarRevela(); atualizarFiscal(); atualizarProximo(); montarProposta(); salvar();
    if (!folha.hidden) montarFolha();
  }

  /* revelação do patrocínio integral (etapa 1) */
  function atualizarRevela() {
    var el = $('#m-integral-revela'), ints = GRUPOS[0].itens;
    if (integral()) {
      el.className = 'm-integral-revela aberta';
      el.innerHTML = '<p class="m-ir-rot">Patrocinador integral</p><p class="m-ir-tit">A Matuta pode ajudar a fazer toda essa história acontecer.</p>' +
        '<ol class="m-ir-lista">' + ints.map(function (it) { return '<li><b>' + esc(it.t) + '</b><span>' + esc(it.d) + '</span></li>'; }).join('') + '</ol>' +
        '<p class="m-ir-nota">Simulação de negociação. Estes benefícios são propostas e só passam a valer depois de aprovados e formalizados. Exclusividade depende de análise.</p>' +
        '<button type="button" class="btn" data-ir-etapa="2">Ver como a marca aparece</button>';
    } else {
      var faltam = INC.filter(function (id) { return !liberado(ITENS[id], estado.valor); }).length;
      el.className = 'm-integral-revela';
      el.innerHTML = '<p class="m-ir-teaser"><b>No patrocínio integral:</b> ' + ints.length + ' oportunidades exclusivas' + (faltam - ints.length > 0 ? ' e mais ' + (faltam - ints.length) + ' contrapartidas que hoje estão bloqueadas.' : '.') + ' <button type="button" class="m-usar" data-integral>Ver o que muda</button></p>';
    }
  }

  function atualizarProximo() {
    var el = $('#p-prox'), v = estado.valor;
    var proxItens = INC.filter(function (id) { return !liberado(ITENS[id], v); }).map(function (id) { return ITENS[id]; });
    if (proxItens.length) {
      var alvo = Math.min.apply(null, proxItens.map(minDe));
      var novos = proxItens.filter(function (it) { return minDe(it) === alvo; });
      el.innerHTML = 'Com mais <b>' + rs(alvo - v) + '</b> (' + (alvo >= SALDO - 0.005 ? 'patrocínio integral' : mil(alvo)) + '), a Matuta destrava ' + novos.length + (novos.length === 1 ? ' contrapartida: ' : ' contrapartidas, como ') + esc(novos[0].t) + '.';
    } else el.innerHTML = 'Todas as oportunidades estão abertas. Próxima etapa: <b>' + NOMES_ETAPA[Math.min(4, estado.etapa)] + '</b>';
  }

  function fiscalTexto() {
    if (!estado.irpj) return 'Para direcionar ' + rs(estado.valor) + ' com dedução, a Matuta precisa ser tributada pelo Lucro Real e ter IRPJ anual de pelo menos ' + rs(estado.valor / 0.04) + ' (teto de 4%). Enquadramento e dedução dependem da confirmação da contabilidade.';
    var teto = estado.irpj * 0.04;
    if (estado.valor <= teto) return 'Cabe no teto estimado de ' + rs(teto) + ' (4% do IRPJ). Com Lucro Real e enquadramento confirmado no Art. 18, a dedução pode chegar a 100% do aporte cultural.';
    return 'O aporte passa o teto estimado de ' + rs(teto) + ' em ' + rs(estado.valor - teto) + '. Essa parte não seria deduzida no ano; o aporte pode ser dividido em mais de um ano, se o prazo de captação permitir.';
  }
  function atualizarFiscal() {
    var out = $('#m-calc-saida');
    if (!estado.irpj) out.textContent = 'Informe o IRPJ para ver até quanto a Matuta pode direcionar com dedução.';
    else out.innerHTML = 'Teto estimado de dedução: <b>' + rs(estado.irpj * 0.04) + '</b> por ano (4% do IRPJ). <button type="button" class="m-usar">Usar esse valor</button>';
  }

  /* ---------- proposta, comparador, mensagem ---------- */
  function porGrupo(ids) { var m = {}; ids.forEach(function (id) { var g = ITENS[id].g; (m[g.id] = m[g.id] || { g: g, it: [] }).it.push(ITENS[id].t); }); return m; }
  function lista(arr) { return '<ul>' + arr.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
  var ORDEM_GR = ['I', 'A', 'B', 'C', 'D', 'N'];

  function comparadorHTML(compacto) {
    var v = estado.valor, inc = sel('inc'), atual = integral() ? 400000 : v;
    var incAtual = integral() ? INC.filter(function (id) { return liberado(ITENS[id], atual); }) : inc;
    var novos = INC.filter(function (id) { return !liberado(ITENS[id], atual); }).map(function (id) { return ITENS[id]; });
    var exclusivos = novos.filter(function (it) { return it.min === INT; }), outros = novos.filter(function (it) { return it.min !== INT; });
    var tem = function (id, val) { return liberado(ITENS[id], val); };
    var cmp = [
      ['Aporte', rs(atual) + ' (' + pctTxt(atual) + ')', rs(SALDO) + ' (100% do saldo)'],
      ['Faixa', NIVEIS[nivelDe(atual)].nome, 'Patrocinador integral'],
      ['Créditos', tem('b8', atual) ? 'Destaque de maior aporte' : 'Bloco de patrocínio', 'Cartão de patrocínio integral'],
      ['Cartaz', 'Faixa de patrocínio', '"Cachaça Matuta apresenta" com reconhecimento máximo'],
      ['Abertura', tem('b6', atual) ? 'Vinheta "apresenta"' : tem('b1', atual) ? 'Logomarca' : 'Sem presença', 'Vinheta "apresenta"'],
      ['Contrapartidas possíveis', String(incAtual.length), String(INC.length)],
      ['Gala, legado e documentação', 'Não incluídos', 'Propostos para negociação']
    ];
    var h = '<div class="m-cmp-cols"><div class="m-cmp-col"><p class="m-cmp-rot">' + (integral() ? 'Parceria de referência' : 'Minha parceria atual') + '</p><p class="m-cmp-v">' + rs(atual) + '</p></div>' +
      '<div class="m-cmp-col m-cmp-int"><p class="m-cmp-rot">Com patrocínio integral</p><p class="m-cmp-v">' + rs(SALDO) + '</p></div></div>';
    if (!compacto) h += '<div class="m-cmp-pecas" aria-hidden="true"><div class="' + (tem('b1', atual) ? 'amplo ' : '') + 'sem-vinheta">' + clonar('cartaz').outerHTML + '</div><div class="amplo integral-on">' + clonar('cartaz').outerHTML + '</div></div>';
    h += '<table class="m-cmp-tab"><thead><tr><th scope="col"><span class="visualmente-oculto">Item</span></th><th scope="col">Atual</th><th scope="col">Integral</th></tr></thead><tbody>' + cmp.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table>';
    h += '<p class="m-cmp-sub">O integral acrescenta ' + exclusivos.length + ' oportunidades exclusivas' + (outros.length ? ' e destrava mais ' + outros.length + ' contrapartidas' : '') + ':</p>' +
      '<ul class="m-cmp-novos">' + novos.slice(0, compacto ? 6 : 30).map(function (it) { return '<li' + (it.min === INT ? ' class="ex"' : '') + '>' + esc(it.t) + '</li>'; }).join('') + (compacto && novos.length > 6 ? '<li>e mais ' + (novos.length - 6) + '</li>' : '') + '</ul>';
    h += integral() ? '<button type="button" class="btn vazado" data-cmp="400000">Simular R$ 400 mil</button>' : '<button type="button" class="btn" data-cmp="' + SALDO + '">Simular patrocínio integral</button>';
    h += '<p class="legenda">Diferenças baseadas nas contrapartidas desta proposta. Nada aqui é direito adquirido antes da formalização.</p>';
    return h;
  }

  function mensagem(n, gr, bou) {
    var msg;
    if (n === 4) msg = 'Olá! Analisamos a proposta personalizada para a Matuta e gostaríamos de conversar sobre a possibilidade de viabilizar integralmente o documentário *De nada em nada, tudo.*, com aporte cultural de *' + rs(estado.valor) + '* (100% do saldo disponível), incluindo as oportunidades especiais de presença e relacionamento apresentadas na página.\n\n';
    else msg = 'Olá! Analisamos a proposta de patrocínio do documentário *De nada em nada, tudo.* e gostaríamos de conversar sobre uma participação de *' + rs(estado.valor) + '*, correspondente a *' + pctTxt(estado.valor) + '* do projeto (faixa ' + NIVEIS[n].nome + ').\n\n';
    ORDEM_GR.forEach(function (k) { if (gr[k]) msg += '*' + gr[k].g.t + ':* ' + gr[k].it.join('; ') + '.\n'; });
    if (bou.length) msg += '\n*Serviços da Bourbon para orçar à parte, fora do patrocínio:* ' + bou.map(function (id) { return ITENS[id].t; }).join('; ') + '.\n';
    return msg + '\nCachaça Matuta';
  }

  var elMsg = $('#m-msg-txt');
  function atualizarLinksWhats() {
    var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(elMsg.value);
    ['#m-wa', '#m-wa-fim', '#m-folha-wa'].forEach(function (s) { var a = $(s); if (a) a.href = url; });
  }
  elMsg.addEventListener('input', function () { estado.msgEditada = true; $('#m-msg-reset').hidden = false; atualizarLinksWhats(); });
  $('#m-msg-reset').addEventListener('click', function () { estado.msgEditada = false; this.hidden = true; montarProposta(); });

  function montarProposta() {
    var n = nivel(), inc = sel('inc'), bou = sel('bou'), gr = porGrupo(inc);
    var total = !bou.length ? rs(estado.valor) : rs(estado.valor) + ' + serviços a orçar';
    var prev = inc.filter(function (id) { return ITENS[id].cond === 'prev'; }).length;
    var h = '<div class="m-pr-topo"><div><p class="m-etapa-n">' + (n === 4 ? 'Patrocinador integral' : 'Faixa ' + NIVEIS[n].nome + ', ' + NIVEIS[n].sub) + '</p>' +
      '<p class="m-pr-sub">Matuta + De nada em nada, tudo.</p></div>' +
      '<img class="mk-logo" src="../assets/img/parceria-matuta/matuta-tinta.png" alt="Cachaça Matuta" width="900" height="694"></div>' +
      '<dl class="m-pr-linhas">' +
      '<div><dt>Aporte cultural pretendido<small>' + pctTxt(estado.valor) + ' do projeto, via Lei Rouanet</small></dt><dd>' + rs(estado.valor) + '</dd></div>' +
      '<div><dt>Contrapartidas culturais selecionadas<small>' + prev + ' previstas no projeto, ' + (inc.length - prev) + ' propostas a formalizar</small></dt><dd>' + inc.length + '</dd></div>' +
      '<div><dt>Serviços adicionais sob negociação<small>Bourbon Films, sem dedução fiscal</small></dt><dd>' + (bou.length ? bou.length + ', a orçar' : 'nenhum') + '</dd></div>' +
      '<div class="m-pr-total"><dt>Total comercial estimado<small>' + (bou.length ? 'aporte cultural + serviços independentes' : 'igual ao aporte cultural') + '</small></dt><dd>' + total + '</dd></div></dl>' +
      '<div class="m-pr-cols">';
    ORDEM_GR.forEach(function (k) { if (gr[k]) h += '<div class="m-pr-bloco' + (k === 'I' ? ' int' : '') + '"><h4>' + gr[k].g.t + '</h4>' + lista(gr[k].it) + '</div>'; });
    h += '<div class="m-pr-bloco bou"><h4>Produção audiovisual negociável</h4>' + (bou.length ? lista(bou.map(function (id) { return ITENS[id].t; })) : '<p class="vazio">Nenhum serviço escolhido.</p>') + '</div></div>' +
      '<p class="legenda m-pr-fiscal">' + esc(fiscalTexto()) + ' Serviços da Bourbon não são dedutíveis.</p>';
    $('#m-proposta').innerHTML = h;
    $('#m-comparar').innerHTML = comparadorHTML(false);
    if (!estado.msgEditada) elMsg.value = mensagem(n, gr, bou);
    atualizarLinksWhats();
    montarPdf(n, inc, bou, gr, total);
  }
  doc.addEventListener('click', function (e) { var b = e.target.closest('[data-cmp]'); if (b) definirValor(+b.dataset.cmp, 'nivel'); });
  $('#m-copiar').addEventListener('click', function () {
    var b = this;
    function ok() { b.textContent = 'Mensagem copiada'; setTimeout(function () { b.textContent = 'Copiar mensagem'; }, 2000); }
    function velho() { elMsg.select(); try { doc.execCommand('copy'); ok(); } catch (e) {} }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(elMsg.value).then(ok, velho); else velho();
  });

  /* ---------- resumo fixo e folha no celular ---------- */
  var barra = $('#m-barra'), folha = $('#m-folha'), folhaVolta = null;
  function montarFolha() {
    var n = nivel(), inc = sel('inc'), bou = sel('bou'), gr = porGrupo(inc);
    var h = '<div class="m-fl-num"><div><span>Aporte selecionado</span><b>' + rs(estado.valor) + '</b></div><div><span>Do projeto</span><b>' + pctTxt(estado.valor) + '</b></div><div><span>Faixa</span><b>' + NIVEIS[n].nome + '</b></div></div>';
    var pecas = ['abertura', 'cartaz', 'creditos', 'post', 'sessao', 'evento', 'legado'].filter(function (k) { return inc.some(function (id) { return ITENS[id].onde === k; }); });
    if (pecas.length) h += '<p class="m-fl-rot">Toque para ampliar</p><div class="m-fl-pecas">' + pecas.map(function (k) { return '<button type="button" class="m-fl-peca" data-zoom="' + k + '"><span class="m-fl-mini ' + classesPresencaTxt() + '">' + clonar(k).outerHTML + '</span><b>' + PECAS[k] + '</b></button>'; }).join('') + '</div>';
    ORDEM_GR.forEach(function (k) { if (gr[k]) h += '<h4>' + gr[k].g.t + '</h4>' + lista(gr[k].it); });
    if (bou.length) h += '<h4>Para orçar com a Bourbon (fora do patrocínio)</h4>' + lista(bou.map(function (id) { return ITENS[id].t; }));
    h += '<details class="m-fl-cmp"' + (n === 4 ? '' : ' open') + '><summary>Comparar com o patrocínio integral</summary>' + comparadorHTML(true) + '</details>';
    h += '<div class="m-fl-acoes"><button type="button" class="btn" data-ir-proposta>Ver proposta completa</button><a class="btn vazado" id="m-folha-wa" target="_blank" rel="noopener noreferrer" href="#">Conversar no WhatsApp</a><button type="button" class="btn vazado" data-pdf>Gerar PDF</button></div>';
    $('#m-folha-conteudo').innerHTML = h;
    atualizarLinksWhats();
  }
  function abrirFolha() { folhaVolta = doc.activeElement; montarFolha(); folha.hidden = false; doc.body.classList.add('m-travado'); $('.m-folha-fechar', folha).focus(); }
  function fecharFolha() { folha.hidden = true; doc.body.classList.remove('m-travado'); if (folhaVolta) folhaVolta.focus(); }
  $('#m-barra-abre').addEventListener('click', abrirFolha);
  $$('[data-fecha-folha]').forEach(function (b) { b.addEventListener('click', fecharFolha); });
  folha.addEventListener('click', function (e) {
    if (e.target.closest('[data-ir-proposta]')) { fecharFolha(); irEtapa(5, true); }
    var z = e.target.closest('[data-zoom]'); if (z) ampliar(z.dataset.zoom);
  });
  /* teclado do celular aberto: a barra sai do caminho e o campo fica visível */
  doc.addEventListener('focusin', function (e) {
    var t = e.target;
    if (/INPUT|TEXTAREA/.test(t.tagName) && t.type !== 'range' && t.type !== 'checkbox') {
      barra.classList.add('teclado');
      if (celular.matches && t.scrollIntoView) setTimeout(function () { t.scrollIntoView({ block: 'center' }); }, 300);
    }
  });
  doc.addEventListener('focusout', function () { barra.classList.remove('teclado'); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { barra.classList.toggle('visivel', e.isIntersecting); }); }, { rootMargin: '-15% 0px -15% 0px' }).observe($('#montar'));
    var ab = $('#m-galeria .m-peca[data-onde="abertura"]');
    if (ab) new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on-view'); o.disconnect(); } }); }, { threshold: .5 }).observe(ab);
  }

  /* ---------- PDF (impressão do navegador) ---------- */
  function montarPdf(n, inc, bou, gr, total) {
    var hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    var IMG = '../assets/img/parceria-matuta/';
    var pecasOn = ['abertura', 'cartaz', 'creditos', 'sessao', 'post', 'evento', 'legado', 'site', 'imprensa', 'live', 'bastidores', 'reconhecimento'].filter(function (k) { return inc.some(function (id) { return ITENS[id].onde === k; }); });
    function clone(k) { var c = clonar(k); var fc = $('figcaption', c); if (fc) fc.innerHTML = '<b>' + PECAS[k] + '</b>'; $$('img', c).forEach(function (im) { im.removeAttribute('loading'); }); return c.outerHTML; }
    var cls = ' ' + classesPresencaTxt();
    var previstos = inc.filter(function (id) { return ITENS[id].cond === 'prev'; }).map(function (id) { return ITENS[id].t; });
    var propostos = inc.filter(function (id) { return ITENS[id].cond !== 'prev' && ITENS[id].cond !== 'jur'; }).map(function (id) { return ITENS[id].t; });
    var avaliar = inc.filter(function (id) { return ITENS[id].cond === 'jur'; }).map(function (id) { return ITENS[id].t; });
    var h = '';
    if (n === 4) {
      h += '<section class="pdf-capa' + cls + '"><div><span class="pdf-capa-rot">proposta de patrocínio integral · simulação de negociação</span>' +
        '<p class="pdf-capa-tit">A Matuta pode ajudar a fazer toda essa história acontecer.</p></div>' +
        '<div class="pdf-capa-pecas">' + clone('abertura') + clone('cartaz') + '</div>' +
        '<div><div class="pdf-capa-logos"><img src="' + IMG + 'matuta-papel.png" alt="Cachaça Matuta"><span class="pdf-capa-x">+</span><p class="pdf-capa-filme">De nada em nada, <span>tudo.</span></p></div>' +
        '<p class="pdf-capa-pe">Aporte cultural pretendido de ' + rs(estado.valor) + ', 100% do saldo disponível. PRONAC 258413. Proposta para negociação: não é contrato e não confirma patrocínio. ' + hoje + '.</p></div></section>' +
        '<section class="pdf-apres"><p class="pdf-rot2">O projeto</p><p class="pdf-apres-t">Um documentário sobre a poesia que o Nordeste guarda de cor.</p>' +
        '<p><i>De nada em nada, tudo.</i> registra repentistas, cantadores, cordelistas e as novas gerações que levam a poesia nordestina adiante. Projeto aprovado na Lei Rouanet (PRONAC 258413), com valor aprovado de ' + rs(VALOR_APROVADO) + ', realizado pela Bourbon Films, de Campina Grande, Paraíba.</p>' +
        '<p>Como patrocinadora integral, a Matuta viabilizaria todo o saldo disponível para captação. Esta proposta reúne o que a parceria pode oferecer em presença, relacionamento e reconhecimento, separando o que já está previsto no projeto do que depende de negociação.</p>' +
        '<div class="pdf-pecas' + cls + '">' + ['creditos', 'legado', 'sessao', 'post'].map(clone).join('') + '</div></section>';
    }
    h += '<header class="pdf-cab"><div class="pdf-cab-txt"><span class="pdf-rot">proposta de parceria</span><div><p class="pdf-tit">De nada em nada, <span>tudo.</span></p>' +
      '<p class="pdf-sub">Documentário · Lei Rouanet · PRONAC 258413 · ' + hoje + '</p></div></div>' +
      '<img src="' + IMG + 'matuta-papel.png" alt="Cachaça Matuta"></header><div class="pdf-faixa"></div>' +
      '<div class="pdf-num"><div><span>Aporte cultural pretendido</span><b>' + rs(estado.valor) + '</b></div><div><span>Participação no projeto</span><b>' + pctTxt(estado.valor) + '</b></div><div><span>Faixa</span><b>' + (n === 4 ? 'Integral' : NIVEIS[n].nome) + '</b></div></div>';
    if (n !== 4 && pecasOn.length) h += '<div class="pdf-pecas' + cls + '">' + pecasOn.slice(0, 5).map(clone).join('') + '</div>';
    h += '<table class="pdf-tab"><tr><td>Aporte cultural pretendido<small>via Lei Rouanet, ' + pctTxt(estado.valor) + ' do projeto</small></td><td>' + rs(estado.valor) + '</td></tr>' +
      '<tr><td>Contrapartidas culturais selecionadas<small>presença da marca: ' + estado.presenca + '%</small></td><td>' + inc.length + '</td></tr>' +
      '<tr><td>Serviços adicionais sob negociação<small>Bourbon Films, orçamento próprio, sem dedução fiscal</small></td><td>' + (bou.length ? bou.length + ', a orçar' : 'nenhum') + '</td></tr>' +
      '<tr><td><b>Total comercial estimado</b></td><td>' + total + '</td></tr></table>';
    if (previstos.length) h += '<section class="pdf-sec"><h2>Previstas no projeto aprovado</h2>' + lista(previstos) + '</section>';
    if (propostos.length) h += '<section class="pdf-sec prop"><h2>Propostas, sujeitas a aprovação e formalização</h2>' + lista(propostos) + '</section>';
    if (avaliar.length) h += '<section class="pdf-sec prop"><h2>A avaliar</h2>' + lista(avaliar) + '<p>Exclusividade por segmento depende das regras do projeto aprovado, dos demais patrocinadores, de contratos, de exigências do MinC e de viabilidade comercial. Não está garantida.</p></section>';
    if (bou.length) h += '<section class="pdf-sec bou"><h2>Produção audiovisual negociável (à parte)</h2>' + lista(bou.map(function (id) { return ITENS[id].t; })) + '<p>Serviços independentes da Bourbon Films. Não saem dos recursos incentivados e não geram dedução fiscal. Orçamento, contrato e nota próprios.</p></section>';
    h += '<section class="pdf-sec"><h2>Condições e observações legais</h2><p>' + esc(fiscalTexto()) + '</p><p>Contrapartidas seguem o plano aprovado pelo Ministério da Cultura, o manual de identidade da Lei Rouanet e as regras de publicidade de bebidas alcoólicas (Lei 9.294/1996 e CONAR). As faixas de valor são referências comerciais, não cotas nem direitos automáticos. Benefícios propostos só valem depois de aprovados e formalizados no termo de patrocínio.</p></section>' +
      '<section class="pdf-sec"><h2>Próximos passos</h2><ul class="pdf-passos"><li>Conversa para ajustar valor e contrapartidas</li><li>Contabilidade da Matuta confirma Lucro Real e teto</li><li>Validação das propostas com o projeto aprovado</li><li>Termo de patrocínio com as entregas acordadas</li><li>Depósito na conta oficial do projeto no Banco do Brasil</li><li>Recibo de Mecenato e início das contrapartidas</li>' + (bou.length ? '<li>Orçamento separado dos serviços Bourbon</li>' : '') + '</ul></section>' +
      '<p class="pdf-nota">Proposta personalizada e sujeita a alinhamento final. Esta simulação não é contrato, não cria obrigação para nenhuma das partes e não confirma patrocínio. Saldo disponível para captação: ' + rs(SALDO) + ', atualizado em ' + SALDO_EM + '.</p>' +
      '<footer class="pdf-pe"><span><b>Bourbon Films Ltda</b>, realizadora. CNPJ 65.711.903/0001-26.</span><span><b>Bourbon Films</b> · (83) 99868-3878 · bourbonfilms@gmail.com · poesia.art.br</span></footer>';
    $('#m-pdf').innerHTML = h;
  }
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-pdf]')) return;
    var t = doc.title; doc.title = 'Proposta Matuta - De nada em nada, tudo.';
    window.print(); setTimeout(function () { doc.title = t; }, 1000);
  });

  /* ---------- memória local e link compartilhável ---------- */
  function salvar() {
    var cod = Math.round(estado.valor * 100) + '.' + sel().join('-') + '.' + (estado.discreto ? 'd' : '') + estado.etapa;
    try { localStorage.setItem('parceria-matuta-v3', cod); } catch (e) {}
    try { history.replaceState(null, '', '#p=' + cod); } catch (e) {}
  }
  function restaurar() {
    var cod = (location.hash.match(/#p=([\w.\-]+)/) || [])[1];
    if (!cod) { try { cod = localStorage.getItem('parceria-matuta-v3'); } catch (e) {} }
    if (!cod) return false;
    var p = cod.split('.'), v = parseInt(p[0], 10) / 100;
    if (!v) return false;
    estado.valor = Math.min(SALDO, Math.max(MIN, v));
    (p[1] || '').split('-').forEach(function (id) { if (ITENS[id]) estado.sel[id] = true; });
    var fim = p[2] || '';
    estado.discreto = fim.charAt(0) === 'd'; $('#m-discreto').checked = estado.discreto;
    estado.etapa = parseInt(fim.replace('d', ''), 10) || 1;
    return true;
  }

  if (!restaurar()) { estado.valor = Math.min(SALDO, INICIO); destravar(0, estado.valor); }
  atualizar();
  irEtapa(estado.etapa, false);
  iniciado = true;
  focar(integral() ? 'cartaz' : 'abertura', null, 'ver', { t: PECAS[integral() ? 'cartaz' : 'abertura'], cond: 'Cada escolha aparece aqui. Toque em qualquer peça para ampliar.' });
})();
