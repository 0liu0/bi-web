<template>
  <a-layout-footer style="text-align: center">
    <h5>欢迎光临：{{store.state.user.name}} <img style="border-radius: 25px;width: 25px;vertical-align: bottom;" :src="store.state.user.headImg"></h5>
  </a-layout-footer>
</template>

<script setup>

import store from "@/store";
</script>

<style scoped>

</style>