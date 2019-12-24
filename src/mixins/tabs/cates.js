import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    activeKey: 0, // 导航侧边栏默认被选中项
    catesData: [], // 分类数据
    wh:0, // 当前屏幕可用高度
    secondCate: [] // 所有的二级分类数据
  }
  onLoad() {
    this.getCatesList()
    this.getWindowHeight()
  }
  methods = {
    onChange(event) { // 点击二级分类对三级分类进行赋值
      // event.detail 是点击项的索引
      this.secondCate = this.catesData[event.detail].children
      console.log(this.secondCate)
    },
    goGoodsList(id) { // 点击三级分类跳转商品列表页
      wepy.navigateTo({ url: `/pages/goods_list?id=${id}`});
    }
  }

  // 获取分类列表数据
  async getCatesList() {
    const { data: res} = await wepy.get('/categories')
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast() // 封装的 数据加载失败 提示框
    }
    this.catesData = res.message
    this.secondCate = res.message[0].children // 初始化二级分类默认数据
    this.$apply() // 异步返回的数据，赋值后，调用该函数，强制渲染页面
  }

  // 动态获取屏幕可用的高度
  async getWindowHeight(){
    const res = await wepy.getSystemInfo() // 微信小程序官方提供 获取系统信息
    console.log(res)
    if(res.errMsg === 'getSystemInfo:ok') {
      this.wh = res.windowHeight
      this.$apply() // 异步api 赋值后强制渲染
    }
  }
}