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
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <br>
            <a-form-item label="分析目标">
              <a-textarea v-model:value="formState.goal" />
            </a-form-item>
            <br>
            <a-form-item label="图表类型" name="region" style="text-align: left" >
              <a-select v-model:value="formState.chartType" placeholder="选择您想要生成的图表类型">
                <a-select-option value="line">线型图</a-select-option>
                <a-select-option value="bar">柱状图</a-select-option>
              </a-select>
            </a-form-item>
            <br>
            <!--上传文件组件-->
            <a-form-item label="上传文件">
              <a-upload :beforeUpload="beforeUpload">
                <a-button style="margin-left: -245px">
                  <CloudUploadOutlined/> 上传CSV文件
                </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item style="margin-left: -215px" :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onSubmit">提交</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="suggestion">
          这是建议部分
        </div>
      </a-col>
      <a-col :span="16">
        <div class="echarts">
          <h1>分析结论</h1>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {reactive, ref, toRaw} from 'vue';
import bgImage from '@/assets/z1.jpg';
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
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

const formState = reactive({
  name: '',
  goal: '',
  chartType: '',
});
const uploadedFile = ref(null); // 用于存储上传的文件
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('goal', formState.goal);
  formData.append('chartType', formState.chartType);

  // 添加上传的文件
  if (uploadedFile.value) {
    formData.append('file', uploadedFile.value);
  }
  myAxios.post('/api/v1/chart/gen-chart',formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    if (resp.data.code===0) {
      message.success("上传成功！正在解析中…………")
      // todo 将信息分给右侧去生成对应的信息
    }else {
      message.error(resp.data.msg)
    }
  })
};
const beforeUpload = (file) => {
  uploadedFile.value = file;
  return false;
};
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
  background-color: rgba(255,255,255,.75);
}
.echarts {
  width: 1250px;
  height: 900px;
  margin-left: 100px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255,255,255,.75);
}
.suggestion {
  width: 700px;
  height: 352px;
  margin-left: 100px;
  margin-top: 50px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255,255,255,.75);
}
</style>
