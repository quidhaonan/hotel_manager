<template>
  <!-- 搜索区域 -->
    <div class="search">
        <span>顾客姓名：</span>
        <div style="width:200px">
            <el-input 
                class="el_input" 
                size="small" 
                v-model="guestName" 
                placeholder="请输入顾客姓名" 
            />
        </div>
        <span>结账状态：</span>
        <el-select size="small" v-model="resideStateId" class="m-2">
            <el-option
            v-for="item in resideStateList"
            :key="item.resideStateId"
            :label="item.resideStateName"
            :value="item.resideStateId"
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
        <el-table-column prop="guestId" label="编号" width="50" />
        <el-table-column prop="guestName" label="姓名" width="70" />
        <el-table-column prop="identityId" label="身份证" width="160" />
        <el-table-column prop="phone" label="电话" width="100" />
        <el-table-column prop="roomId" label="房间号" width="60" />
        <el-table-column prop="roomTypeName" label="房间类型" width="100" />
        <el-table-column prop="resideDate" label="入住日期" width="140" />
        <el-table-column prop="leaveDate" label="离开日期" width="140" />
        <el-table-column prop="deposit" label="押金" width="80" />
        <el-table-column prop="totalMoney" label="消费金额" width="80" />
        <el-table-column label="结账状态" width="100">
            <template #default="scope">
                <el-tag size="small" v-if="scope.row.resideStateId==2" class="ml-2" type="success">
                    {{ scope.row.resideStateName }}
                </el-tag>
                <el-tag size="small" v-if="scope.row.resideStateId==1" class="ml-2" type="danger">
                    {{ scope.row.resideStateName }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
            <el-button
                v-if="scope.row.resideStateId==1"
                type="warning"
                size="small" 
                @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
                v-if="scope.row.resideStateId==2"
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
                v-if="scope.row.resideStateId==1"
                type="primary"
                size="small" 
                @click="handleCheckout(scope.row)"
            >结账</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination 
            background layout="prev, pager, next" 
            v-model:current-page="pageIndex"
            :page-size="pageSize"
            :total="total" 
        />
    </div>
    <!-- 抽屉区域 size属性默认为 30% ，可以不加-->
    <el-drawer
        v-model="openDrawer"
        :title="isAdd?'添加顾客':'修改顾客'"
        direction="rtl"
        size="30%"
        :before-close="drawerClose"
    >
        <div class="edititem">
            <span>顾客姓名：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.guestName" 
                placeholder="请输入顾客姓名" 
            /></div>
        </div>
        <div class="edititem">
            <span>身份证号：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.identityId" 
                placeholder="请输入身份证号" 
            /></div>
        </div>
        <div class="edititem">
            <span>手机号：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model="formData.phone" 
                placeholder="请输入手机号" 
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
            <span>房间：</span>
            <div>
                <el-select size="small" v-model="formData.roomId" class="m-2">
                    <el-option
                    v-for="item in roomList"
                    :key="item.roomId"
                    :label="item.roomId"
                    :value="item.roomId"
                    />
                </el-select>
            </div>
        </div>
        <div class="edititem">
            <span>入住日期：</span>
            <div>
                <el-date-picker
                    value-format="YYYY/MM/DD HH:mm:ss"
                    size="small"
                    v-model="formData.resideDate"
                    type="datetime"
                    placeholder="请选择入住日期"
                />
            </div>
        </div>
        <div class="edititem">
            <span>押金：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model.number="formData.deposit" 
                placeholder="请输入押金" 
            /></div>
        </div>
        <div class="edititem">
            <span>入住人数：</span>
            <div><el-input 
                class="el_input" 
                size="small" 
                v-model.number="formData.guestNum" 
                placeholder="请输入入住人数" 
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
    import { reactive, toRefs, watch,nextTick } from 'vue';
    // 导入操作顾客信息的 API
    import { list,add,update,checkout,del } from '../../api/guest'
    // 导入操作结账状态信息的 API
    import { list as resideStateList } from '../../api/resideState'
    // 导入操作房间类型的 API 方法
    import { list as roomTypeList } from '../../api/roomType'
    // 导入操作房间的 API 方法
    import { list as roomList } from '../../api/room'
    // 导入消息框
    import { $msg_e } from '../../utils/msg'
    // 导入 excel 方法
    import { xlsx } from '../../utils/xlsx'


    export default {
        name:'Guest',
        setup() {
            // 定义数据
            const data=reactive({
                // 表格数据
                tableData:[],
                // 顾客姓名（查询条件）
                guestName:'',
                // 结账编号（查询条件）
                resideStateId:0,
                // 页码
                pageIndex:1,
                // 每页数量
                pageSize:10,
                // 总数量
                total:0,
                // 结账状态数组
                resideStateList:[],
                // 房间类型数组（用于添加）
                roomTypeList:[],
                // 房间数组（用于添加）
                roomList:[],
                // 是否打开抽屉
                openDrawer:false,
                // 是否是添加操作
                isAdd:true,
                // 表单数据
                formData:{
                    // 顾客编号
                    guestId:0,
                    identityId:'',
                    guestName:'',
                    phone:'',
                    roomTypeId:0,
                    roomId:'请选择房间',
                    resideDate:'',
                    deposit:'',
                    guestNum:''
                },
            })

            // 监听 roomTypeId 的值有没有发生变化
            watch(()=>data.formData.roomTypeId,(val)=>{
                // 清空表单上的房间号
                data.formData.roomId='请选择房间'
                if(val>0){
                    // 调用加载房间的方法
                    loadRoomList(val)
                }else{
                    data.roomList=[]
                }
            })

            // 加载房间的方法
            const loadRoomList=async (roomTypeId)=>{
                // 老师在前端应付分页，我在已经后端搞定了
                // const { data:ret }=await roomList({ roomTypeId,pageSize:100 })
                // roomTypeId   是房间类型编号
                // roomStateId  是房间状态编号
                // pageSize     是返回数量
                // guestId      是当前顾客编号
                const { data:ret }=await roomList({ roomTypeId,roomStateId:1,guestId:data.formData.guestId })
                data.roomList=ret
                console.log(data.roomList)
            }
            // loadRoomList(1)
            
            // 加载房间类型的方法
            const loadroomTypeList=async ()=>{
                const ret=await roomTypeList()
                // console.log(ret)
                ret.unshift({roomTypeId:0,roomTypeName:'请选择房间类型'})
                data.roomTypeList=ret
            }
            // 调用加载房间类型的方法
            loadroomTypeList()

            // 加载结账状态的方法
            const loadResideStateList=async ()=>{
                const ret=await resideStateList()
                ret.unshift({ resideStateId:0,resideStateName:'请选择结账状态' })
                data.resideStateList=ret
            }
            loadResideStateList()

            // 加载表格数据的方法
            const loadTable=async ()=>{
                // 查询条件
                const params={
                    pageIndex:data.pageIndex,
                    pageSize:data.pageSize,
                    guestName:data.guestName,
                    resideStateId:data.resideStateId
                }

                // 获取查询结果
                const { data:guestData,count }=await list(params)
                // console.log(guestData);
                // console.log(roomData)
                // 表格数据
                data.tableData=guestData
                // 总数量
                console.log(count)
                data.total=count
            }
            // 执行加载表格数据的方法
            loadTable()

            // 监听当前页码是否发生变化（做分页）
            watch(()=>data.pageIndex,()=>{
                // 重新加载表格信息
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
                    guestId:0,
                    identityId:'',
                    guestName:'',
                    phone:'',
                    roomTypeId:0,
                    roomId:'请选择房间',
                    resideDate:'',
                    deposit:'',
                    guestNum:''
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
                // 获取当前顾客信息，并赋值给表单数据
                data.formData={...row}
                // 给表单数据添加客房类型编号（此处不需要，这里有）
                // data.formData.roomTypeId=row.roomTypeId
                // DOM 更新完毕后，再执行里面的代码
                nextTick(()=>{
                    // 虽然早有这个属性，但是不重新加就不会刷新
                    // 给表单数据添加客房编号
                    data.formData.roomId=row.roomId
                })

                // 自己添加的用于保存可修改的唯一标识
                data.formData.backupIdentityId=data.formData.identityId

                // console.log(data.formData)
                // 设置为修改操作
                data.isAdd=false
                // 打开抽屉
                data.openDrawer=true
            }

            // 执行删除的方法
            const handleDelete=async (row)=>{
                // 获取顾客编号
                let { guestId }=row
                const r=await del({ guestId })
                // 如果删除成功
                if(r){
                    // 刷新表格信息
                    loadTable()
                }
            }

            // 执行结账的方法
            const handleCheckout=async (row)=>{
                console.log(row)
                // 获取顾客编号和入住日期 (多获取一个，容易实现联动效果，具体在 Guest_handler.js 中自己封装的 liandong 函数)
                const { guestId,resideDate,roomId }=row
                // 判断入住日期必须要小于当前日期
                if(new Date(resideDate)<Date.now()){
                    await checkout({ guestId,roomId })
                    // 刷新表格信息
                    loadTable()
                }else{
                    $msg_e('未到结账时间')
                }
            }

            // 导出 excel
            const toExcel=()=>{
                // console.log(data.tableData)
                // 组织导出数据的格式
                const excelData=data.tableData.map(item=>{
                    return {
                        guestId:item.guestId,
                        identityId:item.identityId,
                        guestName:item.guestName,
                        phone:item.phone,
                        roomTypeName:item.roomTypeName,
                        roomId:item.roomId,
                        resideDate:item.resideDate,
                        leaveDate:item.leaveDate,
                        deposit:item.deposit,
                        totalMoney:item.totalMoney,
                        resideStateName:item.resideStateName
                    }
                })
                // 表头信息
                const excelHeader={
                    guestId:'顾客编号',
                    identityId:'身份证号',
                    guestName:'顾客姓名',
                    phone:'手机号',
                    roomTypeName:'房间类型',
                    roomId:'房间号',
                    resideDate:'入住日期',
                    leaveDate:'离开日期',
                    deposit:'押金',
                    totalMoney:'消费金额',
                    resideStateName:'结账状态',
                }
                // 将数据导出成 excel 文件
                xlsx(excelData,excelHeader,'顾客信息')
            }

            return {
                ...toRefs(data),
                loadTable,
                editForm,
                drawerClose,
                handleEdit,
                handleDelete,
                clearFormData,
                handleCheckout,
                toExcel
            }
        }
    }
</script>

<style>

</style>