'use strict';
const form=document.querySelector('#quote-form');
const number='5551998353976';
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{form.elements.servico.value=link.dataset.service;if(link.dataset.furniture)form.elements.movel.value=link.dataset.furniture;}));
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const data=new FormData(form);
 const value=name=>String(data.get(name)||'').trim();
 const lines=['Olá! Preenchi o formulário no exemplo do Paulo, montador de móveis, da NaWeb.','', 'Nome: '+value('nome'),'Serviço: '+value('servico'),'Móvel: '+value('movel'),'Quantidade: '+value('quantidade'),'Cidade: '+value('cidade'),'Bairro: '+value('bairro')];
 if(value('link'))lines.push('Link do produto: '+value('link'));
 if(value('observacoes'))lines.push('Observações: '+value('observacoes'));
 lines.push('','Este é um teste de orçamento do site demonstrativo. Gostaria de conversar sobre um site como este.');
 const url='https://wa.me/'+number+'?text='+encodeURIComponent(lines.join('\n'));
 const fallback=document.querySelector('#fallback-link');fallback.href=url;fallback.hidden=false;
 document.querySelector('#form-status').textContent='Mensagem preparada. Revise e toque em Enviar no WhatsApp. Se a conversa não abrir, use o link abaixo.';
 window.open(url,'_blank','noopener,noreferrer');
});

// Progressive motion: content stays visible if animation APIs are unavailable.
(() => {
 if (!window.matchMedia || !Element.prototype.animate) return;
 const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
 const running = new Set();
 const accordions = new Map();
 const play = (element, frames, options) => {
  const animation = element.animate(frames, options);
  running.add(animation);
  animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  return animation;
 };
 if ('IntersectionObserver' in window && !preference.matches) {
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if (preference.matches || entry.target.contains(document.activeElement)) return;
    play(entry.target, [
     { opacity: 0, transform: 'translateY(14px)' },
     { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' });
   });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .service-grid article, .about-title, .care-list > div, .gallery figure, .steps > div, .quote-copy, .faq-grid > div:first-child, .last-cta > div').forEach(element => observer.observe(element));
 }
 document.querySelectorAll('.faq details').forEach(details => {
  const summary = details.querySelector('summary');
  summary.addEventListener('click', event => {
   if (preference.matches || event.defaultPrevented) return;
   event.preventDefault();
   const previous = accordions.get(details);
   const start = details.getBoundingClientRect().height;
   const targetOpen = previous ? !previous.targetOpen : !details.open;
   if (previous) previous.animation.cancel();
   details.open = targetOpen;
   const end = details.getBoundingClientRect().height;
   details.open = true;
   details.style.overflow = 'hidden';
   const animation = play(details, [{ height: start + 'px' }, { height: end + 'px' }], {
    duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)'
   });
   const state = { animation, targetOpen };
   accordions.set(details, state);
   animation.finished.then(() => {
    if (accordions.get(details) !== state) return;
    details.open = targetOpen;
    details.style.overflow = '';
    accordions.delete(details);
   }, () => {});
  });
 });
 preference.addEventListener('change', () => {
  if (!preference.matches) return;
  accordions.forEach((state, details) => {
   details.open = state.targetOpen;
   details.style.overflow = '';
  });
  accordions.clear();
  running.forEach(animation => animation.cancel());
  running.clear();
 });
})();
