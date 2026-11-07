# Animation specification

Status vocabulary and screen map: [design-spec.md](design-spec.md). Animation applies to grounding Awareness (กลับมาหาตัวเอง), not the later mood-selection screen named `post-activity reflection`.

## Exact targets — Verified structure

| Screen | Desktop root | Mobile root | Independent child target(s), Desktop / Mobile |
|---|---|---|---|
| Notice | `mooca-notice` 2169:18679 | `mooca-notice` 2034:13063 | `head` 2169:18698 / 2034:13080 → `face` 2169:18700 / 2159:18380 |
| Feel | `mooca-feel` 2169:18712 | `mooca-feel` 2034:13221 | No independent face animation; expression is distributed among Vector/Group layers |
| Listen | `mooca-listen` 2169:18740 | `mooca-listen` 2038:13423 | `music-note-1` 2169:18767 / 2038:13459; `music-note-2` 2169:18769 / 2038:13467 |
| Awareness | `mooca-awareness` 2169:18775 | `mooca-awareness` 2038:13737 | `Star 8` 2169:18797 / 2038:13759 |

All roots are 250×250 frames with separate vector/group descendants. Notes are child frames 36×36 and32×32. Glow is a STAR node ≈72.87×72.70, not a frame literally named `star`. Heart is not semantically named: surrounding artwork uses generic Vector/Group names. Leave all non-star artwork unchanged; do not guess a heart selector.

## Shared rules — Verified annotations

Every grounding root: translateY `0 → -5px → 0`, full cycle3.5s, ease-in-out, infinite. No root rotation/scale. Use the same motion on both devices; preserve their original positions. Keep UI stationary and progression independent of animation. Child transforms compose with parent float rather than replacing it. Heart, hands, head/body/scarf retain their relative geometry except explicitly animated face/notes/star.

**Proposed:** one shared floating definition, scoped child animation definitions, begin on screen entry and dispose on exit. No animation on other screens is specified by the inspected annotations; do not add one.

## Screen behavior

### Notice — annotation `2169:18382`

**Verified:** float root; face translateX `0 → -8px → 0 → +8px → 0`, ease-in-out, “1.2s per movement”; pause1–2s at center between directions; repeat continuously, independently of float. Do not move the entire head.

**Approved timing resolution:** 5.4s face loop, independent of the 3.5s float. Each out-and-back takes 1.2s (0.6s per leg), followed by a fixed 1.5s center pause: 0–0.6s center→−8px; 0.6–1.2s return; 1.2–2.7s pause; 2.7–3.3s center→+8px; 3.3–3.9s return; 3.9–5.4s pause. Use ease-in-out on movement legs; repeat infinitely. This approved interpretation resolves the annotation ambiguity.

### Feel — annotation `2169:18431`

**Verified:** shared float only; retain static closed-eye expression. No horizontal face motion or other character effect.

### Listen — annotation `2169:18450`

**Verified:** shared float; each note starts scale0.3/opacity0. Scale to1 and fade to1 over0.8s ease-out; hold0.5s; fade to0 over0.7s ease-in; total3s including1s pause. Note1 starts0s, Note2 starts0.6s; each repeats its own3s timeline with that stagger. Transform origin center; no note translation or rotation; original colors/positions retained. Face static.

**Proposed timeline per note:** 0–0.8 enter;0.8–1.3 hold;1.3–2 fade;2–3 hidden pause. Reset scale to0.3 while hidden. Initial Note2 is hidden until0.6s. Stagger allows overlap; “one after another” does not mean strictly non-overlapping.

### Awareness — annotation `2169:18804`

**Verified:** shared float; animate only `Star 8`: scale `0.7 → 1 → 0.7`, full cycle2.5s, ease-in-out, seamless infinite, origin center. Preserve fills, opacity, gradients, shadows, proportions and position behind heart. Heart stays original size relative to root; no independent heart/body/face/hand animation. Annotation title “Heart Glow Pulse” does not authorize scaling the heart. Actual star uses angular gradients plus drop/inner shadows: export fidelity must be checked (assets document).

## Other motion and reduced motion

**Verified:** sampled prototype navigation and button/mood transitions use0.3s ease-out Dissolve or Smart Animate. They describe prototype behavior, not a mandate to recreate Figma's Smart Animate engine. No countdown or automatic progression was specified in flow annotations.

**Verified:** Listen and Awareness explicitly require disabling continuous animation for `prefers-reduced-motion`.

**Approved:** apply that rule consistently to all four screens: root translate0, face centered, notes static at original size/opacity1, glow original size; preserve meaningful artwork. Use instant navigation/state changes under reduced motion. Pause loops when view is inactive; ensure animation never gates navigation. These reduced-motion behaviors are approved user decisions, not additional Figma verification. Normal-motion transition mapping remains pending: distinguish page navigation, button state and mood selection; sampled 0.3s transitions are evidence, not blanket approval for every interaction.

## Navigation lifecycle integration

Follow the resolved action/state table in design-spec. Resume keeps the same grounding step; Help return restores its originating screen. Restart and Exit clear activity state and stop the previous screen’s loops. Do not make mood resets depend on animation completion. Whether a paused loop resumes its prior phase or restarts on re-entry is an implementation choice; keep the documented cadence either way. No character effects or timing were changed by the typography/UI variable mapping.

## Notice range update — 2026-11-07

Supersedes the earlier ±8px implementation range: user requested a centered initial face and larger rightward travel. The website centers the visible face within the head using their SVG geometry, then uses 0 → -8px → 0 → +16px → 0 relative to that neutral position. The 5.4s timeline and independent 3.5s float are unchanged. Latest inspected Figma annotation still lists ±8px and has no native motion tracks; +16px is an explicit implementation interpretation. Under reduced motion keep the newly centered neutral face. Predecoded static poses cover animation-document loading so navigation never shows a blank character slot.

## Revision 3 — superseding motion/background decision

User requested equal left/right Notice travel and no center pause. Current implementation starts centered, travels symmetrically -16px/+16px and crosses the center continuously on a 4.8s sine loop. This supersedes prior 5.4s center-hold and asymmetric -8px/+16px descriptions above. Independent root float remains 3.5s; reduced motion retains the centered static face. All screens use the light #F3FCFB background continuously to the bottom of the viewport/document; the reference gradient is not stretched or repeated on tall pages.
