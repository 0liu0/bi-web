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
              <a-input addon-before="用户昵称" :value="editableInfo.name"
                       @input="editableInfo.name = $event.target.value" size="large" style="margin-bottom: 20px"/>
              <a-input addon-before="用户签名" :value="editableInfo.slogan"
                       @input="editableInfo.slogan = $event.target.value" v-model="editableInfo.slogan" size="large"/>
              <button @click="saveChanges" class="button-save" style="margin-right: 20px">Save</button>
              <button @click="cancelEdit" class="button-cancel">Cancel</button>
            </div>
            <div style="padding: 0 250px" v-else>
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 100px;height: 100px;border-radius: 50px"/>
              <div v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
              </div>
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
              <a-button style="margin-left: 20px" type="primary" size="small" primary @click="showModal">充值
              </a-button>
            </p>
            <p class="privilege"><span>身份：</span>{{ userRole }}
              <a-button style="margin-left: 20px" type="primary" size="small" primary @click="showModal">获取会员
              </a-button>
            </p>
            <p class="privilege">
              <a-button style="margin-top: 10px" type="primary" size="small" primary @click="changePWD">修改密码
              </a-button>
            </p>
          </div>
        </a-col>
      </a-row>
      <div>
        <a-modal v-model:open="open" title="当前功能尚未开发，请添加下方客服微信联系哦！" @ok="handleOk">
          <div><img src="@/assets/xiaozhi.png"><img style="width: 200px;height: 200px" src="@/assets/admin-weixin.jpg">
          </div>
        </a-modal>
      </div>
      <div>
        <a-modal v-model:open="showChangePwd" title="用户修改密码" @ok="handleChangePwd">
          <template #footer>
            <a-button key="back" @click="changeHandleCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="handleChangePwd">提交</a-button>
          </template>
          <a-form
              :model="userChangePwdForm"
              name="basic"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
          >
            <a-form-item
                label="新密码"
                name=newPWD
                :rules="[{ required: true, message: '请输入新密码！' }]"
                autocomplete="off"
            >
              <a-input-password v-model:value="userChangePwdForm.newPWD"/>
            </a-form-item>
            <a-form-item
                label="确认密码"
                name=confirmPWD
                :rules="[{ required: true, message: '确认密码不可空哦！' }]"
                autocomplete="off"
            >
              <a-input-password v-model:value="userChangePwdForm.confirmPWD"/>
            </a-form-item>
            <a-form-item
                label="邮箱验证"
                name=mailCode
                :rules="[{ required: true, message: '请输入邮箱验证码' }]"
                autocomplete="off"
            >
              <a-input-search
                  v-model:value="userChangePwdForm.mailCode"
                  placeholder="请输入邮箱验证码"
                  enter-button="发送验证码"
                  size="defualt"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout>
  </a-layout-content>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import bgImage from "@/assets/z1.jpg";
import store from "@/store";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";

const bgStyle = ref(`background-image: url('${bgImage}');`);
const open = ref(false);
const showChangePwd = ref(false);
let userChangePwdForm = reactive({
  "newPWD": "",
  "confirmPWD": "",
  "mailCode": null
})
const showModal = () => {
  open.value = true;
};
const handleOk = e => {
  console.log(e);
  open.value = false;
};
const userInfo = ref({
  createTime: "2023-09-04T04:44:30.000+00:00",
  headImg: "https://liucheoss.oss-cn-zhangjiakou.aliyuncs.com/2023/07/23/38f20270b7d04878b06082855bd4bf2dikun.jpg",
  id: 3,
  mail: "706716852@qq.com",
  name: "liuche",
  points: 0,
  sex: 1,
  slogan: "人生需要动态规划，",
  token: "liuche-bieyJhbGciOiJIUzI1NiJ9...",
  role: 2
});


const userRole = computed(() => {
  switch (userInfo.value.role) {
    case 0:
      return '超级管理员';
    case 1:
      return '管理员';
    case 2:
      return 'VIP用户';
    case 3:
      return '普通用户'
    default:
      return '未知';
  }
});

onMounted(() => {
  userInfo.value = store.state.user
  editableInfo.value = store.state.user
  imageUrl.value = store.state.user.headImg
})

const editableInfo = ref({});
const updateInfo = ref({});
const editing = ref(false);

const loading = ref(false);
const imageUrl = ref('');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const startEdit = () => {
  editableInfo.value = {...userInfo.value};
  editing.value = true;
  console.log("userInfo.value:", userInfo.value)
};

const saveChanges = () => {
  editing.value = false;
  updateInfo.value.name = userInfo.value.name;
  updateInfo.value.slogan = userInfo.value.slogan;
  myAxios.post("/api/v1/user/update", editableInfo.value).then(resp => {
    if (resp.data.code === 0 && resp.data.data) {
      userInfo.value = editableInfo.value;
      // 前端更新用户数据 todo
      store.commit("setUserToSessionStorage", userInfo.value)
      message.success("用户数据更改成功！")
    } else {
      message.warn("网络繁忙请稍后再试")
    }
  })
  console.log("editableInfo", editableInfo.value)
};

const cancelEdit = () => {
  editing.value = false;
};
const getPoints = () => {
  console.log("每日领取")
  myAxios.get("/api/v1/user/daily-claim").then(resp => {
    if (resp.data.code === 0 && resp.data.data) {
      message.success("领取成功！")
      refreshUserInfo()
    } else {
      message.warn("您已达每日领取最大次数！")
    }
  })
}

const refreshUserInfo = () => {
  myAxios.get("/api/v1/user/get/user-info").then(resp => {
    if (resp.data.code === 0) {
      // 得到用户最新数据，并保存至前端
      const curInfo = resp.data.data;
      curInfo.token = userInfo.value.token
      store.commit("setUserToSessionStorage", curInfo);
      userInfo.value = store.state.user
    } else {
      console.log("网络繁忙！")
    }
  })
}
// 更改密码
const changePWD = () => {
  console.log("changePWD")
  // 显示弹出层
  showChangePwd.value = true
}
const changeHandleCancel = () => {
  showChangePwd.value = false
}
const handleChangePwd = () => {
  console.log("已提交：", userChangePwdForm)
}
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
