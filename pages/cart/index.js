// pages/cart/index.js
/*
  1.获取用户收货地址 wx.chooseLocation
  2.获取用户对小程序的收货地址的权限状态 scope 
  3.防止用户取消获取地址授权
  4.总价格和总数量 全部选中才计算，获取购物车数组，遍历，
    总价格+=商品单价*数量
    总数量+=商品的数量
    把计算后的价格和数量设置到data中
  5.商品的选中
    1.绑定change事件
    2.获取被修改的商品对象
    3.选中状态修改 取反
    4.重新赋值data中
    5.重新计算全选，总价格，总数量...
  6.全选和反选
    1.全选复选框绑定事件，change
    2.获取data中的全选变量 allChecked，直接取反
    3.遍历购物车数组，让商品选中状态跟随 allChecked
    4.购物车数组和allChecked重新设置到data中，购物车设置缓存
  7.商品数量的加减编辑
    1.加减按钮 绑定同一个事件，区分的关键，自定义属性
    2."+""+1"  "-" "-1"
    3.传递被点击的商品id goods_id
    4.获取data中的购物车数组，获取被修改的商品对象
    5.直接修改商品对象中的数量 num值
    6.把cart数组 重新设置到缓存和data中 this.setCart
    7.数量不能为负数
  8.点击结算
    1.判断有无地址和商品
    2.都有跳转结算页面

*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {}, //地址
        cart: [], //购物车数组
        allChecked: false, //是否全选
        totalPrice: 0, //全选总价格
        totalNum: 0 //全选总数量 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //获取地址
        const address = wx.getStorageSync("address");
        //获取缓存中购物车数据
        const cart = wx.getStorageSync("cart") || [];
        //计算全选 空数据调用every 返回就是true
        // const allChecked = cart.length ? cart.every(v => v.checked) : false;
        this.setData({ address })
        this.setCart(cart);
    },
    //点击 获取收货地址
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
    //商品选中
    handeItemChange(e) {
        //获取被修改的商品id
        const goods_id = e.currentTarget.dataset.id;
        // console.log(goods_id);
        //获取购物车数组
        let { cart } = this.data;
        //找到被修改商品索引
        let index = cart.findIndex(v => v.goods_id === goods_id)
            //选中状态取反
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },
    //设置购物车状态同时重新计算底部的全部数据,全选，价格，数量
    setCart(cart) {
        let allChecked = true;
        //总价格，总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num;
                } else {
                    allChecked = false;
                }
            })
            //判断cart是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        //购物车数据重新设置到data和缓存
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked
        });
        wx.setStorageSync("cart", cart);
        // console.log(cart);
    },
    //商品全选
    handleItemAllCheck() {
        //  1.获取data中的数据
        let { cart, allChecked } = this.data;
        //2.修改值
        allChecked = !allChecked;
        //3.循环修改cart数组中的商品选中状态
        cart.forEach(v => v.checked = allChecked);
        //4.修改后的值重新设置到data中和缓存中
        this.setCart(cart);
    },
    //商品数量编辑功能
    async handleItemNumEdit(e) {
        //1.获取传递过来的参数
        const { operation, id } = e.currentTarget.dataset;
        // console.log(operation, id);
        //2.获取购物车数组
        let { cart } = this.data;
        //3.找到需要修改的商品索引
        const index = cart.findIndex(v => v.goods_id === id);
        if (cart[index].num === 1 && operation === -1) {
            const res = await showModal({ content: "是否要删除" })
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
        } else {
            //4.进行修改数量
            cart[index].num += operation;
            //5.设置回data中
            this.setCart(cart);
        }
    },
    //点击结算
    async handelPay() {
        //判断地址和商品
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({ title: '还没选择收货地址' })
            return;
        }
        if (totalNum === 0) {
            await showToast({ title: '购物车为空' })
            return;
        }
        //全部验证 跳转支付
        wx.navigateTo({
            url: '/pages/pay/index',
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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