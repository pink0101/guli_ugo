import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    cart: [], //购物车商品列表
  }
  methods = {
    // 监听商品数量变化
    countChanged(e) {
      // console.log(e.detail) // 当前最新的数量值
      const count = e.detail
      // console.log(e.target.dataset.id) //商品的id
      const id = e.target.dataset.id
      // 调用全局函数 进行修改 商品数量 和持久化存储
      this.$parent.updateGoodsToCart(id, count)
    },
    // 当商品前面的复选框，选中状态变化，触发
    statusChanged(e) {
      // console.log(e.detail) // 复选框当前状态
      const status = e.detail
      // console.log(e.target.dataset.id) // 商品id
      const id = e.target.dataset.id
      // 调用全局函数 改变当前商品的状态
      this.$parent.updateGoodsStatus(id, status)
    },
    // 点击删除对应商品
    close(id) {
      // console.log(id) // 商品的id
      // 调用 全局函数 删除 购物车商品
      this.$parent.removeGoodsById(id)
    },
    // 点击全选更改购物车中商品的选中状态
    onFullCheckChanged(status) {
      // console.log(e.detail) // 全选按钮 的状态
      // 调用全局函数 更新购物车每个商品的状态
      this.$parent.updateAllGoodsStatus(status.detail)
    },
    // 提交订单
    submitOrder() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单金额不能为空')
      }
      wepy.navigateTo({ url: '/pages/order' })
      
    }
  }
  computed = {
    // 判断购物车是否为空
    isEmpty() {
      if(this.cart.length <= 0){
        return true
      }
      return false
    },
    // 总价格，单位是 分
    amount() {
      let total = 0 // 单位 元
      this.cart.forEach(x => {
        if(x.isCheck) {
          total += x.price * x.count
        }
      })
      return total * 100
    },
    // 判断全选的状态
    isFullChecked() {
      // 所有商品的个数
      const allcount = this.cart.length
      // 购物车勾选了的商品的数量
      let c = 0
      this.cart.forEach(x => {
        if(x.isCheck) {
          c ++
        }
      })
      return c === allcount
    }
  }
  onLoad() {
    this.cart = this.$parent.globalData.cart
  }
}