/* Carta da poesia: interface de inscrição.
   Estados: inativo (Firebase não configurado), simulação (?carta=simulacao, nada é enviado) e ativo.
   O SDK do Firebase (vendor/firebase-carta.js) só é carregado quando configurado e na primeira interação. */
(function () {
  'use strict';
  var form = document.getElementById('carta-form');
  if (!form) return;

  var cfg = window.CARTA_CONFIG || {};
  var simulacao = /[?&]carta=simulacao\b/.test(location.search);
  var configurado = !!(cfg.firebase && cfg.firebase.apiKey && cfg.firebase.projectId);
  var $ = function (id) { return document.getElementById(id); };
  var campo = $('carta-email'), consente = $('carta-consente'), enviar = $('carta-enviar'), google = $('carta-google');
  var painel = $('carta-google-confirma'), consenteG = $('carta-consente-google'), status = $('carta-status'), aviso = $('carta-aviso');
  var isca = $('carta-site');
  var VERSAO = cfg.versaoPolitica || '2026-10-21';

  var MSG = {
    vazio: 'Escreva seu e-mail.',
    invalido: 'Este e-mail não parece completo. Confira e tente de novo.',
    semConsentimento: 'Para receber a carta, marque a autorização.',
    enviando: 'Enviando...',
    verificar: 'Quase lá. Se este endereço puder receber a carta, enviamos uma mensagem de confirmação. Abra o e-mail e toque em Confirmar inscrição.',
    googleCancelado: 'Login com o Google cancelado. Nada foi registrado.',
    googleFalha: 'Não conseguimos falar com o Google agora. Tente de novo ou use seu e-mail.',
    googleOk: 'Inscrição confirmada. A próxima carta chega em ',
    jaInscrito: 'Este e-mail já recebe a Carta da poesia. Nada mudou.',
    recusou: 'Tudo bem. Você não foi inscrito e saiu da conta Google.',
    muitas: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
    falha: 'O serviço não respondeu. Nada foi registrado. Tente mais tarde.'
  };

  function diz(texto, tipo) { status.textContent = texto; status.dataset.tipo = tipo || ''; }
  function ocupado(sim) {
    [enviar, google, $('carta-google-sim'), $('carta-google-nao')].forEach(function (b) { if (b) b.disabled = sim; });
    form.setAttribute('aria-busy', sim ? 'true' : 'false');
  }
  function emailValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254; }

  /* ---------- APIs: simulada (nada sai do navegador) ou Firebase (carregado sob demanda) ---------- */
  var esperar = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var apiSimulada = {
    inscreverEmail: function (d) { return esperar(500).then(function () { if (/falha/.test(d.email)) throw { code: 'internal' }; if (/limite/.test(d.email)) throw { code: 'resource-exhausted' }; return { ok: true }; }); },
    entrarGoogle: function () { return esperar(400).then(function () { if (/[?&]google=cancelado\b/.test(location.search)) throw { code: 'auth/popup-closed-by-user' }; if (/[?&]google=falha\b/.test(location.search)) throw { code: 'auth/network-request-failed' }; return { email: /[?&]google=inscrito\b/.test(location.search) ? 'ja.inscrita@exemplo.com' : 'leitora@exemplo.com' }; }); },
    inscreverGoogle: function () { return esperar(500).then(function () { return { estado: /[?&]google=inscrito\b/.test(location.search) ? 'ja-inscrito' : 'ativo' }; }); },
    sair: function () { return Promise.resolve(); }
  };
  var apiReal = null;
  function api() {
    if (simulacao) return Promise.resolve(apiSimulada);
    if (apiReal) return Promise.resolve(apiReal);
    var base = document.querySelector('script[src$="carta.js"]').src.replace(/carta\.js.*$/, '');
    return import(base + 'vendor/firebase-carta.js').then(function (m) { apiReal = m.iniciar(cfg); return apiReal; });
  }
  function erroCodigo(e) { return (e && (e.code || (e.details && e.details.code))) || ''; }

  /* ---------- Estado inicial ---------- */
  if (!configurado && !simulacao) { form.dataset.estado = 'inativo'; return; }
  form.dataset.estado = 'ativo';
  [campo, consente, enviar, google].forEach(function (el) { el.disabled = false; });
  aviso.textContent = '';
  if (simulacao) {
    var faixa = document.createElement('p');
    faixa.className = 'carta-simulacao';
    faixa.textContent = 'Modo de demonstração: nenhum dado é enviado ou guardado.';
    aviso.replaceWith(faixa);
  }

  /* ---------- Inscrição por e-mail ---------- */
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = campo.value.trim().toLowerCase();
    campo.removeAttribute('aria-invalid');
    if (!email) { campo.setAttribute('aria-invalid', 'true'); campo.focus(); return diz(MSG.vazio, 'erro'); }
    if (!emailValido(email)) { campo.setAttribute('aria-invalid', 'true'); campo.focus(); return diz(MSG.invalido, 'erro'); }
    if (!consente.checked) { consente.focus(); return diz(MSG.semConsentimento, 'erro'); }
    if (isca && isca.value) { return diz(MSG.verificar, 'ok'); } /* robô: finge sucesso, nada é enviado */
    ocupado(true); diz(MSG.enviando);
    api().then(function (a) {
      return a.inscreverEmail({ email: email, consentimento: { aceito: true, fonte: 'formulario-email', versaoPolitica: VERSAO } });
    }).then(function () {
      diz(MSG.verificar, 'ok'); form.reset();
    }).catch(function (e) {
      var c = erroCodigo(e);
      diz(c.indexOf('resource-exhausted') > -1 ? MSG.muitas : c.indexOf('invalid-argument') > -1 ? MSG.invalido : MSG.falha, 'erro');
    }).then(function () { ocupado(false); });
  });

  /* ---------- Google: entrar NÃO inscreve; consentimento vem depois ---------- */
  google.addEventListener('click', function () {
    ocupado(true); diz('');
    api().then(function (a) { return a.entrarGoogle(); }).then(function (u) {
      $('carta-google-email').textContent = u.email;
      consenteG.checked = false;
      painel.hidden = false;
      consenteG.focus();
    }).catch(function (e) {
      var c = erroCodigo(e);
      diz(/popup-closed|cancelled-popup|user-cancelled/.test(c) ? MSG.googleCancelado : MSG.googleFalha, 'erro');
    }).then(function () { ocupado(false); });
  });
  $('carta-google-sim').addEventListener('click', function () {
    if (!consenteG.checked) { consenteG.focus(); return diz(MSG.semConsentimento, 'erro'); }
    ocupado(true); diz(MSG.enviando);
    var email = $('carta-google-email').textContent;
    api().then(function (a) {
      return a.inscreverGoogle({ consentimento: { aceito: true, fonte: 'google', versaoPolitica: VERSAO } });
    }).then(function (r) {
      painel.hidden = true;
      diz(r && r.estado === 'ja-inscrito' ? MSG.jaInscrito : MSG.googleOk + email + '.', 'ok');
    }).catch(function (e) {
      diz(erroCodigo(e).indexOf('resource-exhausted') > -1 ? MSG.muitas : MSG.falha, 'erro');
    }).then(function () { ocupado(false); });
  });
  $('carta-google-nao').addEventListener('click', function () {
    api().then(function (a) { return a.sair(); }).catch(function () {}).then(function () {
      painel.hidden = true; diz(MSG.recusou, 'ok'); google.focus();
    });
  });
})();
