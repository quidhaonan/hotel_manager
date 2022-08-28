# hotel_manager

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 笔记
1.element-plus 中的 menu 菜单有一个 router 属性，开启后就不需要一个一个的绑定点击事件来进行路由切换
2.服务器接收 get 请求时，使用 request.query 就可以接收到，当使用表格发送 post 请求时，必须得使用
    const bodyParser = require('body-parser')
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    才能进行解析
3.export const xx=()=>{} 与 exports.xx=()=>{}
4.服务器中 router_handler 中的 Admin_handler 中的 list 方法使用了自己想的分页方法
5.服务器读取图片，需要用到 multer 中间件
6.上传的图片不能使用本地浏览器的地址（例如 d 盘什么的），得需要用服务器托管静态资源后进行访问
7.imageUrl 进行路径拼接的时候，如果没有添加服务器的地址，会将前端的地址进行拼接，
  例如：'upload/admin/'+imageUrl 会变成 'http://localhost:8080/upload/admin'+imageUrl
    因此，必须得这样子拼接 'http://localhost:8081/upload/admin/'+imageUrl
8.使用 vue-quill 的时候，打开关闭后上一次的数据还没有清空（类似于单项绑定，实际上却进行了双向绑定，当然，
  这是老师说的，说是一个 bug ），此时可以用 v-if 使用销毁机制来完成上一次数据的清空
9.使用 vue-quill 的时候，添加的时候点击取消出现将富文本编辑器上的内容清空，此时可以用原生 Dom 操作
10.第 20 集处的 25 分钟左右，分页首先要传给服务器 当前页码 和 每页总数 ，并且分页需要动态绑定，最终要的
   是要 监听当前页码的改变 ，否则不会有变化
11.useStore 和 useRoute 百度只能在 setup 中使用，实践出不能在 js 中使用

使用到的技术 nodejs express mysql vue flex布局 element-plus 路由 vuex core跨域 axios发送请求
  echarts画图 body-parser解析前端传过来的表格信息,此时就能request.body
  multer处理前端传过来的图片，此时就能request.files
# hotel_manager
