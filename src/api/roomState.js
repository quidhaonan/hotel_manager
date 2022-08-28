// 定义操作房间状态的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get } from '../utils/request'

// 获取所有房间状态的方法
export const list=async ()=>{
    const ret=await $get('/RoomState/List')
    return ret
}

// 获取所有房间状态的方法（没有入住信息）
export const listToUpdate=async ()=>{
    const ret=await $get('/RoomState/ListToUpdate')
    return ret
}