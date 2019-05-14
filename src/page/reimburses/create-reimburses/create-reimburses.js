let app = getApp();
let myDate = new Date();
Page({
  data: {
    projects: [],
    projectId: 1,
    projectsIndex: 0,
    submitDate: ''
  },

  onLoad(query) {
    this.getProjects();
  },

  bindProjectsChange(e) {
    this.setData({
      projectsIndex: e.detail.value,
      projectId: this.data.projects[e.detail.value].value
    });
  },

  //获取项目列表
  getProjects() {
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/Project/GetDropDownsAsync',
          method: 'Get',
          // dataType: 'json',
          success: (res) => {
            //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
            this.setData({ projects: res.data.result, projectId: res.data.result[0].value })
          },
          fail: function (res) {
            dd.alert({ content: '获取项目列表异常', buttonText: '确定' });
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

  selectDate() {
    dd.datePicker({
      currentDate: this.myDate,
      success: (res) => {
        this.setData({
          submitDate: res.date
        })
      },
      fail: function (res) {
        dd.alert({ content: '选择日期出错', buttonText: '确定' });
      }
    });
  },

  onSubmit(e) {
    e.detail.value["projectId"] = this.data.projectId;
    if (!e.detail.value["projectId"])
      return dd.alert({ title: '亲', content: '请选择所属项目', buttonText: '确定' });
    if (!e.detail.value["submitDate"])
      return dd.alert({ title: '亲', content: '请选择申请日期', buttonText: '确定' });
    e.detail.value["employeeId"] = app.globalData.userInfo.id;
    let pdata = JSON.stringify({ reimburse: e.detail.value });
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/Reimburse/CreateOrUpdateAsync',
          data: pdata,
          method: 'Post',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '新增成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../index",
                });
              },
            });
          },
          fail: function (res) {
            dd.alert({ content: '新增异常', buttonText: '确定' });
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
