# Fix production image delivery

## Scope
- Replace bundled/CDN branding references with exact, lowercase root paths served from `public/`.
- Preserve the current high-resolution transparent SUKHF and SUES artwork.
- Move the rocket and skyline backgrounds to stable public paths so all visible imagery follows the same production-safe approach.
- Add a reusable image fallback that swaps failed brand images to a local fallback mark without retry loops.

## Implementation
1. Recover the source logo PNGs from their existing asset URLs, validate dimensions/transparency, and place them under `public/branding/` with exact filenames.
2. Move the rocket and skyline files into `public/images/` and replace imports with `/images/...` paths.
3. Update header, loader, footer, registration, sign-in, and admin branding to use `/branding/...` paths and fallback handling.
4. Audit all remaining static image references and casing.
5. Record the public-asset convention in the project architecture notes.

## Verification
- Run a Vercel-targeted production build.
- Confirm every required image exists in the generated public output.
- Serve the production build locally and verify all image requests return successfully on desktop and mobile.
- Check the latest build diagnostics before completion.
