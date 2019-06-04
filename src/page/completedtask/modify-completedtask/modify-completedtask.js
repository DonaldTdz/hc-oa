let app = getApp();
Page({
  data: {
    id: '',
    task: {},
    messageId: '',
    bond: 0,
    isWinbid: true
  },

  onLoad(query) {
    this.setData({ id: query.id, messageId: query.messageId });
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
  radioChange: function (e) {
    this.setData({ isWinbid: e.detail.value })
  },



  //修改任务状态
  onSubmit(e) {
    this.setData({ bond: e.detail.value["bond"] })
    if (this.data.task.status == 3) {
      dd.confirm({
        title: '温馨提示',
        content: '确认当前中标状态为：' + this.data.isWinbid ? "已中标" : "未中标",
        confirmButtonText: '是',
        cancelButtonText: '否',
        success: (result) => {
          if (!result.confirm) {
            return;
          } else {
            if (this.data.task.status == 1 && this.data.bond != 0 && this.data.bond != null) {
              return dd.alert({ title: '亲', content: '请输入保证金', buttonText: '确定' });
            }
            this.data.task.isCompleted = true;
            let pdata = JSON.stringify({ completedtask: this.data.task, messageId: this.data.messageId, bond: this.data.bond, isWinbid: this.data.isWinbid });
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
                    if (res.data.result.code == 0) {
                      dd.alert({
                        content: '保存成功', buttonText: '确定', success: () => {
                          dd.navigateTo({
                            url: "../index",
                          });
                        },
                      });
                    } else {
                      dd.alert({
                        content: res.data.result.msg, buttonText: '确定', success: () => {
                        },
                      });
                    }
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
        },
      });
    }
    else if (this.data.task.status == 1 && (this.data.bond == 0 || this.data.bond == null)) {
      return dd.alert({ title: '亲', content: '请输入保证金', buttonText: '确定' });
    }
    else {
      this.data.task.isCompleted = true;
      let pdata = JSON.stringify({ completedtask: this.data.task, messageId: this.data.messageId, bond: this.data.bond, isWinbid: this.data.isWinbid });
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
              if (res.data.result.code == 0) {
                dd.alert({
                  content: '保存成功', buttonText: '确定', success: () => {
                    dd.navigateTo({
                      url: "../index",
                    });
                  },
                });
              } else {
                dd.alert({
                  content: res.data.result.msg, buttonText: '确定', success: () => {
                  },
                });
              }
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
  }
})
