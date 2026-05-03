# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-05-03

### Fixed
- **Auto theme now detects the actual host site's background**, not the visitor's OS preference. Previously, a visitor with iOS dark mode visiting a light-themed site would see the widget render in dark-mode styling - including white-inverted icons that were invisible against the light background. Now the widget walks up the DOM, reads the parent's actual computed background color, and computes perceptual luminance to decide light vs dark. Works correctly on light sites, dark sites, and sites that adapt via `prefers-color-scheme`.

### Renamed (clearer attribute names)
- `data-theme` → `data-color-theme`
- `data-size` → `data-icon-size`
- Other attributes (`data-providers`, `data-prompt`, `data-label`, `data-icon-style`, `data-target`) unchanged.

## [1.0.2] - 2026-05-03

Maintenance release. No functional changes to the widget itself - identical behavior to v1.0.1. Released to refresh CDN cache references and exercise the release pipeline.

## [1.0.1] - 2026-05-03

### Changed
- Widget now renders **right where the script tag is placed** by default (paste in your footer = appears in your footer). Pass `data-target="#some-element"` to mount inside a specific element instead.
- Removed the imposed `border-top` divider line - widget now blends seamlessly into the surrounding container.
- Text color now inherits from the parent element (was hardcoded `#1a1a1a`), so the widget picks up your site's color scheme automatically.

## [1.0.0] - 2026-05-02

First public release.

### Features
- 8 supported AI providers (ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot, Mistral / Le Chat, DeepSeek), with the first 5 enabled by default
- Smart default prompt that asks the AI for a deeper summary, key takeaway, and personal relevance - auto-fills brand name (`og:site_name`), URL, and meta description (gracefully omits the description sentence if the page has no `<meta description>`)
- Brand-color icons by default (full color SVGs from `@lobehub/icons`); pass `data-icon-style="mono"` to opt out
- Light, dark, and auto themes (`data-theme`)
- Three sizes: `sm`, `md`, `lg` (`data-size`)
- **Renders right where the script tag is placed** by default - paste it in your footer and it appears in your footer; paste in a sidebar and it appears there. Use `data-target="#some-element"` to mount inside a specific element instead.
- Configurable via `data-*` attributes: `data-providers`, `data-prompt`, `data-label`, `data-theme`, `data-size`, `data-icon-style`, `data-target`
- Lazy-loaded brand icons from jsDelivr with graceful fallback to letter placeholders if the icon CDN is unreachable
- ~2 KB gzipped, zero runtime dependencies, no tracking, no cookies, no backend
- Served via [jsDelivr](https://www.jsdelivr.com/) CDN - byte-for-byte identical to the `dist/widget.min.js` on the `v1` git tag
- MIT licensed
