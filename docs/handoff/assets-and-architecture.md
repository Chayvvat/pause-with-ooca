# Assets and architecture

See [design-spec.md](design-spec.md) for tokens/screens and [animation-spec.md](animation-spec.md) for exact animation targets. No application code or production asset exports have been created. Figma variables/styles and bindings were updated during follow-up work; these updates are design work, not completed asset delivery.

## Asset inventory

| Required asset | Verified source / condition | Export readiness |
|---|---|---|
| Four character poses | Separate vector/group trees; IDs in animation spec | No root export settings. Structurally separable; SVG export/render not validated |
| Notice face / Listen notes | Named independent frames | Preserve grouping/IDs in delivered SVG; flattened single path/image cannot support required independent motion |
| Awareness glow | `Star 8`, STAR with solid+two angular-gradient fills, drop/inner shadows | High fidelity risk for SVG/CSS conversion; confirm exported appearance and editable isolation |
| Mood faces | `2052:14956`, five variants including no-select; tired variant named `try` | Vector artwork available in Figma; no local SVGs yet |
| Logo | `ooca-logo-color 1`, e.g. `2159:18175` | Export not tested; preserve supplied artwork |
| Back/Help/close/restart/arrow | Header controls and Icon set `2124:16331` | Source layers available; production SVG files not delivered |
| Grass/background | `image 232`, e.g. `2152:17612`; 1919×384 rectangles on grounding screens; Mobile Notice also has `grass` frame `2159:18381` | Raster image fill, CROP, configured PNG1× on representative image; no claim of vector availability |
| Welcome imagery | `image 230`, `2159:18036`, multiple image-fill sources | Raster fills, FILL/CROP; no presets |
| Download QR | `image 231`, `2152:17733` | Raster fill; encoded destination/scanability not tested |
| Store badges | `ooca-app-store-th 1` `2152:17735`, `ooca-play-store-th 1` `2152:17766`; Mobile counterparts `2052:15560`, `2052:15592` | External URLs present in reactions; artwork/export not tested |

**Verified:** four distinct image-fill hashes across inspected views. No production SVG/background bundle has been exported into the workspace. User-supplied Gotham Rounded files exist outside the workspace (see Fonts). Character layers are not wholly flattened in Figma; exported SVG internals have not been inspected. Do not claim export-ready assets based solely on vector node types.

**Approved export requirements:** preserve separate animation layers and verify production assets; availability in Figma is not acceptance of an export. Export acceptance: export each pose with required child groups preserved, or aligned subassets sharing one viewBox. Verify face travel without clipping, note origins, star-behind-heart stacking and glow bounds. Compare SVG render with Figma; angular gradients/shadows may require a separately rasterized glow while keeping it independently scalable. Do not flatten the whole animated character. Confirm QR at rendered size and preserve crop/alpha in backgrounds.

## Fonts

**Verified:** 22 TH styles use Prompt (Light/Regular/Medium/SemiBold); 20 EN styles use Gotham Rounded (Book/Medium/Bold). Inter has been removed from local typography styles. All 42 styles have mapped typography variables; sizes and line heights were preserved. See design-spec for the weight/style-binding distinction.

User-supplied source directory: `/Users/fei/Desktop/Fei/C's/occa/Gotham/`. It contains OTF/TTF Gotham Rounded faces. Book, Medium and Bold were successfully loaded in the connected Figma runtime after upload. This confirms design-font availability, not webfont delivery or licensing.

**Remaining delivery task:** confirm web embedding rights and choose production font format/delivery. The supplied OTF/TTF files are source fonts, not an accepted webfont bundle. Obtain Prompt from its official distribution with license; use Gotham Rounded only by an approved licensed delivery route. Do not substitute silently. Figma upload does not establish web licensing.

## Proposed component architecture

- `ExperienceShell`: shared header, background, main region, navigation context.
- `Welcome`, `MoodCheckIn` (pre/post content), `GroundingStep` (four configurations), `Completion`, `Help`.
- `ResponsiveNavigation`, `Button`, `MoodOption`, `MoodSummary`, `Character` with pose-specific child hooks.
- `CancelDialog`, `DownloadDialog`; shared modal focus/close behavior.
- Central journey state: current step, previous Help origin, independent nullable before/after moods, dialog state. Shared navigation actions for both layouts; no device-specific route graph. Implement the approved action/state table in design-spec. Logo is non-interactive; Restart and Exit independently reset both moods and return to Welcome. Approved Back preserves moods; optional mood Skip clears only its corresponding value.

Use a small explicit state model; no backend dependency is established. Technology/framework choice is not determined by the empty workspace. Avoid introducing API or storage requirements.

## Proposed responsive, accessibility and performance approach

- **Approved:** use measured reference layouts and shared CSS; preserve icon sizes and label visibility rules. Select a content-fit media-query threshold after layout validation, rather than treating frame widths as breakpoints.
- **Approved:** allow vertical scrolling on short viewports. Center constrained content and let Thai text wrap; check narrow layouts and non-overlapping controls. Fixed Figma coordinates are reference evidence, not permission to clip content.
- Native buttons; accessible names for icon-only navigation; mood group with selected semantics and keyboard operation. Decorative character/background artwork hidden from assistive technology; instructions remain text.
- **Approved:** accessible focus and pressed states; modal focus trap, Escape/close dismissal without destructive state changes, and focus restoration. Dismissal closes the overlay and preserves underlying activity; it is distinct from Exit. Preserve visible approved icon dimensions when providing accessible hit areas. Help return restores the saved originating screen and moods; closing Download stays on Help without replacing its origin.
- Verify contrast for small gray text and translucent cards against actual background; contrast compliance has not been measured.
- Animate transforms/opacity; cache reused assets, avoid duplicate pose exports per viewport, stop inactive loops and support reduced motion as specified in animation-spec.
- Flow `2011:3349` requests continued use after load without APIs and Retry if initial load fails. No offline/error screen design exists. Browser caching strategy and error UI remain proposals until approved.
- Help dialing behavior is explicitly approved in per-row annotations: use the exact annotated telephone URI for each row, not one shared destination. Opening an external telephone handler must not clear app state. Service availability/content and QR destination have not been externally validated.
- Store destinations inspected in prototype: App Store app ID `1260476046`; Google Play package `co.ooca.user`. Retain the full inspected URLs when implementing and validate them before release; final QR destination remains unverified.
- Proposed responsive acceptance: clamp dialogs to available width with side gutters, permit internal scrolling on short viewports, test text zoom and intermediate widths, and preserve reference background crops. These are implementation proposals rather than newly approved design metrics.
- Offline requirement needs a defined load-complete point: required screens, fonts and assets must be available before claiming network-loss readiness. Offline reload/session recovery has not been specified.
