// 开发模式
let model={
    // 本机接口地址
    local:'http://localhost:8081',
    // 开发阶段接口地址
    dev:'http://bingjs.com:83',
    // 测试阶段接口地址
    test:'http://bingjs.com:84',
    // 发布阶段接口地址
    pro:'http://bingjs.com:85'
}

// 定义请求根路径
// 根据当前的开发阶段，返回对应的接口地址
export const BASE_URL=model.local

// 账户头像上传地址
export const admin_upload_url=BASE_URL+'/Admin/UploadImg'
// 查看账号头像地址
export const admin_photo_base_url=BASE_URL+'/upload/admin/'

// 房间照片上传地址
export const room_upload_url=BASE_URL+'/RoomImg/UploadImg'
// 查看房间照片地址
export const room_photo_base_url=BASE_URL+'/upload/room'