// 定义操作房间图片的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get,$post } from '../utils/request'


// 添加房间图片
export const add=async (params)=>{
    const { success }=await $post('/RoomImg/Add',params)
    return success
}

// 查询指定房间对应的房间图片
export const list=async (params)=>{
    const ret=await $get('/RoomImg/List',params)
    return ret
}

// 删除房间图片
export const del=async (params)=>{
    const { success }=await $post('/RoomImg/Delete',params)
    return success
}