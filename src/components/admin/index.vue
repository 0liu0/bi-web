<template xmlns="">
  <!-- 搜索框部分 -->
  <a-space direction="vertical">
    <a-input-search
        v-model:value="searchValue"
        placeholder="input search text"
        size="large"
        @search="onSearch"
        class="search"
    >
      <template #enterButton>
        <a-button>Custom</a-button>
      </template>
    </a-input-search>
  </a-space>
  <!-- 用户列表主体部分 -->
  <a-table style="padding: 20px" :columns="columns" :data-source="userList" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          昵称
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'role'">
        <span>
          <a-tag
              :color="record.role > 1 ? 'geekblue' : 'green'"
          >
            {{ getTagChinese(record.role) }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-popconfirm title="确定要将此用户升级为会员吗？" @confirm="upgradeVIP(record.id)">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary">升级会员</a-button>
          </a-popconfirm>
          <a-button class="btn" type="primary" @click="rechargeBeans(record.id)">充值BI豆</a-button>
          <a-popconfirm title="确定要删除此用户吗？" @confirm="deleteUser(record.id)">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <div>
    <!--            <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>-->
    <a-modal v-model:open="open" title="充值BI豆" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">充值</a-button>
      </template>
      <div>
        <a-input-number id="inputNumber" v-model:value="rechargeNum" :min="10"/>
        当前值：{{ rechargeNum }}
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {message} from "ant-design-vue";
import myAxios from "@/utils/myAxios";

let cutUserId = ref(-1) // 当前用户ID，用户充值用户的BI豆
const searchValue = ref('');
let rechargeNum = ref(10);
const columns = [
  {
    name: '昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '邮箱账号',
    dataIndex: 'mail',
    key: 'mail',
  },
  {
    title: 'BI豆剩余',
    dataIndex: 'points',
    key: 'points',
  },
  {
    title: '用户角色',
    key: 'role',
    dataIndex: 'role',
  },
  {
    title: '操作',
    key: 'action',
  },
];
const userList = ref([
  {
    id: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tag: 0,
  },
])
const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
})
onMounted(() => {
  fetchData()
})
// 搜索
const onSearch = searchValue => {
  console.log('use value', searchValue);
  console.log('or use this.value', searchValue.value);
};
// 用户角色的转换
const getTagChinese = (tag) => {
  const tagMap = {
    0: '超级管理员',
    1: '管理员',
    2: 'VIP',
    3: '普通用户'
  };
  return tagMap[tag] || '未知';
}
// 分页相关操作
const handleTableChange = (newPagination) => {
  console.log("Changing page to", newPagination.current);
  // 更新当前页数
  pagination.current = newPagination.current;
  // 可选: 更新页面大小
  pagination.pageSize = newPagination.pageSize;
  // 重新请求数据
  fetchData();
}
const fetchData = () => {
  // 在这里发送 AJAX 请求来获取数据
  // 你需要使用 this.pagination.current 和 this.pagination.pageSize 来获取当前页的数据
  // 更新 this.userList 和 this.pagination.total
  // console.log("nihao a")
  myAxios.get(`/api/v1/admin/page/list-user?page=${pagination.current}&size=${pagination.pageSize}`)
      .then(resp => {
        if (resp.data.code === 0) {
          userList.value = resp.data.data.list;
          pagination.total = resp.data.data.total;
        } else {
          message.warn(resp.data.msg)
        }
      })
}
// 按钮的操作
const upgradeVIP = (userID) => {
  message.success("升级会员操作,userID=>" + userID)
}
const deleteUser = (userID) => {
  message.success("删除用户操作,userID=>" + userID)
}
// 弹窗处理逻辑===========================
const loading = ref(false);
const open = ref(false);
const rechargeBeans = (curId) => {
  open.value = true;
  cutUserId.value = curId
  message.success("充值BI豆操作，当前用户ID：" + curId)
}
const handleOk = () => {
  loading.value = true;
  console.log("我去充值啦")
  setTimeout(() => {
    loading.value = false;
    open.value = false;
  }, 2000);
};
const handleCancel = () => {
  open.value = false;
};
</script>

<style scoped>
.search {
  width: 1000px;
  margin: 50px 0 50px 0;
}

.btn {
  margin-right: 10px;
}
</style>