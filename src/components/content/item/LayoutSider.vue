<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKeys"
            @select="changeContent"
            mode="inline"
            style="height: 100%"
    >
      <a-menu-item key="1">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp我的图表</span>
        <router-link to="/bi/content/my-chart"/>
      </a-menu-item>
      <a-menu-item key="2">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp创建图表</span>
        <router-link to="/bi/content/gen-chart"/>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, onMounted } from "vue";

let selectedKeys = ref(['1']);

// 初始化时从localStorage读取selectedKey
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedKey");
  if (storedSelectedKey) {
    selectedKeys.value = [storedSelectedKey];
  }
});

const changeContent = (info) => {
  selectedKeys.value = [info.key];
  // 选项改变时更新localStorage
  localStorage.setItem("selectedKey", info.key);
};
</script>

<style scoped>

</style>