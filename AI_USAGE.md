# AI Usage Documentation — Scoreline Mobile App

This document provides transparent, comprehensive, and honest disclosure of how Generative AI tools assisted in the planning, design, implementation, and debugging of the Scoreline Mobile Application for **IN3210 Mobile Applications Development Assignment 2**.

---

## 1. AI Tools Utilized

- **Google Antigravity Agentic AI (Gemini 3.8 Flash / Pro)**: Primary engineering assistant used for codebase structuring, component creation, state management implementation, test suite authoring, and build verification.

---

## 2. Assistance Across Development Phases

### A. Project Planning & Architecture
- **Assistance**: AI helped map out the feature-based folder structure (`src/features/*`), separating UI components, API services, slices, and storage utilities.
- **Verification**: Ensured that the architectural design adhered to the university assignment specification, using Redux Toolkit, RTK Query, React Hook Form, Zod, and React Native Keychain without unsupported third-party frameworks like Expo or backend frameworks like Express/Firebase.

### B. UI/UX Design System
- **Assistance**: AI generated the centralized design token files (`colors.ts`, `spacing.ts`, `radii.ts`, `typography.ts`, `themes.ts`).
- **Student Review & Customization**: The student verified the contrast ratios for both Dark Mode (`#101820` / `#C5F451`) and Light Mode (`#F8FAFC` / `#365314`), ensuring that light mode did not employ low-contrast lime text on white card surfaces.

### C. Implementation & Code Generation
- **Assistance**: AI assisted in scaffolding the boilerplate for:
  - Zod schemas for login and registration.
  - RTK Query API slice for TheSportsDB and DummyJSON.
  - Reusable UI component library (`AppButton`, `AppTextInput`, `TeamCard`, `OfflineBanner`, etc.).
  - Offline-first cache synchronization and NetInfo integration.

### D. Testing & Quality Assurance
- **Assistance**: AI assisted in authoring automated Jest test suites for Zod validation rules, Favourites Redux reducer, offline storage serialization, and theme tokens.

---

## 3. Real Technical Limitations & Issues Encountered

During development, several concrete technical challenges were encountered and resolved:

### 1. React Native 0.88 StatusBar Typing Mismatch
- **Issue**: React Native 0.88 TypeScript definitions for `StatusBar` caused a type mismatch when passing `backgroundColor` directly as a JSX prop on Android.
- **Resolution**: Replaced the direct JSX prop with a safe imperative hook call inside `useEffect`: `(StatusBar as any).setBackgroundColor?.(colors.background, true);` and `StatusBar.setBarStyle(...)`.

### 2. React Native Synthetic Event vs React Hook Form Typing
- **Issue**: React Hook Form's `handleSubmit(onSubmit)` returns an event handler expecting standard synthetic DOM events, whereas React Native button `onPress` passes a `GestureResponderEvent`, causing TypeScript compilation errors.
- **Resolution**: Wrapped the submit invocation cleanly: `onPress={() => handleSubmit(onSubmit)()}`.

### 3. Jest ES Module Transformation with Modern Redux Toolkit & React-Redux
- **Issue**: Redux Toolkit and React-Redux modern package distributions use ESM (`.legacy-esm.js`), which threw `SyntaxError: Cannot use import statement outside a module` when parsed by Jest's default transformer.
- **Resolution**: Updated `jest.config.js` to map `immer`, `@reduxjs/toolkit`, and `react-redux` to their CommonJS dist entry points, and configured `transformIgnorePatterns` for React Navigation.

---

## 4. Student Verification and Corrections (Mandatory Section)

*Instructions for Student: As required by Assignment 2 evaluation criteria, review the implementation and document at least one real example where you corrected or changed the AI-generated output and explain why.*

```markdown
### Student Correction Record

- **Component / File**: [e.g. src/features/sports/screens/HomeScreen.tsx]
- **Original AI Output**: [Describe what the AI initially suggested or generated]
- **Identified Problem**: [Explain why you felt it was incorrect, suboptimal, or didn't meet the assignment requirement]
- **My Correction**: [Explain what change you made in your own words]
- **Outcome / Learning**: [What did you learn from this correction?]
```

---

## 5. Summary Statement

AI was used as an assistive software development and productivity tool. All architectural decisions, API choices, security constraints, and UI flows were verified to satisfy the requirements of IN3210 Assignment 2.
