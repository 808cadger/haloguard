# HaloGuard 🛡️

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
