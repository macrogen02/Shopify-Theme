const body = document.body;

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = next;
  localStorage.setItem('themeMode', next);
});

const cachedTheme = localStorage.getItem('themeMode');
if (cachedTheme) body.dataset.theme = cachedTheme;

document.querySelectorAll('[data-countdown]').forEach((node) => {
  const output = node.querySelector('[data-countdown-display]');
  const end = new Date(node.dataset.endTime).getTime();

  const tick = () => {
    const diff = end - Date.now();
    if (diff <= 0) {
      output.textContent = 'Expired';
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    output.textContent = `${d}d : ${h}h : ${m}m : ${s}s`;
  };

  tick();
  setInterval(tick, 1000);
});

const cartDrawer = document.querySelector('[data-cart-drawer]');
document.querySelectorAll('[data-cart-trigger]').forEach((btn) => {
  btn.addEventListener('click', () => cartDrawer?.removeAttribute('hidden'));
});
document.querySelector('[data-cart-close]')?.addEventListener('click', () => cartDrawer?.setAttribute('hidden', true));

setTimeout(() => {
  const popup = document.querySelector('[data-newsletter-popup]');
  if (!sessionStorage.getItem('newsletterDismissed')) popup?.removeAttribute('hidden');
}, 2000);
document.querySelector('[data-newsletter-close]')?.addEventListener('click', () => {
  document.querySelector('[data-newsletter-popup]')?.setAttribute('hidden', true);
  sessionStorage.setItem('newsletterDismissed', 'true');
});

const quickViewModal = document.querySelector('[data-quick-view-modal]');
document.querySelectorAll('[data-quick-view-trigger]').forEach((button) => {
  button.addEventListener('click', () => {
    quickViewModal.querySelector('[data-quick-view-content]').innerHTML = `<p>Quick view for <strong>${button.dataset.handle}</strong></p><p>Connect this modal to Shopify product API for richer content.</p>`;
    quickViewModal.showModal();
  });
});
document.querySelector('[data-quick-view-close]')?.addEventListener('click', () => quickViewModal?.close());

const predictiveInput = document.querySelector('[data-predictive-search-input]');
const predictiveResults = document.querySelector('[data-predictive-search-results]');

predictiveInput?.addEventListener('input', async (event) => {
  const q = event.target.value.trim();
  if (q.length < 2) {
    predictiveResults.hidden = true;
    return;
  }

  const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=4`);
  if (!response.ok) return;
  const data = await response.json();

  const products = data.resources.results.products || [];
  predictiveResults.innerHTML = products.length
    ? products.map((product) => `<a href="${product.url}" class="predictive-item"><img src="${product.featured_image.url}&width=60" alt="${product.title}" /><span>${product.title}</span></a>`).join('')
    : '<p>No matching products found.</p>';
  predictiveResults.hidden = false;
});
