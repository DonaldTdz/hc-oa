let app = getApp();
// let myDate = new Date();
Page({
  data: {
    id: '',
    projects: [],
    pageIndex: 1,
    pageSize: 100,
    projectId: 1,
    projectsIndex: 0,
    submitDate: '',
    amount: 0,
    reimburse: {},
    reimburseTypes: [{ text: '项目型报销', value: 1, checked: true }, { text: '非项目报销', value: 2 }],
    reimburseType: 0,
    items: []
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
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Reimburse/GetByIdAsync?id=' + this.data.id,
      method: 'Get',
      success: (res) => {
        this.data.projects.forEach(function(item, index) {
          if (item.value == res.data.result.projectId) {
            projectindex = index;
          }
        });
        this.setData({ reimburse: res.data.result, projectId: res.data.result.projectId, projectsIndex: projectindex, amount: res.data.result.amount })
      },
      fail: function(res) {
        dd.alert({ content: '获取报销详情异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  //报销类型切换
  typeChange: function(e) {
    this.setData({ reimburseType: e.detail.value })
  },

  //获取报销明细list
  getReimburseDetails() {
    let params = {};
    dd.showLoading();
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
        // if (dataCount < 10) {
        //   this.setData({ pageIndex: 1 });
        // } else {
        //   var pindex = this.data.pageIndex + 1;
        //   this.setData({ pageIndex: pindex });
        // }
        this.setData({ items: datas });
      },
      fail: function(res) {
        dd.alert({ content: '获取任务列表异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  //获取项目列表
  getProjects() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Project/GetDropDownsAsync',
      method: 'Get',
      // dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        this.setData({ projects: res.data.result, projectId: res.data.result[0].value })
      },
      fail: function(res) {
        dd.alert({ content: '获取项目列表异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  //提交审批
  onSubmission() {
    let reimburse = this.data.reimburse;
    reimburse.projectId = this.data.projectId;
    reimburse.type = this.data.reimburseType;
    this.setData({ reimburse: reimburse })
    if (!this.data.id || this.data.items.length <= 0)
      return dd.alert({ content: '请先填写报销和报销明细', buttonText: '确定' })
    if (this.data.reimburse.type == 0)
      return dd.alert({ title: '亲', content: '请选择报销类型', buttonText: '确定' });
    if (!this.data.reimburse.projectId && this.data.reimburse.type == 1)
      return dd.alert({ title: '亲', content: '请选择所属项目', buttonText: '确定' });
    let param = JSON.stringify({ Reimburse: this.data.reimburse });
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Reimburse/DingSubmitApprovalAsync',
      method: 'Post',
      data: param,
      headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      success: (res) => {
        dd.alert({
          content: res.data.result.msg, buttonText: '确定', success: () => {
            dd.navigateBack({
            });
          },
        });
      },
      fail: function(res) {
        dd.alert({ content: '提交异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  //添加报销明细
  onSubmit(e) {
    if (!this.data.id) {
      e.detail.value["projectId"] = this.data.projectId;
      e.detail.value["type"] = this.data.reimburseType;
      if (!e.detail.value["projectId"])
        return dd.alert({ title: '亲', content: '请选择所属项目', buttonText: '确定' });
      if (e.detail.value["type"] == 0)
        return dd.alert({ title: '亲', content: '请选择报销类型', buttonText: '确定' });
      e.detail.value["employeeId"] = app.globalData.userInfo.id;
      let pdata = JSON.stringify({ reimburse: e.detail.value });
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
        },
        fail: function(res) {
          dd.alert({ content: '新增异常', buttonText: '确定' });
        },
        complete: function(res) {
          dd.hideLoading();
        }
      });
    } else {
      dd.navigateTo({
        url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.id,
      });
    }

  },

  //报销明细编辑
  goVisit(data) {
    dd.navigateTo({
      url: "../update-reimbursesdetail/update-reimbursesdetail?id=" + this.data.items[data.index].id,
    });
  },

  //新增报销明细
  // createReimbursesDetail() {
  //   dd.navigateTo({
  //     url: "../create-reimbursesdetail/create-reimbursesdetail?reimburseId=" + this.data.reimburse.id,
  //   });
  // },
})
