<template>
  <div :style="bgStyle" style="height: 1120px;padding: 20px">
    <h1 style="font-size: 50px;color: #00a6bc">欢迎来到BI图表生成工具</h1>
    <a-row style="margin-top: 60px">
      <a-col :span="8">
        <div class="upload">
          <h1>智能分析</h1>
          <br>
          <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="表名">
              <a-input v-model:value="formState.name"/>
            </a-form-item>
            <br>
            <a-form-item label="分析目标">
              <a-textarea v-model:value="formState.goal"/>
            </a-form-item>
            <br>
            <a-form-item label="图表类型" name="region" style="text-align: left">
              <a-select v-model:value="formState.chartType" placeholder="选择您想要生成的图表类型">
                <a-select-option value="线型图">线型图</a-select-option>
                <a-select-option value="柱状图">柱状图</a-select-option>
                <a-select-option value="雷达图">雷达图</a-select-option>
              </a-select>
            </a-form-item>
            <br>
            <!--上传文件组件-->
            <a-form-item label="上传文件">
              <a-upload :beforeUpload="beforeUpload">
                <a-button style="margin-left: -245px">
                  <CloudUploadOutlined/>
                  上传CSV文件
                </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item style="margin-left: -215px" :wrapper-col="{ span: 14, offset: 4 }">
              <a-button :loading="btnLoading" type="primary" @click="onSubmit">提交</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="suggestion">
          <div v-if="echartsInfo.suggestion.length === 0">
            <h1 v-if="!isActive" style="float: left;margin-bottom: 20px;color: #ff003e">请先提交生成数据哦</h1>
            <h1 v-if="isActive" style="float: left;margin-bottom: 20px;color: #00c2fd">正在生成数据，请耐心等待…………</h1>
            <a-skeleton :active="isActive"/>
            <br>
            <a-skeleton :active="isActive"/>
          </div>
          <div v-if="echartsInfo.suggestion.length !== 0" class="sub">
            {{ echartsInfo.suggestion }}
          </div>
        </div>
      </a-col>
      <a-col :span="16">
        <div id="echarts" v-show="echartsInfo.echarts.length !== 0">
        </div>
        <div id="skeleton-echarts" v-if="echartsInfo.echarts.length === 0">
          <h1 v-if="!isActive" style="float: left;margin-bottom: 20px;color: #ff003e">请先提交生成数据哦</h1>
          <h1 v-if="isActive" style="float: left;margin-bottom: 20px;color: #00c2fd">正在生成数据，请耐心等待…………</h1>
          <a-skeleton :active="isActive"/>
          <br/>
          <a-skeleton :active="isActive"/>
          <br/>
          <a-skeleton :active="isActive"/>
          <br/>
          <a-skeleton :active="isActive"/>
          <br/>
          <a-skeleton :active="isActive"/>
          <br/>
          <a-skeleton :active="isActive"/>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, toRaw} from 'vue';
import bgImage from '@/assets/z1.jpg';
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import * as echarts from 'echarts';
// ----------------------------------------------------------------------
const bgStyle = ref(`background-image: url('${bgImage}');`);
const labelCol = {
  style: {
    width: '150px',
  },
};
const wrapperCol = {
  span: 14,
};
let btnLoading = ref(false)
let isActive = ref(false)

const formState = reactive({
  name: '',
  goal: '',
  chartType: '',
});

let echartsInfo = reactive({
  echarts: '',
  suggestion: '',
})
let myChart;

onMounted(() => {
  // 通过 nextTick 确保 DOM 更新完成
  nextTick(() => {
    const element = document.getElementById('echarts');
    if (element) {
      myChart = echarts.init(element);
      if (myChart && echartsInfo.echarts) {
        const option = JSON.parse(echartsInfo.echarts);
        myChart.setOption(option);  // 确保 myChart 和 option 都是有效的
      }
    }
  });
})
const uploadedFile = ref(null); // 用于存储上传的文件
/**
 * 提交方法给AI分析并获得返回值展示页面
 */
const onSubmit = () => {
  isActive.value = true
  btnLoading.value = true
  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('goal', formState.goal);
  formData.append('chartType', formState.chartType);
  message.success("小的正在努力请稍等哦")
  // 添加上传的文件
  if (uploadedFile.value) {
    formData.append('file', uploadedFile.value);
  }
  myAxios.post('/api/v1/chart/gen-chart', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    if (resp.data.code === 0) {
      message.success("上传成功！正在解析中…………")
      echartsInfo = resp.data.data
      // echartsInfo.echarts = echartsInfo.echarts.replace(/'/g, '"').replace(/([{,])\s*([^:{\s]+)\s*:/g, '$1"$2":');
      console.log('echartsInfo::',echartsInfo)
      if (myChart && echartsInfo.echarts) {
        const option = echartsInfo.echarts; // 或者其他转换逻辑
        myChart.setOption(option);
      }
    } else {
      message.error(resp.data.msg)
    }
    isActive.value = false
    btnLoading.value = false
  })
};
/**
 * 阻断文件上传
 * @param file
 * @returns {boolean}
 */
const beforeUpload = (file) => {
  uploadedFile.value = file;
  return false;
};
// const optionString = '{"title": {"text": "ECharts 示例"}, "tooltip": {}, "legend": {"data":["销量"]}, "xAxis": {"data": ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]}, "yAxis": {}, "series": [{"name": "销量","type": "bar","data": [5, 20, 36, 10, 10, 20]}]}';
// const str = '{"title":{"text":"用户增长情况","subtext":""},"tooltip":{},"radar":{"indicator":[{"name":"1号","max":2000},{"name":"2号","max":2000},{"name":"3号","max":2000},{"name":"4号","max":2000},]},"series":[{"name":"用户增长情况","type":"radar","data":[{"value":[200,"300",2000,100],"name":"人数"}]}]}'
</script>

<style scoped>
.upload {
  width: 700px;
  height: 500px;
  margin-left: 100px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
}

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

#skeleton-echarts {
  width: 1250px;
  height: 900px;
  margin-left: 100px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
}

.suggestion {
  float: left;
  width: 700px;
  height: 352px;
  margin-left: 100px;
  margin-top: 50px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
  white-space: pre-line;
  text-align: left;
  overflow: hidden;
}

.sub {
  float: left;
  width: 650px;
  height: 302px;
  overflow: hidden;
  font-size: 24px;
  /*当文字的长度超过了div的长度就换行*/
  overflow-wrap: break-word;
}
</style>
