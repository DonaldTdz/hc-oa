let app = getApp();

Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    items: [],
  },
  onLoad(query) {
  },
  onShow() {
     this.setData({ pageIndex: 1 });
    this.cleanData();
    this.getMessages();
  },
  cleanData() {
    this.setData({
      items: [],
      pageIndex: 1,
      pageSize: 10
    });
  },

  getMessages() {
    let params = {};
    dd.showLoading();
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/Message/GetPagedAsync',
          method: 'Get',
          data: {
            SkipCount: (this.data.pageIndex - 1) * this.data.pageSize,
            MaxResultCount: this.data.pageSize,
            EmployeeId: app.globalData.userInfo.id
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
            dd.alert({ content: '获取消息列表异常', buttonText: '确定' });
          },
          complete: function (res) {
            dd.hideLoading();
            //dd.alert({ content: 'complete' });
          }
        });
  },

  //点击周报跳转周报详情
  goVisit(data) {
    dd.navigateTo({
      url: "./detail-messages/detail-messages?id=" + this.data.items[data.index].id,
    });
  },

  // 页面被拉到底部
  onReachBottom() {
    if (this.data.pageIndex > 1) {
      this.getMessages();
    }
  },
});


