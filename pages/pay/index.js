// pages/cart/index.js
/*
1.页面加载的时候
  1从缓存中获取购物车数据 渲染 支付的商品数据  checked=true
  2.微信支付
    1.那些人 哪些账号 可以实现微信支付
        1.企业账号
        2.企业账号的小程序后台必须给开发者添加白名单
        3.一个appID可以绑定多个开发者
        4.这些开发者可以公用这个APPID 和 开发权限
  3.支付授权
    1.判断缓存有没有token
    2.没有就跳转授权页面
    3.有token就正常执行
 */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //地址
    cart: [], //购物车数组
    totalPrice: 0, //全选总价格
    totalNum: 0, //全选总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取地址
    const address = wx.getStorageSync("address");
    //获取缓存中购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤购物车数组
    cart = cart.filter((v) => v.checked);
    this.setData({
      address,
    });
    //总价格，总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    //购物车数据重新设置到data和缓存
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    });
  },
  async handleOrderPay() {
    //1.判断缓存有没有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
      return;
    }
    // console.log('已经存在token');
    //3.创建订单 准备 请求头参数
    const header = { Authorization: token };
    //3.准备请求体
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach((v) =>
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price,
      })
    );
    const orderParams = { order_price, consignee_addr, cart };
    //准备发送请求，创建订单
    const { order_number } = await request({
      url: "/my/orders/create",
      method: "post",
      data: orderParams,
      header,
    });
    // console.log(order_number);
    //发起预支付
    const res = await request({
      url: "/my/orders/req_unifiedorder",
      method: "post",
      header,
      data: { order_number },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
