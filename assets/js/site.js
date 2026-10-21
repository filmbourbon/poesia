/* De nada em nada, tudo.  Comportamento do site.
   Sem dependências. Cada módulo é independente e falha em silêncio:
   se algo der errado, o conteúdo continua legível (ver boot.js). */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(s, el) { return (el || doc).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); }
  function seguro(nome, fn) { try { fn(); } catch (e) { if (window.console) console.warn('[' + nome + ']', e); } }

  /* ---------- Cabeçalho: fundo sólido + progresso no cordão ---------- */
  seguro('topo', function () {
    var topo = $('.topo');
    var barra = $('.progresso');
    if (!topo) return;
    var agendado = false;
    function atualiza() {
      agendado = false;
      var y = window.scrollY || window.pageYOffset;
      var max = root.scrollHeight - window.innerHeight;
      topo.classList.toggle('solido', y > 24);
      if (barra) barra.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    }
    window.addEventListener('scroll', function () {
      if (!agendado) { agendado = true; requestAnimationFrame(atualiza); }
    }, { passive: true });
    window.addEventListener('resize', atualiza);
    atualiza();
  });

  /* ---------- Índice de capítulos (dialog) ---------- */
  seguro('indice', function () {
    var dlg = $('#indice');
    var abrir = $('[data-abre-indice]');
    if (!dlg || !abrir || typeof dlg.showModal !== 'function') {
      if (abrir) abrir.hidden = true;
      return;
    }
    abrir.addEventListener('click', function () {
      dlg.showModal();
      abrir.setAttribute('aria-expanded', 'true');
      root.classList.add('travado');
    });
    dlg.addEventListener('close', function () {
      abrir.setAttribute('aria-expanded', 'false');
      root.classList.remove('travado');
      if (!dlg.dataset.indo) abrir.focus();
      delete dlg.dataset.indo;
    });
    $$('[data-fecha]', dlg).forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    $$('a[href^="#"]', dlg).forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var alvo = $(a.getAttribute('href'));
        if (!alvo) return;
        ev.preventDefault();
        dlg.dataset.indo = '1';
        dlg.close();
        alvo.scrollIntoView({ behavior: reduz.matches ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', a.getAttribute('href'));
        var foco = $('h2, h1', alvo) || alvo;
        if (!foco.hasAttribute('tabindex')) foco.setAttribute('tabindex', '-1');
        foco.focus({ preventScroll: true });
      });
    });
  });

  /* ---------- Revelações editoriais (uma vez, ao entrar na tela) ---------- */
  seguro('revela', function () {
    var alvos = $$('.rv, .kin, .traco, .forma, .quem-lista, .alcance');
    if (!('IntersectionObserver' in window) || reduz.matches) {
      alvos.forEach(function (el) { el.classList.add('on'); });
      return;
    }
    var pendentes = alvos.slice();
    function liga(el) { el.classList.add('on'); io.unobserve(el); pendentes.splice(pendentes.indexOf(el), 1); }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting && pendentes.indexOf(e.target) > -1) liga(e.target); });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    alvos.forEach(function (el) { io.observe(el); });
    /* rolagem rápida pode pular o observer: tudo que já passou do meio da tela é revelado */
    var agendado = false;
    function varre() {
      agendado = false;
      var limite = window.innerHeight * 0.9;
      pendentes.slice().forEach(function (el) { if (el.getBoundingClientRect().top < limite) liga(el); });
    }
    window.addEventListener('scroll', function () { if (!agendado) { agendado = true; requestAnimationFrame(varre); } }, { passive: true });
    /* rede de segurança: nada fica invisível se o observer falhar */
    window.addEventListener('load', function () {
      setTimeout(function () {
        alvos.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('on');
        });
      }, 1200);
    });
  });

  /* ---------- Anatomia do verso: rimas e sílabas ---------- */
  seguro('anatomia', function () {
    var box = $('.anatomia');
    if (!box) return;
    var nota = $('.anatomia-nota', box);
    var textos = {
      rimas: 'Rua rima com sua (rima A). Nasceu rima com meu (rima B). O esquema é ABAB: o 1º verso rima com o 3º, o 2º com o 4º.',
      silabas: 'Cada verso tem 7 sílabas poéticas: a redondilha maior. Conta-se até a última sílaba tônica (em preto). Vogais que se encontram entre palavras se juntam numa sílaba só.',
      ambos: 'Sete sílabas por verso, rimas cruzadas ABAB. É a medida que cabe na voz e na memória.',
      nada: 'Toque em Rimas ou Sílabas para ver como o verso é construído.'
    };
    function sincroniza() {
      var r = box.dataset.rimas === '1', s = box.dataset.silabas === '1';
      nota.textContent = r && s ? textos.ambos : r ? textos.rimas : s ? textos.silabas : textos.nada;
    }
    $$('.chave', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.chave;
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on);
        box.dataset[k] = on ? '1' : '0';
        sincroniza();
      });
    });
    sincroniza();
  });

  /* ---------- O folheto: cena fixa guiada pelos passos ---------- */
  seguro('dobra', function () {
    var palco = $('.palco');
    var passos = $$('.passo');
    if (!palco || !passos.length) return;
    function marca(n) {
      palco.dataset.passo = n;
      passos.forEach(function (p) { p.classList.toggle('atual', p.dataset.passo === String(n)); });
    }
    if (!('IntersectionObserver' in window)) { marca(3); return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marca(e.target.dataset.passo); });
    }, { rootMargin: window.matchMedia('(max-width: 860px)').matches ? '-60% 0px -22% 0px' : '-40% 0px -45% 0px' });
    passos.forEach(function (p) { io.observe(p); });
    marca(1);
  });

  /* ---------- Leitura do folheto: páginas com rolagem nativa ---------- */
  seguro('paginas', function () {
    var trilho = $('.paginas');
    if (!trilho) return;
    var pags = $$('.pagina', trilho);
    var ant = $('[data-pag="ant"]'), prox = $('[data-pag="prox"]'), saida = $('.paginador output');
    function margem() { return parseFloat(getComputedStyle(trilho).paddingLeft) || 0; }
    function fim() { return trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 4; }
    function atual() {
      var x = trilho.scrollLeft + margem(), melhor = 0, d = Infinity;
      pags.forEach(function (p, i) {
        if (Math.abs(p.offsetLeft - x) < d) { d = Math.abs(p.offsetLeft - x); melhor = i; }
      });
      return melhor;
    }
    function ui() {
      var i = atual();
      if (saida) saida.textContent = 'Página ' + (i + 1) + ' de ' + pags.length;
      if (ant) ant.disabled = trilho.scrollLeft <= 2;
      if (prox) prox.disabled = fim();
    }
    function vai(delta) {
      var i = Math.max(0, Math.min(pags.length - 1, atual() + delta));
      trilho.scrollTo({ left: pags[i].offsetLeft - margem(), behavior: reduz.matches ? 'auto' : 'smooth' });
    }
    if (ant) ant.addEventListener('click', function () { vai(-1); });
    if (prox) prox.addEventListener('click', function () { vai(1); });
    var t;
    trilho.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(ui, 80); }, { passive: true });
    window.addEventListener('resize', ui);
    ui();
  });

  /* ---------- Acervo: leitor de cordel (dialog nativo) ---------- */
  seguro('leitor', function () {
    var dlg = $('#leitor');
    if (!dlg || typeof dlg.showModal !== 'function') return; /* sem suporte: os links levam ao texto na própria página */
    var titulo = $('#leitor-titulo'), autor = $('#leitor-autor'), corpo = $('.leitor-corpo', dlg);
    var origem = null;

    function abre(id, opener) {
      var art = doc.getElementById('txt-' + id);
      if (!art) return false;
      origem = opener || null;
      titulo.textContent = art.dataset.titulo;
      autor.textContent = art.dataset.autor + (art.dataset.ano ? ', ' + art.dataset.ano : '');
      dlg.style.setProperty('--cor', art.dataset.cor || '');
      corpo.innerHTML = '';
      $$('.aviso-provisorio, .estrofe, .cred, .ler-tudo', art).forEach(function (n) { corpo.appendChild(n.cloneNode(true)); });
      $$('a[href^="#"]', corpo).forEach(function (a) {
        a.addEventListener('click', function () { dlg.close(); });
      });
      corpo.scrollTop = 0;
      dlg.showModal();
      root.classList.add('travado');
      $('.leitor-fechar', dlg).focus();
      return true;
    }

    $$('a.folheto[data-cordel]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
        if (abre(a.dataset.cordel, a)) ev.preventDefault();
      });
    });
    $('.leitor-fechar', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      root.classList.remove('travado');
      if (origem && doc.contains(origem)) origem.focus();
      origem = null;
    });

    /* link direto (ex.: poesia.art.br/#txt-triste-partida) abre o leitor */
    var h = location.hash.match(/^#txt-(.+)$/);
    if (h) {
      var card = $('a.folheto[data-cordel="' + h[1] + '"]');
      if (card) { card.scrollIntoView({ block: 'center' }); abre(h[1], card); }
    }
  });

  /* ---------- As vozes: filtro ---------- */
  seguro('vozes', function () {
    var lista = $('.nomes');
    var status = $('.vozes-status');
    if (!lista) return;
    var botoes = $$('.filtro');
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        botoes.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        lista.dataset.filtro = b.dataset.filtro;
        if (status) {
          var n = b.dataset.filtro === 'todos' ? lista.children.length : $$('li[data-grupo="' + b.dataset.filtro + '"]', lista).length;
          status.textContent = b.dataset.filtro === 'todos' ? 'Mostrando todos os ' + n + ' nomes.' : n + ' de ' + lista.children.length + ' nomes em destaque: ' + b.textContent.trim().toLowerCase() + '.';
        }
      });
    });
  });

  /* ---------- Vídeo: carrega o player só quando a pessoa pede ---------- */
  seguro('video', function () {
    $$('[data-yt]').forEach(function (box) {
      var btn = $('.video-play', box);
      if (!btn) return;
      var img = $('img', btn);
      if (img) {
        img.addEventListener('error', function () { img.classList.add('falhou'); });
        if (img.complete && !img.naturalWidth) img.classList.add('falhou');
      }
      btn.addEventListener('click', function () {
        var f = doc.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.dataset.yt) + '?autoplay=1&rel=0';
        f.title = box.dataset.titulo || 'Vídeo';
        f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        btn.replaceWith(f);
        f.focus();
      });
    });
  });

  /* ---------- Separa palavras para a tipografia cinética ---------- */
  /* (feito no HTML; aqui só garantimos índices para o atraso) */
  seguro('kin', function () {
    $$('.kin').forEach(function (k) { $$('.w', k).forEach(function (w, i) { w.style.setProperty('--i', i); }); });
  });
})();
