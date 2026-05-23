/* ── PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 10 + 8}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ── STATS COUNTER ── */
const counters = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(current);
    }, 25);
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => statsObserver.observe(c));

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 3D CAROUSEL ── */
const cards = document.querySelectorAll('.menu-card');
const total = cards.length;
const dotsContainer = document.getElementById('carouselDots');
let current = 0;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function positionCards() {
  const angleStep = 360 / total;
  const radius = 320;
  cards.forEach((card, i) => {
    const angle = angleStep * (i - current);
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;
    const scale = i === current ? 1 : 0.75;
    const opacity = Math.abs(i - current) <= 1 || Math.abs(i - current) >= total - 1 ? 1 : 0.3;
    card.style.transform = `translateX(calc(-50% + ${x}px)) translateY(-50%) translateZ(${z}px) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = i === current ? 10 : 1;
    card.style.pointerEvents = i === current ? 'auto' : 'none';
  });
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

function goTo(index) {
  current = (index + total) % total;
  positionCards();
}

document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowLeft') goTo(current - 1);
});

// Touch swipe
let touchStartX = 0;
document.getElementById('carouselScene').addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
document.getElementById('carouselScene').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
});

positionCards();

/* ── CART ── */
let cart = [];

function addToOrder(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  updateCart();
  showToast(`✅ ${name} added to order`);
}

function updateCart() {
  const bubble = document.getElementById('cartBubble');
  const list = document.getElementById('cartList');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
  list.innerHTML = cart.map(i =>
    `<li><span>${i.name} x${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></li>`
  ).join('');
  bubble.style.display = cart.length ? 'block' : 'none';
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function checkout() {
  if (!cart.length) return;
  showToast('🎉 Order placed! Thank you!');
  cart = [];
  updateCart();
  document.getElementById('cartPanel').style.display = 'none';
}

/* ── MODAL ── */
function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay') || e.type === 'click') {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
}

function submitReservation(e) {
  e.preventDefault();
  closeModal();
  showToast('🍽️ Table reserved! See you soon.');
}

/* ── CONTACT FORM ── */
function submitForm(e) {
  e.preventDefault();
  e.target.reset();
  showToast('✉️ Message sent! We\'ll be in touch.');
}

/* ── TOAST ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── SCROLL TO MENU ── */
function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

/* ── TESTIMONIALS CLONE (infinite scroll) ── */
const track = document.getElementById('testimonialsTrack');
track.innerHTML += track.innerHTML;

/* ── HAMBURGER (mobile) ── */
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const isOpen = links.style.display === 'flex';
  links.style.cssText = isOpen ? '' : 'display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:rgba(13,13,13,0.98); padding:2rem; gap:1.5rem;';
});
