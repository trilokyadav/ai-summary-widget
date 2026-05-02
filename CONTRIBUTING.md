# Contributing

Thanks for your interest. This is a small side project, so contributions are kept simple.

## Good first PRs

- **Adding a new AI provider.** Edit the `P` array in `src/widget.js` with the provider's URL pattern and icon slug. Test it works with `examples/index.html`. Open a PR.
- **Fixing a broken provider URL.** AI assistants change their URL schemes occasionally. If you spot one that no longer pre-fills the prompt correctly, fix it and PR.
- **Better default styles.** The widget should look reasonable on any host site. If you've got a small CSS tweak that helps, send it.

## Things I'm less likely to merge

- **Major rewrites.** The whole point is staying ~2 KB and dependency-free. Adding frameworks, build steps, or large refactors goes against that.
- **Analytics/tracking features.** This widget will never call home or track users. That's a hard rule.
- **Per-site account systems.** No accounts, no API keys, no backend.

## Local development

There's no build framework. Just:

1. Clone the repo
2. Open `examples/index.html` in a browser to see the widget
3. Edit `src/widget.js`
4. Refresh the example page to see your changes

To regenerate the minified file before submitting:

```bash
npx terser src/widget.js -c passes=2 -m -o dist/widget.min.js
```

## Reporting bugs

Use the bug report template in [Issues](https://github.com/trilokyadav/ai-summary-widget/issues/new/choose). Include:

- Browser and OS
- The exact snippet you pasted
- What you expected to happen
- What actually happened
- A screenshot if visual, or a CodePen/Glitch link if reproducible

## Code style

- Keep things simple and readable over clever.
- No new dependencies.
- No build tools beyond terser for minification.
- Match the existing style (single quotes, 2-space indent, `var` not `let/const` for IE11-safe output).
