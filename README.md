# Scoreline ⚽🏀🏎️

> **Discover. Follow. Stay Connected.**

Scoreline is a production-quality, offline-first sports discovery mobile application built with **React Native CLI** and **TypeScript** for university assignment evaluation. The application allows sports enthusiasts to register, authenticate, explore global leagues and teams, inspect detailed club profiles, and manage personalized favourites that remain completely accessible without an internet connection.

---

## 1. Assignment Information

- **Module**: IN3210 Mobile Applications Development
- **Assignment**: Assignment 2 – Build Your Own Discovery App
- **Student Index Number**: 234109F
- **Last numerical digit**: 9
- **Second-last numerical digit**: 0
- **Domain**: Sports
- **Required Twist**: **Offline-first** (10 Marks)
- **Bonus Feature**: **Persistent Light/Dark Mode** (Up to 5 Marks)
- **Application Name**: Scoreline
- **Tagline**: Discover. Follow. Stay Connected.
- **Deadline**: 13 December 2026, 11:59 PM

---

## 2. Features Overview

### 🔐 Screen 1 — Branded Splash Screen
- Original Scoreline wordmark with sports activity emblem.
- Dark navy background (`#101820`) with vibrant lime accent (`#C5F451`).
- Asynchronous session hydration from platform secure storage (`react-native-keychain`) and local profile cache before directing to authentication or the main app.

### 🔑 Screen 2 — Sports-Themed Login Screen
- Clean sports editorial design.
- Heading: *"Your game. Your world."*
- Form validation powered by **React Hook Form** and **Zod**.
- Username and password inputs with Feather toggleable eye visibility icon.
- One-tap quick-fill demo banner for verified DummyJSON test credentials.
- Real API authentication via `POST https://dummyjson.com/auth/login`.
- Access and refresh tokens stored securely in **Keychain/Keystore** (confidentiality).
- Non-sensitive user profile cached for offline display.

### 📝 Screen 3 — Registration Screen
- Input validation: First name, last name, username (min 3 chars), email (RFC compliant), password (min 8 chars), and matching password confirmation.
- Integrates with `POST https://dummyjson.com/users/add`.
- Clear transparency dialog explaining that DummyJSON is a simulated mock API and redirects the user to Sign In with the verified demo credentials.

### 🏟️ Screen 4 — Sports Discovery Home Screen
- Personalized header displaying authenticated user's name: *"Hello, {FirstName} 👋"*.
- Profile quick-access avatar.
- **Controlled SearchBar**: Real-time team search across all sports with instant clear button.
- **Sports Category Chips**: Soccer, Basketball, Motorsport, American Football, Ice Hockey.
- **Featured Sports Discovery Banner**: Highlights major leagues (e.g., English Premier League).
- **Popular League Selector**: English Premier League, Spanish La Liga, NBA, Formula 1, NFL, NHL.
- **Virtualized Team List**: Built using `FlatList` with optimized item keys and memoization.
- Real team badge imagery with fallback icons (`ImageWithFallback`).
- Instant favourite heart toggle button on every card.
- Pull-to-refresh integration.
- Polished skeleton loading, empty state, and error state with retry.
- Offline banner and cached data timestamp indicator when operating without network.

### 📄 Screen 5 — Team Details Screen
- Typed navigation parameter: receives `{ teamId: string; teamName?: string }` (does not pass bloated team objects).
- Independently queries TheSportsDB free-tier endpoint: `lookupteam.php?id={teamId}`.
- Displays team stadium/venue, capacity, location, founded year, country, league, and English club history.
- Safe external website launcher using `Linking`.
- Offline caching: stores loaded team profiles in AsyncStorage for instant offline access.

### ❤️ Screen 6 — Persistent Favourites Screen
- Displays total saved clubs counter (*"X teams saved"*).
- User-scoped favourites isolation: ensures another user's saved items never leak between sessions.
- Fully accessible offline: favourites can be added, browsed, and removed without an active internet connection.
- Empty state with Feather heart icon and one-tap *"Explore Sports"* action button.

### ⚙️ Screen 7 — Profile and Settings Screen
- User avatar, full name, username, and email.
- **Persistent Light / Dark Mode Toggle** (Bonus Feature): Persists theme preference across restarts.
- Real-time network connection mode indicator.
- Last synchronized API refresh timestamp.
- Application version and assignment module metadata.
- Sign out with destructive confirmation dialog, wiping Keychain credentials and in-memory session.

