# Caposeo Mockup Site — PLAYBOOK

## What This Is

Static HTML/CSS site deployed to GitHub Pages as the marketing front for Caposeo (built in `seo-pulse/`). Purpose: validate demand, collect founding member signups, and give the product a home while the app is built.

## Structure

```
caposeo-mockups/
├── index.html                    # Main landing page
├── pricing.html                  # Single-tier Founding Member pricing
├── waitlist.html                 # Signup form (Formspree)
├── shared/
│   ├── styles.css                # Brand tokens + component library
│   └── charts.js                 # SVG chart helpers (CI bands, confusion matrices)
├── assets/
│   └── (logo, icon — copy from seo-pulse/public/)
└── features/
    ├── decay-engine.html         # LIVE — flagship feature page
    ├── pulse-lab.html            # LIVE
    ├── llm-citation-gap.html     # LIVE
    ├── ai-overview.html          # LIVE
    ├── content-editor.html       # LIVE
    ├── topical-authority.html    # Coming Q3 2026
    ├── pipeline-influence.html   # Coming Q3 2026
    ├── cannibalization.html      # Coming Q3 2026
    ├── war-room.html             # Coming Q3 2026
    ├── half-life.html            # Coming Q4 2026
    ├── intent-flux.html          # Coming Q4 2026
    ├── pixel-share.html          # Coming Q4 2026
    └── seismograph.html          # Coming Q4 2026
```

## Deploy to GitHub Pages

```bash
cd /c/Users/alima/caposeo-mockups
git init
git add .
git commit -m "feat: initial mockup site — 5 live features + 8 coming soon"
gh repo create alimabsoute/caposeo-mockups --public --source=. --remote=origin --push
# Then: repo Settings → Pages → Source: main branch, / (root)
```

## Update Formspree

1. Go to formspree.io → create a new form
2. Replace `your-form-id` in these files with your real form ID:
   - `waitlist.html`
   - All 8 `features/*coming-soon*.html` files (the feature notify forms)

## Add to the Live App (Stage 13)

When the product (seo-pulse) goes live:
1. Update all CTA buttons from `waitlist.html` → actual app URL
2. Update nav "Get Early Access" → "Open App"
3. Add `<link rel="canonical">` pointing to caposeo.com pages
4. The mockup site becomes the marketing site permanently

## Brand Tokens (CSS vars)

| Token | Value | Use |
|-------|-------|-----|
| `--primary` | `#4a6fa5` | CTAs, links, accents |
| `--fg` | `#1a1f2e` | Body text |
| `--bg` | `#f8f9fb` | Page background |
| `--ink` | `#2c3345` | Dark headings |
| `--surface-warm` | `#f7f5f2` | Honest limits boxes |
| `--surface-cool` | `#f0f3f9` | Table headers |
| `--muted-fg` | `#6b7280` | Secondary text |

## Feature Pages — What Makes a "Live" vs "Coming Soon" Page

**Live**: Has the actual technical spec, SVG charts, comparison table, backtest results. Links to the real app.

**Coming Soon**: Has the marketer pitch, operator explanation, "The tease" quote, feature-specific waitlist form. Converts curiosity → email.

## Decay Engine Backtest Summary (for feature page copy)

- Corpus: 2,000 synthetic page histories × 52 weeks
- TPR (true positive rate): 94% at 2-week early warning
- FPR (false positive rate): 3%
- Calibration: Brier score 0.04 on validation set
- Layers: EWMA crossover → OLS slope → CPI vs category → STL residuals → Bayesian CTR drift
