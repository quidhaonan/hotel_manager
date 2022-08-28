<template>
    <!-- 搜索区域 -->
    <div class="search">
        <span>房间类型：</span>
        <el-select size="small" v-model="roomTypeId" class="m-2">
            <el-option
            v-for="item in roomTypeList"
            :key="item.roomTypeId"
            :label="item.roomTypeName"
            :value="item.roomTypeId"
            />
        </el-select>
        <span>房间状态：</span>
        <el-select size="small" v-model="roomStateId" class="m-2">
            <el-option
            v-for="item in roomStateList"
            :key="item.roomStateId"
            :label="item.roomStateName"
            :value="item.roomStateId"
            />
        </el-select>
        <el-button
            type="success"
            size="small" 
            @click="loadTable"
        >查询</el-button>
        <el-button
            type="info"
            size="small" 
            @click="toExcel"
        >导出Excel</el-button>
        <el-button
            type="primary"
            size="small" 
            @click="openDrawer=true"
        >添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table size="small" :data="tableData" style="width: 99%">
        <el-table-column prop="roomId" label="房间号" width="100" />
        <el-table-column prop="roomTypeName" label="房间类型" width="120" />
        <el-table-column prop="roomTypePrice" label="房间价格" width="100" />
        <el-table-column prop="bedNum" label="床位数" width="100" />
        <el-table-column label="房间状态" width="100">
            <template #default="scope">
                <el-tag size="small" v-if="scope.row.roomStateId==1" class="ml-2" type="success">{{ scope.row.roomStateName }}</el-tag>
                <el-tag size="small" v-if="scope.row.roomStateId==2" class="ml-2" type="warning">{{ scope.row.roomStateName }}</el-tag>
                <el-tag size="small" v-if="scope.row.roomStateId==3" class="ml-2" type="danger">{{ scope.row.roomStateName }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
            <el-button
                type="primary"
                size="small" 
                @click="openDialog(scope.row)"
            >照片</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
                v-if="scope.row.roomStateId!=2"
                type="warning"
                size="small" 
                @click="handleEdit(scope.row)"
            >编辑</el-button>
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
        :title="isAdd?'添加房间':'修改房间'"
        direction="rtl"
        size="40%"
        :before-close="drawerClose"
    >
        <div class="edititem">
            <span>房间编号：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.roomId" 
                placeholder="请输入房型名称" 
            /></div>
        </div>
        <div class="edititem">
            <span>房间类型：</span>
            <div>
                <el-select size="small" v-model="formData.roomTypeId" class="m-2">
                    <el-option
                    v-for="item in roomTypeList"
                    :key="item.roomTypeId"
                    :label="item.roomTypeName"
                    :value="item.roomTypeId"
                    />
                </el-select>
            </div>
        </div>
        <div class="edititem">
            <span>房间状态：</span>
            <div>
                <el-select size="small" v-model="formData.roomStateId" class="m-2">
                    <el-option
                    v-for="item in roomStateList2"
                    :key="item.roomStateId"
                    :label="item.roomStateName"
                    :value="item.roomStateId"
                    />
                </el-select>
            </div>
        </div>
        <div class="edititem">
            <span>房间描述：</span>
            <div>
                <QuillEditor 
                    v-if="openDrawer"
                    v-model:content="formData.description" 
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
    <!-- 弹出层 -->
    <el-dialog
        v-model="dialogVisible"
        title="房间照片"
        width="60%"
    >
        <el-upload
            v-model:file-list="imgList"
            :action="room_upload_url"
            list-type="picture-card"
            :limit="9"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
            <el-icon><Plus /></el-icon>
        </el-upload>

        <!-- 这里加的 width 和 style 没有一点作用 -->
        <el-dialog v-model="dialogVisible2" width="50%" >
            <img style="width:100%" :src="dialogImgeUrl" alt="Preview Image" />
        </el-dialog>
    </el-dialog>
</template>

<script>
    // 导入组合式 API
    import { reactive,toRefs,watch } from 'vue'
    // 导入操作房间的 API 方法
    import { list,add,update,del } from '../../api/room'
    // 导入操作房间类型的 API 方法
    import { list as roomTypeList } from '../../api/roomType'
    // 导入操作房间状态的 API 方法
    import { list as roomStateList,listToUpdate as roomStateList2 } from '../../api/roomState'
    // 导入图标，因为是自动导入，因此不需要，同时省略了 注册 的环节
    // import { PLUS } from '@element-plus/icons-vue'
    // 导入上传和查看房间照片的地址
    import { room_upload_url,room_photo_base_url } from '../../config/conster'
    // 导入操作房间图片的 API 方法
    import { add as addRoomImg,list as roomImgList,del as delRoomImg } from '../../api/roomImg'
    // 导入 excel 方法
    import { xlsx } from '../../utils/xlsx'
    // 导入消息提示框
    import { $msg_e } from '../../utils/msg'


    export default {
        name:'Room',
        setup() {
            // 定义数据
            const data=reactive({
                // 表格数据
                tableData:[],
                // 房间类型编号（用于搜索）
                roomTypeId:0,
                // 房间状态编号（用于搜索）
                roomStateId:0,
                // 当前页码
                pageIndex:1,
                // 每页数量
                pagSize:10,
                // 总数量
                total:0,
                // 房间类型数组
                roomTypeList:[],
                // 房间状态数组（用于查询）
                roomStateList:[],
                // 房间状态数组（用于添加）
                roomStateList2:[],
                // 是否打开抽屉
                openDrawer:false,
                // 是否是添加操作
                isAdd:true,
                // 表单数据
                formData:{
                    roomId:'',
                    description:'',
                    roomStateId:0,
                    roomTypeId:0
                },
                // 是否显示弹出层
                dialogVisible:false,
                // 上传房间照片的地址
                room_upload_url,
                // 查看房间照片的地址
                room_photo_base_url,
                // 指定房间的图片列表
                imgList:[],
                // 是否显示大图弹出层
                dialogVisible2:false,
                // 大图地址
                dialogImgeUrl:''
            })

            // 加载房间状态的方法（用于添加）
            const loadRoomStateList2=async ()=>{
                const ret=await roomStateList2()
                ret.unshift({roomStateId:0,roomStateName:'请选择房间状态'})
                data.roomStateList2=ret
            }
            // 调用加载房间状态的方法（用于添加）
            loadRoomStateList2()

            // 加载房间状态的方法（用于查询）
            const loadRoomStateList=async ()=>{
                const ret=await roomStateList()
                ret.unshift({roomStateId:0,roomStateName:'请选择房间状态'})
                // console.log(ret)
                data.roomStateList=ret
            }
            // 调用加载房间状态的方法（用于查询）
            loadRoomStateList()

            // 加载房间类型的方法
            const loadroomTypeList=async ()=>{
                const ret=await roomTypeList()
                ret.unshift({roomTypeId:0,roomTypeName:'请选择房间类型'})
                data.roomTypeList=ret
            }
            // 调用加载房间类型的方法
            loadroomTypeList()

            // 加载表格数据的方法
            const loadTable=async ()=>{
                // 查询条件
                const params={
                    pageIndex:data.pageIndex,
                    pageSize:data.pagSize,
                    roomTypeId:data.roomTypeId,
                    roomStateId:data.roomStateId
                }

                // 获取查询结果
                const { data:roomData,count }=await list(params)
                // console.log(roomData)
                // 表格数据
                data.tableData=roomData
                // 总数量
                data.total=count
            }
            // 执行加载表格数据的方法
            loadTable()

            // 监听当前页码是否发生变化
            watch(()=>data.pageIndex,()=>{
                // 重新加载表格数据
                loadTable()
            })

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
                    console.log(data.formData)
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
                    roomId:'',
                    description:'',
                    roomStateId:0,
                    roomTypeId:0
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
                // 获取当前客房信息，并赋值给表单数据
                data.formData={...row}
                // 在表单数据数据中，添加 id 属性，备份房间号
                data.formData.id=row.roomId
                // console.log(data.formData)
                // 设置为修改操作
                data.isAdd=false
                // 打开抽屉
                data.openDrawer=true
            }

            // 执行删除的方法
            const handleDelete=async (row)=>{
                // 获取房间类型编号
                let { roomId }=row
                const r=await del({ roomId })
                // 如果删除成功
                if(r){
                    // 刷新表格信息
                    loadTable()
                }
            }

            // 定义当前房间编号
            let currentRoomId=''
            // 打开房间图片对话框的方法
            const openDialog=async (row)=>{
                // 获取房间号
                const { roomId }=row
                currentRoomId=roomId
                // 显示对话框
                data.dialogVisible=true
                // 根据房间号，查询该房间对应的所有图片
                let ret=await roomImgList(roomId)
                const imgList=ret.map(r=>{
                    return {
                        roomImgId:r.roomImgId,
                        name:r.imgUrl,
                        url:room_photo_base_url+'/'+r.imgUrl
                    }
                })
                data.imgList=imgList
            }

            // 上传成功调用的函数
            const handleAvatarSuccess=async (res)=>{
                // console.log(res)
                let {filename,success}=res
                if(success){
                    const params={
                        // 房间号
                        roomId:currentRoomId,
                        // 房间图片地址
                        imgUrl:filename
                    }
                    // 执行添加图片
                    await addRoomImg(params)
                    // console.log(data.imageUrl)
                }
                // this.imageUrl=URL.createObjectURL(file.raw)
            }
            // 上传之前调用的函数
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

            // 删除房间图片（此方法能接收两个参数）
            const handleRemove =async (file) => {
                // 获取图片 id
                const { roomImgId,name }=file
                // 删除指定的房间图片
                await delRoomImg({roomImgId,filename:name})

                // console.log(file)
                // console.log(fileList)
            }

            // 预览大图
            const handlePictureCardPreview = (uploadFile)=>  {
                // 设置大图地址
                // console.log(uploadFile.name)
                data.dialogImgeUrl=uploadFile.url
                // console.log(uploadFile.url)
                // console.log(data.dialogImgeUrl)
                // 显示大图对话框
                data.dialogVisible2=true
            }

            // 监听 dialogVisible
            watch(()=>data.dialogVisible,(val)=>{
                // 监听到关闭了对话框
                if(!val){
                    // 清空图片数组
                    data.imgList=[]
                }
            })

            // 导出 excel
            const toExcel=()=>{
                // console.log(data.tableData)
                // 组织导出数据的格式
                const excelData=data.tableData.map(item=>{
                    return {
                        roomId:item.roomId,
                        roomTypeName:item.roomTypeName,
                        roomTypePrice:item.roomTypePrice,
                        bedNum:item.bedNum,
                        roomStateName:item.roomStateName
                    }
                })
                // 表头信息
                const excelHeader={
                    roomId:'房间号',
                    roomTypeName:'房间类型',
                    roomTypePrice:'房间价格',
                    bedNum:'床位数',
                    roomStateName:'房间状态'
                }
                // 将数据导出成 excel 文件
                xlsx(excelData,excelHeader,'房间信息')
            }

            return {
                ...toRefs(data),
                loadTable,
                editForm,
                drawerClose,
                handleEdit,
                handleDelete,
                clearFormData,
                openDialog,
                beforeAvatarUpload,
                handleAvatarSuccess,
                handleRemove,
                handlePictureCardPreview,
                toExcel
            }
        }
    }
</script>

<style>

</style>