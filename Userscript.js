// ==UserScript==
// @name         YouTube God Mode - Strongest Ad Skipper
// @namespace    https://github.com/
// @version      1.3
// @description  Instantly nukes YouTube ads the moment they appear (pre-roll, mid-roll, overlays). Strongest bookmarklet version upgraded to userscript.
// @author       Grok
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let godModeActive = true;
    let intervals = [];
    let observer = null;
    let lastAdState = false;

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
            width: 56px;
            height: 56px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            user-select: none;
        }
        #yt-godmode-status {
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 2147483647;
            background: #000000dd;
            color: #0f0;
            padding: 8px 14px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            display: none;
        }
    `;
    document.head.appendChild(style);

    function isAdPlaying() {
        return !!document.querySelector('.ad-showing, .ytp-ad-player-overlay, .ytp-ad-overlay-container, ytd-ad-slot-renderer, button.ytp-ad-skip-button-modern');
    }

    function nukeAds() {
        if (!godModeActive) return;

        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            if (!video || isNaN(video.duration) || video.duration < 2) return;

            if (isAdPlaying()) {
                // Aggressive skip
                video.currentTime = Math.max(video.duration - 0.3, video.currentTime + 8);
                video.playbackRate = 16;
                if (!video.muted) video.muted = true;
            } else {
                if (video.playbackRate !== 1) video.playbackRate = 1;
            }
        });

        // Click skip buttons
        document.querySelectorAll('button.ytp-ad-skip-button-modern, .ytp-ad-skip-button, [aria-label*="Skip"], .ytp-skip-ad-button').forEach(btn => {
            btn.click();
        });

        // Nuclear removal
        const selectors = [
            '.ad-showing', 'ytd-ad-slot-renderer', '.ytp-ad-overlay-container',
            '.ytp-ad-module', 'ytd-player-legacy-desktop-watch-ads-renderer',
            '.ytp-ad-player-overlay', '[class*="ad-"]:not(.html5-video-player)'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                setTimeout(() => el.remove(), 10);
            });
        });
    }

    function startGodMode() {
        // Mutation Observer - instant detection
        if (observer) observer.disconnect();
        observer = new MutationObserver(nukeAds);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Multiple intervals for maximum aggression
        intervals.forEach(i => clearInterval(i));
        intervals = [];
        intervals.push(setInterval(nukeAds, 60));
        intervals.push(setInterval(nukeAds, 180));
        intervals.push(setInterval(nukeAds, 400));

        console.log('%c🔥 YouTube God Mode ACTIVATED - Strongest Ad Skipper', 'color:#0f0;font-size:16px;font-weight:bold');
    }

    function stopGodMode() {
        godModeActive = false;
        intervals.forEach(i => clearInterval(i));
        if (observer) observer.disconnect();

        document.querySelectorAll('video').forEach(v => {
            v.playbackRate = 1;
            v.muted = false;
        });

        console.log('%c⛔ YouTube
