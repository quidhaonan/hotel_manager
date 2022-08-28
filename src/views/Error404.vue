<template>
  <div class="box">
      <img src="../assets/img/404.jpg" @click="$router.push('/')">
  </div>
</template>

<script>
    export default {
        name:'Error404'
    }
</script>

<style lang='scss' scoped>
    .box{
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items:center;
    }
</style>