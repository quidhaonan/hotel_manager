<template>
    <div class="box">
        <div class="edititem">
            <span>原始密码：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                type="password"
                v-model="oldLoginPwd"
                placeholder="请输入原始密码" 
            /></div>
        </div>
        <div class="edititem">
            <span>最新密码：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                type="password"
                v-model="newLoginPwd"
                placeholder="请输入最新密码" 
            /></div>
        </div>
        <div class="edititem">
            <span>确认密码：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                type="password"
                v-model="newLoginPwd2"
                placeholder="请输入密码" 
            /></div>
        </div>
        <div class="edititem">
            <span></span>
            <el-button type="primary" size="small" @click="editForm">修改</el-button>
            <el-button type="default" size="small" @click="clearFormData">取消</el-button>
        </div>
    </div>
</template>

<script>
    // 导入组合式 API
    import {reactive,toRefs} from 'vue'
    // 导入 API 方法
    import {resetPwd} from '../../api/admin'
    // 导入全局状态管理
    import {useStore} from 'vuex'

    export default {
        name: "ResetPwd",
        setup() {
            // 导入全局状态管理
            const store=useStore()

            const data=reactive({
                oldLoginPwd:'',
                newLoginPwd:'',
                newLoginPwd2:''
            })

            // 清空表单数据的方法
            const clearFormData=()=>{
                data.oldLoginPwd='',
                data.newLoginPwd='',
                data.newLoginPwd2=''
            }
            
            const editForm=async ()=>{
                // 获取当前登录账户的 id 信息
                data.id=store.state.admin.admin.id
                // await resetPwd(data)

                // 自己添加的修改成功后自动清空表单的功能
                const success=await resetPwd(data)
                // console.log(success)
                if(success){
                    clearFormData()
                }
            }
            

            return {
                ...toRefs(data),
                clearFormData,
                editForm
            }
        }
    };
</script>

<style lang='scss' scoped>
    .box{
        width: 400px;
    }
</style>
