class Ads {
  constructor(){
    this.init();
  }

  init() {
    this.setUpAdsLoader();
    this.requestAds(0);
    document.addEventListener(glob.EVENT_PLAY_ADS, ()=>this.playAds());
  }

  setUpAdsLoader() {
    this.adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'), null);

    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
    this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e)=>this.onAdsManagerLoaded(e), false);
    this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e)=>this.onAdError(e), false);
  }

  requestAds(liveStreamPrefetchSeconds) {
    if (this.adsLoader) {
      this.adsLoader.contentComplete();
    }
    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

    adsRequest.linearAdSlotWidth = 1280;
    adsRequest.linearAdSlotHeight = 720;
    adsRequest.liveStreamPrefetchSeconds = liveStreamPrefetchSeconds;

    this.adsLoader.requestAds(adsRequest);
  }

  playAds() {
    if (!this.adDisplayContainerInitialized) {
      this.adDisplayContainer.initialize();
      this.adDisplayContainerInitialized = true;
    }

    try {
      this.adsManager.init(1280, 720, google.ima.ViewMode.NORMAL);
      this.adsManager.start();
    } catch (adError) {
      document.dispatchEvent(new Event(glob.EVENT_PLAY_GAME));
    }
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(null, adsRenderingSettings);
    this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e)=>this.onAdError(e));
    this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, ()=>this.requestAds(2));
    this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, ()=>document.dispatchEvent(new Event(glob.EVENT_PLAY_GAME)));
  }

  onAdError(adErrorEvent) {
    console.error(adErrorEvent.getError());
    document.dispatchEvent(new Event(glob.EVENT_PLAY_GAME));
    this.adsManager.destroy();
  }
}










