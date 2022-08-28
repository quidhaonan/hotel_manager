// 定义操作管理员的 API 函数--围绕后台实现增删改查

// 导入请求函数
import {$get,$post,$setToken} from '../utils/request'

// 导入 js-md5
// import md5 from 'js-md5'

// 导入消息框
import {$msg_s,$msg_e,$confirm} from '../utils/msg'

// 定义登录方法
export let login=async (params)=>{
    // 解构出 ckMe
    const {ckMe}=params

    // 目前不用
    // 对密码进行加密
    // params.loginPwd=md5(md5(params.loginPwd).split('').reverse().join())

    // 登录成功后，服务器会向前台返回一个 token
    // token 是你的唯一凭证：令牌
    // 之后你向服务器的每一次提交，都要带上这个
    const {message,success,token}=await $get('/Admin/Login',params)
    if(success){
        // 浏览器缓存有两种：sessionStorage 和 loaclStorage
        // sessionStorage 缓存数据，随着浏览器的关闭而清空
        // loaclStorage 缓存数据，除非手动清空，否则会一直缓存在浏览器中
        sessionStorage.setItem('token',token)
        // 将 token 信息设置为请求头内容
        $setToken()
        $msg_s(message)
        // 登录成功后，缓存账号信息
        localStorage.setItem('loginId',params.loginId)
        // 判断是否需要记住我
        if(ckMe){
            // 缓存密码，注意：密码是加密过后的
            localStorage.setItem('loginPwd',params.loginPwd)
        }
    }else{
        $msg_e(message)
    }
    return success
}

//          这里因为我没有加密，所以是可以的，但因为老师有加密，所以不行（P9:24分），因此多设计一个方法，不用加密的话可以不用定义
// 自动登录方法
export const loginAuto=async ()=>{
    // 从浏览器缓存中获取账号密码
    const loginId=localStorage.getItem('loginId')
    const loginPwd=localStorage.getItem('loginPwd')
    if(loginId && loginPwd){
        const params={
            loginId,
            loginPwd
        }
        const {success,token}=await $get('/Admin/Login',params)
        if(success){
            sessionStorage.setItem('token',token)
            // 将 token 信息设置为请求头内容
            $setToken()
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}

// 查询账户信息的方法
export const list=async (params)=>{
    let ret=await $get('Admin/List',params)
    return ret
}

// 添加账号信息的方法
export const add=async (params)=>{
    // 验证账户信息
    if(!params.loginId){
        $msg_e('请输入账号')
        return false
    }else if(!params.loginPwd){
        $msg_e('请输入密码')
        return false
    }else if(params.loginPwd.length<6){
        $msg_e('密码长度不能小于6位')
        return false
    }else if(params.loginPwd!=params.loginPwd2){
        $msg_e('两次密码不一致')
        return false
    }else if(!params.name){
        $msg_e('请输入名字')
        return false
    }else if(!params.phone){
        $msg_e('请输入电话')
        return false
    }else if(!(/^1\d{10}/.test(params.phone))){
        $msg_e('电话格式错误')
        return false
    }else if(params.roleId==0){
        $msg_e('请选择角色')
        return false
    }

    // 对密码进行加密
    // params.loginPwd=md5(md5(params.loginPwd).split('').reverse().join())

    const {success,message}=await $post('/Admin/Add',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 修改账户信息的方法
export const update=async (params)=>{
    // 验证账户信息
    if(!params.name){
        $msg_e('请输入名字')
        return false
    }else if(!params.phone){
        $msg_e('请输入电话')
        return false
    }else if(!(/^1\d{10}/.test(params.phone))){
        $msg_e('电话格式错误')
        return false
    }else if(params.roleId==0){
        $msg_e('请选择角色')
        return false
    }

    const {success,message}=await $post('/Admin/Update',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 删除账户信息的方法
export const del=async (params)=>{
    // 提示是否确定删除
    await $confirm('是否确定删除')
    const {success,message}=await $post('/Admin/Delete',params)
    // console.log(params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}

// 根据账号返回一个账户对象的方法
export const getOne=async (params)=>{
    const r=await $get('/Admin/GetOne',params)
    return r
}

// 修改密码的方法
export const resetPwd=async (params)=>{
    // 验证密码信息
    if(!params.oldLoginPwd){
        $msg_e('请输入原始密码')
        return false
    }else if(!params.newLoginPwd){
        $msg_e('请输入最新密码')
        return false
    }else if(params.newLoginPwd.length<6){
        $msg_e('密码长度不能小于6位')
        return false
    }else if(params.newLoginPwd!==params.newLoginPwd2){
        $msg_e('两次密码输入不一致')
        return false
    }
    
    // 对密码进行加密
    // params.oldLoginPwd=md5(md5(params.oldLoginId).split('').reverse().join(''))
    // params.newLoginPwd=md5(md5(params.newLoginId).split('').reverse().join(''))

    const {success,message}=await $post('/Admin/ResetPwd',params)
    if(success){
        $msg_s(message)
    }else{
        $msg_e(message)
    }
    return success
}