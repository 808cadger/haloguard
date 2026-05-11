# HaloGuard

[![Release](https://img.shields.io/github/v/release/808cadger/haloguard?include_prereleases&label=release)](https://github.com/808cadger/haloguard/releases)
[![Last commit](https://img.shields.io/github/last-commit/808cadger/haloguard)](https://github.com/808cadger/haloguard/commits)
[![License](https://img.shields.io/github/license/808cadger/haloguard)](https://github.com/808cadger/haloguard/blob/HEAD/LICENSE)
![Platforms](https://img.shields.io/badge/platform-Web%2FPWA%2C%20Android-2563eb)

Silent AI fraud detection and personal-assistant prototype focused on protection workflows.

## Project Snapshot

| Area | Details |
|------|---------|
| Primary use case | Silent AI fraud detection and personal-assistant prototype focused on protection workflows. |
| Platforms | Web/PWA, Android |
| Core stack | JavaScript, Capacitor, PWA, Android |
| Review first | `index.html`, `capacitor.config.json`, `package.json` |

## Download Links

| Platform | Link |
|----------|------|
| iOS / iPhone | [Open the PWA in Safari](https://808cadger.github.io/haloguard/) and choose **Share -> Add to Home Screen** |
| Android | [Download the latest APK from GitHub Releases](https://github.com/808cadger/haloguard/releases/latest) |
| Source | [Download the GitHub source ZIP](https://github.com/808cadger/haloguard/archive/refs/heads/master.zip) |
| Repository | [View on GitHub](https://github.com/808cadger/haloguard) |

## Why This Repo Is Worth Reviewing

- Security-oriented user flow focused on fraud awareness.
- PWA packaging keeps installation lightweight.
- Capacitor setup provides an Android path when native packaging is needed.


<!-- INSTALL-START -->
## Install and run

These instructions install and run `haloguard` from a fresh clone.

### Clone
```bash
git clone https://github.com/808cadger/haloguard.git
cd haloguard
```

### Web app
```bash
npm install
npm run build
python3 -m http.server 8080
```

### Android build/open
```bash
npx cap sync android
npm run android
```

### Notes
- Use Node.js 22 or newer for the current package set.
- Android builds require Android Studio, a configured SDK, and Java 21 when Gradle is used.

### AI/API setup
- If the app has AI features, add the required provider key in the app settings or local `.env` file.
- Browser-only apps store user-provided API keys on the local device unless a backend endpoint is configured.

### License
- Apache License 2.0. See [`LICENSE`](./LICENSE).
<!-- INSTALL-END -->


> Your personal AI bodyguard — fraud protection that runs silently in the background, plus a full AI assistant that knows who you are.

**[Live App](https://codeberg.org/cadger808/haloguard) · [Codeberg](https://codeberg.org/cadger808/haloguard)**

---

## What It Does

HaloGuard runs quietly in the background with a glowing halo indicator. When you're about to send money, click a link, or respond to a message — it checks it first.

- 🔵 **Blue halo** — active and monitoring
- 🟢 **Green halo** — last check passed, you're safe
- 🔴 **Red halo** — threat detected, don't act yet

---

## Features

### 🔍 Check This (fraud scanner)
Paste any link, email, text message, or payment request. HaloGuard analyzes it with Claude AI and tells you if it's a scam before you act.

### 🤖 Personalized AI Assistant
Ask anything — write a resume, get a recipe, find directions, draft a contract. The AI knows your job, your neighborhood, and your life — answers are tailored to *you*, not a generic user.

### 📋 Scam History Log
Every threat flagged is saved with a timestamp. See patterns, share with family, or report to authorities.

### 🧠 Smart Onboarding
Progressive Q&A learns who you are on first launch. Connect Google, Facebook, or LinkedIn to personalize even further.

### Detects:
- Fake payment requests (Venmo, Zelle, CashApp spoofs)
- Phishing emails and texts
- Fake websites stealing card info
- Contractor and job scams
- Romance scams
- Urgency pressure tactics

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript |
| AI | Claude claude-sonnet-4-6 (Anthropic API) |
| Mobile | Capacitor (Android + PWA) |
| Storage | localStorage (API key never leaves your device) |

---

## Install

**As a PWA:** Open in browser → Add to Home Screen

**As APK:** Download from [Releases](https://codeberg.org/cadger808/haloguard/releases)

---

## Setup

1. Get a Claude API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app — enter your key on the setup screen
3. Your key stays on your device only — never shared

---

*Built by [Christopher Cadger](https://codeberg.org/cadger808) · Pearl City, Hawaii*
