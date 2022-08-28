<template>
  Index
</template>

<script>
    import {onBeforeMount} from 'vue'
    // 导入路由器对象
    import {useRouter} from 'vue-router'
    // 导入访问后台 API
    import { loginAuto } from '../api/admin'

    export default {
        name:'Index',
        setup() {
          // 获取当前项目中的路由器对象
          const $router=useRouter()

          // 页面挂载之前
          onBeforeMount(async ()=>{
            if(await loginAuto()){
              // 跳转到布局页
              $router.push('/layout')
            }else{
              // 跳转到登录页
              $router.push('/login')
            }
          })
        }
    }
</script>

<style>

</style>