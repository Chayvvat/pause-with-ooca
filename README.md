# Ooca grounding preview

Static HTML/CSS/ES modules. No framework, backend, analytics or runtime API calls. The design source and approved interaction contract are in `docs/handoff/` and the referenced Figma file. Original asset exports and official Prompt fonts are local to `dist/assets/`.

## Run and check

```sh
npm run dev
npm test
```

Serve `dist/` over HTTP; ES modules and character SVG objects require a server. The service worker caches the app after a successful installation. Bump its cache version whenever published static assets change.

## Implemented

- Welcome, optional pre/post check-ins, all four grounding steps, Completion, Help, Cancel and Download dialogs.
- Independent nullable moods; Skip clears only its check-in slot; Back/Help/Resume preserve values; Exit/Restart clear both and return to Welcome.
- Non-interactive logo, per-row telephone URIs, external store links, original QR artwork.
- Original SVG character poses with preserved child IDs: Notice face, Listen notes and Awareness star animate independently of the shared float. Reduced motion leaves the artwork static. Dialog/background inactivity pauses loops.
- Native radio groups, keyboard focus, native dialog focus trapping/Escape, trigger-focus restoration, screen-heading focus, responsive text wrapping and short-viewport scrolling.
- Local image/font preparation with initial asset-load Retry; service worker precaches app assets. No mood is sent to a server or written to persistent storage.

## Preview implementation choices pending product review

- Clicking/tapping an already-selected mood clears that slot to null; choosing another card switches selection. This is an approved follow-up change. Check-in actions remain enabled because selection is optional.
- Completion summary cards are read-only; use Back to change a response.
- Refresh/direct entry starts a fresh Welcome session. Returning from the telephone app to the still-loaded page retains state. OS/browser termination recovery is not implemented.
- Browser Back retains current moods; after Exit/Restart, history from the previous activity cannot restore that activity.
- Welcome has no redundant Back control. Help without an origin falls back to Welcome.
- Page navigation is instant; button/mood feedback uses short CSS transitions. Reduced motion disables transitions and loops.
- Content-fit navigation breakpoint: 680 CSS px. Reference placements use normal document flow, with scrolling on small heights.

## Verification

Seven Node state tests passed, including all 25 mood pairs, optional Skip isolation, Help origins, Resume preservation, reset/history invalidation and the null-mood journey. Browser checks exercised selection, grounding navigation, original character renders, child animation counts, Resume, Help/Download return, Before-only Completion and Restart clearing. Reference desktop/mobile and narrow/short layouts were inspected.

Telephone links were inspected without placing calls. External service information and the QR destination have not been independently accepted. Production webfont rights/delivery and final rendered accessibility/contrast acceptance remain release checks. Supplied Gotham Rounded font availability in Figma does not itself establish web embedding rights; this is a private design preview.

## Source attribution

Prompt: official google/fonts distribution, license in `dist/assets/fonts/Prompt-OFL.txt`. Gotham Rounded: user-supplied files. Illustrations, backgrounds, icons, QR, logos and store badges: user-provided Figma design. Static exports retain their original geometry and effects; rendering references in `design-reference/` are development inputs, not runtime assets.

## Revision 2026-11-07

Replaced Pause with and favicon with user-supplied PNG files. Ghost hover keeps a transparent fill and darkens text to #009e8d. Character SVG images are decoded in advance and reused as immediate posters until their animation document is ready. Notice centers the face using head/face geometry, then looks left 8px and right 16px on the existing 5.4s loop; right 16px is an implementation interpretation of the requested larger rightward movement, while the Figma annotation still states ±8px.

## Revision 3 — continuous Notice motion and full-height light background

The gradient is painted once over the 844px reference composition on a solid #F3FCFB base, so tall viewports and longer pages retain the same light color down to the bottom without a gradient restart or seam. Notice now uses symmetric ±16px travel on a continuous 4.8s sine loop, starting centered and crossing the center without a pause. This supersedes revision 2's asymmetric range and the original center-hold timing. Float and reduced-motion behavior are unchanged.

## Internal mobile preview — 2026-11-08

Approved Figma revision: mobile content starts at y=120, primary actions at y=576 on the 390×800 reference; shorter/narrower devices retain normal vertical scrolling. Welcome artwork is reduced; grounding scenes are 224px with clouds at y=300 and a 40px copy gap. Mood cards are 147×116px with 48px face slots. Completion spacing, 320px dialogs, 160px dialog artwork, close buttons, and Help card fills match the approved mobile design. Active mood fill is turquoise 100 at 50%, border #80e2d9, text #00b6a3; default and Help fills are white at 60%.

Validation: seven state tests pass. Browser checks covered 390×800 reference geometry, all four grounding cloud/action positions, both check-ins, deselection, Help origin return, Resume, both dialogs, Completion, 320×568 scrolling/overflow and desktop 1440px layout. No browser errors observed. This mobile revision was approved in the internal preview before release.

## Internal desktop/tablet preview — 2026-11-08

Desktop now follows the updated 1440×800 Figma references: 120px content origin, 224px grounding scene, 300px clouds, 576px primary actions, 520px check-in/completion content, and 232×116px mood cards. Cancel has a 480px outer frame and 440px panel; Download is 440px. Mobile below 680px retains the approved v4 geometry.

Tablet widths use the desktop content sizes with responsive header margins. Below 741px viewport height, upper/CTA spacing compresses and content remains in normal flow with vertical scrolling as needed. Background decoration is clipped to the viewport so it does not create artificial scrolling on iPad landscape.

Checks: seven state tests pass; browser geometry checked at 1440×800, 768×1024, 1024×768, 820×1180, 1180×820, 1024×600 and 390×800. All main journey screens, Help and both dialogs inspected. Approved for GitHub and Cloudflare release.

Desktop preview follow-up: all primary action groups use the same grid row (y=576 on the 800px reference; y=528 on short windows). Pre/post check-ins and Completion share the same 480px grid and 232px card width. This revision was approved in the internal Site preview and released to Cloudflare Pages.

## Production hosting

https://pause-with-ooca.pages.dev/ — Cloudflare Pages Direct Upload of the contents of dist/. No build step. Run npm test before releasing. GitHub commits do not trigger automatic deployment.

