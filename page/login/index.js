/**
   * 目标1：验证码登录
   * 1.1 在 utils/request.js 配置 axios 请求基地址
   * 1.2 收集手机号和验证码数据
   * 1.3 基于 axios 调用验证码登录接口
   * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
   */
const form = document.querySelector(".login-form")
const button = document.querySelector('.btn')
button.addEventListener('click', function () {
  const data = serialize(form, { hash: true, empty: true })
  axios({
    url: "/v1_0/authorizations",
    method: 'POST',
    data: data
  }).then(function (response) {
    myAlert(true, "登录成功")
    // 保存token令牌
    localStorage.setItem('token', response.data.token)
    // 这里设置延迟是为了让用户看到登录成功的提示，有必要吗？
    setTimeout(function () {
      location.href = '../content/index.html'
    }, 500)
  }).catch(function (error) {
    const message = error.response.data.message
    myAlert(false, message)
  })
})