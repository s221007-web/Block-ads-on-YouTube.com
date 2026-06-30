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
           document.querySelector('button.ytp-ad-skip-button-modern, .ytp-ad-skip-button') !== null;
  }

  function nukeAds(){
    const videos = document.querySelectorAll('video');
    const skipBtn = document.querySelector('button.ytp-ad-skip-button-modern, .ytp-ad-skip-button');
    
    // Auto click skip button if available
    if(skipBtn) skipBtn.click();

    videos.forEach(video => {
      if(video && video.duration > 1){
        if(isAdPlaying()){
          // Force skip and speed through ad
          video.currentTime = Math.max(video.duration - 0.3, video.currentTime + 5);
          video.playbackRate = 16;           
          if(!video.muted){
            god.originalVolume = video.volume;
            video.muted = true;
            god.muted = true;
          }
        } else {
          // Restore normal playback after ad finishes
          if(video.playbackRate === 16) video.playbackRate = 1;
          if(god.muted) {
            video.muted = false;
            video.volume = god.originalVolume;
            god.muted = false;
          }
        }
      }
    });
  }

  // Run checks every 250 milliseconds
  god.intervals.push(setInterval(nukeAds, 250));
  console.log('%c🚀 YouTube God Mode Activated','color:green;font-weight:bold');
})();
