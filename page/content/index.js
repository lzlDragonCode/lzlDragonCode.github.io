/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
const queryObject = {
  status: "",       // 文章状态（1-待审核，2-审核通过）空字符串-全部
  channel_id: "",   // 文章频道id，空字符串-全部
  page: 1,          // 当前页码
  per_page: 10      // 当前页面条数
}
let totalCount = 0  // 当前总条数

const artList = document.querySelector('.art-list')
const totalCountHTML = document.querySelector('.total-count')
const pageNow = document.querySelector('.page-now')
function getList(data) {
  axios({
    method: "GET",
    url: '/v1_0/mp/articles',
    // 这里要传的是params不是body
    params: data
  }).then(function (response) {
    // console.log(response)
    const list = response.data.results
    // console.log(list)
    const StringHTML = list.map(function (element) {
      return `<tr>
      <td>
        <img src="${parseInt(element.cover.type) > 0 ? element.cover.images[0] : "https://img2.baidu.com/it/u=2640406343,1419332367&fm=253&fmt=auto&app=138&f=JPEG?w=708&h=500"}">
      </td>
      <td>${element.title}</td>
      <td>
        ${element.status === 1 ? '<span class="badge text-bg-primary">待审核</span>' : '<span class="badge text-bg-success">审核通过</span>'}
      </td>
      <td>
        <span>${element.pubdate}</span>
      </td>
      <td>
        <span>${element.read_count}</span>
      </td>
      <td>
        <span>${element.comment_count}</span>
      </td>
      <td>
        <span>${element.like_count}</span>
      </td>
      <td data-id=${element.id}>
        <i class="bi bi-pencil-square edit">修改</i>
        <i class="bi bi-trash3 del">删除</i>
      </td>
    </tr>`
    }).join('')
    artList.innerHTML = StringHTML
    // console.log(StringHTML)
    // 设置总页数
    totalCount = response.data.total_count
    totalCountHTML.innerHTML = `共${totalCount}条`
    // 设置当前页数
    pageNow.innerHTML = `第${queryObject.page}页`
  })
}
// 进入页面自动调用，显示数据
getList(queryObject)


/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
// 2.1 设置频道列表数据
const formSelect = document.querySelector('.form-select')
function setChannels() {
  axios({
    method: "GET",
    url: "/v1_0/channels",
  }).then(function (response) {
    // console.log(response)
    const list = response.data.channels
    formSelect.innerHTML = "<option selected value=''>请选择文章频道</option>" + list.map(function (item) {
      return `<option value="${item.id}">${item.name}</option>`
    })
  })
}
setChannels()
// 2.2 监听筛选条件改变，保存查询信息到查询参数对象
document.querySelectorAll('.form-check-input').forEach(function (item) {
  item.addEventListener("click", function (event) { // 每一个元素都要添加
    queryObject.status = event.target.value
  })
})
document.querySelector('.form-select').addEventListener("change", function (event) {
  queryObject.channel_id = event.target.value
})
// 2.3 点击筛选时，传递查询参数对象到服务器
// 当用户选择筛选条件时，可能不点击筛选按钮，而是直接点击下一页按钮，所以要监听form表当里面两个项的变化，并直接修改queryObject
// 这样可以避免这个BUG(实际上是一种情况，在用户角度考虑，用户点击下一页就是想要查询了)
const selButton = document.querySelector('.sel-btn')
selButton.addEventListener('click', function () {
  // console.log(queryObject)
  getList(queryObject)
})

// 但是使用表单搜集也可以避免这个BUG？
/* function getForm() {
  const selForm = document.querySelector('.sel-form')
  // 可以使用form-serialize来搜集表单数据
  const data = new serialize(selForm, { hash: true, empty: true })
  // console.log(data)
  return data
} */


/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
const last = document.querySelector('.pagination .last')
const next = document.querySelector('.pagination .next')
last.addEventListener('click', function () {
  if (queryObject.page > 1) {
    queryObject.page--;
    getList(queryObject)
  }
})
next.addEventListener('click', function () {
  if (queryObject.page < Math.ceil(totalCount / queryObject.per_page)) {
    queryObject.page++
    getList(queryObject)
  }
})


/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
artList.addEventListener('click', function (event) {
  if (event.target.tagName === "I") {
    const id = event.target.parentNode.dataset.id
    // console.log("id", id)
    if (event.target.classList.contains("del")) {
      // console.log("delete")
      axios({
        method: "DELETE",
        url: `/v1_0/mp/articles/${id}`,
      }).then(function (response) {
        // console.log(response)
        // 4.5 删除最后一页的最后一条，需要自动向前翻页,这里是大于，不是大于等于
        console.log(Math.ceil(totalCount / queryObject.per_page))
        if (queryObject.page > Math.ceil(totalCount / queryObject.per_page)) {
          queryObject.page--
        }
        getList(queryObject)
      })
    } else {
      // console.log("edit")
      // 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
      location.href = `../publish/index.html?id=${id}`
    }
  }
})




