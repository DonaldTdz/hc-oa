let app = getApp();

Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    items: [],
  },
  onLoad(query) {
    this.cleanData();
  },
  onShow() {
    this.setData({ items: [],pageIndex: 1,});
    this.getReimburses();
  },
  cleanData() {
    this.setData({
      items: [],
      pageIndex: 1,
      pageSize: 10
    });
  },
  getReimburses() {
    let params = {};
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Project/GetPagedByDDAsync',
      method: 'Get',
      data: {
        SkipCount: (this.data.pageIndex - 1) * this.data.pageSize,
        MaxResultCount: this.data.pageSize,
        EmployeeId: app.globalData.userInfo.id,
      },
      dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        const datas = res.data.result.items;
        const dataCount = res.data.result.totalCount;
        if (dataCount < 10) {
          this.setData({ pageIndex: 1 });
        } else {
          var pindex = this.data.pageIndex + 1;
          this.setData({ pageIndex: pindex });
        }
        var tempItems = this.data.items;
        if (tempItems.length > 0) {
          for (var i in datas) {
            tempItems.push(datas[i]);
          }
          this.setData({ items: tempItems });
        } else {
          this.setData({ items: datas });
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取项目列表异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },

  // 页面被拉到底部
  onReachBottom() {
    if (this.data.pageIndex > 1) {
      this.getReimburses();
    }
  },
  // onShareAppMessage() {
  //   // 返回自定义分享信息
  //   return {
  //     title: '任务列表',
  //     desc: '所有任务列表',
  //     path: 'pages/list/index',
  //   };
  // }
});

