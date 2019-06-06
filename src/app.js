App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
    // this.globalData.sysInfo = dd.getSystemInfoSync();
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    // sysInfo:{},
    // host: 'http://127.0.0.1:21022/',
    host:'http://pm.hechuangcd.com/',
    corpId: '',
    appId: 8
  }
});