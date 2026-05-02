# Changelog

All notable changes to this project will be documented in this file.

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
