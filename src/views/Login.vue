<template>
  <div class="container">
      <div class="login">
          <div class="item">
              <h2>Bing酒店管理系统</h2>
          </div>
          <div class="item">
              <span>账号：</span>
              <div><el-input class="el_input" size="small" v-model="loginId" placeholder="请输入账号" /></div>
          </div>
          <div class="item">
              <span>密码：</span>
              <div><el-input class="el_input" type="password" size="small" v-model="loginPwd" placeholder="请输入密码" /></div>
          </div>
          <div class="item">
              <span>记住我：</span>
              <div @click="jizhuwo"><el-checkbox v-model="ckMe" size="large" /></div>
          </div>
          <div class="item">
              <span></span>
              <el-button size="small" type="primary" @click="adminLogin">登录</el-button>
              <el-button size="small">取消</el-button>
          </div>
      </div>
  </div>
</template>

<script>
    // 导入组合式 API
    import { reactive,toRefs,onBeforeMount } from 'vue';
    // 导航访问后台 API
    import {login,loginAuto} from '../api/admin'
    // 导入路由器对象
    import {useRouter} from 'vue-router'

    export default {
        name:'Login',
        setup() {
            // 获取当前项目中的路由器对象
            let $router=useRouter()

            // 定义登录数据
            let loginData=reactive({
                loginId:'',
                loginPwd:'',
                ckMe:false
            })

            // 定义管理员登录方法
            const adminLogin=async ()=>{
                // 调用登录 API，返回是否登录成功
                let success=await login(loginData)
                // 表示登录成功
                if(success){
                    // 跳转到布局页
                    $router.push('/layout')
                }
            }

            // 页面挂载之前
            onBeforeMount(async ()=>{
                // // 从浏览器缓存中获取账号密码
                // const loginId=localStorage.getItem('loginId')
                // const loginPwd=localStorage.getItem('loginPwd')
                // if(loginId && loginPwd){
                //     // //                      这里因为我没有加密，所以是可以的，但因为老师有加密，所以不行（P9:24分）
                //     // // 给登录数据重新赋值
                //     // loginData.loginId=loginId
                //     // loginData.loginPwd=loginPwd
                //     // loginData.ckMe=true
                //     // // 调用登录方法
                //     // adminLogin()
                // }

                if(await loginAuto()){
                    // 跳转到登录页
                    $router.push('/layout')
                }
            })

            // 返回数据
            return {
                ...toRefs(loginData),
                adminLogin,
            }
        }
    }
</script>

<style lang='scss' scoped>
    .container{
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to bottom,rgb(13,40,58),lightblue);
        display: flex;
        justify-content: center;
        align-items: center;
        .login{
            width: 400px;
            border:1px solid #eee;
            border-radius: 6px;
            color: #eee;
            padding: 10px;
            .item{
                display: flex;
                font-size: 14px;
                align-items: center;
                margin: 10px 0;
                h2{
                    flex: 1;
                    text-align: center;
                }
                span{
                    width: 60px;
                    text-align: right;
                }
                div{
                    flex: 1;
                }
            }
        }
    }
</style>



// adminLogin 函数那里，使用的是 let ，而我使用的是 const