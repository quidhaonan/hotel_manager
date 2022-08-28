// 定义操作房间类型的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get,$post } from '../utils/request'

// 导入消息框
import { $msg_e,$msg_s,$confirm } from '../utils/msg'

// 获取所有房间类型的方法
export const list=async ()=>{
    const r=await $get('/RoomType/List')
    // console.log(r)
    return r
}

// 添加房间类型的方法
export const add=async (params)=>{
    console.log(params)
    if(!checkInput(params)) return false

    const { success,message }=await $post('/RoomType/Add',params)
    console.log(success)
    console.log(message)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 修改房间类型的方法
export const update=async (params)=>{
    if(!checkInput(params)) return false

    const { success,message }=await $post('/RoomType/Update',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 删除房间类型的方法
export const del=async (params)=>{
    // 提示是否确定删除
    await $confirm('是否确定删除')

    const { success,message }=await $post('/RoomType/Delete',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}


// 统计房间类型的销售额
export const totalTypePrice=async ()=>{
    const ret=await $get('/RoomType/TotalTypePrice')
    return ret
}

// 验证输入方法
const checkInput=(params)=>{
    if(!params.roomTypeName){
        $msg_e('请输入房型名称')
    }else if(!params.roomTypePrice){
        $msg_e('请输入房型价格')
    }else if(isNaN(params.roomTypePrice)){
        $msg_e('房型价格必须是数字')
    }else if(!params.bedNum){
        $msg_e('请输入床位数量')
    }else if(!Number.isInteger(Number.parseInt(params.bedNum))){
        $msg_e('床位数量必须是整数')
    }else{
        return true
    }
    return false
}