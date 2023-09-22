<template>
  <a-layout-content style="padding: 0 50px">
    <a-layout style="padding: 24px 0; background: #ffffff">
      <LayoutSider/>
      <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
        <router-view/>
<!--        <a-button type="primary" @click="send">nihao a</a-button>-->
      </a-layout-content>
    </a-layout>
  </a-layout-content>
</template>

<script setup>
import myAxios from "@/utils/myAxios";
import LayoutSider from "@/components/content/item/LayoutSider.vue";


const send = () => {
  myAxios.get("/api/v1/user/test").then(resp => {
    console.log("resp:::", resp)
  })
}
</script>

<style scoped>

</style>