let app = getApp();
let myDate = new Date();
Page({
  data: {
    id: '',
    projects: [],
    pageIndex: 1,
    pageSize: 10,
    projectId: 1,
    projectsIndex: 0,
    submitDate: '',
    reimburse: {},
    items: [],
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.getProjects();

  },

  onShow() {
    if (this.data.id) {
      this.getReimburse();
      this.getReimburseDetails();
    }
  },

  bindProjectsChange(e) {
    this.setData({
      projectsIndex: e.detail.value,
      projectId: this.data.projects[e.detail.value].value
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
          url: app.globalData.host + 'api/services/app/Reimburse/GetByIdAsync?id=' + this.data.id,
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

  //获取报销明细list
  getReimburseDetails() {
    let params = {};
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/ReimburseDetail/GetPagedAsync',
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

  //获取项目列表
  getProjects() {

    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/Project/GetDropDownsAsync',
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

  //提交审批
  onSubmission() {
    if (!this.data.id || this.data.items.length <= 0) {
      return dd.alert({ content: '请先填写报销和报销明细', buttonText: '确定' })
    }
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/Reimburse/SubmitApproval',
          method: 'Post',
          data: {
            id: this.data.reimburse.id
          },
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

  //选择报销明细并且保存报销
  onSubmit(e) {
    if (!this.data.id) {
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
            url: app.globalData.host + 'api/services/app/Reimburse/CreateOrUpdateAsync',
            data: pdata,
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            success: (res) => {
              this.setData({ reimburse: res.data.result, id: res.data.result.id })
              dd.navigateTo({
                url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.id,
              });
              // dd.alert({
              //   content: '新增成功', buttonText: '确定', success: () => {

              //   },
              // });
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
    } else {
      dd.navigateTo({
        url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.id,
      });
    }
  },

  //新增报销明细
  // createReimbursesDetail() {
  //   dd.navigateTo({
  //     url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.reimburse.id,
  //   });
  // },
})
