import { createStore } from 'vuex'

// 导入颜色主题模块
import theme from './modules/theme'
// 导入当前登录账户模块
import admin from './modules/admin'

export default createStore({
  state:{
    // 测试
    // names:[
    //   {id:1,name:'zs'}
    // ]
  },
  getters:{
    // 测试
    // getName(state){
    //   return state.names
    // }
  },
  // 定义模块
  modules: {
    theme,
    admin
  }
})
