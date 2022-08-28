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
        <el-table-column prop="roomTypeId" label="类型编号" width="100" />
        <el-table-column prop="roomTypeName" label="类型名称" width="120" />
        <el-table-column prop="roomTypePrice" label="类型价格" width="100" />
        <el-table-column prop="bedNum" label="床位数" width="100" />
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
        :title="isAdd?'添加房型':'修改房型'"
        direction="rtl"
        size="40%"
        :before-close="drawerClose"
    >
        <div class="edititem">
            <span>房型名称：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.roomTypeName" 
                placeholder="请输入房型名称" 
            /></div>
        </div>
        <div class="edititem">
            <span>房型价格：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.roomTypePrice" 
                placeholder="请输入房型价格" 
            /></div>
        </div>
        <div class="edititem">
            <span>床位数量：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.bedNum" 
                placeholder="请输入床位数量" 
            /></div>
        </div>
        <div class="edititem">
            <span>房型描述：</span>
            <div>
                <QuillEditor 
                    v-if="openDrawer"
                    v-model:content="formData.typeDescription" 
                    contentType="html"
                    theme="snow" 
                    style="height:300px" 
                />
            </div>
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
    import { reactive,toRefs } from 'vue'
    // 导入操作房间类型的 API 方法
    import { list,add,update,del } from '../../api/roomType'

    export default {
        name:'RoomType',
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
                    roomTypeName:'',
                    typeDescription:'',
                    roomTypePrice:'',
                    bedNum:''
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
                    // console.log(data.formData)
                    r=await add(data.formData)
                    if(r){
                        // 添加成功后，调用清空表单数据的方法
                        clearFormData()
                    }
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
                    roomTypeName:'',
                    typeDescription:'',
                    roomTypePrice:'',
                    bedNum:''
                }
                // 清空富文本框编辑器上的内容
                document.querySelector('.ql-editor').innerHTML=''
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
                // 获取当前房型信息，并赋值给表单数据
                data.formData={...row}
                console.log(data.formData)
                // 设置为修改操作
                data.isAdd=false
                // 打开抽屉
                data.openDrawer=true
            }

            // 执行删除的方法
            const handleDelete=async (row)=>{
                // 获取房间类型编号
                let { roomTypeId }=row
                const r=await del({ roomTypeId })
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

<style>

</style>