<template>
  <div :style="bgStyle" style="height: 1120px;position:relative">
    <div style="padding: 20px;opacity: .7">
      <a-row :gutter="16">
        <a-col :span="8" style="margin-bottom: 20px">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false" hoverable>
            <p>card content</p>
          </a-card>
        </a-col>
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

const bgStyle = ref(`background-image: url('${bgImage}');`);
// let currentPage = ref(2);
// let itemsPerPage = ref(6);
// let totalItems = ref(0);
// let name = ref("");
const chartVO = reactive({
  currentPage: 1,
  itemsPerPage: 6,
  totalItems: 0,
  name: name,
})

let chartList = ref([]);


onMounted(() => {
  loadCharts()
})

const loadCharts = () => {
  myAxios.post('/api/v1/chart/get-chart', chartVO).then(resp => {
    console.log("resp:::", resp.data.data)
    if (resp.data.code === 0) {
      chartList.value = resp.data.data.list // 将图列表信息赋值
      chartVO.totalItems = resp.data.data.totalItems // 将图表信息赋值
      console.log("chartList.value::", chartList.value)
      console.log("totalItems::", chartVO.totalItems)
    }else {
      message.error(resp.data.msg)
    }
  })
}

const handlePageChange = () => {

}

</script>

<style scoped>
.pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>