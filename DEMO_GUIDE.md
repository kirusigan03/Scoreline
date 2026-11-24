# Scoreline — 3-Minute Video Demonstration Guide

This guide is structured for a **maximum 3-minute narrated video demonstration** for **IN3210 Assignment 2**.

---

## Timeline Breakdown

| Section | Duration | Target Topic |
|---|---|---|
| **Part 1: App Demonstration** | ~1 minute | Live walkthrough of core app flows (Login, Discovery, Offline, Favourites, Theme) |
| **Part 2: Technical Explanation** | ~2 minutes | Codebase walkthrough showing architecture, offline twist, security, and tests |

---

## Part 1: Application Walkthrough (~1 Minute)

### Step 1: Launch & Splash Screen (0:00 – 0:10)
- **Action**: Launch Scoreline.
- **Narrate**: *"Welcome to Scoreline, my sports discovery application for IN3210. On launch, the splash screen checks for existing secure sessions and hydrates user preferences."*

### Step 2: Login & Authentication (0:10 – 0:25)
- **Action**: Tap **Quick Demo Login** (fills `emilys` / `emilyspass`) and tap **Sign In**.
- **Narrate**: *"Authentication is integrated with the DummyJSON Auth API. Access tokens are stored securely in the device's Keychain/Keystore. Notice the personalized greeting displaying Emily's name."*

### Step 3: Explore Sports & Team Details (0:25 – 0:40)
- **Action**: Scroll through leagues (English Premier League, NBA), search for a club (e.g. "Arsenal"), tap a team card.
- **Narrate**: *"The Home screen fetches real live sports data from TheSportsDB free-tier API. Tapping a team card navigates by ID to Team Details, where stadium, founding year, and club history are displayed."*

### Step 4: Favourites & Offline-First Twist (0:40 – 1:00)
- **Action**: Tap the Heart icon on Team Details. Switch to the **Favourites** tab. Enable Airplane Mode (turn off Wi-Fi/cellular).
- **Narrate**: *"Here is the mandatory 10-mark Offline-First twist. When network connectivity drops, the offline banner immediately informs the user. The app automatically serves saved data from AsyncStorage. Favourites remain fully browsable and editable offline."*
- **Action**: Restore Wi-Fi. Notice the subtle green snackbar: *"Back online — fresh sports data loaded!"*

---

## Part 2: Technical Code Walkthrough (~2 Minutes)

Open and showcase the following exact file paths in your IDE:

### 1. Feature-Based Architecture & State Management (1:00 – 1:30)
- **Files to show**:
  - `src/features/` (Project tree)
  - `src/app/store.ts`
  - `src/features/sports/api/sportsApi.ts`
- **What to say**:
  - *"We organized the codebase using a clean feature-based architecture with domains for auth, sports, favourites, offline, and settings."*
  - *"State management uses Redux Toolkit with RTK Query. Queries like `getTeamsByLeague` and `lookupteam` handle caching and request deduplication automatically."*

### 2. Offline-First Twist & Automatic Reconnection (1:30 – 2:00)
- **Files to show**:
  - `src/services/network/networkService.ts`
  - `src/storage/cacheStorage.ts`
  - `src/features/offline/offlineSlice.ts`
- **What to say**:
  - *"Our offline service listens to NetInfo events. In `cacheStorage.ts`, every successful remote response persists to AsyncStorage. When the device reconnects, `networkService.ts` automatically invalidates RTK Query cache tags to fetch fresh sports data and updates the UI."*

### 3. Mobile Security & Storage Isolation (2:00 – 2:25)
- **Files to show**:
  - `src/storage/secureStorage.ts`
  - `src/storage/favouritesStorage.ts`
  - `src/features/auth/schemas/authSchemas.ts`
- **What to say**:
  - *"In accordance with our Mobile Security lecture, authentication tokens are stored strictly in `react-native-keychain` using hardware-backed keystore encryption. Non-sensitive preferences use AsyncStorage. Favourites in `favouritesStorage.ts` are user-scoped so another user's saved clubs are never exposed."*

### 4. Persistent Light/Dark Mode & Jest Tests (2:25 – 3:00)
- **Files to show**:
  - `src/theme/themes.ts`
  - `src/theme/ThemeContext.tsx`
  - Terminal showing `npm test` passing
- **What to say**:
  - *"For the bonus feature, persistent Light and Dark themes are managed with WCAG-compliant design tokens. We have 19 passing automated Jest tests across 5 test suites covering validation, reducers, offline cache serialization, and theme tokens."*

---

## Summary of Exact Files to Bookmark for Walkthrough

1. `src/services/network/networkService.ts` (Offline reconnect logic)
2. `src/storage/cacheStorage.ts` (Offline cache persistence)
3. `src/storage/secureStorage.ts` (Keychain token security)
4. `src/features/sports/api/sportsApi.ts` (TheSportsDB RTK Query)
5. `src/theme/themes.ts` (Color tokens & contrast)
6. `__tests__/offlineCache.test.ts` (Unit tests)
