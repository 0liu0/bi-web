<template xmlns="">
  <!-- 搜索框部分 -->
  <a-space direction="vertical">
    <a-input-search
        v-model:value="searchValue"
        placeholder="输入邮箱账号/昵称"
        size="large"
        @search="onSearch"
        class="search"
    >
      <template #enterButton>
        <a-button>搜索</a-button>
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
          <a-button class="btn" type="primary" @click="upgradeVIP(record.id)">升级会员</a-button>
          <a-button class="btn" type="primary" @click="rechargeBeans(record.id)">充值BI豆</a-button>
          <a-popconfirm title="确定要删除此用户吗？" @confirm="deleteUser(record.id)" okText="确认" cancel-text="取消">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <div>
    <!--            <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>-->
    <a-modal v-model:open="BIOpen" title="充值BI豆" @ok="BIHandleOk">
      <template #footer>
        <a-button key="back" @click="BIHandleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="BIHandleOk">充值</a-button>
      </template>
      <div>
        <a-input-number id="inputNumber" v-model:value="rechargeNum" :min="10"/>
        当前值：{{ rechargeNum }}粒
      </div>
    </a-modal>
  </div>
  <div>
    <!--            <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>-->
    <a-modal v-model:open="VIPOpen" title="充值会员" @ok="VIPHandleOk">
      <template #footer>
        <a-button key="back" @click="VIPHandleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="VIPHandleOk">充值</a-button>
      </template>
      <div>
        <a-input-number id="inputNumber" v-model:value="vipDate" :min="10"/>
        当前值：{{ vipDate }}月
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {message} from "ant-design-vue";
import myAxios from "@/utils/myAxios";

let cutUserId = ref(-1) // 当前用户ID，用户充值用户的BI豆
let searchValue = ref('');
let rechargeNum = ref(10);
let vipDate = ref(1);
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
const onSearch = () => {
  pagination.current = 1
  fetchData()
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
  myAxios.post('/api/v1/admin/page/list-user',{
    page:pagination.current,
    size:pagination.pageSize,
    searchValue: searchValue.value
  }).then(resp => {
        if (resp.data.code === 0) {
          userList.value = resp.data.data.list;
          pagination.total = resp.data.data.total;
        } else {
          message.warn(resp.data.msg)
        }
      })
}
// 按钮的操作
const deleteUser = (userID) => {
  message.success("删除用户操作,userID=>" + userID)
}
// 弹窗处理逻辑===========================
const loading = ref(false);
const BIOpen = ref(false);
const VIPOpen = ref(false);
const rechargeBeans = (curId) => {
  BIOpen.value = true;
  cutUserId.value = curId
}
const upgradeVIP = (userID) => {
  VIPOpen.value = true;
  cutUserId.value = userID
}
const BIHandleOk = () => {
  loading.value = true;
  // message.success("充值BI豆操作,userID=>" + cutUserId.value)
  // message.success("充值BI豆操作,数量=>" + rechargeNum.value)
  setTimeout(() => {
    loading.value = false;
    BIOpen.value = false;
  }, 1000);
  myAxios.get(`/api/v1/admin/recharge-bi-beans/${cutUserId.value}?nums=${rechargeNum.value}`).then(resp => {
    // 验证响应和数据的存在
    if (!resp || !resp.data) {
      console.error('Invalid response:', resp);
      message.error('充值失败，无效的响应');
      return;
    }
    if (resp.data.code === 0) {
      fetchData();
      message.success("充值成功！")
    } else {
      message.warn(resp.data.msg)
    }
  }).catch(error => {
  }).catch(error => {
    console.error('Request error:', error);
    message.error('充值请求失败');
  })

};
const BIHandleCancel = () => {
  BIOpen.value = false;
};
const VIPHandleCancel = () => {
  VIPOpen.value = false;
};

const VIPHandleOk = () => {
  loading.value = true;
  message.success("升级会员操作,userID=>" + cutUserId.value)
  setTimeout(() => {
    loading.value = false;
    VIPOpen.value = false;
  }, 2000);

  myAxios.get(`/api/v1/admin/upgrade-vip/${cutUserId.value}?month=${vipDate.value}`).then(resp => {
    if (resp.data.code === 0) {
      fetchData();
      message.success("充值成功！")
    } else {
      message.warn(resp.data.msg)
    }
  }).catch(error => {
    console.error('Request error:', error);
    message.error('充值请求失败');
  })
}
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