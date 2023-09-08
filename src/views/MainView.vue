<template>
  <a-layout id="components-layout-demo-top-side">
    <MyHeader/>
    <router-view/>
    <MyFooter/>
  </a-layout>
</template>
<script setup>
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';
import store from "@/store";
import myAxios from "@/utils/myAxios";
import MyHeader from "@/components/header/MyHeader.vue"
import MyContent from "@/components/content/MyContent.vue";
import MyFooter from "@/components/footer/MyFooter.vue";

const send = ()=> {
  myAxios.get("/api/v1/user/test").then(resp => {
    console.log("resp:::",resp)
  })
}



</script>
<style>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  color: #00a6bc;
  margin-right: 80px;
  //background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>