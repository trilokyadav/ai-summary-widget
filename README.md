# ai-summary-widget

> A small embeddable widget that lets visitors summarize your brand, product, feature, or article with ChatGPT, Claude, Perplexity, Gemini, and more.

A drop-in `<script>` tag that adds a row of AI assistant buttons to your page. Visitors click one - their preferred AI opens with a "summarize this page" prompt pre-filled. Useful when you want people to quickly understand what your company, product, or feature does without reading through everything.

**[→ Create a widget for your brand at trilokyadav.com/ai-summary-widget](https://trilokyadav.com/ai-summary-widget)**

- ~2 KB gzipped, zero dependencies
- No tracking, no cookies, no backend
- Served via [jsDelivr](https://www.jsdelivr.com/), the multi-CDN trusted by WordPress, Stripe, Discord, and millions of other websites - serving over 100 billion requests per month worldwide
- MIT licensed, open source, [auditable on GitHub](https://github.com/trilokyadav/ai-summary-widget)

## Install

Paste this script tag wherever you want the widget to appear - your footer, sidebar, end of an article, anywhere:

```html
<script src="https://cdn.jsdelivr.net/gh/trilokyadav/ai-summary-widget@v1.0.0/dist/widget.min.js"></script>
```

That's it. The widget renders **right where you paste the script tag** with five colored brand-icon buttons: ChatGPT, Claude, Perplexity, Gemini, Grok. No build step, no npm install, no API key.

Most sites paste it in the footer just above the copyright line - the widget then naturally inherits your footer's styling.

Want it in a different spot than where the script lives? Pass `data-target="#your-element"` and the widget mounts inside that element instead.

### What gets sent to the AI by default

When a visitor clicks a button, the AI receives a prompt built from your page's `og:site_name`, URL, and `<meta description>`:

```
Tell me about {site} ({url}). Their site describes them as: "{description}"

Give me a deeper summary, the key takeaway, and how this is helpful for me.
```

The "Their site describes them as..." sentence is automatically omitted if the page has no `<meta description>`, so the prompt always reads naturally.

**Real example - if you embed it on `github.com`:**

```
Tell me about GitHub (https://github.com/). Their site describes them as: "Join the world's most widely adopted, AI-powered developer platform where millions of developers, businesses, and the largest open source community build software that advances humanity."

Give me a deeper summary, the key takeaway, and how this is helpful for me.
```

The AI now knows the brand, the URL, and the brand's own pitch in their own words - so the summary is actually useful, not generic.

### Want Customizations?

**Highly recommended.** The default works out of the box, but customizing the prompt, label, providers, theme, and visual style takes 30 seconds and gives visitors a much more on-brand experience. Two ways:

1. **Use the visual builder** (easiest) - point, click, copy your custom snippet:

   **[→ Build your snippet at trilokyadav.com/ai-summary-widget](https://trilokyadav.com/ai-summary-widget)**

2. **Hand-edit the script tag** - add `data-*` attributes (see [Configuration](#configuration) below).

## Configuration

All options are passed via `data-*` attributes on the script tag:

| Attribute | Description | Default |
|---|---|---|
| `data-providers` | Comma-separated list of provider IDs | `chatgpt,claude,perplexity,gemini,grok` |
| `data-prompt` | Prompt template sent to each AI | See [default prompt](#default-prompt) |
| `data-label` | Heading text shown above the icons | `Request an AI summary of {site}` |
| `data-theme` | `light`, `dark`, or `auto` | `auto` |
| `data-size` | `sm`, `md`, or `lg` | `md` |
| `data-icon-style` | `mono` or `color` | `color` |
| `data-target` | CSS selector to mount the widget into a specific element | (none — widget renders where the script tag is placed) |

### Available providers

`chatgpt` · `claude` · `perplexity` · `gemini` · `grok` · `copilot` · `mistral` · `deepseek`

### Default prompt

When you don't pass `data-prompt`, the widget sends:

```
Tell me about {site} based on this page: "{title}". What does this brand or product do, who is it for, and what's the key takeaway? Page description: {description}. Source: {url}
```

This works well for brand homepages (the most common use case) and still gives reasonable results on product pages, blog posts, and articles. The brand name, page title, meta description, and URL are all auto-substituted from the page itself.

### Prompt template variables

Your `data-prompt` can include these placeholders, replaced at runtime:

- `{title}` - the page's `<title>`
- `{url}` - the current URL
- `{site}` - site name (from `og:site_name` meta tag, or hostname)
- `{description}` - the page's meta description

URL and title are appended automatically if they aren't already in your template, so the AI has enough context.

### Example: customized

```html
<script src="https://cdn.jsdelivr.net/gh/trilokyadav/ai-summary-widget@v1.0.0/dist/widget.min.js"
        data-providers="chatgpt,claude,perplexity"
        data-prompt="Summarize {title} from {site} in 3 bullets"
        data-label="Quick TL;DR with"
        data-theme="dark"
        data-icon-style="mono"></script>
```

## How it works

The widget reads your page's URL, title, and meta description, builds a prompt, and constructs a deep-link to each AI provider with the prompt URL-encoded as a query parameter (`?q=...`). The visitor's browser opens that link in a new tab.

There's no API call, no server, no tracking. The widget just builds links - the AI providers do the actual summarization on their side.

Most AI assistants will fetch the URL to read the actual content (Perplexity especially). For others, the title and description give them enough context to produce a useful summary.

## Adding a provider

The provider list is in `src/widget.js`. Each entry is a short array:

```js
['providerid', 'Display Name', '#brandcolor', 'https://provider.com/?q=', 'icon-slug']
```

The icon slug is the file name in [@lobehub/icons](https://github.com/lobehub/lobe-icons). PRs welcome for any AI assistant with a URL-based prompt parameter.

## Building

There's no real build step. To regenerate the minified dist file:

```bash
npx terser src/widget.js -c passes=2 -m -o dist/widget.min.js
```

That's it.

## Local testing

Open `examples/index.html` in a browser. It loads the widget from `../dist/widget.min.js` and shows it at the bottom of a sample page.

## License

MIT - use it however you want, no attribution required.

## Credits

- Brand icons from [@lobehub/icons](https://github.com/lobehub/lobe-icons) (MIT)
- Built by [Trilok Yadav](https://trilokyadav.com) as a side project
