# AGENTS.md

## Project

This project is a small PWA called "いつも買ってるあのメーカー ポケット帳".

The app helps users remember their usual product maker, product variant, size, and package photo while shopping.

## Core product value

The core value is:

"買い物中に、いつも買っているメーカー・サイズ・商品をすぐ確認できること"

Do not turn this into a general shopping list app.

## Product principles

- Keep the app small.
- Keep the UI mobile-first.
- Prioritize shopping-time usability.
- Use large readable text.
- Avoid feature creep.
- The user should be able to find the usual product quickly.
- The app should work without login or cloud sync in the MVP.

## MVP features

Implement only the following:

- Add item
- Edit item
- Delete item
- View item list
- View item detail
- Search by item name, maker name, and product detail
- Filter by category
- Register one photo per item
- Record last purchased date
- Persist data locally

## Do not implement yet

Do not implement the following unless explicitly requested:

- Login
- Cloud sync
- Family sharing
- Barcode scanning
- JAN code lookup
- Price tracking
- Store-specific price comparison
- Shopping list features
- Inventory management
- Recipe suggestions
- AI product recognition

## Tech stack

Use the following stack:

- React
- TypeScript
- Vite
- IndexedDB
- Dexie.js
- Tailwind CSS

## Data model

Use the main entity `PocketItem`.

Required fields:

- id
- itemName
- makerName
- categoryName
- productDetail
- photoDataUrl
- lastPurchasedAt
- memo
- createdAt
- updatedAt

## UI requirements

- Mobile-first layout
- One-column layout on smartphone
- Large item cards
- Large detail view
- Photo should be easy to see
- Maker name should be prominent
- Item name and product detail should be easy to scan
- Search box should be visible on the list screen
- Category filter should be simple

## Engineering rules

- Use TypeScript strictly.
- Keep components small.
- Keep storage logic separated from UI components.
- Do not introduce a backend.
- Do not add unnecessary dependencies.
- Do not over-engineer the first version.

## Expected file direction

When implementation starts, create files like:

- src/types/PocketItem.ts
- src/data/sampleItems.ts
- src/db/pocketItemsDb.ts
- src/components/
- src/pages/

These files should be created during the implementation phase, not during the initial documentation phase.

## Checks

After implementation, run:

- npm run build

If lint or test scripts are added, also run:

- npm run lint
- npm test

## Definition of done

The MVP is done when:

- A user can add an item.
- A user can edit an item.
- A user can delete an item.
- A user can search items.
- A user can filter by category.
- A user can register a photo.
- A user can see the last purchased date.
- Data remains after page reload.
- The app works on a smartphone-sized screen.