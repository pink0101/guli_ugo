import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    query: '', // 查询关键词
    cid:'', // 商品分类id
    pagenum: 1, // 页码值
    pagesize: 10, // 每页显示多少条数据
    goodsList: [],// 商品列表数据
    total:0, // 总数据条数
    isover: false, // 数据是否加载完毕
    isloading: false // 表示当前数据是否在请求中
  }
  onLoad(e) {
    console.log(e) // 传递过来参数
    this.query = e.query || ''
    this.cid = e.id || ''
    this.getGoodsList(e.query)
  }

  methods ={
    // 点击商品列表项，跳转到商品详情页
    goGoodsDetail(id) {
      wepy.navigateTo({ url: `/pages/goods_detail/main?goods_id=${id}` });
    }
  }
  // 获取商品列表数据
  async getGoodsList(cb){
    this.isloading = true
    const { data: res } =await wepy.get('/goods/search',{
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
    console.log(res)
    if(res.meta.status !== 200) {
      return wepy.baseToast() // 数据获取不成功，提示数据加载失败
    }
    this.goodsList = [...this.goodsList,...res.message.goods] // 将新数组的数据展开然后存到外面的数组中去
    this.total = res.message.total
    this.isloading = false
    this.$apply()
    cb && cb()
  }

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    console.log('触底')
    // 判断当前是否在请求数据中
    if(this.isloading) {
      return
    }
    // 先判断是否有下一页的数据
    if(this.pagenum * this.pagesize >= this.total ) {
      this.isover = true
      return 
    }
    this.pagenum++
    this.getGoodsList()
  }

  // 下垃刷新事件处理函数
  onPullDownRefresh() {
    console.log('触发下垃')
    // 初始化必要的字段值
    this.pagenum = 1
    this.total = 0
    this.goodsList = []
    this.isover = this.isloading = false
    // 重新请求数据
    this.getGoodsList(() => {
      wepy.stopPullDownRefresh() //当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
    })
  }
}