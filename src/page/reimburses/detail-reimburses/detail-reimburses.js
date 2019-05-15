let app = getApp();
let myDate = new Date();

Page({
  data: {
    id: '',
    projects: [],
    projectId: 1,
    projectsIndex: 0,
    submitDate: '',
    reimburse: {},
    items: [],
    pageIndex: 1,
    pageSize: 10,
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.getProjects();
    this.getReimburse();
    this.getReimburseDetails();
  },

  onShow() {
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
            this.setData({ projects: res.data.result })
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

  //获取报销详情
  getReimburse() {
    let projectindex;
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/Reimburse/GetByIdAsync?id=' + this.data.id,
          method: 'Get',
          success: (res) => {
            this.data.projects.forEach(function (item, index) {
              if (item.value == res.data.result.projectId) {
                projectindex = index;
              }
            });
            this.setData({ reimburse: res.data.result, submitDate: res.data.result.submitDateFormat, projectId: res.data.result.projectId, projectsIndex: projectindex })
          },
          fail: function (res) {
            dd.alert({ content: '获取报销详情异常', buttonText: '确定' });
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

  selectSubmitDate() {
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

  // 页面被拉到底部
  onReachBottom() {
    if (this.data.pageIndex > 1) {
      this.getReimburseDetails();
    }
  },

  //保存
  onSubmit(e) {
    this.data.reimburse.projectId = this.data.projectId;
    this.data.reimburse.submitDate = e.detail.value["submitDate"];
    // this.data.reimburse.status = e.detail.value["status"];
    // return console.log(this.data.reimburse);
    //  if (!this.data.reimburse.projectId)
    // return dd.alert({ title: '亲', content: '请选择所属项目', buttonText: '确定' });
    if (!this.data.reimburse.submitDate)
      return dd.alert({ title: '亲', content: '请选择申请日期', buttonText: '确定' });
    let pdata = JSON.stringify({ reimburse: this.data.reimburse });
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
              content: '修改成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../index",
                });
              },
            });
          },
          fail: function (res) {
            dd.alert({ content: '修改异常', buttonText: '确定' });
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

  //删除
  onDelete() {
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/Reimburse/DeleteAsync?id=' + this.data.reimburse.id,
          method: 'Delete',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '删除成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../index",
                });
              },
            });
          },
          fail: function (res) {
            dd.alert({ content: '删除异常', buttonText: '确定' });
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

  //获取报销明细list
  getReimburseDetails() {
    let params = {};
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/ReimburseDetail/GetPagedAsync',
          method: 'Get',
          data: {
            SkipCount: (this.data.pageIndex - 1) * this.data.pageSize,
            MaxResultCount: this.data.pageSize,
            ReimburseId: this.data.id,
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
          fail: function (res) {
            dd.alert({ content: '获取任务列表异常', buttonText: '确定' });
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

//提交审批
  onSubmission(){
 //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + '/api/services/app/Reimburse/SubmitApproval?id=' + this.data.reimburse.id,
          method: 'Post',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '提交成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../index",
                });
              },
            });
          },
          fail: function (res) {
            dd.alert({ content: '提交异常', buttonText: '确定' });
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

  //新增报销明细
  createReimbursesDetail() {
    dd.navigateTo({
      url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.reimburse.id,
    });
  },

 //点击报销明细跳转报销明细编辑
  goVisit(data) {
    dd.navigateTo({
      url: "../update-reimbursesdetail/update-reimbursesdetail?id=" + this.data.items[data.index].id,
    });
  },

})
