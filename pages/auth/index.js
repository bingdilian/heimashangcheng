// pages/auth/index.js
import { request } from "../../request/index";
import { login } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  async handleGetUserInfo(e) {
    try {
      // console.log(e);
      //1.获取用户信息
      const { encryptedData, iv, rawData, signature } = e.detail;
      //获取小程序登录成功的code
      const { code } = await login();
      // console.log(code);
      const loginParams = {
        encryptedData,
        iv,
        rawData,
        signature,
        code
      };
      //发送请求，获取token
      const { token } = await request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "post",
      });
      // console.log(token);
      //把token存入缓存，同时调整回上个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1,
      });
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
