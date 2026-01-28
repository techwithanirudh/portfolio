# Clippy (Rover) AI Assistant Integration Plan

## Executive Summary

Add a nostalgic Clippy-style assistant (using the "Rover" character) as the AI chat trigger. Clicking Rover opens the AI search dialog.

---

## Part 1: Library Investigation

### Evaluated Options

| Library | NPM | Drag Bug Fixed | Notes |
|---------|-----|----------------|-------|
| `clippyts` (lizozom) | v1.0.4 | ❌ No | Original TS port, has [open PR #2](https://github.com/lizozom/clippyts/pull/2) for drag fix |
| `tgxn/clippyts` fork | Not published | ✅ Yes | 7 commits ahead, includes drag fix + click handlers |
| `mlshv/clippyts` fork | Not published | ✅ Partial | Adds `position: static` support only |
| `@react95/clippy` | v2.0.2 | ❌ (inherits) | React wrapper around original clippyts |
| `@kusainovv/react-clippy` | v1.1.27 | ✅ Yes | Modern rewrite, zero deps, React 18+/19+ |

### Chosen: **@kusainovv/react-clippy**

**Reasons:**
1. **Modern React rewrite** - Clean React 18+/19+ component API
2. **Zero dependencies** - Lightweight and self-contained  
3. **TypeScript native** - No type issues with strict mode
4. **Actively maintained** - v1.1.27 with React 19 support
5. **No drag bugs** - Complete rewrite avoids original clippyts issues
6. **SSR compatible** - Works with Next.js via dynamic import

---

## Part 2: Architecture

### Implementation

```
src/components/ai/
├── ai-search.tsx - Provider + Panel + useAISearchContext hook
└── ai-search-trigger.tsx - Clippy/Rover trigger component
```

The old button trigger was removed and replaced with Clippy (Rover character).

---

## Part 3: Implementation Summary

### Completed

1. **Installed `@kusainovv/react-clippy`** - npm package with React 18+/19+ support

2. **Created `ai-search-trigger.tsx`**
   - Uses `<Clippy name="Rover" />` component
   - Click handler toggles AI search panel
   - Dynamic import with `ssr: false` for Next.js compatibility

3. **Updated `ai-search.tsx`**
   - Removed old `AISearchTrigger` button
   - Added `useAISearchContext()` hook export
   - Renamed "Simba" to "Rover" throughout

4. **Updated `provider.tsx`**
   - Import `AISearchTrigger` from new file

---

## Part 4: Technical Details

### @kusainovv/react-clippy API

```tsx
import { Clippy, useClippyAgent } from '@kusainovv/react-clippy'

// Simple component usage
<Clippy name="Rover" />

// Hook for programmatic control
const agent = useClippyAgent('Rover')
agent.speak("Hello!")
agent.play("Wave")
```

### Available Agents
- Clippy, Bonzi, F1, Genie, Genius, Links, Merlin, Peedy, **Rover**, Rocky

---

## Part 5: File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Edit | Added `@kusainovv/react-clippy` |
| `src/components/ai/ai-search.tsx` | Edit | Removed old trigger, added `useAISearchContext`, renamed to Rover |
| `src/components/ai/ai-search-trigger.tsx` | Create | New Clippy-based trigger |
| `src/app/provider.tsx` | Edit | Updated import path |

---

## Part 6: Future Enhancements

1. **Idle animations** - Random animations when not interacting
2. **Speak on events** - "New message!" balloon on AI response
3. **Character selection** - Let users pick their assistant
4. **Sound toggle** - Enable/disable Clippy sounds
5. **Persistent position** - Save Clippy position to localStorage
6. **Panel following** - Position panel relative to dragged Clippy position
