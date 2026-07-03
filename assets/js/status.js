const OPEN_HOUR = 7;
const CLOSE_HOUR = 21;

export function initStatus() {
  const dot = document.querySelector('[data-status-dot]');
  const text = document.querySelector('[data-status-text]');

  if (!dot || !text) return;

  const update = () => {
    const hour = new Date().getHours();
    const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    dot.classList.toggle('is-open', isOpen);
    dot.classList.toggle('is-closed', !isOpen);

    text.textContent = isOpen
      ? 'Kitchen is live — cooking right now'
      : `Kitchen opens at ${OPEN_HOUR}:00 AM`;
  };

  update();
  window.setInterval(update, 60_000);
}
