// 定义操作角色的 API 函数--围绕后台实现增删改查

// 导入请求函数
import {$get,$post} from '../utils/request'
import {$msg_e,$msg_s,$confirm} from '../utils/msg'

// 返回所有的角色信息
export const list=async ()=>{
    const data=await $get('/Role/List')
    return data
}

// 添加角色信息
export const add=async (params)=>{
    // 验证信息
    if(!checkInput(params)){
        return false
    }

    const {success,message}=await $post('Role/Add',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 修改角色信息
export const update=async (params)=>{
    // 验证信息
    if(!checkInput(params)){
        return false
    }
    const {success,message}=await $post('/Role/Update',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 删除角色信息
export const del=async (params)=>{
    // 提示是否确定删除
    await $confirm('是否确定删除')
    const {success,message}=await $post('/Role/Delete',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 非空验证方法
const checkInput=(params)=>{
    // 验证信息
    if(!params.roleName){
        $msg_e('请输入角色名称')
        return false
    }else{
        return true
    }
}