---

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| **React Native CLI** (0.88.1) | Native mobile development framework |
| **TypeScript** (6.0.3) | Strict type safety and predictable architecture |
| **React Navigation** | Native Stack & Bottom Tab navigators |
| **Redux Toolkit** | Centralized predictable state management |
| **RTK Query** | Data fetching, automated caching, tag invalidation |
| **React Hook Form** | Performant, un-controlled form state |
| **Zod** | Declarative schema validation |
| **React Native Keychain** | Platform secure hardware credential storage (Keystore/Keychain) |
| **AsyncStorage** | Offline cache, favourites, and preferences storage |
| **React Native NetInfo** | Real-time network reachability detection |
| **React Native Vector Icons** (Feather) | High-contrast accessible interface icons |
| **React Native Safe Area Context** | Edge-to-edge safe area screen handling |
| **Jest & ESLint & Prettier** | Automated unit tests and code quality |

---

## 4. Public API Integration

### 1. DummyJSON Auth API
- **Documentation**: [https://dummyjson.com/docs/auth](https://dummyjson.com/docs/auth)
- **Base URL**: `https://dummyjson.com`
- **Endpoints used**:
  - `POST /auth/login` (Authentication)
  - `POST /users/add` (Simulated user registration)
  - `GET /auth/me` (Profile verification)
  - `POST /auth/refresh` (Session refresh)

### 2. TheSportsDB Sports API
- **Documentation**: [https://www.thesportsdb.com/documentation](https://www.thesportsdb.com/documentation)
- **Base URL**: `https://www.thesportsdb.com/api/v1/json/3` (Free Tier Key: `3`)
- **Endpoints used**:
  - `search_all_teams.php?l={league}` (Teams by league)
  - `searchteams.php?t={query}` (Global team search)
  - `lookupteam.php?id={idTeam}` (Individual team details)
  - `all_sports.php` (Sports categories)
  - `all_leagues.php` (Available leagues)

---

## 5. Verified Demo Login Credentials

You can sign in using public DummyJSON test accounts or use the one-tap **Quick Demo Login** button on the Login screen:

| Username | Password | User Name | Role |
|---|---|---|---|
| `emilys` | `emilyspass` | Emily Johnson | Standard User |
| `michaelw` | `michaelwpass` | Michael Williams | Standard User |
| `sophieb` | `sophiebpass` | Sophia Brown | Standard User |

---

## 6. Offline-first Architecture (Mandatory Twist — 10 Marks)

Scoreline implements a multi-tier offline-first strategy:

```
[User Interface]
       │
       ▼
[Redux / RTK Query State]
       │
   ┌───┴───────────────────────────────┐
   ▼                                   ▼
(Online)                           (Offline)
Fetch TheSportsDB                  Load from AsyncStorage Cache
       │                               │
       ├─► Update UI                   ├─► Display Saved Data
       └─► Persist to Storage Cache    └─► Show Offline Banner & Timestamp
```

1. **Online State**: Requests are sent to TheSportsDB. Upon receiving valid data, the response is persisted to AsyncStorage (`@scoreline_sports_list_cache_v1`).
2. **Offline Transition**: Detected via `NetInfo.addEventListener`. The application immediately renders the accessible `OfflineBanner` (*"You're offline — showing saved data."*) without crashing or showing blank screens.
3. **Offline Restarts**: If the app is killed and reopened offline, the authenticated session is restored from secure storage, favourites are loaded, and the last sports list is rendered with a `CachedDataIndicator`.
4. **Offline Favourites**: Users can freely add or remove favourites while offline; updates persist in `@scoreline_user_favourites_v1_{username}`.
5. **Automatic Reconnection**: When connectivity is restored, the `initNetworkListener` detects the transition, invalidates RTK Query cache tags, fetches fresh sports data, updates local storage, and presents a subtle `Snackbar` (*"Back online — fresh sports data loaded!"*).

---

## 7. Key Architecture & Design Decisions

### Technical Decision 1: Redux Toolkit and RTK Query
*Note for Student: Review and adjust in your own words.*
> **Decision**: Redux Toolkit was selected over plain context or standalone state libraries because it provides a predictable, centralized store with strict immutability via Immer. RTK Query eliminates hundreds of lines of boilerplate asynchronous data-fetching logic, request deduplication, cache normalization, and automated background polling. Tag invalidation (`sportsApi.util.invalidateTags`) allows instantaneous background refresh when network reconnection occurs without polluting UI components with manual fetching loops.

### Technical Decision 2: Feature-Based Architecture
*Note for Student: Review and adjust in your own words.*
> **Decision**: The codebase is partitioned into distinct vertical domains (`auth`, `sports`, `favourites`, `offline`, `settings`). Each feature folder encapsulates its own API definitions, slice reducers, screens, schemas, and types. This prevents monolithic files, enables modular testing, isolates dependencies, and aligns with enterprise software engineering standards.

### Technical Decision 3: Storage Layer Separation (Keychain vs AsyncStorage)
*Note for Student: Review and adjust in your own words.*
> **Decision**: In compliance with mobile security principles from the university lecture, authentication tokens (`accessToken`, `refreshToken`) are stored exclusively in `react-native-keychain`, which leverages Android Keystore hardware-backed encryption. Conversely, non-sensitive preferences (theme mode, last refresh timestamp, team caches, and favourites) reside in `AsyncStorage`. Sensitive passwords are never persisted anywhere on the client device.

### Technical Decision 4: Deterministic Light & Dark Design Tokens
*Note for Student: Review and adjust in your own words.*
> **Decision**: Scoreline enforces WCAG-compliant contrast ratios in both themes. Dark theme pairs midnight navy (`#101820`) with vibrant lime (`#C5F451`), while Light theme pairs clean slate (`#F8FAFC`) with deep forest olive (`#365314`), strictly avoiding illegible lime text on white backgrounds.

---

## 8. Project Structure

```
Scoreline/
├── android/                        # Android native configuration & wrapper
├── ios/                            # iOS native configuration
├── src/
│   ├── app/                        # Redux store and typed hooks
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── components/                 # Reusable UI component library
│   │   ├── common/                 # AppText, AppButton, AppTextInput, Header, etc.
│   │   ├── feedback/               # OfflineBanner, Skeleton, Error, Snackbar
│   │   └── sports/                 # TeamCard, FavouriteButton, CategoryChip
│   ├── features/
│   │   ├── auth/                   # Authentication (DummyJSON, schemas, screens)
│   │   ├── favourites/             # User-scoped persistent favourites
│   │   ├── offline/                # Offline monitoring, hooks, slice
│   │   ├── settings/               # Profile, light/dark mode settings
│   │   └── sports/                 # TheSportsDB API, Home, Details screens
│   ├── navigation/                 # Root, Auth, Tab, and Stack navigators
│   ├── services/                   # Centralized API and Network services
│   ├── storage/                    # SecureStorage (Keychain) & CacheStorage
│   └── theme/                      # Centralized design tokens (colors, radii, spacing)
├── __tests__/                      # Automated Jest test suites
├── App.tsx                         # Root application entry point
├── jest.config.js                  # Jest test configuration
├── jest.setup.js                   # Mock configuration for native modules
├── package.json                    # Project dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 9. Prerequisites & Installation

### Prerequisites
- **Node.js**: v22.x or later
- **npm**: v11.x or later
- **Java JDK**: 21 (LTS)
- **Android Studio & SDK**: Android SDK Platform 34+, Android Build-Tools, Android Emulator or USB Debugging device.

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/kirusigan03/Scoreline.git
cd Scoreline

# Install project dependencies
npm install --legacy-peer-deps
```

### Running the Application

```bash
# Start the Metro bundler
npm run start

# Launch on Android
npm run android

# Run TypeScript type check
npm run typecheck

# Run ESLint validation
npm run lint

# Run automated Jest tests
npm test
```

---

## 10. Automated Testing Results

The project includes 19 automated unit tests across 5 test suites covering validation rules, reducer states, offline storage serialization, theme tokens, and component rendering:

```
PASS __tests__/offlineCache.test.ts
PASS __tests__/favouritesReducer.test.ts
PASS __tests__/themePreferences.test.ts
PASS __tests__/authValidation.test.ts
PASS __tests__/App.test.tsx

Test Suites: 5 passed, 5 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        ~20s
```

---

## 11. University Lecture Alignment

- **Clarity**: High-contrast typography hierarchy, recognizable Feather icons, plain language labels.
- **Consistency**: Centralized theme tokens (`spacing`, `colors`, `radii`, `typography`).
- **Feedback**: Immediate button touch states, ActivityIndicators, animated Snackbars, and skeleton loaders.
- **Simplicity**: Distraction-free navigation structure focused on core discovery and favourites workflows.
- **Security**: Confidentiality (Keychain storage), Integrity (Zod validation), Availability (Offline-first data caching).
- **Sensors & Permissions**: Zero unnecessary invasive sensor permissions requested.

---

## 12. License & Author

- **Author**: Kirusigan (Index: 234109F)
- **Module**: IN3210 Mobile Applications Development
- **Institution**: University Assignment Submission 2026
