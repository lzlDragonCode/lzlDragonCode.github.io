// axios 公共配置

// 基地址
axios.defaults.baseURL = 'https://geek.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  // 逻辑中断的使用
  token && (config.headers.Authorization = `Bearer ${token}`)
  /* if (token !== null) {
    config.header.Authorization = `Bearer ${token}`
  } */
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器 --> Token前端判断有无，后端判断是否正确
axios.interceptors.response.use(
  function (response) {
    // 2xx范围内的状态码都会触发该函数
    const result = response.data
    return result
  }, function (error) {
    // 超出2xX范围的状态码都会触发该函数
    // ?.是可选链，可以用来安全的访问属性
    if (error?.response?.status === 401) {
      // console.log(error)
      alert('登录过期，请重新登录')
      localStorage.clear()
      location.href = '/page/login/index.html'
    }
    return Promise.reject(error)
  }
)