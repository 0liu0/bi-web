<template>
  <a-layout-content :style="bgStyle" style="height: 1120px;padding: 20px">
    <a-layout style="padding: 24px 0;border-radius: 30px;height: 100%;background-color: transparent;">
      <div style="text-align: left;margin:50px"><h1 style="font-size: 40px;font-weight: 700">
        {{ userInfo.name }}的个人中心：</h1></div>
      <a-row>
        <a-col :span="12">
          <div class="user-info-container" style="background-color:#fff;opacity: .9">
            <h1 style="margin-bottom: 30px;font-size: 30px">用户个人信息</h1>
            <div v-if="editing">
              <a-input addon-before="用户昵称" :value="editableInfo.name" @input="editableInfo.name = $event.target.value" size="large" style="margin-bottom: 20px"/>
              <a-input addon-before="用户签名" :value="editableInfo.slogan" @input="editableInfo.slogan = $event.target.value" v-model="editableInfo.slogan" size="large"/>
              <button @click="saveChanges" class="button-save" style="margin-right: 20px">Save</button>
              <button @click="cancelEdit" class="button-cancel">Cancel</button>
            </div>
            <div v-else>
              <a-upload
                  v-model:file-list="fileList"
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  action="http://127.0.0.1:8000/api/v1/file/upload/head-img"
                  :before-upload="beforeUpload"
                  @change="handleChange"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <p class="user-name"><h1 class="h">用户昵称：</h1>{{ userInfo.name }}</p>
              <hr>
              <p class="user-email"><h1 class="h">用户邮箱：</h1>{{ userInfo.mail }}</p>
              <hr>
              <p class="user-slogan"><h1 class="h">用户签名：</h1>{{ userInfo.slogan }}</p>
              <hr>
              <p class="user-points"><h1 class="h">BI豆数量：</h1>{{ userInfo.points }}</p>
              <hr>
              <p class="user-create-time"><h1 class="h">加入时间：</h1>{{ formatDate(userInfo.createTime) }}</p>
              <hr>
              <button @click="startEdit" class="button-edit">编辑</button>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="user-info-container" style="background-color:#fff;opacity: .9">
            <h1 style="font-size: 40px;font-weight: 700;margin-bottom: 30px">我的特权</h1>
            <p class="privilege"><span>BI豆：</span>{{ userInfo.points }}
              <a-button style="margin-left: 20px" type="primary" size="small" primary @click="getPoints">每日领取
              </a-button>
            </p>
            <p class="privilege"><span>身份：</span>{{ userInfo.points }}
              <a-button style="margin-left: 20px" type="primary" size="small" primary @click="getVIP">获取会员
              </a-button>
            </p>
          </div>
        </a-col>
      </a-row>
    </a-layout>
  </a-layout-content>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import bgImage from "@/assets/z1.jpg";
import store from "@/store";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
const bgStyle = ref(`background-image: url('${bgImage}');`);

const userInfo = ref({
  createTime: "2023-09-04T04:44:30.000+00:00",
  headImg: "https://liucheoss.oss-cn-zhangjiakou.aliyuncs.com/2023/07/23/38f20270b7d04878b06082855bd4bf2dikun.jpg",
  id: 3,
  mail: "706716852@qq.com",
  name: "liuche",
  points: 0,
  sex: 1,
  slogan: "人生需要动态规划，",
  token: "liuche-bieyJhbGciOiJIUzI1NiJ9..."
});

onMounted(()=>{
  userInfo.value = store.state.user
  editableInfo.value = store.state.user
  imageUrl.value = store.state.user.headImg
})

const editableInfo = ref({});

const editing = ref(false);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fileList = ref([]);
const loading = ref(false);
const imageUrl = ref('');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const startEdit = () => {
  editableInfo.value = {...userInfo.value};
  editing.value = true;
  console.log("userInfo.value:",userInfo.value)
};

const saveChanges = () => {
  // TODO: Save the changes to the backend.
  userInfo.value = editableInfo.value;
  editing.value = false;
  console.log("editableInfo",editableInfo.value)
};

const cancelEdit = () => {
  editing.value = false;
};
const getPoints = () => {
  console.log("每日领取")
}
const getVIP = () => {
  console.log("获取会员")
}
const handleChange = info => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, base64Url => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
};
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
</script>

<style scoped>
.user-info-container {
  width: 90%;
  margin: auto;
  text-align: center;
  background-color: #f2f2f2;
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 12px #ccc;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}


.user-email,
.user-slogan,
.user-points,
.user-name,
.user-create-time {
  font-size: 14px;
  margin-top: 15px;
  font-weight: 700;
}

input {
  display: block;
  margin: 10px auto;

}

.button-edit,
.button-save,
.button-cancel {
  font-size: 18px; /* Increase font size */
  padding: 10px 30px; /* Increase padding */
  margin-top: 15px; /* Increase margin */
  background-color: #00c2fd; /* Green background */
  color: white; /* White text */
  border: none; /* Remove border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease; /* Transition */
}

.button-edit:hover {
  background-color: #45a049; /* Darker green on hover */
}

.h {
  display: inline;
  float: left;
  font-weight: 700;
  font-size: 20px;
}

hr {
  margin-bottom: 30px;
}

.privilege {
  text-align: left;
  font-size: 16px;
  margin-bottom: 10px;
}

.privilege span {
  font-weight: 700;
}
</style>
