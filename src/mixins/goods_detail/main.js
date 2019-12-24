import wepy from 'wepy'
export default class extends wepy.mixin{
  data = {
    goods_id:'', // 商品的id值 
    goodsInfo: {} , // 商品详情
    addressInfo: null, // 收货地址
    cartNummber: [] , // 购物车的数量
  }
  methods = {
    // 点击预览图片
    preview(current){
      wepy.previewImage({
        urls: this.goodsInfo.pics.map(x => x.pics_big), //需要预览的图片链接列表,
        current: current // 当前默认看到的图片
      })
    },
    // 获取用户的收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      console.log(res)
      if(res.errMsg !== 'chooseAddress:ok'){
        return wepy.baseToast('获取收货地址失败')
      }
      this.addressInfo = res
      wepy.setStorageSync('address', res)        
      this.$apply()
    },
    // 点击按钮，把商品添加到购物车列表中
    addToCart() {
      // 调用加入购物车全局函数，并传递商品信息
      this.$parent.addGoodsToCart(this.goodsInfo)
      // 提示用户，加入购物车成功
      wepy.showToast({
        title: '加入购物车成功', // 提示的内容,
        icon: 'success', // 图标,
        duration: 1000, // 延迟时间,
        mask: true, // 显示透明蒙层，防止触摸穿透,
        success: res => {}
      })
    }
  }

  computed = {
    addressStr() {
      if(this.addressInfo === null){
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str = addr.provinceName+addr.cityName+addr.countyName+addr.detailInfo
      return str
    },
    // 所有已经勾选的商品的数量
    total() {
      return this.$parent.globalData.total
    }
  }

  onLoad(options) {
    console.log(options) // 传递过来的参数
    this.goods_id = options.goods_id
    this.getGoodsInfo()
  }

  // 获取商品详情数据
  async getGoodsInfo() {
    const { data: res } = await wepy.get('/goods/detail',{goods_id:this.goods_id})
    if(res.meta.status !== 200 ){
      return wepy.baseToast
    }
    this.goodsInfo = res.message
    this.$apply()
  }
}