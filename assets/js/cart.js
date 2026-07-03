const STORAGE_KEY = 'tkf-cart';
const WHATSAPP_NUMBER = '918104515987';

let cart = loadCart();
let render = () => {};

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable (private browsing, quota) - cart still works in-memory
  }
}

function formatPrice(value) {
  return `₹${value}`;
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateQty(id, delta) {
  const entry = cart.find((item) => item.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }
  saveCart();
  render();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  render();
}

function buildWhatsAppMessage() {
  const lines = cart.map(
    (item) => `- ${item.qty}x ${item.name} (${formatPrice(item.price * item.qty)})`
  );
  lines.push('', `Total: ${formatPrice(getTotal())}`);
  return `Hi! I'd like to order:\n${lines.join('\n')}`;
}

export function addToCart(item) {
  const existing = cart.find((entry) => entry.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  render();
}

export function initCart() {
  const toggle = document.getElementById('cart-toggle');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.querySelector('[data-cart-overlay]');
  const closeButton = drawer ? drawer.querySelector('.cart-close') : null;
  const list = document.querySelector('[data-cart-items]');
  const emptyState = document.querySelector('[data-cart-empty]');
  const totalEl = document.querySelector('[data-cart-total]');
  const countEl = document.querySelector('[data-cart-count]');
  const checkoutButton = document.querySelector('[data-cart-checkout]');

  if (!toggle || !drawer || !list) return;

  render = () => {
    list.innerHTML = '';

    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
        </div>
        <div class="cart-item-qty">
          <button type="button" data-decrease aria-label="Decrease quantity of ${item.name}">−</button>
          <span aria-live="polite">${item.qty}</span>
          <button type="button" data-increase aria-label="Increase quantity of ${item.name}">+</button>
        </div>
        <button type="button" class="cart-item-remove" data-remove aria-label="Remove ${item.name} from cart">&times;</button>
      `;
      li.querySelector('[data-decrease]').addEventListener('click', () => updateQty(item.id, -1));
      li.querySelector('[data-increase]').addEventListener('click', () => updateQty(item.id, 1));
      li.querySelector('[data-remove]').addEventListener('click', () => removeItem(item.id));
      list.appendChild(li);
    });

    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = String(itemCount);
    if (totalEl) totalEl.textContent = formatPrice(getTotal());
    if (emptyState) emptyState.hidden = cart.length > 0;
    if (checkoutButton) checkoutButton.disabled = cart.length === 0;
  };

  const openCart = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.hidden = false;
    document.body.classList.add('cart-locked');
  };

  const closeCart = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('cart-locked');
  };

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeCart();
    } else {
      openCart();
    }
  });

  if (closeButton) closeButton.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeCart();
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (!cart.length) return;

      const originalLabel = checkoutButton.innerHTML;
      checkoutButton.disabled = true;
      checkoutButton.innerHTML = '<span class="loader" aria-hidden="true"></span> Preparing order…';

      window.setTimeout(() => {
        const message = encodeURIComponent(buildWhatsAppMessage());
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');
        checkoutButton.disabled = cart.length === 0;
        checkoutButton.innerHTML = originalLabel;
      }, 600);
    });
  }

  render();
}
