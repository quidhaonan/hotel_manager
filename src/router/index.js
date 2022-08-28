import { createRouter, createWebHashHistory } from 'vue-router'

// 定义路由信息的数组
const routes = [
  // 首页
  {
    path:'/',
    name:'Index',
    // 配置路由元信息
    meta:{
      title:'酒店管理系统'
    },
    component:()=>import('../views/Index.vue')
  },
  // 登录页
  {
    path:'/login',
    name:'Login',
    // 配置路由元信息
    meta:{ title:'登录页' },
    component:()=>import('../views/Login.vue')
  },
  // 布局页
  {
    path:'/layout',
    name:'Layout',
    // 配置路由元信息
    meta:{ title:'酒店管理系统' },
    component:()=>import('../views/Layout.vue'),
    // 二级路由
    children:[
      // 首页
      {
        path:'',
        name:'Home',
        // 配置路由元信息
        meta:{ title:'首页' },
        component:()=>import('../views/home/Home.vue')
      },
      // 邮件
      {
        path:'email',
        name:'Email',
        // 配置路由元信息
        meta:{ title:'邮件' },
        component:()=>import('../views/home/Email.vue')
      },
      // 消息
      {
        path:'message',
        name:'Message',
        // 配置路由元信息
        meta:{ title:'消息' },
        component:()=>import('../views/home/Message.vue')
      },
      // 个人中心
      {
        path:'mine',
        name:'Mine',
        // 配置路由元信息
        meta:{ title:'个人中心' },
        component:()=>import('../views/admin/Mine.vue')
      },
      // 修改密码
      {
        path:'resetPwd',
        name:'ResetPwd',
        // 配置路由元信息
        meta:{ title:'修改密码' },
        component:()=>import('../views/admin/ResetPwd.vue')
      },
      // 角色管理
      {
        path:'role',
        name:'Role',
        // 配置路由元信息
        meta:{
          title:'角色管理',
          // 设置该路由的权限
          role:[1]
        },
        component:()=>import('../views/role/Role.vue')
      },
      // 账号管理
      {
        path:'admin',
        name:'Admin',
        // 配置路由元信息
        meta:{ title:'账户管理' },
        component:()=>import('../views/admin/Admin.vue')
      },
      // 客房类型管理
      {
        path:'roomType',
        name:'RoomType',
        // 配置路由元信息
        meta:{
          title:'客房类型管理',
          // 设置该路由的权限
          role:[1]
        },
        component:()=>import('../views/roomType/RoomType.vue')
      },
      // 客房管理
      {
        path:'room',
        name:'Room',
        // 配置路由元信息
        meta:{ title:'客房管理' },
        component:()=>import('../views/room/Room.vue')
      },
      // 顾客管理
      {
        path:'guest',
        name:'Guest',
        // 配置路由元信息
        meta:{ title:'顾客管理' },
        component:()=>import('../views/guest/Guest.vue')
      }
    ]
  },
  // 404 页面
  {
    path:'/:pathMatch(.*)*',
    name:'Error404',
    meta:{ title:'404' },
    component:()=>import('../views/Error404.vue')
  }
]

// 创建一个路由器的对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导入 nprogress
import NProgress from 'nprogress'
// 导入 nprogress 的样式
import 'nprogress/nprogress.css'

// 定义路由导航前置守卫
router.beforeEach((to,from,next)=>{
  // 开启进度条
  NProgress.start()

  // 获取当前登录用户的角色 id
  // const roleId=useStore()
  // console.log(roleId)
  // 判断权限
  // if(to.meta && to.meta.role && to.meta.role.includes())
  
  next()
})

// 定义路由导航后置守卫
router.afterEach((to)=>{
  // 判断路由元信息中，有没有配置标题信息，如果配置了，显示它里面配置的标题
  if(to.meta && to.meta.title){
    document.title=to.meta.title
  }
  // 关闭进度条
  NProgress.done()
})

export default router
