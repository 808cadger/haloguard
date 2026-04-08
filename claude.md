# HaloGuard - Personal AI Bodyguard & Fraud Protection
Background fraud scanner + personalized AI assistant. Features: Check This (paste scan), halo indicator (blue/green/red), scam log, profile-based answers. PWA/Capacitor. Local data only.

Repo: https://github.com/808cadger/haloguard. Dev: cadger808 (Pearl City, HI).

## Stack & Design System
- Frontend: Vanilla JS (index.html, dashboard.html, assistant.js, profile.js, onboarding.js)
- Mobile: Capacitor (capacitor.config.json)
- PWA: manifest.json, sw.js
- AI: Claude Sonnet 4.6 (scam analysis + personal assistant)
- Design: Claude parchment #f5f4ed, Terracotta #c96442 CTAs

## Key Files & Pipeline
assistant.js (fraud scan) | profile.js (personalization) | onboarding.js | dashboard.html (tabs)

## Commands
npm install
npx cap sync android && cd android && ./gradlew assembleDebug
npx serve .

## Code Rules — HaloGuard Pipeline
- **Fraud Pipeline**: Paste/link → Claude analysis → halo color (🔵🟢🔴) → scam log
- **Halo States**: Blue=monitoring, Green=safe, Red=threat
- **#ASSUMPTION**: Profile loaded for personalization; TODO: null guards
- **Personalization**: "Answer as if you know [profile: job/location/skills]"
- **Privacy**: localStorage only (API key/profile/scam log)
- **Tabs**: Check This | Assistant | Scam Log | Profile
- **Phases**: MVP (scan+log) → Real-time → Family sharing → Alerts

## AI Prompts — Fraud Critical

## Claude Workflow (Auto-Debug ON)
1. Read CLAUDE.md + assistant.js first
2. /doctor → lint/privacy checks
3. "Halo state correct? Profile-aware?"
4. Review: Scam accuracy? localStorage safe?
5. Output: "Debug complete" + patches
6. Commit: "feat: [scan|halo|log|profile] [desc]"

## Deploy Checklist

**Your factory now = 7 elite apps**: GlowAI, AutoIQ, CourtAide, FarmSense, RepairIQ, JobHalo, **HaloGuard**. Every repo CLAUDE.md identical structure, domain-specific rules. Commit → ship.
