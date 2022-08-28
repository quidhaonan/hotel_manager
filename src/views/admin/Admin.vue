<template>
    <!-- 搜索区域 -->
    <div class="search">
        <span>角色：</span>
        <el-select size="small" v-model="roleId" class="m-2">
            <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
            />
        </el-select>
        <el-button
            type="success"
            size="small" 
            @click="loadTable"
        >查询</el-button>
        <el-button
            type="primary"
            size="small" 
            @click="openDrawer=true"
        >添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table size="small" :data="tableData" style="width: 99%">
        <el-table-column prop="id" label="编号" width="100" />
        <el-table-column prop="loginId" label="账号" width="100" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column label="头像">
            <template #default="scope">
                <el-image 
                    style="width: 60px; height: 60px" 
                    :src="admin_photo_base_url+(scope.row.photo || 'default.png')" 
                    fit="cover" 
                />
            </template>
        </el-table-column>
        <!-- <el-table-column prop="photo" label="头像" width="100" /> -->
        <el-table-column prop="roleName" label="角色" width="100" />
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
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination 
            background layout="prev, pager, next" 
            v-model:current-page="pageIndex"
            :page-size="pagSize"
            :total="total" 
        />
    </div>
    <!-- 抽屉区域 size属性默认为 30% ，可以不加-->
    <el-drawer
        v-model="openDrawer"
        :title="isAdd?'添加账户':'修改账户'"
        direction="rtl"
        size="30%"
        :before-close="drawerClose"
    >
        <div class="edititem">
            <span>头像：</span>
            <div>
                <el-upload
                    class="avatar-uploader"
                    :action="admin_upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="formData.photo" :src="admin_photo_base_url+formData.photo" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </div>
        </div>
        <div class="edititem" v-if="isAdd">
            <span>账号：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.loginId" 
                placeholder="请输入账号" 
            /></div>
        </div>
        <div class="edititem">
            <span>姓名：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.name" 
                placeholder="请输入姓名" 
            /></div>
        </div>
        <div class="edititem" v-if="isAdd">
            <span>密码：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                type="password"
                v-model="formData.loginPwd" 
                placeholder="请输入密码" 
            /></div>
        </div>
        <div class="edititem" v-if="isAdd">
            <span>确认密码：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                type="password"
                v-model="formData.loginPwd2" 
                placeholder="请输入确认密码" 
            /></div>
        </div>
        <div class="edititem">
            <span>电话：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.phone" 
                placeholder="请输入电话" 
            /></div>
        </div>
        <div class="edititem">
            <span>角色：</span>
            <div>
                <el-select size="small" v-model="formData.roleId" class="m-2">
                    <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    />
                </el-select>
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
    // 导入组合式 API
    import {reactive,toRefs,watch} from 'vue'
    // 导入 API 方法
    import {list,add,update,del} from '../../api/admin'
    // 导入角色的 API 方法
    import {list as roleList} from '../../api/role'
    // 导入图标 因为自动引入，所以用不着
    // import {Plus} from '@element-plus/icons-vue'
    // 导入上传头像地址 和 查看头像地址
    import {admin_upload_url,admin_photo_base_url} from '../../config/conster'
    // 导入弹框
    import {$msg_e} from '../../utils/msg'

    export default {
        name:'Admin',
        // component:{
        //     Plus
        // },
        setup() {
            // 定义数据
            const data=reactive({
                // 表格数据
                tableData:[],
                // 角色数组
                roleList:[],
                // 角色编号（用于搜索）
                roleId:0,
                // 当前页码
                pageIndex:1,
                // 每页数量
                pagSize:6,
                // 总数量
                total:0,
                // 是否打开抽屉
                openDrawer:false,
                // 是否是添加操作
                isAdd:true,
                // 表单数据
                formData:{
                    loginId:'',
                    // 密码
                    loginPwd:'',
                    // 确认密码
                    loginPwd2:'',
                    name:'',
                    phone:'',
                    roleId:0,
                    photo:''
                },
                // 上传账户头像的地址
                admin_upload_url,
                // 查看账户头像地址
                admin_photo_base_url,
            })

            // 加载角色数组方法
            const loadRoleList=async ()=>{
                // 返回所有角色信息
                let r=await roleList()
                // 在角色信息数组开头处添加一条角色信息
                r.unshift({roleId:0,roleName:'请选择角色'})
                data.roleList=r
            }
            // 调用加载角色数组的方法
            loadRoleList()

            // 加载表格数据的方法
            const loadTable=async ()=>{
                // 查询条件
                const params={
                    roleId:data.roleId,
                    pageIndex:data.pageIndex,
                    pageSize:data.pagSize
                }
                // console.log(params)
                // 获取查询结果
                const {count,data:adminData}=await list(params)
                data.tableData=adminData
                data.total=count
                // console.log(adminData)
            }
            // 执行加载表格数据的方法
            loadTable()

            // 监听当前页是否发生变化
            watch(()=>data.pageIndex,()=>{
                // 重新加载表格数据
                loadTable()
            })

            // 头像上传成功调用的函数
            const handleAvatarSuccess=(res)=>{
                // console.log(res)
                let {filename,success}=res
                if(success){
                    // 获取上传到服务器上的图片的名称
                    data.formData.photo=  filename
                    // console.log(data.imageUrl)
                }
                // this.imageUrl=URL.createObjectURL(file.raw)
            }
            // 头像上传之前调用的函数
            const beforeAvatarUpload=(file)=>{
                // console.log(111111111111)
                // console.log(file)
                // 定义图片格式
                const imgTypes=['image/jpeg','image/png','image/gif']
                // 上传的文件必须是指定的图片的格式
                const isJPG=imgTypes.includes(file.type)
                // 上传图片的大小必须小于2MB
                const isLt2M=file.size/1024/1024<2

                // 判断是不是图片格式
                if(!isJPG){
                    // this.$message.error('Avatar picture must be JPG format!')
                    $msg_e('请选择正确的图片格式')
                }
                // 判断文件大小是不是小于2MB
                if(!isLt2M){
                    // this.$message.error('Avatar picture size can not exceed 2MB!')
                    $msg_e('图片大小不能超过2MB')
                }
                return isJPG && isLt2M
            }

            // 编辑表单的方法
            const editForm=async ()=>{
                let r=false
                // 判断是执行添加还是修改
                if(data.isAdd){
                    r=await add(data.formData)
                    if(r){
                        // 清空表单数据
                        clearFormData()
                    }
                }else{
                    r=await update(data.formData)
                }
                // 如果执行成功
                if(r){
                    // 刷新表格信息
                    loadTable()

                    // 自己加的调用关闭抽屉事件，因为老师自己封装了一个 clearFormData 方法，所以此
                    // 页面中不再需要
                    // drawerClose()
                }
            }

            // 清空表单数据的方法
            const clearFormData=()=>{
                // 清空表单数据
                data.formData={
                    loginId:'',
                    // 密码
                    loginPwd:'',
                    // 确认密码
                    loginPwd2:'',
                    name:'',
                    phone:'',
                    roleId:0,
                    photo:''
                }
            }

            // 关闭抽屉事件
            const drawerClose=()=>{
                // 关闭抽屉
                data.openDrawer=false
                data.isAdd=true
                // 清空表单数据
                clearFormData()
            }

            // 执行修改的方法
            const handleEdit=(row)=>{
                // 获取当前账户信息，并赋值给表单数据
                data.formData={...row}
                // 设置为修改操作
                data.isAdd=false
                // 打开抽屉
                data.openDrawer=true
            }

            // 执行删除的方法
            const handleDelete=async (row)=>{
                // 获取角色编号
                let {id}=row
                const r=await del({id})
                // 如果删除成功
                if(r){
                    // 刷新表格信息
                    loadTable()
                }
            }

            return {
                ...toRefs(data),
                loadTable,
                handleAvatarSuccess,
                beforeAvatarUpload,
                drawerClose,
                editForm,
                handleEdit,
                handleDelete,
                clearFormData
            }
        }
    }
</script>

<style lang='scss' scoped>
    .avatar-uploader {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        width: 178px;
        height: 178px;
    }

    .avatar-uploader:hover {
        border-color:  var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }

    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>