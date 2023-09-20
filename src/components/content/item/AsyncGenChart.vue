<template>
  <div :style="bgStyle" style="height: 1120px;padding: 20px">
    <h1 style="font-size: 50px;color: #00a6bc">欢迎来到BI图表生成工具</h1>
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
    <contextHolder />
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import bgImage from "@/assets/z1.jpg";
import {message} from "ant-design-vue";
import myAxios from "@/utils/myAxios";
import { notification } from 'ant-design-vue';
import store from "@/store";

const bgStyle = ref(`background-image: url('${bgImage}');`);
let btnLoading = ref(false)
let isActive = ref(false)

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
const beforeUpload = (file) => {
  uploadedFile.value = file;
  return false;
};
const onSubmit = () => {
  isActive.value = true
  btnLoading.value = true
  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('goal', formState.goal);
  formData.append('chartType', formState.chartType);
  message.success("小的正在努力请稍等哦")
  // 开启一个定时任务，将提交接口置灰3秒钟，防止用户瞎点把自己豆子点没了，毕竟一天三个豆

  // 添加上传的文件
  if (uploadedFile.value) {
    formData.append('file', uploadedFile.value);
  }
  myAxios.post('/api/v1/chart/fast/gen-chart', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    if (resp.data.code === 0 && resp.data.data) {
      message.success("上传成功！正在解析中…………")
      open(`hello${store.state.user.name}`);
    } else {
      message.error(resp.data.msg)
    }
    isActive.value = false
    btnLoading.value = false
  })
};
// 通知提醒框
const [api, contextHolder] = notification.useNotification();
const open = placement => openNotification(placement);
const openNotification = placement => {
  api.info({
    message: `${placement}`,
    description:
        '小的正在解析您的文件哦，不要急！',
    // placement,
  });
};
</script>

<style scoped>
.upload {
  width: 700px;
  height: 500px;
  margin-left: 32%;
  margin-top: 150px;
  border-color: #3399ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, .75);
}
</style>