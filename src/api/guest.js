// 定义操作顾客信息的 API 函数--围绕后台实现增删改查

// 导入请求函数
import { $get,$post } from '../utils/request'

// 导入消息框
import { $msg_e,$msg_s,$confirm } from '../utils/msg'

// 查询顾客信息
export const list=async (params)=>{
    const ret=await $get('/GuestRecord/List',params)
    return ret
}

// 添加顾客
export const add=async (params)=>{
    // 验证输入是否完整
    if(!checkInput(params)) return false

    // 执行添加操作
    const { success,message }=await $post('/GuestRecord/Add',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 修改顾客
export const update=async (params)=>{
    // 验证输入是否完整
    if(!checkInput(params)) return false

    // 执行修改操作
    const { success,message }=await $post('/GuestRecord/Update',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 结账方法
export const checkout=async (params)=>{
    // 执行结账操作
    const { totalMoney }=await $post('/GuestRecord/Checkout',params)
    $msg_e('结账成功，需要支付'+totalMoney+'元')
}

// 删除顾客信息的方法
export const del=async (params)=>{
    // 提示是否确定删除
    await $confirm('是否确定删除')

    const { success,message }=await $post('/GuestRecord/Delete',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 验证输入方法
const checkInput=(params)=>{
    if(!params.identityId){
        $msg_e('请输入身份证号')
    }else if(params.identityId.length!==18){
        $msg_e('身份证号必须是18位')
    }else if(!params.guestName){
        $msg_e('请输入顾客姓名')
    }else if(!params.phone){
        $msg_e('请输入手机号')
    }else if(params.phone.length!==11){
        $msg_e('手机号必须是11位')
    }else if(params.roomId==='请选择房间'){
        $msg_e('请选择房间')
    }else if(!params.resideDate){
        $msg_e('请选择入住日期')
    }else if(!params.deposit){
        $msg_e('请输入押金')
    }else if(!(/^\d+$/.test(params.deposit))){
        $msg_e('押金格式错误')
    }else if(!params.guestNum){
        $msg_e('请输入入住人数')
    }else if(!(/^\d+$/.test(params.guestNum))){
        $msg_e('入住人数格式错误')
    }else{
        return true
    }
    return false
}