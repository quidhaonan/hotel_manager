// 导入 Mock
import Mock from 'mockjs'
// 设置延迟时间
Mock.setup({
    timeout:400
})

// 随机生成数据
const { roleList }=Mock.mock({
    'roleList|2-10':[
        {
            'roleId|+1':1,
            roleName:'@ctitle(4,6)'
        }
    ]
})

// 定义一个接口，拦截指定的请求(此方法可接收一个参数)
Mock.mock(/Role\/List/,'get',()=>{
    return roleList
})

Mock.mock(/Role\/Add/,'post',(options)=>{
    // console.log(options)
    const { body }=options
    const obj=JSON.parse(body)
    obj.roleId=roleList.length+1
    roleList.push(obj)
    return {
        message:'添加成功',
        success:true
    }
})