let app = getApp();
Page({
  data: {
    id: '',
    task: {},
    messageId: '',
    bond: 0,
  },

  onLoad(query) {
    this.setData({ id: query.id, messageId: query.messageId });
    this.getTaskById();
  },

  //获取任务详情
  getTaskById() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/CompletedTask/GetByIdAsync?id=' + this.data.id,
      method: 'Get',
      success: (res) => {
        this.setData({ task: res.data.result })
      },
      fail: function(res) {
        dd.alert({ content: '获取任务详情异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },



  //修改任务状态
  onSubmit(e) {
    this.data.task.isCompleted = true;
    let pdata = JSON.stringify({ completedtask: this.data.task, messageId: this.data.messageId });
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/CompletedTask/CreateOrUpdateAsync',
      data: pdata,
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      success: (res) => {
        if (res.data.result.code == 0) {
          dd.alert({
            content: '保存成功', buttonText: '确定', success: () => {
              dd.navigateBack({});
            },
          });
        } else {
          dd.alert({
            content: res.data.result.msg, buttonText: '确定', success: () => {
            },
          });
        }
      },
      fail: function(res) {
        dd.alert({ content: '保存失败', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  }
})
