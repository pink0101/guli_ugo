import wepy from 'wepy'
export default class extends wepy.mixin {
  data  = {
    addressInfo:null, // 默认收货地址
    cart: [], // 购物车中一勾选的商品
  }
  methods = {
    // 选择收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err) // 调用微信收货地址的api 异步
      console.log(res)
      if(res.errMsg !== 'chooseAddress:ok') {
        return
      }
      this.addressInfo = res
      wepy.setStorageSync('address',res) // 存入本地
      this.$apply()
    },
    // 获取用户信息
    async getUserInfo(userInfo) {
      // 判断是否获取用户信息失败
      if(userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败！')
      }
      console.log(userInfo)

      // 获取用户登录的凭证 code
      const loginRes = await wepy.login() // 异步的
      console.log(loginRes)
      if(loginRes.errMsg !== 'login:ok') {
        return wepy.baseToast('微信登录失败')
      }

      // 登录的参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }

      // 发起登录的请求，换取登录成功之后的 Token 值
      const {data: res} = await wepy.post('/users/wxlogin', loginParams)
      console.log(res)
    }
  }
  computed = {
    isHaveAddress() {
      if(this.addressInfo === null) {
        return false
      }
      return true
    }
  }
  onLoad() {
    // 加载页面的时候去本地存储中读 收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
    // 从购物车列表中， 将那些被勾选的商品，过滤出来，形成一个新的数组
    const newArr = this.$parent.globalData.cart.filter(x => x.isCheck)
    console.log(newArr)
    this.cart = newArr
  }
}