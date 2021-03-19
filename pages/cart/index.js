// pages/cart/index.js
/*
  1.获取用户收货地址 wx.chooseLocation
  2.获取用户对小程序的收货地址的权限状态 scope 
  3.防止用户取消获取地址授权
  4.
*/
import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    async handleChooseAddress() {
        try {
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            if (scopeAddress === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            // console.log(address);
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
            wx.setStorageSync('address', address)
        } catch (error) {
            console.log(error);
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const address = wx.getStorageSync("address");
        this.setData({
            address
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})