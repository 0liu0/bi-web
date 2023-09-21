<template>
  <div class="two" @click="showChartInfo">
    <h3 class="info">表名：{{ props.echarts_item.name }}</h3>
    <div v-show="echarts_item.status===1" class="echarts" :id="`echarts-${props.echarts_item.id}`">
    </div>
    <div v-show="echarts_item.status===2" class="echarts">
      <a-skeleton/>
      <br/>
      <h1 class="up" style="margin-top: 40px;font-size: 25px;color: #ff003e;font-weight: 500;z-index: 100">生成失败</h1>
      <a-skeleton/>
      <br/>
      <a-skeleton/>
    </div>
    <div v-show="echarts_item.status===0" class="echarts">
      <a-skeleton :active="true"/>
      <br/>
      <div class="up">
        <a-spin size="large" class="custom-spin"/>
        <h1 style="font-size: 25px;color: #3399ff;font-weight: 500">正在生成……</h1>
      </div>
      <a-skeleton :active="true"/>
      <br/>
      <a-skeleton :active="true"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import * as echarts from "echarts";
import {Tool} from "@/utils/tool";
import router from "@/router";
// eslint-disable-next-line no-undef
const props = defineProps(['echarts_item'])

onMounted(() => {
  // 初始化图表
  const uniqueId = `echarts-${props.echarts_item.id}`;
  const myChart = echarts.init(document.getElementById(uniqueId));
  if (Tool.isNotEmpty(props.echarts_item.echarts)) {
    // 使用 JSON.parse 将字符串解析为对象
    const option = props.echarts_item.echarts;
    // 使用刚指定的配置项和数据显示图表
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
})

const showChartInfo = () => {
  console.log("跳转到图表详情页")
  router.push({name:'chart-info', params: {id:props.echarts_item.id}})
}
</script>

<style scoped>
.echarts {
  position: relative;
  width: 700px;
  height: 380px;
  border-color: #3399ff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
  transition: all .3s ease;
  overflow: hidden;
}

.info {
  text-align: center;
  background-color: #3399ff;
  width: 700px;
  height: 50px;
  font-size: 25px;
  line-height: 50px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transition: all .3s ease;
  opacity: .9;
}

.info:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  opacity: 1;
}

.echarts:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  opacity: 1;
}

.custom-spin >>> .ant-spin-dot {
  font-size: 50px;
}

.up {
  position: absolute;
  top: 40%;
  left: 40%;
}
</style>