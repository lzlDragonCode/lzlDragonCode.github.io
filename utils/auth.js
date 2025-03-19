// 权限插件（引入到了除登录页面，以外的其他所有页面）
/**
 * 目标1：访问权限控制
 * 1.1 判断无 token 令牌字符串，则强制跳转到登录页
 * 1.2 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
 */
const token = localStorage.getItem('token')
if (!token) {
  location.href = '../login/index.html'
}

/**
 * 目标2：设置个人信息
 * 2.1 在 utils/request.js 设置请求拦截器，统一携带 token
 * 2.2 请求个人信息并设置到页面
 */
const nameSpan = document.querySelector('.nick-name')
axios({
  url: '/v1_0/user/profile',
  method: 'GET'
}).then(function (response) {
  // console.log(response)
  const name = response.data.name
  nameSpan.innerHTML = name
})

/**
 * 目标3：退出登录
 *  3.1 绑定点击事件
 *  3.2 清空本地缓存，跳转到登录页面
 */
const quitButton = document.querySelector('.quit')
quitButton.addEventListener("click", function () {
  // 清除所有 localStorage 数据
  // localStorage.clear();
  // 只清除特定的键值对，例如 "token"
  localStorage.removeItem('token')
  location.href = "/page/login/index.html"
})

