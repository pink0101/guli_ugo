import wepy from 'wepy'

// 发送数据请求的域名
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

//  str = '获取数据失败' 新的赋默认方式 
// 弹框提示一个无图标的消息
wepy.baseToast = function (str = '获取数据失败') {
  wepy.showToast({
    title: str, // 提示的内容,
    duration: 2000, // 延迟时间,
    icon: 'none', // 不显示图标
    mask: true, // 显示透明蒙层，防止触摸穿透,
    success: res => {}
  })
}
// 发起 get 请求的API 函数
wepy.get =  function (url, data = {}) {
  return wepy.request({
    url: baseURL + url, // 开发者服务器接口地址",
    data, // 请求的参数",
    method: 'GET'
  })
}

// 发起 post 请求的API 函数
wepy.post =  function (url, data = {}) {
  return wepy.request({
    url: baseURL + url, // 开发者服务器接口地址",
    data, // 请求的参数",
    method: 'POST'
  })
}