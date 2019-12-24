import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    value: '', // 搜索框中的默认内容
    suggestList: [], // 搜索建议列表
    kwList: [] // 搜索历史列表
  }

  onLoad() {
    // 获取 本地存储搜索关键词内容
    const kwList = wepy.getStorageSync('key') || []
    this.kwList = kwList
    console.log(kwList)
  }

  methods= {
    // 触发了搜索
    onSearch(e) {
      // e.detail 就是最新搜索关键词
      // console.log(e.detail)
      const kw = e.detail.trim()
      if(kw.length <=0){
        return
      }
      // 把用户填写的搜索关键词，保存到 Storage 中
      if(this.kwList.indexOf(kw) === -1){
        this.kwList.unshift(kw)
      }
      this.kwList = this.kwList.slice(0,10) // 截取前10位 返回一个新数组
      wepy.setStorageSync('key', this.kwList)
      // 跳转商品列表页
      wepy.navigateTo({ url: `/pages/goods_list?query=${kw}`});
    },
    // 触发了取消
    onCancel() {
      this.suggestList = []
    },
    // 当搜索关键词变化时，会触发
    onChange(e) {
      // console.log(e.detail)
      this.value = e.detail.trim() 
      if(e.detail.trim().length <= 0){
        this.suggestList = [] // 搜索建议列表 
        return
      }
      this.getSuggestList(e.detail)
    },
    goGoodsDetail(id) { // 点击搜索建议 跳转到商品详情页
      wepy.navigateTo({ url: `/pages/goods_detail/main?goods_id=${id}`});
    },
    goGoodsList(e) { // 点击每个历史搜索标签，导航到商品列表页面
      wepy.navigateTo({ url: `/pages/goods_list?query=${e}`})
    },
    clearHistory(){ // 清空搜索历史记录
      this.kwList = []
      wepy.setStorageSync('key',[])
      
    }
  }

  // 计算属性
  computed = {
    // true 展示搜索历史区域
    // false 展示搜索建议区域
    isShowHistory() {
      if(this.value.length <= 0){
        return true
      }
      return false
    }
  }

  // 获取搜索列表
  async getSuggestList(e) {
    const { data: res } =await wepy.get('/goods/qsearch',{ query : e })
    if(res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.suggestList = res.message 
    this.$apply()
  }
}