# App icon source

`Rakazo.icon` is the shared editable source for macOS and iOS. Open it in Apple's
Icon Composer with Xcode 26 or newer. The RunTars foreground keeps its authored
lighting, is centered, and uses the system dark background without translucency.
The existing `Rakazo.icon` and `orange-bot.png` paths are retained for packaging
compatibility; they now contain the RunTars artwork.

macOS packaging compiles the source into a Tahoe asset catalog and generates the
legacy ICNS fallback. Expo copies the same source into the iOS project.

The platform exports are:

- `apps/desktop/assets/icon-macos.png`: 1024-pixel macOS development preview,
  including Dock margins. Verify the compiled Icon Composer appearance on macOS
  when packaging; the preview is not a capture of the native renderer.
- `apps/mobile/assets/icon.png`: opaque 1024-pixel square for the generic/legacy icon,
  with no rounded mask or Dock margins.
- `apps/mobile/assets/adaptive-icon.png`: transparent 1024-pixel Android foreground;
  the 1024-pixel source canvas is scaled to 716 pixels and centered with 154-pixel
  margins. The full character stays inside the launcher's safe area.
- `apps/mobile/assets/icon-background.png`: opaque Android background using the
  shared dark background token.
- `apps/mobile/assets/monochrome-icon.png`: matching Android alpha silhouette with
  a transparent visor and positive eye strokes for themed launchers.

Refresh platform exports after changing the source. Android supplies its own mask;
never bake Mac corners, a rim, or an outer shadow into adaptive layers.

Run `pnpm --filter @rakazo/ui-tokens export:brand` to refresh the web and marketing
favicons, install icons, marketing mark, Windows/Linux icons, generic mobile icon,
Android foreground and background, mobile splash, and mobile web favicon.
These use the same RunTars foreground with the shared dark
background, a rounded mask for small browser marks, and transparent splash padding.
The notification export uses the Android monochrome silhouette so its visor remains
transparent. Refresh the authored monochrome silhouette separately when changing
the character. Apple Icon Composer and the macOS preview remain separate because
their system masks and safe areas differ.

After exporting, run `pnpm exec tsx apps/www/scripts/render-og.mjs` to refresh the
marketing page social cards, including the homepage; set `CHROME_PATH` to a headless Chrome executable when
it is not available at the script's default location.

## Alternate app icons

`app-icons/` holds the 512-pixel opaque squares people can pick as the app's icon in settings,
named by their id in `APP_ICONS` (`packages/contracts/src/clients/app-icons.ts`). The default is
the primary icon above. Run `pnpm --filter @rakazo/ui-tokens export:app-icons` after adding or
changing one: it writes the desktop Dock and taskbar files, the 180-pixel mobile images the iOS
build resizes into its alternate icon sets, and the web picker thumbnails.

## Animated vector avatars

The animated avatar still uses the original Rakazo SVG paths and gradients in the
shared `logo-avatar-art.ts` definition. It is intentionally independent of the
RunTars static icon in this change. Its reference colour samples are preserved in
the avatar E2E test; no raster body is embedded or loaded by the vector renderer.
