<template>
  <div :style="bgStyle">
    <h1>这是生成图表内容</h1>
    <a-row>
      <a-col :span="8" style="">
        <h1>智能分析</h1>
        <br>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="表名">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="分析目标">
            <a-textarea v-model:value="formState.goal" />
          </a-form-item>
          <a-form-item label="图表类型" name="region">
            <a-select v-model:value="formState.chartType" placeholder="选择您想要生成的图表类型">
              <a-select-option value="line">线型图</a-select-option>
              <a-select-option value="bar">柱状图</a-select-option>
            </a-select>
          </a-form-item>
          <!--上传文件组件-->
          <a-form-item label="上传文件">
            <a-upload :beforeUpload="beforeUpload">
              <a-button style="margin-left: -242px">
                <a-icon type="upload" /> 点击上传
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item style="margin-left: -60px" :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">Create</a-button>
            <a-button style="margin-left: 10px">Cancel</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="16" style="background-color:#333;">
        <h1>分析结论</h1>
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
</style>
