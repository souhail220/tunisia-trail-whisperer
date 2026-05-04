# Make TrailMate fully interactive

The app's main navigation works (bottom tabs route correctly, "Continue" / "Skip" / "Generate my route" / "See all" all navigate). But most secondary controls — trail cards on Routes/Community/Generate, onboarding chips, like/comment/bookmark, guide booking, profile menu items, FAB, etc. — are static `<button>`s with no `onClick`. That makes the app feel broken even though routing is fine.

This plan adds real behavior (navigation or local state) to every visible interactive element so nothing dead-ends.

## Scope of changes

### 1. Onboarding (`src/routes/index.tsx`)
- Make Step 2 "Experience level" chips controlled — clicking selects one (purple fill).
- Make Step 2 "Preferred region" select store its value.
- Persist the chosen name/level/region to `localStorage` (`trailmate.profile`) on "Start exploring" so Profile can read it later.

### 2. Trail cards link to detail page everywhere
The `/trail/$id` route already exists; only Explore wraps cards in a `Link`. Add `Link to="/trail/$id"` wrapping in:
- `src/routes/routes.tsx` (Saved + Recently generated)
- `src/routes/generate.tsx` (results carousel)
- `src/routes/community.tsx` (post → linked trail)

### 3. Explore page (`src/routes/explore.tsx`)
- Search input becomes controlled; trail list filters by name/region as user types.
- Difficulty/region filter chips actually filter the visible trails.
- Filter (sliders) icon and "Filters" button on guides open a small bottom sheet (use existing `Sheet` from `components/ui/sheet`).
- Map pins become buttons that scroll the matching trail card into view.
- Guide "Book" button opens a confirmation toast (`sonner`) — already installed.

### 4. Routes page (`src/routes/routes.tsx`)
- "Saved" entries get a remove button that drops them from local state.
- Empty state CTA when nothing is saved.

### 5. AI Guide (`src/routes/ai-guide.tsx`)
- Mic button toggles a "listening…" pulsing state for 2s, then inserts a canned phrase.
- Quick-reply chips already call `send`; keep as-is.

### 6. Community (`src/routes/community.tsx`)
- Like, comment, bookmark buttons toggle local state and update counters.
- Floating `+` FAB opens a "Share a trail" sheet with a simple form (title, region, photo URL) that prepends a new post to the feed.
- Hazard cards become clickable to expand details (description, severity).

### 7. Profile (`src/routes/profile.tsx`)
- Settings gear and the three menu rows (My activity, Story trails, Settings & privacy) open a `Sheet` with placeholder content.
- "Share" achievement button uses `navigator.share` with fallback toast.
- "Save as PDF" gear button shows a success toast.
- Read profile name/level from `localStorage` if onboarding saved it.

### 8. Trail detail (`src/routes/trail.$id.tsx`)
- Back button returns to previous screen.
- "Save", "Start hike", "Share" buttons toggle saved state / show toasts.

### 9. Global
- Mount `<Toaster />` from `sonner` once in `__root.tsx` so toasts work everywhere.

## Technical notes

- Use existing shadcn `Sheet`, `Button`, and `sonner` — no new dependencies.
- Local state via `useState`; lightweight persistence via `localStorage` guarded by `typeof window !== "undefined"` (SSR-safe).
- Keep all colors/tokens from `src/styles.css` — no hardcoded hex.
- No backend changes; everything stays in mock-data + client state.

## Out of scope
- Real auth, real maps, real AI, real persistence backend.
- Visual redesign — only behavior is added.
