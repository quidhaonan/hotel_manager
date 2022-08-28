// 主题模块

export default {
    namespaced:true,
    state: {
        // 定义所有的主题色
        colors:[
            {
                name:'蓝色主题',
                color:'#101f30'
            },
            {
                name:'绿色主题',
                color:'#497568'
            },
            {
                name:'红色主题',
                color:'#481e1c'
            },
            {
                name:'黑色主题',
                color:'#000000'
            },
            {
                name:'灰色主题',
                color:'#545c64'
            }
        ],
        // 当前主题色
        currentThemeColor:{
            name:'蓝色主题',
            color:'#101f30'
        }
    },
    getters: {
        // 返回主题色的名字数组
        getColorNames(state){
            return state.colors
        }
    },
    mutations: {
        // 更新当前主题色的方法
        updateCurrentThemeColor(state,val){
            state.currentThemeColor.color=val
        }
    },
    actions: {
        // 更新当前主题色的方法
        updateCurrentThemeColor(content,val){
            content.commit('updateCurrentThemeColor',val)
        }
    },
    modules: {
    }
}