/* Página de cancelamento: o link do e-mail traz i (identificador) e s (assinatura).
   O cancelamento só acontece com o clique no botão (POST), nunca ao abrir a página. */
(function () {
  'use strict';
  var btn = document.getElementById('cancelar-btn');
  var st = document.getElementById('cancelar-status');
  if (!btn) return;
  var cfg = window.CARTA_CONFIG || {};
  var q = new URLSearchParams(location.search);
  var i = q.get('i') || '', s = q.get('s') || '';
  function diz(t, tipo) { st.textContent = t; st.dataset.tipo = tipo || ''; }
  if (!cfg.urlFuncoes) { diz('O cancelamento automático ainda não está ativo. Peça por bourbonfilms@gmail.com.', 'erro'); return; }
  if (!/^[a-f0-9]{64}$/.test(i) || !s) { diz('Este link de cancelamento está incompleto. Use o link do último e-mail recebido.', 'erro'); return; }
  btn.disabled = false;
  btn.addEventListener('click', function () {
    btn.disabled = true; diz('Cancelando...');
    fetch(cfg.urlFuncoes.replace(/\/$/, '') + '/cartaCancelar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ i: i, s: s })
    }).then(function (r) {
      if (r.ok) { diz('Inscrição cancelada. Você não vai mais receber a Carta da poesia.', 'ok'); btn.hidden = true; }
      else { diz('Não foi possível confirmar este link. Use o link do último e-mail ou escreva para bourbonfilms@gmail.com.', 'erro'); btn.disabled = false; }
    }).catch(function () { diz('O serviço não respondeu. Nada mudou. Tente de novo mais tarde.', 'erro'); btn.disabled = false; });
  });
})();
