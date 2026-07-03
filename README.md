# The Kota Factory

A meal delivery & subscription site for students in Kota's coaching hostels and PGs — home-style thalis delivered daily.

Static HTML/CSS/JS, no build tooling, no framework, no dependencies.

## Running locally

Open `index.html` directly in a browser, or serve it with any static server, e.g.:

```bash
python3 -m http.server 8080
```

then visit `http://localhost:8080`.

The VS Code [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) extension also works out of the box — right-click `index.html` → "Show Preview".

## Structure

- `index.html` — the full page (hero, daily special, menu, subscription plans, kitchen/hygiene proof, parent trust, reviews, delivery, FAQ, footer, cart)
- `assets/css/` — one stylesheet per concern, all imported through `main.css` in cascade order; design tokens live in `variables.css`
- `assets/js/` — one ES module per feature (`nav`, `cart`, `menu`, `special`, `status`, `reveal`), wired together in `app.js`
- `components/`, `data/` — scaffolding for a future partial/data-driven build; currently unused placeholders

## Features

- Daily special engine with a live countdown to the 8 PM order cutoff
- Cart with WhatsApp checkout (prefilled order message via a `wa.me` link)
- Live kitchen open/closed status indicator
- Scroll-triggered reveal animations, respecting `prefers-reduced-motion`
- Hand-built SVG steel-thali illustration system reused across the hero, daily special, and menu cards

See [CLAUDE.md](CLAUDE.md) for architecture notes aimed at AI coding assistants working in this repo.
