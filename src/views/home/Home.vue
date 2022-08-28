<template>
   <div class="home">
        <div class="box" ref="box1"></div>
        <div class="box" ref="box2"></div>
        <div class="box" ref="box3"></div>
        <div class="box" ref="box4"></div>
   </div>
</template>

<script>
    import * as echarts from 'echarts'
    import { getCurrentInstance, reactive, onBeforeMount, watch } from 'vue';
    import { totalTypePrice } from '../../api/roomType'

    export default {
        name:'Home',
        setup() {
            // 获取当前实例
            const $this=getCurrentInstance()
            // 定义数据
            const data=reactive({
                // 定义 echarts 实例
                myChart:{},
                // 每种房型的销售额数组
                totalTypePriceList:[]
            })

            window.onresize = function() {
                data.myChart.resize();
            };

            // 加载每种房型的销售额数组的方法
            const loadTotalTypePriceList=async ()=>{
                const ret=await totalTypePrice()
                data.totalTypePriceList=ret
            }

            // 页面挂载之前
            onBeforeMount(()=>{
                loadTotalTypePriceList()
            })

            
            watch(()=>data.totalTypePriceList,()=>{
                // 基于准备好的dom，初始化 echarts 实例
                data.myChart=echarts.init($this.refs.box1)

                // 绘制图表
                data.myChart.setOption({
                    title: {
                        text: '房型累计销售额'
                    },
                    tooltip: {},
                    xAxis: {
                        data: data.totalTypePriceList.map(item=>{
                            return item.roomTypeName
                        })
                    },
                    yAxis: {},
                    series: [
                        {
                        name: '销量',
                        type: 'bar',
                        data: data.totalTypePriceList.map(item=>{
                            return item.totalMoney
                        })
                        }
                    ]
                });
            })
        }
    }
</script>

<style lang="scss" scoped>
    .home{
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
    }

    .box{
        width: 49%;
        height: 49%;
        border: 1px solid #ddd;
    }
</style>