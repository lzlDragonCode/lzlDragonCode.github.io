/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
const formSelect = document.querySelector('.form-select')
function getChannels() {
  axios({
    method: "GET",
    url: "/v1_0/channels"
  }).then(function (response) {
    // console.log(response) // 拿到的是经过axios拦截器拦截响应结果优化过的（去掉了一层data）
    // map方法的应用
    formSelect.innerHTML = response.data.channels.map(function (item) {
      return `<option value="${item.id}">${item.name}</option>`
    }).join('')
  })
}
getChannels()


/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
const imageFile = document.querySelector('.img-file')
const image = document.querySelector('.rounded')
imageFile.addEventListener('change', function (event) {
  const target = event.target
  if (target.files.length === 0) {
    alert("请选择封面")
    return
  }
  // 选择文件并保存在FormData中
  const formData = new FormData()
  formData.append("image", target.files[0])
  axios({
    method: "POST",
    url: '/v1_0/upload',
    data: formData
  }).then(function (response) {
    // console.log(response)
    const url = response.data.url
    image.src = url
    image.classList.add('show')
    document.querySelector('.place').classList.add("hide")
  })
})
// 实现选好图片用户想换图片的时候
image.addEventListener('click', function () {
  imageFile.click()
})

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
const form = document.querySelector('.art-form')
const button = document.querySelector('.send')
// 不能在这里获取image的URL，应为这里是同步代码，上面设置image的url是异步代码，所以这样imageURL永远为空
// const imageURL = image.src 
button.addEventListener('click', function (event) {
  // 因为发布和修改公用一套form，这里要判断是不是发布
  if (event.target.innerHTML === '修改') {
    return
  }

  const data = new serialize(form, { empty: true, hash: true })
  // 发布文章的时候，不需要id属性，所以可以删除掉（id为了后续做编辑使用）
  delete data.id
  // 根据要求组装请求数据对象，获取imageURL一定要在这个函数里面，如果在全局作用域获取，用户还没上传图片，赋值语句就执行，url为空
  const imageURL = image.src
  data.cover = {
    type: 1,
    // 这里API接口要求是数组，因为可以有多个图片
    images: [imageURL]
  }
  // console.log("data:")
  // console.log(data)
  axios({
    method: "POST",
    url: "/v1_0/mp/articles",
    data: data
  }).then(function (response) {
    myAlert(true, "发布文章成功")
    // 清空
    clear()
    // setTimeout跳转
    setTimeout(function () {
      location.href = "../content/index.html"
    }, 1000)
    console.log(response)
  }).catch(function (error) {
    myAlert(error.response.data.message)
  })
})
function clear() {
  // 清空表单,但是富文本编辑器和图片不能清除
  form.reset()
  // 清空图片
  image.src = ''
  image.classList.remove('show')
  document.querySelector('.place').classList.remove("hide")
  // 清空富文本编辑器
  editor.setHtml('')
}
// data.id = new Date().toLocaleString()


/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
// 自动执行函数，框架里面用的很多
; (function () {
  const URL = location.search
  const params = new URLSearchParams(URL)
  params.forEach(function (value, key) {
    // console.log(value, key)
    // 进入修改页面逻辑
    if (key === "id") {
      document.querySelector('.card .title').innerHTML = "修改文章"
      document.querySelector('.send').innerHTML = "修改"
      // 得到修改前的内容并回显示
      axios({
        method: "GET",
        url: `/v1_0/mp/articles/${value}`
      }).then(function (response) {
        // console.log(response)
        // title
        document.querySelector('.form-control').value = response.data.title
        // channel
        document.querySelector('.form-select').value = response.data.channel_id
        // image
        image.src = parseInt(response.data.cover.type) > 0 ? response.data.cover.images[0] :
          "https://img2.baidu.com/it/u=2640406343,1419332367&fm=253&fmt=auto&app=138&f=JPEG?w=708&h=500"
        image.classList.add('show')
        document.querySelector('.place').classList.add("hide")
        // id
        document.querySelector('.art-form [name=id]').value = response.data.id
        // 富文本编辑器
        editor.setHtml(response.data.content)
      })

    }
  })
})();
// 这里新增和修改公用一套表单太麻烦了，自己写可以直接复制一份，用两个表单
// 在vue中用component写法和插槽就不会这么麻烦

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
button.addEventListener('click', function (event) {
  if (event.target.innerHTML === '发布') {
    return
  }
  const URL = location.search
  const params = new URLSearchParams(URL)
  console.log(params)
  let id = null
  params.forEach(function (value, key) {
    if (key === 'id') {
      id = value
    }
  })
  // 根据要求组装请求数据对象
  const data = new serialize(form, { empty: true, hash: true })
  data.cover = {
    type: image.src ? 1 : 0,
    // 这里API接口要求是数组，因为可以有多个图片
    // 获取imageURL一定要在这个函数里面，如果在全局作用域获取，用户还没上传图片，赋值语句就执行，url为空
    images: [image.src]
  }
  console.log(data)
  axios({
    method: "PUT",
    url: `/v1_0/mp/articles/${data.id}`,
    data: data
  }).then(function (response) {
    console.log(response)
    myAlert(true, "修改成功")
    // 这里不需要把form表单修改回去，应为模板就是发布，当点击左边状态栏的发布文章按钮是，会重新加载page/publish/publish.html
    // 也不需要清空内容
    location.href = "../content/index.html"
  }).catch(function (error) {
    // 在request.js里面设置的式成功的响应结果才会优化
    myAlert(false, error.response.data.message)
  })
})