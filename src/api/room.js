// 定义操作房间的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get,$post } from '../utils/request'

// 导入消息框
import { $msg_e,$msg_s,$confirm } from '../utils/msg'

// 获取房间信息的方法
export const list=async (params)=>{
    const ret=await $get('/Room/List',params)
    return ret
}

// 添加房间信息的方法
export const add=async (params)=>{
    // 验证输入是否完整
    if(!checkInput(params)) return false

    // 执行添加操作
    const { success,message }=await $post('/Room/Add',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 修改房间信息的方法
export const update=async (params)=>{
    // 验证输入是否完整
    if(!checkInput(params)) return false

    // 执行修改操作
    const { success,message }=await $post('/Room/Update',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 删除房间信息的方法
export const del=async (params)=>{
    // 提示是否确定删除
    await $confirm('是否确定删除')

    const { success,message }=await $post('/Room/Delete',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 验证输入方法
const checkInput=(params)=>{
    if(!params.roomId){
        $msg_e('请输入房间号')
    }else if(params.roomStateId==0){
        $msg_e('请选择房间状态')
    }else if(params.roomTypeId==0){
        $msg_e('请选择房间类型')
    }else{
        return true
    }
    return false
}