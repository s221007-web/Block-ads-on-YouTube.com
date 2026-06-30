# 🔥 YouTube God Mode — The Nuclear Ad Skipper

A high-performance, lightweight Userscript designed to instantly fast-forward, mute, and dismiss YouTube advertisements the millisecond they touch your browser DOM. 

Unlike traditional adblockers that intercept network requests, **YouTube God Mode** manipulates the HTML5 video engine natively. It forces ads to play at **16x speed**, silences their audio, snaps straight to the final split-second, and clicks the skip button for you—effectively making ads invisible while rendering them "watched" to YouTube's backend tracking.

---

## ✨ Key Features

*   **⚡ Quantum Speed Execution:** Accelerates unskippable pre-roll and mid-roll ads to 16x speed (the absolute browser limits).
*   **🎯 Instant Target Skipping:** Automatically forces the playback timeline to the last `0.2` seconds of the ad structure.
*   **🔇 Intelligent Smart Mute:** Silences ad volume instantly and perfectly restores your exact volume and playback speed settings once the actual video resumes.
*   **💥 Total DOM Deletion:** Obliterates banner overlays, promoted sidebar items, and tracking placeholders directly from the webpage.
*   **🎛️ On-Screen Toggle Switch:** Includes an interactive floating toggle button (**🔥** / **❌**) to easily activate or pause the automation script dynamically.
*   **🔋 Battery & CPU Optimized:** Consolidated down to a single, event-driven loop cycle alongside a `MutationObserver` to maximize speed while eliminating resource lag.

---

## 🛠️ Installation Guide

### Step 1: Install a Userscript Manager
To run this script, you need a browser extension that handles custom user scripts. Choose one of the options below:
*   [Tampermonkey](https://tampermonkey.net) *(Highly Recommended)*
*   [Violentmonkey](https://github.io)

### Step 2: Install the Script
1. Open your extension's dashboard and click **Create a new script**.
2. Erase any default template code provided.
3. Copy the entire source code from `youtube-god-mode.user.js` in this repository.
4. Paste the code into your script editor and hit **Save** (`Ctrl + S` or `Cmd + S`).

---

## 🚀 How It Works Under the Hood

The script utilizes a dual-engine architecture to maintain dominance over the webpage layout:

1. **The Event Observer Engine:** A `MutationObserver` keeps watch on the page structural hierarchy. If any node class alterations match ad characteristics, the execution sequence initiates instantly.
2. **The HTML5 Player Core Controller:** Instead of altering network packets (which triggers anti-adblock warning flags), the code controls the native media engine variables (`video.playbackRate`, `video.currentTime`, `video.muted`).

---

## ⚙️ Disclaimer & Technical Context

YouTube updates its native frontend player configuration regularly to combat automated elements. If a change occurs:
*   The script may occasionally encounter an infinite loading spinner if YouTube blocks variable acceleration overrides.
*   Class elements (`.ad-showing`, `.ytp-ad-skip-button-modern`) may alter over time. 

*Contributions, pull requests, and structural element selector patches are always welcome to keep this script robust against changes!*

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
