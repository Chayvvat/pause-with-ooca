# Design specification

Source: [ooca-test](https://www.figma.com/design/Nppa4m3ZjXOHQX2SLVsyEz/ooca-test?node-id=0-1), inspected 2026-11-06. **Verified** means inspected Figma structure, copy or properties; **Approved** records user decisions (not additional Figma verification); **Proposed** is implementation guidance; **Needs Clarification** is unresolved. IDs below belong to this file.

## Screen coverage — Verified

Page `preview` (`0:1`): Desktop section `2159:18377`, Mobile `2159:18378`, components `2159:18379`. Draft page `2003:2682` contains exploratory welcome/character/design-system material; not treated as approved screens.

| View | Desktop ID | Mobile ID |
|---|---|---|
| Welcome | 2124:17234 | 2013:3811 |
| Emotional check-in | 2124:16452 | 2023:9161 |
| Notice / มองไปรอบๆ | 2124:16653 | 2023:9680 |
| Feel / รับรู้สัมผัส | 2124:16730 | 2034:13101 |
| Listen / ฟังเสียงรอบตัว | 2124:16802 | 2034:13298 |
| Awareness / กลับมาหาตัวเอง | 2124:16881 | 2038:13601 |
| Post-activity reflection | 2124:17007 | 2038:14003 |
| Completion | 2124:16954 | 2038:14133 |
| Help | 2019:8992 | 2142:17327 |
| Cancel dialog | 2152:17634 | 2049:14594 |
| Download Ooca dialog | 2152:17680 | 2052:15445 |

Mobile completion edge-case examples: `2117:15904`, `2117:16014`, `2117:16133` (all misleadingly named `awareness`); rules `2121:16250`. Additional inspected documentation: flow `2011:3349`; animation/navigation annotations listed in animation-spec. Total: 11 view pairs (22 views) + 3 edge-case views.

## Journey and navigation

**Verified — flow annotation `2011:3349`:** Welcome → optional pre-mood → Notice → Feel → Listen → Awareness → optional post-mood → Completion. Next and Skip advance manually; no response deadline. “2–3 minutes” is an estimated duration, not a countdown. No microphone/camera/location permission required; no free-text input in inspected screens.

- Grounding: Back goes to previous step; Notice Back returns to pre-mood. Awareness `จบกิจกรรม` and Skip both lead to post-mood.
- Post-mood Back returns to Awareness; Completion Back returns to post-mood.
- Completion offers `พักใจอีกครั้ง` (Restart) and `ช่องทางขอความช่วยเหลือ` (Help) on both layouts. The old Mobile Cancel/Skip and self-linking Help findings are superseded by the inspected updates.
- Help is available through header controls; Contact opens Download dialog. Store badges retain the inspected external URLs. Telephone rows have explicit per-number `tel:` annotations; these authorize dialing behavior, not a claim that service information was independently verified.

### Route and state effects — Approved decisions / verified latest annotations

Explicit approved behavior and current annotations take precedence over absent or stale prototype wires. Use one logical route graph for both layouts; frame IDs identify visual references, not device-specific application routes.

| Action | Destination / behavior | Mood effect |
|---|---|---|
| Cancel during grounding | Open Cancel dialog over the current step | Preserve both |
| Resume / กลับไปทำต่อ | Close Cancel dialog; remain on the exact underlying step | Preserve both |
| Exit / ออกจากกิจกรรม | End current activity, close dialog, return to Welcome | Reset Before and After to `null` |
| Dialog close / Escape | Close overlay; restore focus to its trigger | Preserve both |
| Completion Restart | Return to Welcome; subsequent Start opens optional pre-mood | Reset both to `null` |
| Open Help | Save originating screen and activity state; show Help | Preserve both |
| Help return | Return to the saved originating screen, including Welcome or Completion | Preserve both |
| Help Contact | Open Download dialog over Help; closing it stays on Help and retains the original Help origin | Preserve both |
| Help telephone row | Open the device's telephone handler for that row's annotated number; user confirms calling | Preserve Help, origin, step and both moods when returning to the still-loaded app |
| Logo | Brand artwork only on every screen; no link, hover/click action or keyboard focus | No effect |

**Verified:** phone-row annotations are attached to Desktop `2019:9077`, `2019:9078` and Mobile `2142:17334`, `2142:17340`. Resume, Exit and Help return annotations are present on both layouts. Logo annotations make it non-interactive. Previously observed cross-device links on Desktop pre-mood/Cancel and Mobile Completion Help were corrected in subsequent inspections.

**Needs Clarification:** Desktop Welcome Back last inspected as a self-link; decide whether to remove it. Direct entry to Help without a saved origin, refresh/session restoration, and browser Back behavior need an explicit policy. Do not infer persistence across a full page reload or OS termination from the telephone-return requirement.

## Responsive layout — Verified

- Main frames: Desktop 1440×844; Mobile 390×844. These are reference sizes, not breakpoint definitions.
- Dialogs: Desktop width 480, Mobile 350; Cancel height 456, Download height 538.
- Representative Notice header: Desktop x120/y32, 1200×40; Mobile x20/y32, ≈350×40. Logo ≈99.5×40; Mobile controls 32×32.
- Annotation `2169:18834`: Desktop Back icon + `ย้อนกลับ`; Help `ช่วยเหลือ` + icon. Mobile icons only, same functionality and accessible names.
- Notice content: 312×412 at y144, centered at x564 Desktop / x39 Mobile; character 250×250. Content gap 48. CTA block 328×118 at y640, gap12; primary button 327×53.
- Pre-mood content: Desktop 560×420, Mobile 350×444, y144; gap32. Text wraps differently; preserve Thai content and line-height.
- **Approved:** choose a content-fit breakpoint after layout validation; no numeric threshold is specified by inspected Figma evidence. Allow vertical scrolling on short viewports. Validate narrow layouts and label fit before selecting the threshold; this is a development validation task, not a pending breakpoint approval.

## Tokens and reusable components — Verified samples

| Primitive / component | Values / source |
|---|---|
| Primary button | `#00C4B3`, radius48, 327×53, padding20, gap8; `2023:9128` |
| Button variants | fill/outline/ghost × default/hover; set `2023:9129` |
| Mood card | 155×132, radius20, padding20, gap12; default white at60%, active `#E0F8F6`; set `2052:14959` |
| Mood face | 56×56 instances; calm/anxious/sad/`try`/no-select; set `2052:14956` (`try` is actual variant name, not an app enum) |
| Icons | Arrow/Next and Synchronize, 20×20; set `2124:16331` |
| Other observed colors | `#00B6A3`, `#686868`, `#A6A6A6`, `#EDF2F8`, white; observed values, not inferred semantic token names |
| Spacing samples | 8,12,20,32,48px; do not normalize every layer to a new scale |

Typography (size/line-height px): Prompt Regular 14/20,16/24; Medium16/20,18/22,20/24,24/30; SemiBold36/40 and Help36/48. English typography now uses Gotham Rounded (Book/Medium/Bold); no local text style uses Inter. Welcome uses Gotham Rounded Bold36/40 for Mooca; retain each style’s existing size/line-height when consuming the updated Figma styles. Examples: `2159:18045`, `2159:18046`, `2159:18042`, `2019:9045`.

## State contract

**Verified — `2121:16250`:** `calm=สงบ`, `anxious=กังวล`, `sad=เศร้า`, `tired=เหนื่อยล้า`, `null=ไม่ได้เลือก`. Before and After are independent. No selection remains null; never infer improvement, copy Before into After, or assign a default. Restart resets both to null and returns to Welcome. Exit also resets both to null and returns to Welcome by a separately approved decision. Logo has no navigation action. Support all 25 before/after combinations. No mandatory mood selection.

**Approved:** retain mood selections when navigating Back. Skip clears only the corresponding optional mood value (Before or After), leaving the other unchanged; grounding Skip does not clear moods.

**Proposed:** one mutually exclusive selection group per check-in. Next remains usable with null, consistent with optional input.

### Completion edge cases — Verified rules and examples

Render each summary slot independently from its stored mood. A selected value displays its corresponding face and Thai label; `null` displays the no-select face (`2117:16007`, question-mark artwork) and `ไม่ได้เลือก`. Do not hide the missing slot. The three examples and normal Completion share the same neutral heading/body and Restart + Help actions; no 25-page or improvement-based copy matrix is required. Apply the same rules on both layouts.

| Before | After | Example / expected display |
|---|---|---|
| `null` | `null` | `2117:15904`: both slots show no-select / ไม่ได้เลือก |
| `null` | `calm` | `2117:16014`: Before no-select; After สงบ |
| `sad` | `null` | `2117:16133`: Before เศร้า; After no-select |
| Any selected mood | Any selected mood | Show both actual values, including unchanged or less positive moods; never infer improvement |

Back retains both selections. Revisiting a check-in and choosing a different mood replaces only that slot; optional-mood Skip clears only that slot. Re-entering Completion must render the latest state, not cached artwork from the example frames.

**Proposed implementation clarification:** summary cards are read-only; use Back to edit a mood rather than allowing summary cards to toggle. Some reused component reactions may reflect selection behavior; this read-only interpretation still needs confirmation.

**Approved:** implement accessible focus and pressed states, modal dismissal and reduced-motion behavior; see companion documents.

**Approved follow-up (2026-11-07):** click/tap the selected mood again to set that check-in slot to `null`; choosing another card switches selection. The other mood is unchanged. Keyboard Space supports the same toggle. Disabled-state usage/appearance remains unspecified. These are separate from the resolved Resume, Exit, Help return and Logo policies.

## Variable mapping — Verified Figma updates

- All 42 local typography styles have family, size, line-height and letter-spacing bindings. The 22 TH styles use Prompt and numeric weight variables (300/400/500/600 as used); the 20 EN styles use Gotham Rounded and named Book/Medium/Bold font-style variables.
- Gotham Rounded numeric weight metadata selects incorrect faces in this runtime; use the named style bindings in Figma. Preserve Book/Medium/Bold when mapping font files for code; do not derive CSS weights from these files’ metadata alone.
- UI mapping added 199 bindings across 157 layers and six exact-color/spacing variables in the Desktop, Mobile and Component sections. Reuse semantic tokens; artwork geometry, raster fills, unused Space-between gaps and fixed artwork sizes were not normalized.
- `color/white/60` (`VariableID:2197:682`) = white with alpha 0.6. `color/card/fill/default` (`VariableID:2197:683`) and `color/button/outline/fill` (`VariableID:2197:684`) alias it. Applied to default mood cards and visible white outline-button fills, including instances. Active cards and primary turquoise buttons retain their own tokens.
- White 60% applies to the fill only: keep text/icon opacity unchanged. In CSS use an alpha background color once; do not also apply 0.6 opacity to the whole card/button or multiply alpha twice.

## Website revision — 2026-11-07

User-supplied Pause with PNG and favicon replace the preview assets. Ghost-button hover has no fill and darkens text slightly (#009E8D). Grounding pages reuse predecoded original character images immediately while the SVG animation document initializes; the poster is replaced only when animation is ready. Notice face starts geometrically centered, then looks left and farther right. Implementation uses -8px / +16px relative to that center and retains the 5.4s cadence; +16px is the implementation interpretation of the requested larger rightward movement, not a numeric value verified in Figma.

## Revision 3 — superseding motion/background decision

User requested equal left/right Notice travel and no center pause. Current implementation starts centered, travels symmetrically -16px/+16px and crosses the center continuously on a 4.8s sine loop. This supersedes prior 5.4s center-hold and asymmetric -8px/+16px descriptions above. Independent root float remains 3.5s; reduced motion retains the centered static face. All screens use the light #F3FCFB background continuously to the bottom of the viewport/document; the reference gradient is not stretched or repeated on tall pages.
