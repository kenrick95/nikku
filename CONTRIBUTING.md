# Contribution guide

## Pre-requisites

These are the pre-requisite softwares for local development:

- [Node.js](https://nodejs.org/) v16 (at time of writing, 16.15.0 is used)
- [PNPM](https://pnpm.io/) v7 (at time of writing, 7.13.5 is used)
- Browsers that support [Worker with ES modules](https://caniuse.com/mdn-api_worker_worker_ecmascript_modules) (at time of writing, Firefox is not supported)

## Setup

After forking & cloning your repo locally:

1. Bootstrap dependencies
   ```
   pnpm install
   ```
2. Run dev server
   ```
   pnpm dev
   ```
3. Open `http://localhost:5173` in browser
4. Do code changes in `app/` folder and changes will reflects in browser as soon as you save the changes.

If you change things in `packages/brstm` folder, for it to reflect in browser, you have to restart dev server
