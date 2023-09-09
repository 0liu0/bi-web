<template>
  <div id="echarts">
    <h1>分析结论</h1>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import * as echarts from "echarts";
import {Tool} from "@/utils/tool";
// eslint-disable-next-line no-undef
const props = defineProps(['echarts'])

onMounted(() => {
  // 初始化图表
  const myChart = echarts.init(document.getElementById('echarts'));
  // 响应式布局
  window.addEventListener('resize', function () {
    myChart.resize();
  });
  if (Tool.isNotEmpty(props.echarts)) {
    // 使用 JSON.parse 将字符串解析为对象
    const option = JSON.parse(props.echarts);
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  }
})
</script>

<style scoped>
#echarts {
  width: 1250px;
  height: 900px;
  margin-left: 100px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
}
</style>