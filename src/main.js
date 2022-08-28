import { createApp } from 'vue'
import App from './App.vue'
// 导入当前项目的路由器对象
import router from './router'
// 导入当前项目的全局状态管理对象
import store from './store'
// 导入字体图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app=createApp(App)

// 使用字体图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 导入 vue-quill 富文本编辑器
import { QuillEditor } from '@vueup/vue-quill'
// 导入 vue-quill 富文本编辑器的样式
import '@vueup/vue-quill/dist/vue-quill.snow.css';
app.component('QuillEditor', QuillEditor)

// 导入 mockjs （后台接口没有做好之前，自己模拟数据；后台接口做好后，注释掉下面的一行代码）
// import './mock/index'

// 导入中文国际化
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import { ElementPlus } from 'element-plus'
// app.use(ElementPlus, {
//     locale: zhCn,
// })

app.use(store).use(router).mount('#app')
