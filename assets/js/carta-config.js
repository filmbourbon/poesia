/* Configuração PÚBLICA da Carta da poesia.
   Enquanto "firebase" for null, o formulário fica inativo e nada é enviado.
   Na ativação, cole aqui a configuração web do Firebase (ela é pública por natureza).
   NUNCA coloque aqui chaves de conta de serviço, chaves do provedor de e-mail ou senhas. */
window.CARTA_CONFIG = {
  firebase: null,
  /* exemplo, preenchido na ativação:
  firebase: {
    apiKey: "...",
    authDomain: "SEU-PROJETO.firebaseapp.com",
    projectId: "SEU-PROJETO",
    appId: "..."
  }, */
  regiao: 'southamerica-east1',
  appCheckChaveRecaptcha: '',
  urlFuncoes: '',
  versaoPolitica: '2026-10-21'
};
