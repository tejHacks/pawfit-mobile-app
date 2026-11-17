# PawFit

> Calorie tracking for your pet.

## What's built

- Dogs and cats with life stage and weight; daily target from **RER = 70 × kg^0.75 × life-stage factor** (weight-loss plans use target weight)
- Food log per day with a progress ring; weight updates

## Next

- Food database with kcal per cup/can, weight-trend chart, vet-shareable report, reminders

Targets are standard starting points — owners should confirm with their vet.

## Run it

```bash
npm install          # already done once after scaffolding
npx expo start       # then press i (iOS), a (Android) or w (web)
npm run typecheck
npx expo lint
```

Built on **Expo SDK 58** (React Native 0.88, React 19.3), Expo Router, TypeScript.
Everything is stored on-device with AsyncStorage (`src/lib/storage.ts`); there is no backend yet.

## Structure

- `src/app/` — screens (Expo Router; every file is a route)
- `src/brand.ts` — app name, brand colours, screen titles
- `src/theme.ts` — light/dark design tokens
- `src/components/ui.tsx` — shared UI primitives
