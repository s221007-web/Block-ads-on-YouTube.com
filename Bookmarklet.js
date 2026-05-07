javascript:(function(){
  if(window.ytGodMode){
    window.ytGodMode.stop();
    return;
  }

  const god = {
    intervals: [],
    observer: null,
    muted: false,
    originalVolume: 1,

    stop: function(){
      this.intervals.forEach(i => clearInterval(i));
      if(this.observer) this.observer.disconnect();
      document.querySelectorAll('video').forEach(v => { v.playbackRate = 1; v.muted = false; });
      console.log('%c⛔ YouTube God Mode Stopped','color:orange;font-weight:bold');
      window.ytGodMode = null;
    }
  };

  window.ytGodMode = god;

  function isAdPlaying(){
    return document.querySelector('.ad-showing, .ytp-ad-player-overlay, ytd-ad-slot-renderer, .ytp-ad-overlay-container') !== null ||
           document.querySelector('button.ytp-ad-skip-button-modern') !== null;
  }

  function nukeAds(){
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
      if(video && video.duration > 1){
        // Force skip non-skippable
        if(isAdPlaying()){
          video.currentTime = Math.max(video.duration - 0.3, video.currentTime + 5);
          video.playbackRate = 16;           // Speed through ad
          if(!video.muted){
            god.originalVolume = video.volume;
            video.muted = true;
            god.muted = true;
          }
        } else if(god.muted){
          video.muted = false;
          video.playbackRate = 1;
          god.muted = false;
        }
      }
    });

    // Click every possible skip button
    const skipBtns = document.querySelectorAll('button.ytp-ad-skip-button-modern, .ytp-ad-skip-button, [aria-label*="Skip"], .ytp-skip-ad-button');
    skipBtns.forEach(btn => btn.click());

    // Nuclear DOM removal
    const adSelectors = [
      '.ad-showing', 'ytd-ad-slot-renderer', '.ytp-ad-overlay-container',
      '.ytp-ad-module', 'ytd-player-legacy-desktop-watch-ads-renderer',
      '.ytp-ad-player-overlay', '[class*="ad-"]', 'ytm-promoted-sparkles-web-renderer'
    ];

    adSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.display = 'none';
        el.remove();
      });
    });
  }

  // Instant detection
  god.observer = new MutationObserver(nukeAds);
  god.observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true, 
    attributes: true,
    attributeFilter: ['class']
  });

  // Multiple aggressive intervals
  god.intervals.push(setInterval(nukeAds, 80));   // Ultra fast
  god.intervals.push(setInterval(nukeAds, 250));
  god.intervals.push(setInterval(() => {
    if(isAdPlaying()) nukeAds();
  }, 400));

  // Initial blast
  setTimeout(nukeAds, 100);
  setTimeout(nukeAds, 600);
  setTimeout(nukeAds, 1200);

  console.log('%c🔥 YOUTUBE GOD MODE ACTIVATED - Strongest Ad Skipper 2026','color:#0f0;font-size:16px;font-weight:bold');
  alert('🔥 YouTube GOD MODE Activated!\n\nIt will nuke ads the instant they appear.\n\nClick the bookmark again to disable.');
})();
