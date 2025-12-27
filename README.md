# Pocket Ledger

A small Expo + React Native personal expense tracker demo.

**Project Overview**

This repository demonstrates a minimal expense-tracking app built with Expo and TypeScript. It uses a straightforward, file-based routing structure and React Context for state management so you can focus on UI and features rather than infrastructure

**Folder Structure**

- App/: App entry and route-driven screens. Follows Expo Router conventions for file-based routing and contains top-level layouts and screen components.
- Assets/: Static assets such as images and icons used by the app.
- components/: Reusable UI components (e.g., drop down, expense card) to keep screens small and focused.
- utils/: Small helper functions, such as dateRange.ts and toastMessage.ts.
- context/: React Context providers (for example themeContext.tsx and gradiants.ts for theme) used for lightweight state management.
- db/: Persistence layer containing SQLite-related logic, including files such as database.ts and expenses.ts for handling local data storage and expense operations.
- Root files: package.json, app.json, tsconfig.json, and ESLint/config files for tooling and build configuration.
 
**Why these choices (Libraries & Tools)**

- Expo: Fast cross-platform development, easy device testing, and a managed workflow that removes native build complexity.
- TypeScript: Improves developer experience and reduces runtime bugs through static types.
- File-based routing (Expo Router): Keeps navigation simple and maps filesystem layout to app routes.
- React Context: Lightweight, built-in state management ideal for an app of this scope (centralized contexts for expenses and theme).
- Separation of concerns: components/, context/, db/, and utils/ keep code modular and testable.

These choices prioritize quick iteration, clarity, and portability for a demo app while keeping the codebase approachable for contributors.

**Getting Started**
 
1. Install dependencies
 
`bash
npm install
`
 
2. Start the Expo dev server
 
`bash
npx expo start
`
 
3. Open on a device or emulator using the QR code or the listed options (Expo Go, simulator, or development build).
 
**Development notes**
 
- To modify app routes, edit files under app/ following the file-based routing rules.
- Persistent data storage is handled using SQLite, with database logic abstracted in db/ (for example database.ts and expenses.ts) to keep UI components independent of storage implementation.
 
If you'd like, I can also add a short CONTRIBUTING section or example screenshots. The updated README is saved to the project root.