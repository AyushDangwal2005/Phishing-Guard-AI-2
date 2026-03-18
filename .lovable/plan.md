

# PhishGuard AI — Implementation Plan

## Overview
A premium, single-page AI-powered Phishing & Scam Detection web application with a pure white, ultra-modern design inspired by Stripe and Linear. Built in React with four scanning modules, voice assistant, and full animation system.

## Architecture
All features will be client-side React components. The AI analysis will use pattern-matching heuristics (no external API needed initially). Stats and history persist in localStorage.

---

## Pages & Sections (Single Page, Scrolling)

### 1. Sticky Navbar
- White with scroll shadow effect
- Logo: "🛡️ PhishGuard **AI**" (blue accent)
- Nav links: Home, Features, How It Works
- Right: pulsing green "System Online" dot + "Start Scanning" CTA
- EN/HI language toggle pill

### 2. Hero Section
- Two-column: text left, Unsplash image right
- "Powered by Claude AI" badge pill
- Large H1 with blue accent on second line
- CTA buttons + trust checkmarks row
- Staggered fade-up entry animation

### 3. Trust Badges Strip
- 4 items: AI-Powered, 256-bit Secure, Real-time Detection, Always Free

### 4. How It Works Section
- 3 step cards with circular Unsplash images and step numbers
- Scroll-triggered reveal animation

### 5. Live Stats Bar
- 4 animated counters: Total Scans, Threats Found, Safe, Suspicious
- Persisted in localStorage, updates after each scan

### 6. Detection Tool Section (Core Feature)
**Tabbed interface with 4 panels:**

- **📞 Call Detection** — Audio upload zone, mic button with waveform, textarea for transcript, "Analyze Call" button, sample loader
- **💬 SMS/Email** — Large textarea, speech-to-text mic, highlighted danger/warning words in results
- **🔗 Fake Link** — URL input with lock icon, animated risk meter needle, red flag tags
- **🌐 Website Check** — URL input with globe icon, impersonation alert banner, fraud score bar

**Each panel includes:**
- Unsplash header image
- AI analysis results card with verdict badge, confidence bar, explanation, pattern tags, 6-check security grid
- Voice assistant card (auto-speaks result)

### 7. Voice Assistant (appears after every scan)
- AI avatar with blue ring border
- Animated sound bars during speech
- EN/HI language toggle
- Speak/Stop buttons
- Web Speech API (SpeechSynthesis)
- Simple 5th-grade language explanations

### 8. Speech-to-Text
- Web Speech API on Call + SMS panels
- Live transcript fills textarea
- Mic button: blue idle, red+pulse recording
- Waveform animation during recording

### 9. Scan History
- Collapsible card at bottom
- Vertical timeline with verdict badges
- Click to expand, "Clear All" button
- localStorage, last 10 scans

### 10. Footer
- 3 columns: logo+tagline, links, "Built for India 🇮🇳" + social icons
- Copyright bar

---

## AI Analysis Engine
- Client-side heuristic pattern matching (keyword detection, URL pattern analysis, domain checking)
- Returns structured results: verdict, confidence, explanation, keywords, security checks
- Generates voice text in EN and HI
- Loading spinner + "AI is analyzing..." state
- Error handling with friendly UI

## Design System
- **Fonts:** Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (scores/badges)
- **Colors:** Pure white backgrounds, blue-600 accent, semantic green/amber/red
- **Cards:** 20px radius, layered shadows, hover lift
- **Animations:** Scroll reveal (Intersection Observer), counter animations, waveforms, staggered hero entry, tab cross-fade

## Language Support
- EN/HI toggle in navbar
- All UI labels swap on toggle
- Voice assistant follows language selection

