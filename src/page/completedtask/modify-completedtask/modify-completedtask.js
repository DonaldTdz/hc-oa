let app = getApp();
Page({
  data: {
    id: '',
    task: {}
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.getTaskById();
  },

  //获取任务详情
  getTaskById() {
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/CompletedTask/GetByIdAsync?id=' + this.data.id,
          method: 'Get',
          success: (res) => {
            this.setData({ task: res.data.result })
          },
          fail: function (res) {
            dd.alert({ content: '获取任务详情异常', buttonText: '确定' });
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
  },

  //修改任务状态
  onSubmit(e) {
    // let isCompleted = e.detail.value["isCompleted"]
    this.data.task.isCompleted=true;
    let pdata = JSON.stringify({ completedtask: this.data.task });
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/CompletedTask/CreateOrUpdateAsync',
          data: pdata,
          method: 'Post',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '保存成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../index",
                });
              },
            });
          },
          fail: function (res) {
            dd.alert({ content: '保存失败', buttonText: '确定' });
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
