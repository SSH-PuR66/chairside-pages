# Chairside Pages edition

A static dental workflow prototype by Sergio Rodriguez. Explore an assumptions-based calculator, inspect three workflow graphs, and download their example JSON.

[Live demo](https://ssh-pur66.github.io/chairside-pages/) · [Source](https://github.com/SSH-PuR66/chairside-pages) · [Canonical Cloudflare demo](https://github.com/SSH-PuR66/chairside)

Previously published as **FlowForge**. This is a naming and release repair; the repository history, template JSON, and original preview image remain intact. The preview asset may still carry the former name.

## What is implemented

- A responsive HTML/CSS/JavaScript interface with mobile navigation.
- A calculator for estimated staff-time cost, assumed time savings, and annual value after a fixed $500 monthly fee. It uses 4.33 weeks per month, excludes the illustrative $3,500 setup fee, and reports negative scenarios.
- Workflow preview modals and downloads for intake, appointment reminders, and invoice sync.
- Package selection that prefills a general inquiry form. The existing Formspree endpoint receives submissions; no patient data should be entered.
- Vitest calculator checks and a static build that includes scripts, styles, templates, and the unchanged preview image.

## Implementation boundary

The browser does not run the workflow JSON or connect to practice software. The n8n examples contain placeholder identifiers and incomplete integration settings. Reminder replies, duplicate prevention, accounting reconciliation, failure recovery, and clinical deployment have not been validated. JSON parsing is a packaging check, not proof of import or execution.

Prices and package scopes are illustrative. Calculator output is an estimate from user assumptions, not observed savings, a financial return, a support commitment, or a compliance claim.

## Run and verify

Use Node.js 22.12 or later on a supported LTS release. The test toolchain was updated to Vitest 5.0.3; no npm dependencies are shipped in the static output.

```sh
git clone https://github.com/SSH-PuR66/chairside-pages.git
cd chairside-pages
npm ci
npm run format:check
npm test
npm run build
npm run dev
```

The local server serves **dist/**. The build copies **src/**, **assets/**, and **templates/** together, then checks local page references, anchors, and all three template downloads. Relative template URLs work at both a host root and the GitHub Pages repository subpath.

## Deployment

GitHub Pages: **https://ssh-pur66.github.io/chairside-pages/**.

The GitHub Actions workflow verifies formatting, calculator tests, and build references before uploading **dist/** and publishing the main branch. Pull requests run verification without a production deployment.

## Source layout

```text
src/index.html             Interface and prototype boundaries
src/css/styles.css         Existing design
src/js/main.js             Calculator, navigation, selection, and modals
src/js/roi.js              Pure calculator logic
templates/dental/*.json    Illustrative workflow graphs
tests/roi.test.js          Calculator regression checks
scripts/build.mjs         Static output bundle
scripts/check-build.mjs   Page and download reference validation
assets/og.png             Preserved original preview asset
```
