/* Route the guided finder through the same catalogue filters. */
function findSupplies(term) {
  if (document.body.dataset.product || !$('#catalogue')) {
    location.href = 'catalogue.html?q=' + encodeURIComponent(term) + '#catalogue';
    return;
  }
  active = 'all';
  $('#search').value = term;
  $('#listing-type').value = 'all';
  $('#sort-order').value = 'review';
  render();
  $('#catalogue').scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
  $('#search').focus({ preventScroll: true });
}
$('#finder-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  findSupplies($('#finder-query').value.trim());
});
document
  .querySelectorAll('[data-suggest]')
  .forEach((button) =>
    button.addEventListener('click', () => findSupplies(button.dataset.suggest)),
  );

/* Keep the orbit ring fixed and rotate a separate electron track inside it. */
const orbit = document.querySelector('.orbit');
if (orbit) {
  orbit.innerHTML = '<span class="electron-track"><span class="electron"></span></span>';
}

/* Keep telephone and WhatsApp roles consistent on every generated page. */
document.querySelectorAll('.topline a[href^="tel:"]').forEach((link) => {
  link.href = 'tel:+27112387334';
  link.innerHTML = 'Telephone &nbsp; 011 238 7334';
});
document.querySelectorAll('.contact-details a[href^="tel:"]').forEach((link) => {
  link.href = 'tel:+27112387334';
  link.textContent = 'Telephone: 011 238 7334';
});
document.querySelectorAll('.contact-details .whatsapp').forEach((link) => {
  link.href =
    'https://wa.me/27844106544?text=' +
    encodeURIComponent('Hello Comeiin Works, I would like help with a quotation.');
  link.textContent = 'WhatsApp: 084 410 6544 ↗';
});
document
  .querySelectorAll('header nav a[href="#about"],header nav a[href="index.html#about"]')
  .forEach((link) => (link.href = 'about.html'));
document
  .querySelectorAll('footer a[href$="/privacy.html"]')
  .forEach((link) => (link.href = 'privacy.html'));

/* Lightweight WhatsApp concierge: a friendly prompt, with no message sent until the visitor continues. */
const whatsappMessage =
  'Hello Comeiin Works, I would like help with a laboratory supply quotation.';
const whatsappUrl = 'https://wa.me/27844106544?text=' + encodeURIComponent(whatsappMessage);
const whatsappWidget = document.createElement('aside');
whatsappWidget.className = 'whatsapp-widget';
whatsappWidget.setAttribute('aria-label', 'WhatsApp assistance');
whatsappWidget.innerHTML = `<div class="whatsapp-chat" id="whatsapp-chat"><button class="whatsapp-close" aria-label="Close WhatsApp message">×</button><div class="whatsapp-agent"><span>COMEIIN</span><i aria-hidden="true"></i></div><p><strong>How can we help?</strong>Tell us what your laboratory needs and continue the conversation with our team.</p><a href="${whatsappUrl}" target="_blank" rel="noopener">Continue in WhatsApp <span>↗</span></a></div><button class="whatsapp-launch" aria-expanded="true" aria-controls="whatsapp-chat" aria-label="Chat with Comeiin Works on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4.25A11.75 11.75 0 0 0 5.78 21.8L4.4 27.6l5.95-1.55A11.75 11.75 0 1 0 16 4.25Z"/><path d="M11.1 9.9c.35-.35.8-.3 1.08.12l1.55 2.34c.2.32.2.7-.06.98l-.82.9c-.25.28-.2.62-.03.91.9 1.56 2.27 2.86 3.9 3.7.3.16.63.18.88-.08l.94-.98c.26-.28.65-.33.98-.13l2.36 1.42c.42.25.5.7.17 1.08l-.78.9c-.68.78-1.75 1.1-2.74.83-4.34-1.18-7.9-4.56-9.31-8.83-.33-.98-.06-2.08.68-2.8l1.5-1.36Z"/></svg></button>`;
document.body.append(whatsappWidget);
const whatsappChat = whatsappWidget.querySelector('.whatsapp-chat');
const whatsappLaunch = whatsappWidget.querySelector('.whatsapp-launch');
function setWhatsAppOpen(open) {
  whatsappChat.hidden = !open;
  whatsappLaunch.setAttribute('aria-expanded', String(open));
}
whatsappWidget
  .querySelector('.whatsapp-close')
  .addEventListener('click', () => setWhatsAppOpen(false));
whatsappLaunch.addEventListener('click', () => setWhatsAppOpen(whatsappChat.hidden));
setWhatsAppOpen(false);

/* Subtle brand-colour network behind the whole page. */
const vantaPage = document.querySelector('#vanta-page');
if (vantaPage && !matchMedia('(prefers-reduced-motion: reduce)').matches && window.VANTA?.NET) {
  try {
    const vantaEffect = VANTA.NET({
      el: vantaPage,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      color: 0xfb7908,
      backgroundColor: 0xedf3fc,
      points: 6,
      maxDistance: 18,
      spacing: 20,
      showDots: true,
    });
    addEventListener('pagehide', () => vantaEffect.destroy(), { once: true });
  } catch (error) {
    console.warn('Animated background unavailable; using the hero image.', error);
  }
}
