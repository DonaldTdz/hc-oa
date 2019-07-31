let app = getApp();
let myDate = new Date();

Page({
  data: {
    id: '',
    timeSheet: {},
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.timeSheet();
  },

  onShow() {
  },

  //获取周报详情
  timeSheet() {
    dd.showLoading();
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/TimeSheet/GetByIdAsync?id=' + this.data.id,
          method: 'Get',
          success: (res) => {
            this.setData({ timeSheet: res.data.result})
          },
          fail: function (res) {
            dd.alert({ content: '获取周报详情异常', buttonText: '确定' });
          },
          complete: function (res) {
            dd.hideLoading();
          }
        });
  },

})
