# Implementation plan

**Status: core navigation and Figma token work are documented; implementation is not yet fully validated.** Resume, Exit, Help return/dialing, Completion actions and non-interactive Logo are resolved. Typography variables are mapped across all 42 styles. Assets/webfont delivery, remaining interaction decisions and responsive/offline validation still need work. This update authorizes no application implementation or release by itself.

## Phases — Proposed, ordered

1. **Close remaining interaction details:** confirm the small decision list below. Use the resolved route/state table in design-spec; do not reopen approved Resume/Exit/Help/Logo behavior.
2. **Prepare production assets/fonts:** export isolated animation layers; compare renders, backgrounds, icons and badges; validate QR. Gotham Rounded now loads in Figma and source OTF/TTF files are supplied; confirm web delivery rights/format separately.
3. **Build shared foundations:** choose stack, consume semantic variables and text styles, implement shell/header, buttons, mood options, dialogs and central journey state. Use one route graph for both layouts. Next/Skip remain user-paced.
4. **Add motion:** follow animation-spec, including independent transforms, approved timing and reduced motion. Never gate navigation on loops.
5. **Validate:** compare references, test state transitions/edge cases and responsive boundaries; verify assets, font rendering, network-loss behavior and external actions before release.

## Resolved contract

- Resume closes Cancel and preserves step/moods; close/Escape also preserve state.
- Exit clears Before/After to null, ends the activity and returns to Welcome.
- Completion Restart clears both moods and returns to Welcome; Start then opens optional pre-mood.
- Both Completion layouts offer Restart + Help. Historical Cancel/Skip and self-linking CTA findings are superseded.
- Help returns to its saved originating screen with state preserved. Download close stays on Help and does not overwrite that origin.
- Each Help telephone row uses its own explicitly annotated telephone URI; state remains when returning to the still-loaded app.
- Logo is brand artwork only: no navigation, hover action or keyboard focus.
- Back preserves moods; optional-mood Skip clears only the corresponding slot; grounding Skip does not clear moods.
- Content-fit breakpoint selection, short-viewport scrolling, Notice timing, layer separation, accessible dismissal/states and reduced motion were already approved.

## Remaining decisions and delivery checks

| Type | Item | Required resolution |
|---|---|---|
| UX | Desktop Welcome Back was last inspected as self-linking | Remove or define meaningful behavior |
| UX | Disabled-state usage/appearance | Define when disabling is appropriate; optional mood must not block progression. Repeat-click deselection was approved and implemented on 2026-11-07. |
| UX | Summary cards reuse selectable components | Confirm proposed read-only Completion cards; do not silently inherit selection reactions |
| UX / lifecycle | Direct Help entry without origin, refresh/session recovery and browser Back | Define fallback/history/persistence policies; external-app return is not a promise of reload recovery |
| UX / motion | Normal-motion navigation and component transitions | Map page, button and mood transitions explicitly; sampled 0.3s is not a universal rule |
| UX / loading | Initial-load Retry and offline load-complete boundary | Define Retry UI and assets required before claiming continued use without network |
| Delivery | Assets and webfonts | Export/verify assets; confirm licensed web embedding and font delivery format |
| Release verification | QR/store/contact content | Validate final destinations and service content; dialing behavior itself is already resolved |

## Test checklist

- [ ] Match all 11 view pairs (22 views) and three completion edge cases; exclude exploratory draft material.
- [ ] Welcome → optional pre-mood → Notice → Feel → Listen → Awareness → optional post-mood → Completion; no countdown, sensor permissions or automatic advance.
- [ ] Exercise all 25 Before/After pairs. Null shows no-select face and ไม่ได้เลือก independently in each slot. Never copy Before into After, assign a default, or infer improvement.
- [ ] Back retains selections; change one slot without changing the other; selecting then Skip clears only that slot; Completion reflects the latest state.
- [ ] Check both-null, Before-only, After-only, unchanged-mood and less-positive-mood cases against the same neutral Completion copy and actions.
- [ ] Resume, close/Escape and Exit behave correctly from each grounding step. Exit clears both moods; a new activity has no stale selection.
- [ ] Restart clears both moods and goes to Welcome on both layouts.
- [ ] Open Help from Welcome, each activity screen and Completion; return to the correct origin without resetting state. Open/close Download, then return to that same origin.
- [ ] Each telephone row opens its own annotated number; returning to the loaded web app preserves Help, origin and moods. Account for device-dependent telephone-handler support.
- [ ] Logo is non-interactive and absent from keyboard tab order. No cross-device route graph or unintended self-linking action.
- [ ] All 42 text styles use family/size/line-height/letter-spacing variables and weight or named-style bindings. TH uses Prompt; EN uses Gotham Rounded; no Inter local styles remain.
- [ ] Gotham Book/Medium/Bold resolve to the actual intended faces. Do not infer production weight mapping from inconsistent source font metadata alone.
- [ ] Default mood-card and outline-button backgrounds use color/white/60 through semantic aliases. Apply alpha once to fill only; text/icons remain opaque. Active cards and primary buttons retain their own fills.
- [ ] Reuse UI spacing/color/radius tokens without normalizing character/logo artwork geometry or fixed reference artwork sizes.
- [ ] Match 1440×844 and 390×844; select breakpoint by content fit, then test boundaries, narrow/short viewports, dialog scrolling, Thai wrapping and text zoom.
- [ ] Motion targets, timings, independent transforms, note stagger, face pauses and star layering match animation-spec; no independent heart scaling.
- [ ] Reduced motion stops loops; inactive views stop animating; navigation remains usable.
- [ ] Exported SVGs/subassets have no clipped face/glow, broken effects or wrong crops; QR is readable at rendered size.
- [ ] Keyboard traversal, visible focus, mood semantics, icon names, dialog focus trap/Escape/restore and rendered contrast pass.
- [ ] Production fonts load with Thai coverage and licensed delivery; no silent fallback.
- [ ] Loaded experience survives network loss within the agreed boundary; initial failure has Retry; direct-entry/reload policies are tested once defined.

## Validation scope and limits

- Original read-only inspection covered preview screens, components, image fills and animation targets. Subsequent user-authorized Figma writes updated typography variables, styles and UI bindings; the old claim that no Figma writes occurred is superseded.
- All 42 local text styles were verified with complete typography bindings: 22 TH and 20 EN. English Inter styles were migrated to Gotham Rounded after upload. Named font-style bindings correct Gotham’s numeric-weight selection issue.
- UI mapping added 199 bindings over 157 layers, then added white-60% primitive/semantic fill tokens and updated card/outline-button components and instances. Representative Mobile Welcome/Help/check-in and Desktop check-in renders were inspected during that work.
- Follow-up prototype inspections confirmed corrections to previously reported cross-device links. Resume and dynamic Help return are specified through annotations and need not be represented by fixed prototype wires.
- Production exports, webfont rights/delivery, QR destinations, live service content, rendered contrast and application tests have not been accepted or completed.
- This handoff revision changes only the four Markdown documents. It does not create application code, export production assets or deploy anything.

## Implemented follow-up — 2026-11-07

Updated the existing private Sites preview with supplied Pause with/favicon PNGs, repeat-click/tap/Space mood deselection, immediate decoded Mooca posters, centered Notice movement with a farther +16px right endpoint, and transparent ghost hover with darker text. Seven state tests pass; browser verification confirms deselection on both check-ins, the Before-only summary after clearing After, and ready posters for all four poses. These decisions supersede the previous no-deselection preview choice.
