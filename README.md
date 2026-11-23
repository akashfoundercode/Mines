# Premium Mines — React + JSX + Tailwind CSS v4

```bash
npm install
npm run dev
```

Stack: React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), lucide-react. No TypeScript.

## Structure
- `src/utils/gameLogic.js` – pure rules: mine generation (crypto RNG), multiplier math, ladder window
- `src/hooks/useMinesGame.js` – all state + actions (manual and auto mode)
- `src/components/` – Navbar, BettingPanel (GameMode, BetAmount, MinesSelector, AutoSettings, CashOutButton, GameDetails), GameBoard (MultiplierBar, GameTile, ExplosionFx), GameOverModal, WinModal, Background, Icons
- `src/index.css` – palette tokens (`@theme`) and animation keyframes

## Rules
Payout = 0.95 × C(25,k) / C(25−m,k) for k safe tiles with m mines. For 3 mines this gives exactly
x1.08, x1.23, x1.42, x1.64, x1.92, x2.25, x2.68. Mines are placed once at round start and stay fixed.

## Demo only
Balance and mine positions live in the browser. Do not use this for real money: mines must be generated
and bets settled on a server. To connect a backend, replace `startRound`, `revealTile` and `cashOut`
in `useMinesGame.js` with API calls.
# Mines
