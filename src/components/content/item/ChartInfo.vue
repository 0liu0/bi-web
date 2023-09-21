<template>
  <div :style="bgStyle" style="height: 1120px;padding: 20px">
    <a-row style="margin-top: 60px">
      <a-col :span="18">
        <div id="echarts_info">
        </div>
      </a-col>
      <a-col :span="6" style="font-size: 20px">
        <h1 style="text-align: left;margin-left: 45px;margin-top: 10px;font-weight: 700;font-size: 40px">小智建议：</h1>
        <div style="display: flex; margin-left: 50px;margin-top: 30px">
          <div>
            <img :src="xiaozhi"/>
          </div>
          <div style="padding: 10px;background-color: #3399ff;opacity: .8; border-radius: 20px;width: 300px;text-align: left">
            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{ echartsInfo.genResult}}
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "@/utils/myAxios";
import * as echarts from "echarts";
import router from "@/router";
import bgImage from "@/assets/z1.jpg";
import xiaozhi from "@/assets/xiaozhi.png";

const bgStyle = ref(`background-image: url('${bgImage}');`);
let echartsInfo = reactive({
  id: "",
  goal: "",
  echarts: "",
  name: "",
  chartType: "",
  genResult: "",
  genChart: "",
  status: ""
})
let myChart;
onMounted(() => {
  const route = useRoute();
  const chartId = route.params.id;
  const element = document.getElementById('echarts_info');
  myChart = echarts.init(element);
  myAxios.get(`/api/v1/chart/get-chart/${chartId}`).then(resp => {
    if (resp.data.code === 0) {
      Object.assign(echartsInfo, resp.data.data);
      myChart.setOption(echartsInfo.echarts);
    } else {
      router.back();
    }
  })
})
</script>

<style scoped>
#echarts_info {
  //width: 100%;
  height: 900px;
  margin-left: 100px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
}
</style>
