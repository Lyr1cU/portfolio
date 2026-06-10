# Artem.dev — portfolio & service page

A single-page site that presents my web development offer for local small businesses. The page itself is the sales asset: share the live URL with prospects instead of explaining everything from scratch.

**Live URL (after deploy):** `https://lyr1cu.github.io/portfolio/`

## What’s on the page

| Section | Purpose |
|---------|---------|
| **Hero** | Who I am, what I build, key stats (timeline, languages, base price) |
| **Works** | Live demos — [Zerno](https://lyr1cu.github.io/Zerno/) (café) and [Power Gym](https://lyr1cu.github.io/Power-Gym/) (gym), with links to each admin panel |
| **How it works** | Brief → build → deploy on client domain + CMS → short onboarding |
| **CMS** | What the client edits themselves vs what requires a developer |
| **Pricing** | Base template (15 000 UAH / ~$400 USD) + custom add-ons quoted individually |
| **Terms** | 50% prepayment, scope in writing, free fixes for my bugs |
| **Contact** | Telegram, LinkedIn, GitHub, email |

Page languages: **Ukrainian, Russian, English** (language switcher in header). Prices: UAH for UA/RU, USD for EN.

## Stack

- HTML, CSS, vanilla JavaScript
- No build step, no frameworks
- Static hosting (GitHub Pages or any static host)

## Project structure

```
index.html       # landing page
css/styles.css   # layout and components
js/i18n.js       # UA / RU / EN strings
js/main.js       # i18n + mobile nav
img/             # hero previews for work cards (from Zerno & Power Gym)
OUTREACH.md      # first-message template (local only — do not deploy)
```

## Local preview

```bash
cd portfolio
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Deploy to GitHub Pages

### Option A — separate repo (recommended)

1. Create repo `Lyr1cU/portfolio` on GitHub.
2. Push `index.html`, `css/`, and `js/` (including `i18n.js`).
3. **Settings → Pages → Deploy from branch** → `main` / `/ (root)`.
4. Site: `https://lyr1cu.github.io/portfolio/`

### Option B — user site root

For `https://lyr1cu.github.io/` without `/portfolio`:

1. Repo name must be **`Lyr1cU.github.io`**.
2. Push these files to the repo root.
3. Enable Pages the same way.

## Contact

- Telegram: [@Lyr1c_U](https://t.me/Lyr1c_U)
- LinkedIn: [artem-tolstik-2b6344400](https://www.linkedin.com/in/artem-tolstik-2b6344400/)
- Email: atolstik42@gmail.com
- GitHub: [Lyr1cU](https://github.com/Lyr1cU)
