const app = getApp();
Page({
  data: {
    form_submit_loading: false,
  },

  onLoad() {},

  onShow() {
    wx.setNavigationBarTitle({title: app.data.common_pages_title.answer_form});
    this.init();
  },

  // 初始化
  init() {
    var user = app.GetUserInfo(this, "init");
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        wx.redirectTo({
          url: "/pages/login/login?event_callback=init"
        });
        return false;
      }
    }
  },

  /**
   * 表单提交
   */
  formSubmit(e)
  {              
    // 数据验证
    var validation = [
      {fields: 'name', msg: '请填写联系人'},
      {fields: 'tel', msg: '请填写联系电话'},
      {fields: 'content', msg: '请填写内容'}
    ];
    if(app.fields_check(e.detail.value, validation))
    {
      wx.showLoading({content: '提交中...'});
      this.setData({form_submit_loading: true});

      // 网络请求
      wx.request({
        url: app.get_request_url('Add', 'Answer'),
        method: 'POST',
        data: e.detail.value,
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          wx.hideLoading();

          if(res.data.code == 0)
          {
            wx.showToast({
              type: 'success',
              content: res.data.msg
            });
            setTimeout(function()
            {
              wx.redirectTo({
                url: "/pages/user-answer-list/user-answer-list"
              });
            }, 2000);
          } else {
            this.setData({form_submit_loading: false});
            
            wx.showToast({
              type: 'fail',
              content: res.data.msg
            });
          }
        },
        fail: () => {
          wx.hideLoading();
          this.setData({form_submit_loading: false});

          wx.showToast({
            type: 'fail',
            content: '服务器请求出错'
          });
        }
      });
    }
  },

});
