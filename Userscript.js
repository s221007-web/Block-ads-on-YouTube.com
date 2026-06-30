// ==UserScript==
// @name         YouTube God Mode - Strongest Ad Skipper
// @namespace    https://github.com/
// @version      1.4
// @description  Instantly nukes YouTube ads the moment they appear (pre-roll, mid-roll, overlays). Optimized performance.
// @author       AI Fixed
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    let godModeActive = true;
    let observer = null;
    let loopInterval = null;
    let originalVolume = 1;
    let originalSpeed = 1;
    let wasMutedBeforeAd = false;

    // Inject styles cleanly
    const style = document.createElement('style');
    style.textContent = `
        #yt-godmode-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            background: #cc0000;
            color: white;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        #yt-godmode-btn.active {
            background: #00aa00;
        }
    `;
    document.head.appendChild(style);

    // Create and attach Toggle Button UI
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'yt-godmode-btn';
    toggleBtn.className = 'active';
    toggleBtn.innerHTML = '🔥';
    toggleBtn.title = 'Toggle YouTube God Mode';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        if (godModeActive) {
            stopGodMode();
        } else {
            startGodMode();
        }
    });

    function isAdPlaying() {
        return !!document.querySelector('.ad-showing, .ytp-ad-player-overlay, .ytp-ad-overlay-container, ytd-ad-slot-renderer, button.ytp-ad-skip-button-modern, .video-ads, .ytp-ad-text');
    }

    function nukeAds() {
        if (!godModeActive) return;

        const adPlaying = isAdPlaying();
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            if (!video || isNaN(video.duration) || video.duration < 1) return;

            if (adPlaying) {
                // Save user values before changing them
                if (video.playbackRate !== 16) {
                    originalSpeed = video.playbackRate === 16 ? 1 : video.playbackRate;
                    if (!video.muted) {
                        originalVolume = video.volume;
                        wasMutedBeforeAd = false;
                        video.muted = true;
                    } else {
                        wasMutedBeforeAd = true;
                    }
                }
                
                // Aggressive skip & speed forward
                video.playbackRate = 16;
                if (video.currentTime < video.duration - 0.2) {
                    video.currentTime = Math.max(video.duration - 0.2, video.currentTime + 10);
                }
            } else {
                // Restore user states safely once ad leaves
                if (video.playbackRate === 16) {
                    video.playbackRate = originalSpeed;
                    if (!wasMutedBeforeAd) {
                        video.muted = false;
                        video.volume = originalVolume;
                    }
                }
            }
        });

        // Hard click skip elements
        const skipButtons = document.querySelectorAll('button.ytp-ad-skip-button-modern, .ytp-ad-skip-button, [aria-label*="Skip"], .ytp-skip-ad-button, .ytp-ad-skip-button-slot');
        skipButtons.forEach(btn => btn.click());

        // Nuclear DOM component hiding
        const selectors = [
            '.ad-showing', 'ytd-ad-slot-renderer', '.ytp-ad-overlay-container',
            '.ytp-ad-module', 'ytd-player-legacy-desktop-watch-ads-renderer',
            '.ytp-ad-player-overlay', '[class*="ad-"]:not(.html5-video-player)'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        });
    }

    function startGodMode() {
        godModeActive = true;
        toggleBtn.className = 'active';
        toggleBtn.innerHTML = '🔥';

        // Event-driven mutation monitoring
        if (observer) observer.disconnect();
        observer = new MutationObserver(nukeAds);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Single efficient looping interval instead of three heavy ones
        if (loopInterval) clearInterval(loopInterval);
        loopInterval = setInterval(nukeAds, 150);

        console.log('%c🔥 YouTube God Mode ACTIVATED - Strongest Ad Skipper', 'color:#0f0;font-size:16px;font-weight:bold');
    }

    function stopGodMode() {
        godModeActive = false;
        toggleBtn.className = '';
        toggleBtn.innerHTML = '❌';

        if (observer) observer.disconnect();
        if (loopInterval) clearInterval(loopInterval);

        document.querySelectorAll('video').forEach(v => {
            v.playbackRate = originalSpeed;
            if (!wasMutedBeforeAd) v.muted = false;
        });

        console.log('%c⛔ YouTube God Mode DEACTIVATED', 'color:orange;font-weight:bold');
    }

    // Initialize execution loop
    startGodMode();
})();
