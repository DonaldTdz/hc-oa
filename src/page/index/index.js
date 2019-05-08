let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    width: 200,
    height: 200,
    chart: null,
    showChart: false,
    arr: {
      onItemTap: 'onGridItemTap',
      list: [
        {
          icon: '/images/dodge.png',
          title: '项目周报',
          page: '../district/district',
        }, {
          icon: '/images/bar.png',
          title: '项目报销',
          page: '../task/task',
        }, {
          icon: '/images/area.png',
          title: '任务列表',
          page: '../area/area',
        }
      ],
    }
  },
  loginSystem() {
    if (app.globalData.userInfo.id == '') {
      dd.showLoading();
      //免登陆
      dd.getAuthCode({
        success: (res) => {
          //  console.log('My authCode', res.authCode);
          dd.httpRequest({
            url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
            method: 'Get',
            data: {
              code: res.authCode,
              appId: app.globalData.appId
            },
            dataType: 'json',
            success: (res) => {
              dd.hideLoading();
              //console.log('res', res);
              app.globalData.userInfo = res.data.result;
              if (app.globalData.userInfo.avatar == '') {
                app.globalData.userInfo.avatar = '../../images/logo.jpeg';
              }
              this.setData({ userInfo: app.globalData.userInfo });
              this.getScheduleSummary();
            },
            fail: function(res) {
              // dd.alert({content:JSON.stringify(res)})
              dd.hideLoading();
              dd.alert({ content: '获取用户信息异常', buttonText: '确定' });
            },
            complete: function(res) {
              dd.hideLoading();
              //dd.alert({ content: 'complete' });
            }
          });
        },
        fail: function(err) {
          dd.alert({ content: '授权出错', buttonText: '确定' });
          dd.hideLoading();
        }
      });
    } else {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getScheduleSummary();
    }
  },
  onLoad() {
    //this.setData({items:[]});
    this.loginSystem();
  },
  getScheduleSummary() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetScheduleSummaryAsync',
      method: 'Get',
      data: {
        userId: this.data.userInfo.id,
        areaCode: this.data.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        //console.log('res', res.data.result);
        this.setData({ items: res.data.result });
        for (var i in this.data.items) {
          if (this.data.items[i].num > 0) {
            this.setData({ showChart: true });
            break;
          }
        }
      },
      fail: function(res) {
        // dd.alert({content:JSON.stringify(res)})
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  onGridItemTap(e) {
    const curIndex = e.currentTarget.dataset.index;
    const pageNav = this.data.arr.list[curIndex];
    if (curIndex == 3) {
      if (app.globalData.userInfo.areaCode == 4) {
        dd.navigateTo({
          url: pageNav.page,
        });
      } else if (app.globalData.userInfo.areaCode != 0) {
        dd.navigateTo({
          url: "../area/district-area/district-area",
        });
      }
    } else {
      dd.navigateTo({
        url: pageNav.page,
      });
    }
  },
  onItemTClick(data) {
    dd.navigateTo({
      url: "../district-statis/district-statis?status=" + this.data.items[data.index].status + "&tabIndex=1&areaCode=" + this.data.userInfo.areaCode,
    });
  }
})