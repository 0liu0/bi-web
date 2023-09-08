<template>
  <a-layout-header class="header">
    <div class="logo">
      <h1>欢迎来到BI</h1>
    </div>
    <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="1"><router-link to="/bi/content">首页</router-link></a-menu-item>
      <a-menu-item key="2"><router-link to="/bi/about">关于我们</router-link></a-menu-item>
      <a-menu-item key="3"><router-link to="/bi/user">用户中心</router-link></a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script setup>

</script>

<style scoped>

</style>