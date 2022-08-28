// 定义操作结账状态的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get } from '../utils/request'

// 查询结账状态信息
export const list=async (params)=>{
    const ret=await $get('/ResideState/List',params)
    return ret
}