

## Fix Text Writing Errors in Content Moderation Edit Form

### Problem

The "Edit News" (and Edit Event/Article/Vibe) form in Content Moderation has text input focus loss on mobile. The user annotated "Texts writing errors - trying to edit" on the Title and Full Content fields.

The root cause: all `Input` and `Textarea` elements are inside a `ScrollArea` within a `Drawer`, but none have the mobile-optimized attributes needed to prevent the scroll logic from stealing focus during typing.

### Solution

Apply the established mobile input fix pattern to every `Input` and `Textarea` in `ContentFormDialog.tsx`:

- `style={{ touchAction: 'manipulation' }}` -- prevents scroll interference during typing
- `onClick={(e) => e.stopPropagation()}` -- prevents ScrollArea from stealing focus
- `autoComplete="off"` -- prevents mobile keyboard issues
- `className` with `text-base` -- prevents iOS auto-zoom on input focus

---

### File: `src/components/admin/content/ContentFormDialog.tsx`

**All inputs and textareas that need the mobile fix (14 total):**

| Line | Field | Type |
|------|-------|------|
| 436-440 | Title | Input |
| 447-452 | Full Content / Caption | Textarea |
| 152-160 | News custom category | Input |
| 196-204 | Event custom category | Input |
| 237-246 | Custom platform venue | Input |
| 253-257 | Venue address | Input |
| 263-266 | Start date/time | Input |
| 270-272 | End date/time | Input |
| 278-283 | Capacity | Input |
| 327-332 | Article excerpt | Textarea |
| 336-341 | Article full content | Textarea |
| 346-351 | Article tag input | Input |
| 403-407 | Vibe duration | Input |

**Pattern applied to each Input:**
```
Before:
<Input value={...} onChange={...} placeholder={...} />

After:
<Input
  value={...}
  onChange={...}
  placeholder={...}
  className="text-base"
  style={{ touchAction: 'manipulation' }}
  onClick={(e) => e.stopPropagation()}
  autoComplete="off"
/>
```

**Pattern applied to each Textarea:**
```
Before:
<Textarea value={...} onChange={...} placeholder={...} rows={3} />

After:
<Textarea
  value={...}
  onChange={...}
  placeholder={...}
  rows={3}
  className="text-base resize-none"
  style={{ touchAction: 'manipulation' }}
  onClick={(e) => e.stopPropagation()}
/>
```

### What This Fixes

- Title field will maintain focus while typing on mobile
- Full Content / Caption field will maintain focus while typing on mobile
- All conditional fields (custom category, venue address, platform, etc.) will work on mobile
- iOS auto-zoom on input focus is prevented with `text-base`
- No desktop impact -- these attributes are harmless on desktop browsers

