# Romegamart — Modern React Redesign

A static, single-page React site recreating **Romegamart** — India's 1st & largest B2B
marketplace for the RO (Reverse Osmosis) water-purification industry — with a fresh, modern
"water/clarity" visual redesign (aqua-blue + deep navy + crisp white, electric-cyan accent).

> All product, category and brand **content is real**; only the design/layout/styling is modernized.

## Tech stack

- **React 18** (functional components + hooks)
- **Vite** dev server / bundler
- **Tailwind CSS** (utility classes + small custom theme)
- **lucide-react** icons
- Fonts: Space Grotesk (display) + Inter (body)
- No backend, no storage — wishlist/cart counts live in `useState`.

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  data.js                 # all categories, products, promos, brands, stats
  App.jsx                 # page shell + wishlist/cart state
  hooks/
    useScrollReveal.js     # IntersectionObserver fade/slide-up on scroll
    useCountUp.js          # animated count-up for the stats band
  components/
    TopBar.jsx             # utility bar (seller / helpline / app)
    Navbar.jsx             # sticky header: logo, search, wishlist, cart, auth
    CategoryNav.jsx        # secondary nav strip
    Hero.jsx               # auto-rotating gradient banner carousel
    CategoryGrid.jsx       # "Shop by Category" quick-jump tiles
    CategorySection.jsx    # banner + 4 featured product cards per category
    ProductCard.jsx        # reusable card (image, title, seller, wishlist, CTA)
    PromoBanner.jsx        # PromoStrip grid + single PromoBanner card
    TopBrands.jsx          # marquee logo row
    StatsBand.jsx          # animated Vendors / Sellers / Cities
    Footer.jsx             # brand, links, contact, app badges, socials
    Toast.jsx              # transient "enquiry added" confirmation
```

## Notes

- Product images use [placehold.co](https://placehold.co) placeholders. Swap the `img()` helper
  base in `src/data.js` for `https://images.romegamart.com/...` when real assets are available.
- Enquiry-only categories (Bottling Plant, Water Treatment, ETP/STP/ZLD) render an **Enquire**
  CTA with "Price on request" instead of a price.
- Fully responsive (mobile → desktop), keyboard-focusable, with `prefers-reduced-motion` support.
