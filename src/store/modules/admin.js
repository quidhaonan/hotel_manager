// 当前登录账户信息模块

export default {
    namespaced:true,
    state:{
        // 用于保存当前登录账户信息
        admin:{
            name:'管理员',
            role:{}
        }
    },
    getters:{

    },
    mutations:{
        setAdmin(state,val){
            state.admin=val
        }
    },
    actions:{
        setAdmin(content,val){
            content.commit('setAdmin',val)
        }
    }
}