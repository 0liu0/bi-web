<template>
  <div class="loginVideo">
    <img src="../assets/z1.jpg" alt="nihao" style="width: auto; height: 100%; display: block;">
    <div class="loginBox">
      <!-- 注册框 -->
      <div class="container">
        <div class="drop">
          <div class="content">
            <h2 :style="{ color: '#3399ff' }">BI智能系统</h2>
            <form>
              <div class="inputBox">
                <input type="text" v-model="userRegisterDTO.mail" placeholder="请输入邮箱账号"/>
              </div>
              <div class="inputBox">
                <input type="text" v-model="userRegisterDTO.name" placeholder="请输入账号昵称"/>
              </div>
              <div class="inputBox">
                <input type="text" v-model="userRegisterDTO.pwd" placeholder="请输入账号密码"/>
              </div>
              <div class="inputBox" id="notify">
                <input type="text" v-model="userRegisterDTO.codeCaptcha" placeholder="图形验证码"/>
                <img @click="getCaptcha()" :src="captcha" alt="nihao" style="border-radius: 20px;width: 85%;margin-left: 10px"/>
              </div>
              <div class="inputBox" id="notify" style="width: 130px">
                <input type="text" v-model="userRegisterDTO.code" placeholder="邮箱验证码"/>
                <div>
                  <a-button ghost shape="round" size="large" style="margin-left: 12px;font-size: 6px;"
                            @click="sendCode">发送验证码
                  </a-button>
                </div>
              </div>
              <div class="login" @click="login" style="justify-content: right">
                <a href="#">有账号，去登录</a>
              </div>
              <div class="inputBox" :style="{ margin: '0 auto' }">
                <input
                    :style="{ color: 'white' }"
                    type="button"
                    value="注册"
                    @click="registry"
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

const router = useRouter();
// 用户注册信息
let userRegisterDTO = reactive({
  mail: "",
  name: "",
  pwd: "",
  code: "",
  codeCaptcha: ""
})

let captcha = ref("");
onMounted(() => {
  getCaptcha()
})
const getCaptcha = () => {
  myAxios("/api/v1/notify/captcha/0", {
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
  myAxios.get('/api/v1/notify/send-code/0',{
    params: {
      to: userRegisterDTO.mail,
      captchaCode: userRegisterDTO.codeCaptcha
    }
  }).then(resp => {
    console.log("得到邮箱验证码了：", resp)
  })
}

// 转到登录
function login() {
  // 先验证用户输入的验证码
  router.push("/login");
}

// 注册
const registry = ()=> {
  console.log("userRegisterDTO:::",userRegisterDTO)
  myAxios.post('/api/v1/user/register',userRegisterDTO).then(resp=> {
    if (resp.data.code === 0) {
      // 先转去登录界面，后面优化成自动登录 todo
      message.success("注册成功！自动跳转登录界面")
      router.push("/login")
    }else {
      message.error(resp.data.msg)
    }
  })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.loginVideo {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
#notify {
  display: flex;
  width: 130px;
}

#notify div {
  width: 96px;
  //background: pink;
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
  width: 450px;
  height: 450px;
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

.btns {
  position: absolute;
  right: -120px;
  bottom: 0;
  width: 120px;
  height: 120px;
  background: #00a6bc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  line-height: 1.2em;
  letter-spacing: 0.1em;
  font-size: 0.8em;
  transition: 0.25s;
  text-align: center;
  box-shadow: inset 10px 10px 10px rgba(0, 166, 188, 0.05),
  15px 25px 10px rgba(0, 166, 188, 0.1), 15px 20px 20px rgba(0, 166, 188, 0.1),
  inset -10px -10px 15px rgba(0, 166, 188, 0.5);
  border-radius: 50%;
}

.btns::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 30px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.45;
}

.btns.signup {
  bottom: 150px;
  right: -120px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #00a6bc;
  box-shadow: inset 10px 10px 10px rgba(0, 166, 188, 0.05),
  15px 25px 10px rgba(0, 166, 188, 0.1), 15px 20px 20px rgba(0, 166, 188, 0.1),
  inset -10px -10px 15px rgba(0, 166, 188, 0.5);
}

.btns.signup::before {
  left: 20px;
  width: 15px;
  height: 15px;
}

.btns:hover {
  border-radius: 10%;
}
</style>