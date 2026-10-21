/* Carregado no <head>, sem defer: marca que o JS está ativo antes da primeira pintura.
   Sem esta classe, todo o conteúdo fica visível (fallback sem JavaScript). */
document.documentElement.classList.add('js');
