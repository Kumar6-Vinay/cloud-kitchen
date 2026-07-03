import { addToCart } from './cart.js';

const SPECIALS = [
  {
    name: 'Sunday Special: Chicken Curry Thali',
    description: 'Slow-cooked chicken curry, jeera rice, roti, salad and gulab jamun.',
    price: 179,
  },
  {
    name: "Monday Motivation: Rajma Chawal Deluxe",
    description: 'Punjabi rajma, steamed rice, tandoori roti, papad and curd.',
    price: 139,
  },
  {
    name: 'Tuesday Tiffin: Paneer Butter Masala Thali',
    description: 'Creamy paneer butter masala, roti, jeera rice and fresh salad.',
    price: 159,
  },
  {
    name: 'Wednesday Wellness: Dal Khichdi Bowl',
    description: 'Comfort moong dal khichdi with ghee, papad and mango pickle.',
    price: 119,
  },
  {
    name: 'Thursday Thali: Chole Bhature',
    description: 'Spiced chole with fluffy bhature and onion-lemon salad.',
    price: 129,
  },
  {
    name: 'Friday Feast: Mixed Veg Thali',
    description: 'Seasonal mixed vegetable curry, dal, rice, roti and a sweet.',
    price: 149,
  },
  {
    name: 'Saturday Special: Egg Curry Thali',
    description: 'Home-style egg curry, jeera rice, roti and cucumber salad.',
    price: 149,
  },
];

const ORDER_CUTOFF_HOUR = 20;

function getCutoff(now) {
  const cutoff = new Date(now);
  cutoff.setHours(ORDER_CUTOFF_HOUR, 0, 0, 0);
  if (now >= cutoff) {
    cutoff.setDate(cutoff.getDate() + 1);
  }
  return cutoff;
}

function formatUnit(value) {
  return String(value).padStart(2, '0');
}

function setTickingText(el, text) {
  if (!el || el.textContent === text) return;
  el.textContent = text;
  el.classList.remove('is-ticking');
  void el.offsetWidth;
  el.classList.add('is-ticking');
}

export function initSpecial() {
  const section = document.querySelector('[data-special]');
  if (!section) return;

  const nameEl = section.querySelector('[data-special-name]');
  const descriptionEl = section.querySelector('[data-special-description]');
  const priceEl = section.querySelector('[data-special-price]');
  const hoursEl = section.querySelector('[data-countdown-hours]');
  const minutesEl = section.querySelector('[data-countdown-minutes]');
  const secondsEl = section.querySelector('[data-countdown-seconds]');
  const addButton = section.querySelector('[data-add-special]');

  const now = new Date();
  const cutoff = getCutoff(now);
  const isToday = cutoff.toDateString() === now.toDateString();
  const specialIndex = isToday ? now.getDay() : (now.getDay() + 1) % 7;
  const special = SPECIALS[specialIndex];

  if (nameEl) nameEl.textContent = special.name;
  if (descriptionEl) descriptionEl.textContent = special.description;
  if (priceEl) priceEl.textContent = `₹${special.price}`;

  const tick = () => {
    const remaining = Math.max(0, cutoff - new Date());
    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);

    setTickingText(hoursEl, formatUnit(hours));
    setTickingText(minutesEl, formatUnit(minutes));
    setTickingText(secondsEl, formatUnit(seconds));

    if (remaining <= 0) {
      window.clearInterval(timer);
    }
  };

  tick();
  const timer = window.setInterval(tick, 1000);

  if (addButton) {
    addButton.addEventListener('click', () => {
      addToCart({ id: `special-${specialIndex}`, name: special.name, price: special.price });
    });
  }
}
