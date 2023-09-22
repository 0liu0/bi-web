<template>
  <a-layout id="components-layout-demo-top-side">
    <MyHeader/>
    <router-view/>
    <MyFooter/>
  </a-layout>
</template>
<script setup>
import MyHeader from "@/components/header/MyHeader.vue"
import MyFooter from "@/components/footer/MyFooter.vue"



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

#components-layout-demo-top-side {
  background: #d7e7f5;
}
</style>