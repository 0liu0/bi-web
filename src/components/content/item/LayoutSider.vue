<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKeys"
            @select="changeContent"
            mode="inline"
            style="height: 100%"
    >
      <a-menu-item key="1" @click="navigateTo('/bi/content/my-chart')">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp我的图表</span>
      </a-menu-item>
      <a-menu-item key="2" @click="navigateTo('/bi/content/gen-chart')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp创建图表</span>
      </a-menu-item>
      <a-menu-item key="3" @click="navigateTo('/bi/content/async-gen-chart')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp快速生成</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";

const arr = ['/bi/content/my-chart','/bi/content/gen-chart','/bi/content/async-gen-chart']
let selectedKeys = ref(['1']);
const router = useRouter();

const navigateTo = (route) => {
  router.push(route);
};

// 初始化时从localStorage读取selectedKey
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedKey");
  if (storedSelectedKey) {
    selectedKeys.value = [storedSelectedKey];
    navigateTo(arr[storedSelectedKey - 1])
  } else {
    const index = selectedKeys.value[0] - 1
    navigateTo(arr[index])
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