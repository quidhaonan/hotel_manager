<template>
  <router-view/>
</template>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    outline: none;
  }

  // 搜索区域样式
  .search{
    padding-bottom: 6px;
    font-size: 14px;
    color:#666;
    display: flex;
    align-items: center;
    *{
      margin-right: 5px;
    }
  }
  // 分页区域样式
  .pagination{
    margin-top: 6px;
  }

  // 表单编辑项样式
  .edititem{
    display: flex;
    font-size: 14px;
    align-items: center;
    margin-bottom: 10px;
    &>span{
      width: 70px;
      text-align: right;
      // 会导致 账号管理->添加中的添加按钮文字变成灰色，加一个 &> 就不会了
      color: #666;
    }
    div{
      flex: 1;
    }
  }
</style>
