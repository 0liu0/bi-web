<template>
  <div class="loginVideo">
    <img src="../assets/z1.jpg" alt="nihao" style="width: 100%; height: auto; display: block;">
    <div class="loginBox">
      <!-- 登录框 -->
      <div class="container">
        <div class="drop">
          <div class="content">
            <h2 :style="{ color: '#3399ff' }">BI智能系统</h2>
            <form>
              <div class="inputBox">
                <input type="text" v-model="userLogin.mail" placeholder="请输入邮箱账号"/>
              </div>
              <div v-if="userLogin.loginType===0" class="inputBox">
                <input type="password" v-model="userLogin.pwd" placeholder="请输入账号密码"/>
              </div>
              <div v-if="userLogin.loginType===1" class="inputBox" id="notify" style="width: 130px">
                <input type="text" v-model="mailCode" placeholder="邮箱验证码"/>
                <div>
                  <a-button ghost shape="round" size="large" style="margin-left: 12px;font-size: 6px;"
                            @click="sendCode">发送验证码
                  </a-button>
                </div>
              </div>
              <div v-if="userLogin.loginType===0" class="inputBox" id="notify">
                <input type="text" v-model="userLogin.code" placeholder="图形验证码"/>
                <img @click="getCaptcha()" :src="captcha" alt="nihao"
                     style="border-radius: 20px;width: 85%;margin-left: 10px"/>
              </div>
              <div class="liuche" style="justify-content: right">
                <a href="#">其他登录方式:账号密码</a>
              </div>
              <div class="registry" @click="registry" style="justify-content: right">
                <a href="#">点击注册</a>
              </div>
              <div class="inputBox" :style="{ margin: '0 auto' }">
                <input
                    :style="{ color: 'white' }"
                    type="button"
                    value="登录"
                    @click="login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import { useStore } from 'vuex'
// 这些参数在一个登录中不可能都会用到，但是够全了，以后整合其他登录再加
const userLogin = reactive({
  loginType: 0, // 登录类型：0->账号密码；1->邮箱验证，默认是密码方式，后续添加邮箱验证
  mail: "", // 邮箱
  pwd: "", // 密码
  code: "", // 图形验证码校验
  mailCode: "" // 邮箱验证码需要
})

const router = useRouter();
const store = useStore();
let mailCode = ref("")
let captcha = ref("");
onMounted(() => {
  getCaptcha()
})
// 获取验证码信息
const getCaptcha = () => {
  myAxios("/api/v1/notify/captcha/1", {
    method: "GET",
    responseType: 'blob'
  }).then(resp => {
    console.log("Captcha:", resp);
    // Check if resp.data is a Blob
    if (resp.data instanceof Blob) {
      const myBlob = new window.Blob([resp.data], {type: 'image/png'})
      captcha.value = window.URL.createObjectURL(myBlob)
    } else {
      console.error("Response data is not a Blob");
    }
  });
}


// 发送验证码
const sendCode = () => {
  myAxios.get('/api/v1/notify/send-code/1').then(resp => {
    console.log("resp:", resp)
  })
}

// 登录
function login() {
  myAxios.post("/api/v1/user/login", userLogin).then(resp => {
    if (resp.data.code===0) {
      message.success("恭喜您登录成功！")
      // 将用户信息保存到浏览器中
      store.commit("setUserToSessionStorage",resp.data.data)
      router.push("/bi/content");
    }else {
      message.error("登录失败：" + resp.data.msg)
      if (userLogin.loginType===0) {
        // 刷新验证码，防止失效
        getCaptcha()
      }
    }
  })
}

// 跳转至注册界面
const registry = () => {
  router.push('/registry')
}
</script>

<style scoped>
.loginVideo {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 验证码样式 */
.canvascs {
  width: 92px;
  height: 30px;
  border-radius: 5px;
  margin-top: 2px;
  background: white;
  margin-left: 5px;
}

#notify {
  display: flex;
  width: 130px;
}

#notify div {
  width: 96px;
  /* background: pink; */
}

#notify input {
  width: 100px;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.loginBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 登录框 */
.container .drop {
  position: relative;
  width: 400px;
  height: 400px;
  box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
  25px 35px 20px rgba(0, 0, 0, 0.05), 25px 30px 30px rgba(0, 0, 0, 0.05),
  inset -20px -20px 25px rgba(255, 255, 255, 0.9);
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.container .drop:hover {
  border-radius: 10%;
}

.container .drop::before {
  content: "";
  position: absolute;
  top: 50px;
  left: 85px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.2;
}

.container .drop::after {
  content: "";
  position: absolute;
  top: 90px;
  left: 110px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.8;
}

.container .drop .content {
  position: relative;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  text-align: center;
  padding: 40px;
  gap: 15px;
}

.container .drop .content h2 {
  position: relative;
  color: #333;
  font-size: 1.5em;
}

.container .drop .content form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  /* align-items: center; */
}

.container .drop .content form .inputBox {
  position: relative;
  width: 250px;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  inset -2px -5px 10px rgba(255, 255, 255, 1),
  15px 15px 10px rgba(0, 0, 0, 0.05), 15px 10px 15px rgba(0, 0, 0, 0.025);
  border-radius: 25px;
}


.container .drop .content .inputBox input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 1em;
  padding: 10px 15px;
}

.container .drop .content form .inputBox input[type="submit"] {
  color: #fff;
  text-transform: uppercase;
  font-size: 1em;
  cursor: pointer;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.container .drop .content form .inputBox:last-child {
  width: 120px;
  background: #3399ff;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  15px 15px 10px rgba(0, 0, 0, 0.05), 15px 10px 15px rgba(0, 0, 0, 0.025);
  transition: 0.5s;
}

.container .drop .content form .inputBox:last-child:hover {
  width: 150px;
}
</style>