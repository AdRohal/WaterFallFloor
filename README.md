# AquaFalls Park — Waterfall Experience

A modern, visually rich landing page for **AquaFalls Park**, featuring a glassmorphism UI, an animated Three.js waterfall particle background, and a fully responsive layout.

---

## Project Structure

```
WaterFallFloor/
├── index.html          # Main HTML — all sections and markup
├── css/
│   └── style.css       # Liquid glass theme, layout, animations
└── js/
    ├── app.js          # Navigation, scroll effects, reveal animations
    └── waterfall.js    # Three.js animated waterfall particle background
```

---

## Features

- **Animated particle background** — 6 000 water particles rendered with Three.js, flowing like a waterfall
- **Glassmorphism design** — frosted-glass cards, nav, and overlays throughout
- **Responsive layout** — adapts from mobile to wide desktop screens
- **Sections included:**
  - Hero with park stats
  - Experience / attractions
  - Photo gallery (CSS Grid masonry-style)
  - Ticket pricing cards
  - Contact / footer
- **Smooth scroll & active nav tracking** — navbar highlights the current section on scroll
- **Lucide icons** — lightweight line icon set used across the UI
- **Google Fonts** — Inter (body) + Playfair Display (headings)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | Structure & styling |
| Vanilla JavaScript (ES5 IIFE) | App logic & animations |
| [Three.js r128](https://threejs.org/) | WebGL particle system |
| [Lucide Icons](https://lucide.dev/) | SVG icon set |
| Google Fonts | Typography |

> No build tools or package manager required — everything runs directly in the browser.

---

## Getting Started

### Open locally
Simply open `index.html` in any modern browser:

```bash
# Windows
start index.html

# Or drag-and-drop the file into Chrome / Edge / Firefox
```

### Serve over HTTP (recommended for full functionality)
```bash
# Python 3
python -m http.server 8080

# Then visit: http://localhost:8080
```

---

## Browser Support

Works in all modern browsers that support WebGL and CSS `backdrop-filter`:

- Chrome 90+
- Edge 90+
- Firefox 90+
- Safari 15+

---

## License

This project is for demonstration purposes only. All park images are sourced from publicly available URLs and remain the property of their respective owners.
