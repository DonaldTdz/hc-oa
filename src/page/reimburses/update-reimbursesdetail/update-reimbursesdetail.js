let app = getApp();
let myDate = new Date();
Page({
  data: {
    types: [],
    typeValue: '',
    typeIndex: 0,
    happenDate: '',
    id: '',
    reimburseDetail: {}
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.getTypes();
  },

  onShow() {
    this.getReimburseDetail();
  },

  bindTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value,
      typeValue: this.data.types[e.detail.value].value
    });
  },

  //获取报销分类列表
  getTypes() {
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/DataDictionary/GetDropDownDtosByGroupAsync?group=3',
          method: 'Get',
          // dataType: 'json',
          success: (res) => {
            this.setData({ types: res.data.result, typeValue: res.data.result[0].value })
          },
          fail: function (res) {
            dd.alert({ content: '获取报销分类列表异常', buttonText: '确定' });
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

  //获取报销明细详情
  getReimburseDetail() {
    let typeIndex;
    dd.showLoading();
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/ReimburseDetail/GetByIdAsync?id=' + this.data.id,
          method: 'Get',
          success: (res) => {
            this.data.types.forEach(function (item, index) {
              if (item.value == res.data.result.type) {
                typeIndex = index;
              }
            });
            this.setData({ reimburseDetail: res.data.result, happenDate: res.data.result.happenDateFormat, typeValue: res.data.result.type, typeIndex: typeIndex })
            console.log(this.data.types[typeIndex].text)
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

  selectHappenDate() {
    dd.datePicker({
      currentDate: this.myDate,
      success: (res) => {
        this.setData({
          happenDate: res.date
        })
      },
      fail: function (res) {
        dd.alert({ content: '选择日期出错', buttonText: '确定' });
      }
    });
  },

  onSubmit(e) {
    e.detail.value["id"] = this.data.reimburseDetail.id;
    e.detail.value["reimburseId"] = this.data.reimburseDetail.reimburseId;
    e.detail.value["creationTime"] = this.data.reimburseDetail.creationTime;
    e.detail.value["happenDate"] = this.data.happenDate;
    e.detail.value["type"] = this.data.typeValue;
    if (!e.detail.value["customer"])
      return dd.alert({ title: '亲', content: '请输入客户', buttonText: '确定' });
    if (!e.detail.value["happenDate"])
      return dd.alert({ title: '亲', content: '请选择发生日期', buttonText: '确定' });
    if (!e.detail.value["type"])
      return dd.alert({ title: '亲', content: '请选择报销类型', buttonText: '确定' });
    if (!e.detail.value["place"])
      return dd.alert({ title: '亲', content: '请输入发生地点', buttonText: '确定' });
    if (!e.detail.value["amount"])
      return dd.alert({ title: '亲', content: '请输入金额', buttonText: '确定' });
    let pdata = JSON.stringify({ reimburseDetail: e.detail.value });
    //免登陆
    dd.getAuthCode({
      success: (res) => {
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/ReimburseDetail/CreateOrUpdateAsync',
          data: pdata,
          method: 'Post',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '修改成功', buttonText: '确定', success: () => {
                dd.navigateTo({
                  url: "../detail-reimburses/detail-reimburses?id=" + this.data.reimburseDetail.reimburseId,
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
  }
})
