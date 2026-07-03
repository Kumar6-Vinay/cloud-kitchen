import { addToCart } from './cart.js';

export function initMenu() {
  const grid = document.querySelector('[data-menu-grid]');
  const filters = document.querySelector('.menu-filters');

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.menu-card'));

  if (filters) {
    const chips = Array.from(filters.querySelectorAll('.chip'));

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;

        chips.forEach((c) => c.classList.toggle('is-active', c === chip));

        cards.forEach((card) => {
          const categories = (card.dataset.category || '').split(' ');
          const matches = filter === 'all' || categories.includes(filter);
          card.classList.toggle('is-hidden', !matches);
        });
      });
    });
  }

  cards.forEach((card) => {
    const addButton = card.querySelector('[data-add-to-cart]');
    if (!addButton) return;

    addButton.addEventListener('click', () => {
      addToCart({
        id: addButton.dataset.id,
        name: addButton.dataset.name,
        price: Number(addButton.dataset.price),
      });
    });
  });
}
