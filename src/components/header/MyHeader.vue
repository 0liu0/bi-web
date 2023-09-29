<template>
  <a-layout-header class="header">
    <div class="logo">
      <h1>欢迎来到BI</h1>
    </div>
    <div class="userInfo">
      <!--      <h1>nihao a</h1>-->
      <a-dropdown>
        <a class="ant-dropdown-link" style="color: white;" @click.prevent>
          <img style="margin-right: 10px;margin-bottom: 20px; border-radius: 25px;width: 25px;vertical-align: bottom;" :src="store.state.user.headImg"  alt="你好啊"/>{{ store.state.user.name }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="/bi/user">用户信息</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="loginOut">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="1">
        <router-link to="/bi/content">首页</router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/bi/about">关于我们</router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <router-link to="/bi/user">用户中心</router-link>
      </a-menu-item>
      <a-menu-item v-if="store.state.user.role===0 || store.state.user.role===1" key="4">
        <router-link to="/bi/admin">管理菜单</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script setup>
import store from "../../store";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import router from "@/router";

const loginOut = () => {
  console.log("layout")
  myAxios.get("/api/v1/user/layout").then((resp) => {
    const data = resp.data;
    if (data.code === 0) {
      store.commit("setUserToSessionStorage", {}); // 从本地上删除user上次登录的信息
      message.success("退出登录成功!");
      router.replace("/login")
    }
  });
}
</script>

<style scoped>
.userInfo {
  color: white;
  float: right;
}

</style>