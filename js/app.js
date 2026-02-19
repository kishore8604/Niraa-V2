const products = [
  {
    id: 1,
    name: 'Premium T-Shirt',
    category: '220 GSM Super Combed Bio-Washed Cotton',
    gsm: '220 GSM',
    fit: 'Relaxed',
    price: 1199,
    manufacturing: '₹240–300',
    selling: '₹999–1299',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Professional Shirt',
    category: '100% Cotton + Stretch Blend',
    gsm: '180 GSM',
    fit: 'Tailored',
    price: 2299,
    manufacturing: '₹500–650',
    selling: '₹1999–2499',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Tailored Pants',
    category: 'Cotton-Spandex Blend',
    gsm: '240 GSM',
    fit: 'Slim',
    price: 2799,
    manufacturing: '₹650–850',
    selling: '₹2499–2999',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Short Kurta / Tunic',
    category: 'Linen Blend',
    gsm: '170 GSM',
    fit: 'Relaxed',
    price: 2099,
    manufacturing: '₹550–700',
    selling: '₹1899–2299',
    image: 'https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Loungewear Set',
    category: 'Cotton Modal Blend',
    gsm: '210 GSM',
    fit: 'Relaxed',
    price: 2399,
    manufacturing: '₹580–760',
    selling: '₹2199–2599',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Premium Shorts',
    category: 'Cotton-Spandex Blend',
    gsm: '200 GSM',
    fit: 'Tailored',
    price: 1399,
    manufacturing: '₹320–450',
    selling: '₹1299–1599',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80'
  }
];

const cart = new Map();

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const floatingCart = document.getElementById('floatingCart');
const closeCart = document.getElementById('closeCart');
const checkoutModal = document.getElementById('checkoutModal');
const quickViewModal = document.getElementById('quickViewModal');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function renderProducts() {
  productGrid.innerHTML = products.map((p) => `
    <article class="product-card">
      <img loading="lazy" src="${p.image}" alt="${p.name}" />
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-meta">Fabric: ${p.category}</p>
        <p class="product-meta">GSM: ${p.gsm} • Fit: ${p.fit}</p>
        <div class="price"><span>${formatCurrency(p.price)}</span><small>${p.selling}</small></div>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to cart</button>
          <button class="btn btn-secondary" onclick="quickView(${p.id})">Quick view</button>
        </div>
      </div>
    </article>
  `).join('');
}

window.addToCart = function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  openCart();
};

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function renderCart() {
  const entries = [...cart.entries()];
  const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const subtotal = entries.reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + product.price * qty;
  }, 0);

  cartCount.textContent = totalQty;
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartItems.innerHTML = entries.length
    ? entries.map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        return `
          <div class="cart-item">
            <div>
              <strong>${product.name}</strong>
              <p class="product-meta">${formatCurrency(product.price)}</p>
            </div>
            <div class="qty-controls">
              <button onclick="handleQty(${id}, -1)">−</button>
              <span>${qty}</span>
              <button onclick="handleQty(${id}, 1)">+</button>
            </div>
          </div>
        `;
      }).join('')
    : '<p class="product-meta">Your cart is empty.</p>';
}
window.handleQty = changeQty;

window.quickView = function quickView(id) {
  const p = products.find((item) => item.id === id);
  document.getElementById('quickViewContent').innerHTML = `
    <img src="${p.image}" alt="${p.name}" loading="lazy" style="border-radius:12px; max-height:320px; width:100%; object-fit:cover;" />
    <h3>${p.name}</h3>
    <p class="product-meta">${p.category}</p>
    <p>GSM: ${p.gsm} • Fit: ${p.fit}</p>
    <p>Manufacturing Cost: ${p.manufacturing}</p>
    <p>Retail Price Band: ${p.selling}</p>
    <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to cart</button>
  `;
  quickViewModal.showModal();
};

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
}

function closeAllPanels() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
}

floatingCart.addEventListener('click', openCart);
closeCart.addEventListener('click', closeAllPanels);
overlay.addEventListener('click', closeAllPanels);

document.getElementById('checkoutBtn').addEventListener('click', () => checkoutModal.showModal());
document.querySelectorAll('[data-close]').forEach((btn) => {
  btn.addEventListener('click', () => btn.closest('dialog').close());
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

function initHeroSlider() {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsContainer = document.getElementById('sliderDots');
  let current = 0;

  dotsContainer.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}" class="${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></button>`).join('');

  const setSlide = (index) => {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  };

  window.goSlide = setSlide;

  setInterval(() => {
    setSlide((current + 1) % slides.length);
  }, 5000);
}

document.getElementById('year').textContent = new Date().getFullYear();

renderProducts();
renderCart();
initHeroSlider();
