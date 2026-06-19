# prentang.github.io

Personal portfolio for **Prentice Tang** — CS @ UMass Boston.

Live: https://prentang.github.io

A static, dependency-free site with a Cyberpunk 2077–inspired theme: neon-on-black
palette, glitch animations, scanline overlay, animated data-stream background, and
scroll-reveal sections.

## Stack

- Plain HTML / CSS / JavaScript — no build step, no frameworks.
- Google Fonts: Orbitron, Rajdhani, Share Tech Mono.

## Structure

```
index.html              page markup
assets/css/styles.css   cyberpunk theme
assets/js/app.js        boot sequence, nav, reveal, role cycler, canvas
assets/icons/           favicons + social/tech icons
Prentice_Tang_Resume.pdf
```

## Develop

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

Deployed automatically via GitHub Pages from `main`.
