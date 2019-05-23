let app = getApp();

Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    items: [],
  },
  onLoad(query) {
    this.cleanData();
    this.getTimeSheets();
  },
  onShow() {
    // this.cleanData();
    // this.getReimburses();
  },
  cleanData() {
    this.setData({
      items: [],
      pageIndex: 1,
      pageSize: 10
    });
  },
  getTimeSheets() {
    let params = {};
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/TimeSheet/GetPagedAsync',
          method: 'Get',
          data: {
            SkipCount: (this.data.pageIndex - 1) * this.data.pageSize,
            MaxResultCount: this.data.pageSize,
            EmployeeId: app.globalData.userInfo.id,
            code: res.authCode
          },
          dataType: 'json',
          success: (res) => {
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
          fail: function (res) {
            dd.alert({ content: '获取周报列表异常', buttonText: '确定' });
          },
          complete: function (res) {
            dd.hideLoading();
            //dd.alert({ content: 'complete' });
          }
        });
      },
      fail: function (err) {
        dd.alert({ content: '授权出错', buttonText: '确定' });
        dd.hideLoading();
      }
    });
  },

  //点击周报跳转周报详情
  goVisit(data) {
    dd.navigateTo({
      url: "./detail-timesheet/detail-timesheet?id=" + this.data.items[data.index].id,
    });
  },

  //新增周报
  createReimburses() {
    dd.navigateTo({
      url: "./create-timesheet/create-timesheet",
    });
  },

  // 页面被拉到底部
  onReachBottom() {
    if (this.data.pageIndex > 1) {
      this.getTimeSheets();
    }
  },
});


