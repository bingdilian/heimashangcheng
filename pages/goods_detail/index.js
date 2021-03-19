// pages/goods_detail/index.js
import { request } from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
// 点击图片预览 调用小程序api wx.previewImage
// 加入购物车

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {}
    },
    // 商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const { goods_id } = options;
        // console.log(goods_id);
        // console.log(options);
        this.getGoodsDetail(goods_id);
    },
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
        console.log(goodsObj);
        this.GoodsInfo = goodsObj
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                // 富文本内容中 iphone 部分手机不识别webp图片格式
                // 前端临时改 后端有图片
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics,
            }
        })
    },
    // 点击轮播放大预览
    handlePrevewImage(e) {
        // console.log('预览');
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
        console.log('urls');
        const current = e.currentTarget.dataset.url
        wx.previewImage({
            current,
            urls
        })
    },
    handleCartAdd() {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            this.GoodsInfo.num = 1;
            cart.push(this.GoodsInfo);
        } else {
            cart[index].num++;
        }
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1500,
            // 防止多次点击
            mask: true,
        });

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