<template>
  <div class="container">
      <div class="left" :style="{width:isCollapse?'65px':'200px',background:currentThemeColor}">
            <div class="logo">
                <div>{{!isCollapse?'Bing酒店管理系统':'Bing'}}</div>
            </div>
            <el-menu
                active-text-color="#ffd04b"
                :background-color="currentThemeColor"
                class="el-menu-vertical-demo"
                default-active="/layout/role"
                text-color="#fff"
                :collapse="isCollapse"
                router
            >
                <el-sub-menu index="1">
                <template #title>
                    <el-icon><Aim /></el-icon>
                    <span>账户管理</span>
                </template>
                    <el-menu-item index="/layout/role">角色管理</el-menu-item>
                    <el-menu-item index="/layout/admin">账户管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                <template #title>
                    <el-icon><add-location /></el-icon>
                    <span>客房管理</span>
                </template>
                    <el-menu-item index="/layout/roomType">类型管理</el-menu-item>
                    <el-menu-item index="/layout/room">客房管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                <template #title>
                    <el-icon><briefcase /></el-icon>
                    <span>顾客管理</span>
                </template>
                    <el-menu-item index="/layout/guest">顾客管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                <template #title>
                    <el-icon><cpu /></el-icon>
                    <span>权限管理</span>
                </template>
                    <el-menu-item index="4-1">权限管理</el-menu-item>
                </el-sub-menu>
            </el-menu>
      </div>
      <div class="right">
          <div class="top" :style="{background:currentThemeColor}">
            <div class="icon" @click="isCollapse=!isCollapse">
                <el-icon v-show="isCollapse"><fold /></el-icon>
                <el-icon v-show="!isCollapse"><expand /></el-icon>
            </div>
            <div class="menu">
                <el-menu
                    default-active="1"
                    class="el-menu-demo"
                    mode="horizontal"
                    :background-color="currentThemeColor"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item index="1" @click="$router.push('/layout')">
                        <el-icon><home-filled /></el-icon>
                        首页
                    </el-menu-item>
                    <el-menu-item index="2" @click="$router.push('/layout/email')">
                        <el-icon><message /></el-icon>
                        邮件
                    </el-menu-item>
                    <el-menu-item index="3" @click="$router.push('/layout/message')">
                        <el-icon><chat-dot-square /></el-icon>
                        消息
                    </el-menu-item>
                    <el-sub-menu index="4">
                    <template #title>
                        <el-icon><baseball /></el-icon>
                        切换皮肤
                    </template>
                    <el-menu-item
                        @click="changeTheme(index)"
                        :index="'4-'+(index+1)" 
                        v-for="(item,index) in getColorNames" 
                        :key="index"
                    >
                        {{item.name}}
                    </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="5">
                    <template #title>
                        <el-icon><avatar /></el-icon>
                        {{store.state.admin.admin.name}}
                    </template>
                    <el-menu-item index="5" @click="$router.push('/layout/mine')">个人中心</el-menu-item>
                    <el-menu-item index="5-2" @click="$router.push('/layout/resetPwd')">修改密码</el-menu-item>
                    <el-menu-item index="5-3" @click="exit">退出系统</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
          </div>
          <div class="bottom">
              <router-view></router-view>
          </div>
      </div>
  </div>
</template>

<script>
    // 导入组合式 API
    import { reactive, toRefs, computed, onMounted,onBeforeMount } from 'vue'
    // 导入全局状态管理对象
    import {useStore} from 'vuex'
    // 导入路由器对象
    import {useRouter} from 'vue-router'
    // 导入 API 方法
    import {getOne} from '../api/admin'

    export default {
        name:"Layout",
        setup() {
            // 返回一个全局状态管理对象
            const store=useStore()
            // 返回一个路由器对象
            const $router=useRouter()

            // 获取浏览器缓存中的颜色主题信息
            if(localStorage.getItem('color')){
                store._actions['theme/updateCurrentThemeColor'][0](localStorage.getItem('color'))
            }

            // 定义数据
            const data=reactive({
                // 左侧菜单是否折叠
                isCollapse:false
            })

            // 从全局状态里面获取颜色数组
            const getColorNames=computed(()=>{
                // 测试
                // return mapGetters(['getName']).getName.bind({ $store: store })
                // const result= mapGetters('theme',['getColorNames'])
                // return store.getters['theme/getColorNames']
                return store.getters['theme/getColorNames']
            })

            // 从当前状态里面获取当前主题色
            const currentThemeColor=computed(()=>{
                return store.state.theme.currentThemeColor.color
            })

            // 切换主题的方法
            const changeTheme=(index)=>{
                // 根据 index ，获取对应的颜色主题
                // console.log(store.state.theme.colors[index].color)
                const color=store.state.theme.colors[index].color
                // 将获取到的颜色主题，保存到浏览器的缓存中
                localStorage.setItem('color',color)

                // 然后将该主题颜色，赋值给当前颜色主题
                // console.log(store._actions['theme/updateCurrentThemeColor'])
                store._actions['theme/updateCurrentThemeColor'][0](color)
            }

            // 退出系统方法
            const exit=()=>{
                // 清除所有的浏览器缓存
                sessionStorage.clear(),
                localStorage.clear()
                // 跳转登录页
                $router.push('/login')
            }
                
            onMounted(()=>{
                // 测试
                // console.log(store.getters.getName[0].id)
                // console.log(store.getters['theme/getColorNames'])
                // console.log(getColorNames.value[0].name)
                // console.log(store.state.theme.currentThemeColor)
                // console.log(store.state.admin.admin.name)
            })

            // 页面挂载之前
            onBeforeMount(async ()=>{
                const token=sessionStorage.getItem('token')
                // 判断有无 token ，有 token ，才表示登录成功
                if(!token){
                    // 跳转到登录页
                    $router.push('/login')
                }

                // 获取登录账号
                const loginId=localStorage.getItem('loginId')
                const r=await getOne({loginId})
                // console.log(r)
                store.dispatch('admin/setAdmin',r)
            })

            return {
                ...toRefs(data),
                getColorNames,
                currentThemeColor,
                changeTheme,
                exit,
                store
            }
        }
    }
</script>

<style lang='scss' scoped>
    .container{
        width: 100vw;
        height: 100vh;
        display: flex;
        .left{
            transition: all 0.5s;
            .logo{
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                div{
                    color: white;
                    font-size: 18px;
                    border: 1px solid #eee;
                    padding: 4px 10px;
                    border-radius: 4px;
                    // 不收缩
                    flex-shrink: 0;
                }
            }
        }
        .right{
            flex: 1;
            display: flex;
            flex-direction: column;
            .top{
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .icon{
                    font-size: 20px;
                    color: white;
                    padding-left: 10px;
                }
                .menu{
                    width: 650px;
                }
            }
            .bottom{
                flex: 1;
                padding: 6px;
            }
        }
    }
</style>