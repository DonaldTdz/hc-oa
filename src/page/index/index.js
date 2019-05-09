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
              code: res.authCode
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
            },
            fail: function(res) {
              //dd.alert({content:JSON.stringify(res)})
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
    }
  },
  onLoad() {
    //this.setData({items:[]});
    this.loginSystem();
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