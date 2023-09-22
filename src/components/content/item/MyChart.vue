<template>
  <div :style="bgStyle" style="height: 1120px;position:relative;align-content: center">
    <a-input-search
        v-model:value="chartVO.name"
        placeholder="请输入图表名称"
        enter-button="Search"
        size="large"
        :loading="loading"
        @search="onSearch"
        pressEnter="onSearch"
        :autosize=true
        class="search"
    />
    <a-button type="primary" size="large" style="position: absolute;top: 55px;right: 120px" @click="flush">点我刷新页面</a-button>
    <a-empty v-if="chartList.length===0" style="margin-top: 400px" description="暂无数据" />
    <div style="padding: 20px;opacity: .75">
      <a-row :gutter="16">
        <div class="echarts" v-for="item in chartList" :key="item.id">
          <a-col :span="8" style="margin-bottom: 20px">
            <MyEcharts :echarts_item="item"/>
          </a-col>
        </div>
      </a-row>
    </div>
    <div class="pagination">
      <a-pagination :current="chartVO.currentPage"
                    :total="chartVO.totalItems"
                    :pageSize="chartVO.itemsPerPage"
                    @change="handlePageChange"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import bgImage from "@/assets/z1.jpg";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import MyEcharts from "@/components/content/item/MyEcharts.vue";

const bgStyle = ref(`background-image: url('${bgImage}');`);
let loading = ref(false)
const chartVO = reactive({
  currentPage: 1,
  itemsPerPage: 6,
  totalItems: 0,
  name: "",
})

let chartList = ref([]);


onMounted(() => {
  loadCharts()
})

const loadCharts = () => {
  myAxios.post('/api/v1/chart/get-chart', chartVO).then(resp => {
    if (resp.data.code === 0) {
      chartList.value = [];  // 清空chartList来触发组件的更新
      setTimeout(() => {  // 添加延迟
        chartList.value = resp.data.data.list;
        chartVO.totalItems = resp.data.data.totalItems;
      }, 10);
    } else {
      message.error(resp.data.msg);
    }
  })
}


// 根据表的名称查询用户图表
const onSearch = () => {
  loading.value = true
  myAxios.post('/api/v1/chart/get-chart', chartVO).then(resp => {
    console.log("resp:::", resp.data.data)
    if (resp.data.code === 0) {
      chartList.value = resp.data.data.list // 将图列表信息赋值
      chartVO.totalItems = resp.data.data.totalItems // 将图表信息赋值
      console.log("chartList.value::", chartList.value)
      console.log("totalItems::", chartVO.totalItems)
    } else {
      message.error(resp.data.msg)
    }
    loading.value = false
  })
}

const handlePageChange = (newPage) => {
  chartVO.currentPage = newPage;
  myAxios.post('/api/v1/chart/get-chart', chartVO).then(resp => {
    console.log("resp:::", resp.data.data)
    if (resp.data.code === 0) {
      chartList.value = resp.data.data.list // 将图列表信息赋值
      chartVO.totalItems = resp.data.data.totalItems // 将图表信息赋值
      console.log("chartList.value::", chartList.value)
      console.log("totalItems::", chartVO.totalItems)
    } else {
      message.error(resp.data.msg)
    }
  })
}
const flush = () =>{
  loadCharts();
  message.success("刷新成功！")
}

</script>

<style scoped>
.pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
}
.echarts {
  align-content: center;
}
.search {
  width: 650px;
  margin: 50px 0 30px 0;
}
</style>