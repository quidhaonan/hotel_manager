<template>
  <div class="box">
      <el-image 
        style="width: 220px; height: 300px" 
        :src="admin_photo_base_url+(store.state.admin.admin.photo || 'default.png')" 
        :fit="fill" 
      />
      <div class="content">
          <p>账号：{{store.state.admin.admin.loginId}}</p>
          <p>姓名：{{store.state.admin.admin.name}}</p>
          <p>电话：{{store.state.admin.admin.phone}}</p>
          <p>角色：{{store.state.admin.admin.roleName}}</p>
      </div>
  </div>
</template>

<script>
    // 导入路由器对象
    import {useStore} from 'vuex'
    // 导入头像地址
    import {admin_photo_base_url} from '../../config/conster'
    export default {
        name:'Mine',
        setup() {
          // 返回一个全局状态管理对象
          const store=useStore()

          return {
            store,
            admin_photo_base_url
          }
        }
    }
</script>

<style lang='scss' scoped>
  .box{
    display: flex;
    .content{
      margin-left: 10px;
      p{
        height: 40px;
      }
    }
  }
</style>