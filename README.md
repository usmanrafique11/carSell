# carSell

A vehicles browsing app built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing).

## Features

- **Vehicles list**: browse all vehicles with filters (make/model/min bid/max bid) and a favourites-only toggle.
- **Vehicle details**: view a single vehicle and toggle it as favourite.
- **Favourites**: favourites are stored in app state (in-memory) and reflected across list + detail screens.

## Screens & routes

- **Main list screen**: `app/(main)/index.tsx`
- **Details screen**: `app/vehicles/[id].tsx`
- **Root navigation**: `app/_layout.tsx`
- **Main stack layout**: `app/(main)/_layout.tsx`

Routes are pushed like:

```ts
router.push(`/vehicles/${id}`);
```

## Data + state

- **Data source**: `data/vehicles.json`
- **State provider**: `state/vehicles-context.tsx`
  - exposes `vehicles`, `toggleFavourite(id)`, and `getVehicleById(id)`
- **Auction helper**: `utils/auction.ts` (formats time until auction)

## Project structure (high level)

- `app/`: screens and layouts (Expo Router)
  - `(main)/`: main route group
  - `vehicles/`: vehicle details route(s)
- `components/`: shared UI (e.g. `components/vehicle-card.tsx`, themed components)
- `state/`: app state (vehicles context)
- `data/`: local JSON data
- `utils/`: small utilities

## Run locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

Optional:

```bash
npm run lint
```
