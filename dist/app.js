const supplies = (window.COMEIIN_PRODUCTS || []).map((product) => ({
  ...product,
  image: `assets/products/${product.id}-generated-v2.png`,
  imageOrigin: 'AI-generated product image',
  imageStatus: 'Generated catalogue photography; client approval pending',
}));
const $ = (s) => document.querySelector(s),
  escapeHTML = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
const selected = new Map(),
  quote = $('#quote'),
  detail = $('#detail');
let active = 'all';
try {
  for (const item of JSON.parse(sessionStorage.getItem('comeiin-quote-v1') || '[]')) {
    const p = supplies.find((p) => p.id === item.id);
    if (
      p &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 9999 &&
      (!item.variant || p.variants.includes(item.variant))
    )
      selected.set(item.id + '|' + (item.variant || ''), item);
  }
} catch {}
function saveQuote() {
  try {
    sessionStorage.setItem('comeiin-quote-v1', JSON.stringify([...selected.values()]));
  } catch {}
}
function cardMarkup(p) {
  return `<article class="card"><div class="card-media"><a class="card-image" href="products/${p.id}.html" aria-label="View ${escapeHTML(p.name)}"><img src="${p.image}" alt="${p.imageOrigin === 'Client workbook image' ? 'Client-supplied' : 'Illustrative'} ${escapeHTML(p.name.toLowerCase())}" loading="lazy" width="640" height="560"></a><button class="quick-view" data-detail="${p.id}" aria-label="Quick view ${escapeHTML(p.name)}">Quick view</button></div><div class="category">${escapeHTML(p.category)}</div><h3><a href="products/${p.id}.html">${escapeHTML(p.name)}</a></h3><p>${escapeHTML(p.description)}</p>${p.pack ? `<p class="pack">${escapeHTML(p.pack)}${p.variants.length ? ' · ' + escapeHTML(p.variants.join(' / ')) : ''}</p>` : ''}<div class="card-bottom"><a class="detail-link" href="products/${p.id}.html">${p.kind === 'product' ? 'View product' : 'Explore range'} ↗</a><button class="add" data-detail="${p.id}" aria-label="Select ${escapeHTML(p.name)} for quote">+</button></div></article>`;
}
function revealCards(container) {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches)
    return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: 'translateY(14px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 360, easing: 'ease-out' },
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  container.querySelectorAll('.card').forEach((card) => observer.observe(card));
}
function render() {
  if ($('#count')) $('#count').textContent = selected.size;
  if (!$('#grid')) return;
  const term = $('#search').value.toLowerCase().trim(),
    kind = $('#listing-type').value,
    sort = $('#sort-order').value;
  const found = supplies.filter(
    (p) =>
      (active === 'all' || p.category === active) &&
      (kind === 'all' || p.kind === kind) &&
      [p.name, p.description, p.reference, p.pack, ...Object.values(p.specs)]
        .join(' ')
        .toLowerCase()
        .includes(term),
  );
  if (sort !== 'review')
    found.sort((a, b) => a.name.localeCompare(b.name) * (sort === 'az' ? 1 : -1));
  $('#grid').innerHTML = found.map(cardMarkup).join('');
  revealCards($('#grid'));
  $('#results').textContent = `${found.length} of ${supplies.length} products & supply ranges`;
  $('#empty').hidden = found.length !== 0;
  document.querySelectorAll('[data-filter]').forEach((el) => {
    el.setAttribute('aria-pressed', el.dataset.filter === active);
  });
  const chips = [];
  if (active !== 'all')
    chips.push(`<button data-clear="category">${escapeHTML(active)} ×</button>`);
  if (term)
    chips.push(`<button data-clear="search">Search: ${escapeHTML($('#search').value)} ×</button>`);
  if (kind !== 'all')
    chips.push(
      `<button data-clear="type">${kind === 'product' ? 'Individual products' : 'Supply ranges'} ×</button>`,
    );
  $('#active-filters').hidden = chips.length === 0;
  $('#active-filters').innerHTML =
    chips.join('') +
    (chips.length ? '<button class="clear-all" data-clear="all">Clear all</button>' : '');
  if (!document.body.dataset.product) {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries({
      category: active === 'all' ? '' : active,
      q: $('#search').value,
      type: kind === 'all' ? '' : kind,
      sort: sort === 'review' ? '' : sort,
    })) {
      value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }
}
function detailsMarkup(p) {
  return `<div class="product-layout"><div><img class="product-photo" src="${p.image}" alt="${p.imageOrigin === 'Client workbook image' ? 'Client-supplied' : 'Illustrative'} ${escapeHTML(p.name)}"><p class="image-note">${p.imageOrigin === 'Client workbook image' ? 'Client-supplied product photo.' : 'Illustrative product image. Actual appearance may vary.'}</p></div><div><p class="eyebrow">${escapeHTML(p.category)}</p><h2>${escapeHTML(p.name)}</h2><p class="muted">${escapeHTML(p.description)}</p>${
    Object.keys(p.specs).length
      ? `<dl class="specs">${Object.entries(p.specs)
          .map(([k, v]) => `<div><dt>${escapeHTML(k)}</dt><dd>${escapeHTML(v)}</dd></div>`)
          .join('')}</dl>`
      : '<p class="muted">Tell us the product type, model, size and quantity required. Our team will confirm suitable options.</p>'
  }<p class="availability">Availability: ${escapeHTML(p.availability)} · Request a quote</p>${p.variants.length ? `<label class="variant-label">Capacity<select id="variant-${p.id}" required><option value="">Choose a capacity</option>${p.variants.map((v) => `<option>${escapeHTML(v)}</option>`).join('')}</select></label>` : ''}<button class="button orange" data-detail-add="${p.id}">Add to quote +</button><p class="image-note">${p.pack ? 'Quote quantity is ' + (p.pack.toLowerCase() === 'each' ? 'per item.' : 'the number of boxes requested.') : 'Specify the required units or packs in your enquiry.'} Final specifications and availability are confirmed by Comeiin Works.</p>${p.id === 'CW-001' ? '<a class="text-link" href="products/CW-001-SLIDES.html">Looking for microscope slides? ↗</a>' : ''}</div></div>`;
}
function add(id, variant = '') {
  const key = id + '|' + variant;
  const entry = selected.get(key);
  selected.set(key, { id, variant, quantity: Math.min(9999, (entry?.quantity || 0) + 1) });
  saveQuote();
  render();
}
function quoteRows() {
  $('#quote-items').innerHTML = selected.size
    ? [...selected]
        .map(([key, item]) => {
          const p = supplies.find((p) => p.id === item.id);
          return `<div class="quote-row"><strong>${escapeHTML(p.name)}${item.variant ? ' — ' + escapeHTML(item.variant) : ''}<small>${escapeHTML(p.pack || 'Specify units in requirements')}</small></strong><label>${p.pack && p.pack.toLowerCase() !== 'each' ? 'Boxes' : 'Qty'} <input type="number" min="1" max="9999" value="${item.quantity}" data-qty="${escapeHTML(key)}" aria-label="Quantity for ${escapeHTML(p.name)} ${escapeHTML(item.variant)}"></label><button data-remove="${escapeHTML(key)}">Remove</button></div>`;
        })
        .join('')
    : '<p class="muted">No items selected yet. Describe the products you need below.</p>';
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.filter) {
    active = b.dataset.filter;
    document
      .querySelectorAll('[data-filter]')
      .forEach((el) => el.setAttribute('aria-pressed', el === b));
    render();
  }
  if (b.dataset.detail) {
    const p = supplies.find((p) => p.id === b.dataset.detail);
    $('#detail-body').innerHTML =
      detailsMarkup(p) +
      '<a class="text-link" href="products/' +
      p.id +
      '.html">Open full product page ↗</a>';
    detail.showModal();
  }
  if (b.dataset.detailAdd) {
    const id = b.dataset.detailAdd;
    const variant = b.closest('.product-layout')?.querySelector('select') || null;
    if (variant && !variant.value) {
      variant.reportValidity();
      return;
    }
    add(id, variant?.value || '');
    detail.close();
    quoteRows();
    quote.showModal();
    announce(
      'Added ' +
        supplies.find((p) => p.id === id).name +
        (variant?.value ? ' — ' + variant.value : '') +
        ' to your quote.',
    );
  }
  if (b.classList.contains('quote-open')) {
    $('#quote-feedback').textContent = '';
    quoteRows();
    quote.showModal();
  }
  if (b.classList.contains('continue-shopping')) quote.close();
  if (b.classList.contains('close')) b.closest('dialog').close();
  if (b.dataset.remove) {
    selected.delete(b.dataset.remove);
    saveQuote();
    quoteRows();
    render();
    announce('Item removed from your quote.');
    (quote.querySelector('[data-remove]') || quote.querySelector('.continue-shopping')).focus();
  }
});
$('#search')?.addEventListener('input', render);
$('#quote-items').addEventListener('input', (e) => {
  if (e.target.dataset.qty) {
    const qty = Math.min(9999, Math.max(1, Math.floor(Number(e.target.value) || 1)));
    selected.get(e.target.dataset.qty).quantity = qty;
    saveQuote();
    e.target.value = qty;
  }
});
$('#quote-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const items = [...selected.values()]
    .map((item) => {
      const p = supplies.find((p) => p.id === item.id);
      return `${p.reference} — ${p.name}${item.variant ? ' (' + item.variant + ')' : ''} — ${item.quantity} ${p.pack && p.pack.toLowerCase() !== 'each' ? 'box(es), ' + p.pack : 'item(s) / units to confirm'}`;
    })
    .join('\n');
  const body = `Hello Comeiin Works,\n\nPlease assist with a quotation.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nOrganisation: ${data.get('company')}\n\n${items}\n\nAdditional requirements:\n${data.get('notes')}\n\nPlease confirm specifications, pricing and availability.`;
  window.location.href = `mailto:Admin@comeiin.co.za?subject=${encodeURIComponent('Laboratory supply quotation enquiry')}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent =
    'Your email draft is ready to open. If no email app opens, contact Admin@comeiin.co.za or call 011 238 7334. Your enquiry has not been sent by this website.';
});
let noticeTimer;
function announce(message) {
  clearTimeout(noticeTimer);
  $('#notice').textContent = message;
  if (quote.open) $('#quote-feedback').textContent = message;
  $('#notice').classList.add('visible');
  noticeTimer = setTimeout(() => $('#notice').classList.remove('visible'), 4000);
}
function closeCategories() {
  $('#category-menu').hidden = true;
  $('.browse-toggle').setAttribute('aria-expanded', 'false');
}
const categories = [...new Set(supplies.map((p) => p.category))];
$('#category-links').innerHTML = categories
  .map(
    (cat) =>
      `<a href="catalogue.html?category=${encodeURIComponent(cat)}#catalogue" data-browse="${escapeHTML(cat)}"><strong>${escapeHTML(cat)}</strong><span>${supplies.filter((p) => p.category === cat).length} products & ranges</span></a>`,
  )
  .join('');
$('.browse-toggle').addEventListener('click', () => {
  const expanded = $('.browse-toggle').getAttribute('aria-expanded') === 'true';
  $('#category-menu').hidden = expanded;
  $('.browse-toggle').setAttribute('aria-expanded', String(!expanded));
});
$('.menu-close').addEventListener('click', () => {
  closeCategories();
  $('.browse-toggle').focus();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#category-menu').hidden) {
    closeCategories();
    $('.browse-toggle').focus();
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) closeCategories();
  const browse = e.target.closest('[data-browse]');
  if (browse && !document.body.dataset.product) {
    e.preventDefault();
    if (!$('#catalogue')) {
      location.href =
        'catalogue.html?category=' + encodeURIComponent(browse.dataset.browse) + '#catalogue';
      return;
    }
    active = browse.dataset.browse;
    $('#search').value = '';
    $('#listing-type').value = 'all';
    closeCategories();
    render();
    $('#catalogue').scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    $('#search').focus({ preventScroll: true });
  }
  const clear = e.target.closest('[data-clear]');
  if (clear) {
    const what = clear.dataset.clear;
    if (what === 'category' || what === 'all') active = 'all';
    if (what === 'search' || what === 'all') $('#search').value = '';
    if (what === 'type' || what === 'all') $('#listing-type').value = 'all';
    render();
    $('#search').focus({ preventScroll: true });
  }
});
$('#sort-order')?.addEventListener('change', render);
$('#listing-type')?.addEventListener('change', render);
const params = new URLSearchParams(location.search);
if (!document.body.dataset.product && $('#search')) {
  if (categories.includes(params.get('category'))) active = params.get('category');
  $('#search').value = params.get('q') || '';
  if (['product', 'range'].includes(params.get('type')))
    $('#listing-type').value = params.get('type');
  if (['az', 'za'].includes(params.get('sort'))) $('#sort-order').value = params.get('sort');
}
render();
const currentProduct = supplies.find((p) => p.id === document.body.dataset.product);
if (currentProduct) {
  [...$('#main').children].forEach((el) => (el.hidden = el.id !== 'product-view'));
  $('#product-view').innerHTML =
    '<a class="back-link" href="catalogue.html">← Back to our range</a>' +
    detailsMarkup(currentProduct).replace('<h2>', '<h1>').replace('</h2>', '</h1>');
  document.querySelectorAll('header nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href?.startsWith('#')) a.href = 'index.html' + href;
  });
  const allProducts = $('.category-menu>.text-link');
  if (allProducts) allProducts.href = 'catalogue.html';
}

if (currentProduct) {
  const companionIds = {
    'CW-001': ['CW-001-SLIDES', 'CW-029'],
    'CW-001-SLIDES': ['CW-001', 'CW-034'],
    'CW-005': ['CW-019', 'CW-028', 'CW-030'],
    'CW-019': ['CW-005', 'CW-028', 'CW-030'],
    'CW-028': ['CW-019', 'CW-005', 'CW-030'],
    'CW-009': ['CW-033'],
    'CW-033': ['CW-009'],
    'CW-017': ['CW-023', 'CW-018', 'CW-022'],
  };
  const ids = companionIds[currentProduct.id] || [];
  const related = [
    ...ids.map((id) => supplies.find((p) => p.id === id)).filter(Boolean),
    ...supplies.filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id && !ids.includes(p.id),
    ),
  ].slice(0, 4);
  if (related.length)
    $('#product-view').insertAdjacentHTML(
      'beforeend',
      '<section class="related"><p class="eyebrow">EXPLORE MORE</p><h2>Related products & supplies</h2><div class="grid">' +
        related.map(cardMarkup).join('') +
        '</div></section>',
    );
}

if (currentProduct) revealCards($('#product-view'));
