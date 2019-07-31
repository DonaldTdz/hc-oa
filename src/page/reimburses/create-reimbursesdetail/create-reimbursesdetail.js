let app = getApp();
let myDate = new Date();
Page({
  data: {
    types: [],
    typeValue: '',
    typeIndex: 0,
    happenDate: '',
    reimburseId:''
  },

  onLoad(query) {
     this.setData({ reimburseId: query.reimburseId });
    this.getTypes();
  },

  onShow() {
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
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/DataDictionary/GetDropDownDtosByGroupAsync?group=3',
      method: 'Get',
      // dataType: 'json',
      success: (res) => {
        this.setData({ types: res.data.result, typeValue: res.data.result[0].value })
      },
      fail: function(res) {
        dd.alert({ content: '获取报销分类列表异常', buttonText: '确定' });
      },
      complete: function(res) {
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
      fail: function(res) {
        dd.alert({ content: '选择日期出错', buttonText: '确定' });
      }
    });
  },

  onSubmit(e) {
    e.detail.value["type"] = this.data.typeValue;
    e.detail.value["reimburseId"] = this.data.reimburseId;
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
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/ReimburseDetail/CreateOrUpdateAsync',
          data: pdata,
          method: 'Post',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
          success: (res) => {
            dd.alert({
              content: '新增成功', buttonText: '确定', success: () => {
                dd.navigateBack({
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
      }

})
