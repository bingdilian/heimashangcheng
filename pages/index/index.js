//Page Object
import { request } from '../../request/index';
Page({
    data: {
        swiperList: [],
        catesList: [],
        floorList: []
    },
    //options(Object)
    onLoad: function(options) {
        this.getFloorList();
        this.getSwiperLister(),
            this.getCatesList();
    },
    // 轮播图
    getSwiperLister() {
        request({
            url: '/home/swiperdata'
        }).then((result) => {
            this.setData({
                swiperList: result
            });
        });
    },
    // 分类
    getCatesList() {
        request({
            url: '/home/catitems'
        }).then((result) => {
            this.setData({
                catesList: result
            });
        });
    },
    // 楼层
    getFloorList() {
        request({
            url: '/home/floordata'
        }).then((result) => {
            this.setData({
                floorList: result
            });
        });
    }
});