<template>
    <!-- 搜索区域 -->
    <div class="search">
        <el-button
            type="primary"
            size="small" 
            @click="openDrawer=true"
        >添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table size="small" :data="tableData" style="width: 99%">
        <el-table-column prop="roleId" label="角色编号" width="180" />
        <el-table-column prop="roleName" label="角色名称" width="180" />
        <el-table-column label="操作">
        <template #default="scope">
            <el-button
                type="warning"
                size="small" 
                @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 抽屉区域 size属性默认为 30% ，可以不加-->
    <el-drawer
        v-model="openDrawer"
        :title="isAdd?'添加角色':'修改角色'"
        direction="rtl"
        size="30%"
        :before-close="drawerClose"
    >
        <div class="edititem">
            <span>角色名称：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.roleName" 
                placeholder="请输入角色名称" 
            /></div>
        </div>
        <div class="edititem">
            <span></span>
            <el-button
                type="primary"
                size="small" 
                @click="editForm"
            >{{isAdd?'添加':'修改'}}</el-button>
            <el-button
                type="default"
                size="small" 
                @click="clearFormData"
            >取消</el-button>
        </div>
    </el-drawer>
</template>

<script>
    import {reactive,toRefs} from 'vue'
    // 导入操作角色的 API 方法
    import {list,add,update,del} from '../../api/role'

    export default {
        name:'Role',
        setup() {
            // 定义数据
            const data=reactive({
                // 表格数据
                tableData:[],
                // 是否打开抽屉
                openDrawer:false,
                // 是否是添加操作
                isAdd:true,
                // 表单数据
                formData:{
                    // 角色名称
                    roleName:''
                }
            })

            // 加载表格数据的方法
            const loadTable=async ()=>{
                const result=await list()
                data.tableData=result
            }
            // 执行加载表格数据的方法
            loadTable()

            // 编辑表单的方法
            const editForm=async ()=>{
                let r=false
                // 判断是执行添加还是修改
                if(data.isAdd){
                    r=await add(data.formData)
                }else{
                    r=await update(data.formData)
                }
                // 如果执行成功
                if(r){
                    // 刷新表格信息
                    loadTable()

                    // 自己加的调用关闭抽屉事件
                    drawerClose()
                }
            }

            //  清空表单数据的方法
            const clearFormData=()=>{
                // 清空表单数据
                data.formData={
                    roleName:''
                }
            }

            // 关闭抽屉事件
            const drawerClose=()=>{
                // 关闭抽屉
                data.openDrawer=false
                data.isAdd=true
                // 调用清空表单数据
                clearFormData()
            }

            // 执行修改的方法
            const handleEdit=(row)=>{
                // 获取当前角色信息，并赋值给表单数据
                data.formData={...row}
                // 设置为修改操作
                data.isAdd=false
                // 打开抽屉
                data.openDrawer=true
            }

            // 执行删除的方法
            const handleDelete=async (row)=>{
                // 获取角色编号
                let {roleId}=row
                const r=await del({roleId})
                // 如果删除成功
                if(r){
                    // 刷新表格信息
                    loadTable()
                }
            }

            return {
                ...toRefs(data),
                editForm,
                drawerClose,
                handleEdit,
                handleDelete,
                clearFormData
            }
        }
    }
</script>

<style lang='scss' scoped>
    
</style>