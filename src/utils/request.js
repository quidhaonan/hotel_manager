// 请求相关

// 导入 nprogress
import NProgress from 'nprogress'
// 导入 nprogress 的样式
import 'nprogress/nprogress.css'

// 导入 axios
import axios from 'axios'

// 导入接口根地址
import {BASE_URL} from '../config/conster'

// 初始化一个 axios 对象
var instance=axios.create({
    // 设置请求地址前缀
    baseURL:BASE_URL,
    // 请求超时时间
    timeout:30000,
    // 自定义请求头
    // headers:{'token':sessionStorage.getItem('token')}
})

// 添加请求拦截器
instance.interceptors.request.use((config)=>{
    NProgress.start()
    // 在发送请求之前做什么
    return config
},(err)=>{
    NProgress.done()
    // 对请求错误做些什么
    return Promise.reject(err)
})

// 添加响应拦截器
instance.interceptors.response.use((response)=>{
    NProgress.done()
    // 对响应数据做点什么
    return response
},(err)=>{
    NProgress.done()
    // 对响应错误做点什么
    return Promise.reject(err)
})

// 定义一个 get 请求方法
export let $get=async (url,params)=>{
    let {data}=await instance.get(url,{params})
    return data
}

// 定义一个 post 请求方法
export let $post=async (url,params)=>{
    let {data}=await instance.post(url,params)
    return data
}

// 设置 token 的方法，该方法会将浏览器缓存中的 token 信息，添加到请求头
export let $setToken=()=>{
    // 将 token 信息，保存到请求头中
    instance.defaults.headers.common['token']=sessionStorage.getItem('token')
}