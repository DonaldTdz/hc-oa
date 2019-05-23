let app = getApp();
let myDate = new Date();

Page({
  data: {
    id: '',
    message: {},
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.updateMessageisRead();
  },

  onShow() {
  },

  //获取消息详情
  // getMessage() {
  //   dd.showLoading();
  //   //免登陆
  //   dd.getAuthCode({
  //     success: (res) => {
  //       dd.httpRequest({
  //         url: app.globalData.host + 'api/services/app/Message/GetByIdAsync?id=' + this.data.id,
  //         method: 'Get',
  //         success: (res) => {
  //           this.setData({ message: res.data.result })
  //         },
  //         fail: function (res) {
  //           dd.alert({ content: '获取消息详情异常', buttonText: '确定' });
  //         },
  //         complete: function (res) {
  //           dd.hideLoading();
  //         }
  //       });
  //     },
  //     fail: function (err) {
  //       dd.alert({ content: '授权出错', buttonText: '确定' });
  //       dd.hideLoading();
  //     }
  //   });
  // },

  //修改是否已读并获取消息详情
  updateMessageisRead() {
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/Message/ModifyReadByIdAsync',
          method: 'Post',
            data: { id: this.data.id,isRead:true },
            headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            this.setData({ message: res.data.result })
          },
          fail: function (res) {
            dd.alert({ content: '修改是否已读并获取消息详情异常', buttonText: '确定' });
          },
          complete: function (res) {
            dd.hideLoading();
          }
        });
      },
      fail: function (err) {
        dd.alert({ content: '授权出错', buttonText: '确定' });
        dd.hideLoading();
      }
    });
  }

})
