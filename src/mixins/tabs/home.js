import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    swiperList: [], // 轮播图数据
    cateItem: [], // 首页分类数据
    floorList: [] // 楼层相关数据
  }
  onLoad() { // 生命周期函数--监听页面加载
    this.getSwiperData()
    this.getCateItems()
    this.getFloorData()
  }

  methods = {
    // 点击楼层中的每一张图片，都要跳转到商品列表页面
    goGoodsList(url){
      wepy.navigateTo({ url })
    }
  }

  // 获取轮播图数据的函数
  async getSwiperData() {
    const { data: res } = await wepy.get('/home/swiperdata') // wepy.get 自己封装的api
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast() // 封装的 数据加载失败 提示框
    }
    this.swiperList = res.message
    this.$apply() // 异步返回的数据，赋值后，调用该函数，强制渲染页面
  }

  // 获取首页分类相关的数据项
  async getCateItems() {
    const { data: res } = await wepy.get('/home/catitems')
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast() // 封装的 数据加载失败 提示框
    }
    this.cateItem = res.message
    this.$apply() // 异步获取数据，强制渲染
  }
  // 获取楼层相关的数据项
  async getFloorData() {
    const { data: res } = await wepy.get('/home/floordata')
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast() // 封装的 数据加载失败 提示框
    }
    this.floorList = res.message
    this.$apply() // 异步获取数据，强制渲染
  }
}