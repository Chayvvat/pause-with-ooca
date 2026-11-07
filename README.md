# Pause with Ooca

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

Prompt: official google/fonts distribution, license in `dist/assets/fonts/Prompt-OFL.txt`. Gotham Rounded: user-supplied files. Illustrations, backgrounds, icons, QR, logos and store badges: user-provided Figma design. Static exports retain their original geometry and effects; Figma rendering references remain in the original development workspace and are not runtime assets.

## Revision 2026-11-07

Replaced Pause with and favicon with user-supplied PNG files. Ghost hover keeps a transparent fill and darkens text to #009e8d. Character SVG images are decoded in advance and reused as immediate posters until their animation document is ready. Notice centers the face using head/face geometry, then looks left 8px and right 16px on the existing 5.4s loop; right 16px is an implementation interpretation of the requested larger rightward movement, while the Figma annotation still states ±8px.

## Revision 3 — continuous Notice motion and full-height light background

The gradient is painted once over the 844px reference composition on a solid #F3FCFB base, so tall viewports and longer pages retain the same light color down to the bottom without a gradient restart or seam. Notice now uses symmetric ±16px travel on a continuous 4.8s sine loop, starting centered and crossing the center without a pause. This supersedes revision 2's asymmetric range and the original center-hold timing. Float and reduced-motion behavior are unchanged.

## Hosting

Live site: https://pause-with-ooca.pages.dev/

Cloudflare Pages project: `pause-with-ooca`. The current release uses Direct Upload of the contents of `dist/` (no build step). GitHub stores source and tests; commits do not currently trigger automatic deployments.

To update, run `npm test`, then upload the contents of `dist/` as a ZIP in Cloudflare Pages > pause-with-ooca > Create deployment > Production. Keep `index.html` at the ZIP root. Do not upload this repository root as the website.
