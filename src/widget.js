/**
 * ai-summary-widget · MIT License
 * https://github.com/trilokyadav/ai-summary-widget
 *
 * A small embeddable widget that lets visitors summarize your brand,
 * product, feature, or article with ChatGPT, Claude, Perplexity, Gemini, and more.
 */
(function () {
  // [id, name, color, urlBase, iconSlug]
  // urlBase is the part of the URL before the encoded prompt.
  // iconSlug is the file name in the @lobehub/icons package.
  var P = [
    ['chatgpt',    'ChatGPT',    '#10a37f', 'https://chatgpt.com/?q=',                'openai'],
    ['claude',     'Claude',     '#d97757', 'https://claude.ai/new?q=',               'claude'],
    ['perplexity', 'Perplexity', '#20808d', 'https://www.perplexity.ai/search?q=',    'perplexity'],
    ['gemini',     'Gemini',     '#4796e3', 'https://gemini.google.com/app?q=',       'gemini'],
    ['grok',       'Grok',       '#000000', 'https://grok.com/?q=',                   'grok'],
    ['copilot',    'Copilot',    '#0078d4', 'https://copilot.microsoft.com/?q=',      'copilot'],
    ['qwen',       'Qwen',       '#6336E7', 'https://chat.qwen.ai/?q=',               'qwen'],
    ['deepseek',   'DeepSeek',   '#4d6bfe', 'https://chat.deepseek.com/?q=',          'deepseek'],
    ['mistral',    'Mistral',    '#fa520f', 'https://chat.mistral.ai/chat?q=',        'mistral']
  ];
  var ICON_CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/';

  // Capture the script tag at parse time. document.currentScript is only
  // valid during the initial execution.
  var SELF = document.currentScript;

  function findScript() {
    if (SELF) return SELF;
    var all = document.querySelectorAll('script[src]');
    for (var i = all.length - 1; i >= 0; i--) {
      var src = all[i].getAttribute('src') || '';
      if (src.indexOf('ai-summary-widget') >= 0) return all[i];
    }
    return document.querySelector('script[data-providers]') || null;
  }

  function getMeta(n) {
    var e = document.querySelector('meta[name="' + n + '"]') ||
            document.querySelector('meta[property="' + n + '"]');
    return e ? e.getAttribute('content') : '';
  }

  function buildPrompt(tpl, c) {
    if (!tpl) {
      var s = 'Tell me about ' + c.site + ' (' + c.url + ').';
      if (c.desc) s += ' Their site describes them as: "' + c.desc + '"';
      s += '\n\nGive me a deeper summary, the key takeaway, and how this is helpful for me.';
      return s;
    }
    var p = tpl
      .replace('{title}', c.title)
      .replace('{url}', c.url)
      .replace('{site}', c.site)
      .replace('{description}', c.desc);
    if (p.indexOf(c.url) < 0) p += '\n\nURL: ' + c.url;
    if (c.title && p.indexOf(c.title) < 0) p += '\nTitle: ' + c.title;
    return p;
  }

  var STYLES =
    '.aisw{display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px 16px;font:14px ui-sans-serif,system-ui,-apple-system,sans-serif;color:inherit}' +
    '.aisw[data-theme="dark"]{color:#e8e8e8}' +
    '@media (prefers-color-scheme:dark){.aisw[data-theme="auto"]{color:#e8e8e8}}' +
    '.aisw_l{font-size:15px;font-weight:500;margin:0;text-align:center}' +
    '.aisw_r{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}' +
    '.aisw_b{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;color:#6b6b6b;background:transparent;text-decoration:none;font:600 14px/1 ui-sans-serif,system-ui,sans-serif;transition:color .18s,background .18s,transform .18s}' +
    '.aisw_b:hover,.aisw_b:focus-visible{background:rgba(0,0,0,.06);color:var(--c,#1a1a1a);transform:translateY(-1px);outline:none}' +
    '.aisw[data-theme="dark"] .aisw_b{color:#999}' +
    '.aisw[data-theme="dark"] .aisw_b:hover{background:rgba(255,255,255,.08)}' +
    '@media (prefers-color-scheme:dark){.aisw[data-theme="auto"] .aisw_b{color:#999}.aisw[data-theme="auto"] .aisw_b:hover{background:rgba(255,255,255,.08)}}' +
    '.aisw_b svg{width:22px;height:22px;fill:currentColor;display:block}' +
    '.aisw_b.aisw_b_color svg{fill:initial}' +
    '.aisw_b.aisw_b_color:hover{color:inherit}' +
    '.aisw[data-theme="dark"] .aisw_b.aisw_b_color.aisw_b_chatgpt svg,.aisw[data-theme="dark"] .aisw_b.aisw_b_color.aisw_b_grok svg{filter:brightness(0) invert(1) opacity(.95)}' +
    '@media (prefers-color-scheme:dark){.aisw[data-theme="auto"] .aisw_b.aisw_b_color.aisw_b_chatgpt svg,.aisw[data-theme="auto"] .aisw_b.aisw_b_color.aisw_b_grok svg{filter:brightness(0) invert(1) opacity(.95)}}' +
    '.aisw[data-size="s"] .aisw_b{width:32px;height:32px}.aisw[data-size="s"] .aisw_b svg{width:18px;height:18px}' +
    '.aisw[data-size="l"] .aisw_b{width:44px;height:44px}.aisw[data-size="l"] .aisw_b svg{width:26px;height:26px}';

  function injectCss() {
    if (document.getElementById('aisw-css')) return;
    var s = document.createElement('style');
    s.id = 'aisw-css';
    s.textContent = STYLES;
    (document.head || document.documentElement).appendChild(s);
  }

  // Cache icon fetches across multiple widgets on the same page
  var iconCache = {};
  function loadIcon(slug, useColor) {
    var key = (useColor ? 'c-' : 'm-') + slug;
    if (iconCache[key]) return iconCache[key];
    if (typeof fetch !== 'function') return iconCache[key] = Promise.resolve('');
    var url = ICON_CDN + slug + (useColor ? '-color' : '') + '.svg';
    return iconCache[key] = fetch(url)
      .then(function (r) {
        if (r.ok) return r.text();
        // Fall back to monochrome if -color variant doesn't exist
        if (useColor) return fetch(ICON_CDN + slug + '.svg').then(function (r2) { return r2.ok ? r2.text() : ''; });
        return '';
      })
      .catch(function () { return ''; });
  }

  function render(cfg) {
    try {
      injectCss();

      var c = {
        url: location.href,
        title: document.title || '',
        desc: getMeta('description') || getMeta('og:description') || '',
        site: getMeta('og:site_name') || location.hostname || ''
      };
      var prompt = buildPrompt(cfg.prompt, c);
      var ids = cfg.providers
        ? cfg.providers.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        : ['chatgpt', 'claude', 'perplexity', 'gemini', 'grok'];

      var useColor = cfg.iconStyle !== 'mono';

      var root = document.createElement('div');
      root.className = 'aisw';
      root.setAttribute('data-theme', cfg.theme || 'auto');
      if (cfg.size) root.setAttribute('data-size', cfg.size);

      var label = document.createElement('p');
      label.className = 'aisw_l';
      label.textContent = cfg.label || ('Request an AI summary of ' + c.site);
      root.appendChild(label);

      var row = document.createElement('div');
      row.className = 'aisw_r';

      ids.forEach(function (id) {
        try {
          var p = null;
          for (var i = 0; i < P.length; i++) { if (P[i][0] === id) { p = P[i]; break; } }
          if (!p) return;

          var a = document.createElement('a');
          a.className = (useColor ? 'aisw_b aisw_b_color ' : 'aisw_b ') + 'aisw_b_' + id;
          a.href = p[3] + encodeURIComponent(prompt);
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.title = 'Summarize with ' + p[1];
          a.setAttribute('aria-label', a.title);
          a.style.setProperty('--c', p[2]);
          // Letter placeholder shows immediately, replaced when icon loads
          a.textContent = p[1].charAt(0);
          row.appendChild(a);

          loadIcon(p[4], useColor).then(function (svg) {
            if (svg && svg.indexOf('<svg') === 0) a.innerHTML = svg;
          });
        } catch (err) { /* skip this provider, keep rendering the rest */ }
      });

      root.appendChild(row);

      if (cfg.target) {
        var target = document.querySelector(cfg.target);
        (target || document.body || document.documentElement).appendChild(root);
        return;
      }
      // Default: render right where the script tag was placed
      var s = SELF || findScript();
      if (s && s.parentNode && s.parentNode.tagName !== 'HEAD') {
        s.parentNode.insertBefore(root, s.nextSibling);
      } else {
        (document.body || document.documentElement).appendChild(root);
      }
    } catch (err) {
      if (window.console && console.error) console.error('[ai-summary-widget]', err);
    }
  }

  function init() {
    var s = findScript();
    if (!s) {
      if (window.console && console.warn) {
        console.warn('[ai-summary-widget] could not locate script tag; widget not mounted');
      }
      return;
    }
    var d = s.dataset || {};
    render({
      providers: d.providers,
      prompt: d.prompt,
      label: d.label,
      theme: d.theme,
      size: d.size === 'sm' ? 's' : d.size === 'lg' ? 'l' : null,
      iconStyle: d.iconStyle,
      target: d.target
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})();
