<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="85px"
    >
      <el-form-item label="软件类别" prop="appType">
        <el-select
          v-model="queryParams.appType"
          placeholder="请选择软件类别"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="App版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="软件平台" prop="platform">
        <el-select
          v-model="queryParams.platform"
          placeholder="请选择软件平台"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_PLATFORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="位版本" prop="bit">
        <el-select v-model="queryParams.bit" placeholder="请选择位版本" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_BIT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备指纹" prop="deviceFingerprint">
        <el-input
          v-model="queryParams.deviceFingerprint"
          placeholder="请输入设备指纹"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="系统版本" prop="osRelease">
        <el-input
          v-model="queryParams.osRelease"
          placeholder="请输入系统版本"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['infra:software-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:software-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="设备指纹" align="center" prop="deviceFingerprint">
        <template #default="scope">
          <el-link type="primary" @click="showDetail(scope.row.id)">
            {{ scope.row.deviceFingerprint }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center" prop="ip" />
      <el-table-column label="ip归属地" align="center" prop="ipHomeLocation" />
      <el-table-column label="软件类别" align="center" prop="appType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SOFTWARE_TYPE" :value="scope.row.appType" />
        </template>
      </el-table-column>
      <el-table-column label="App版本" align="center" prop="version" />
      <el-table-column label="软件平台" align="center" prop="platform">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SOFTWARE_PLATFORM" :value="scope.row.platform" />
        </template>
      </el-table-column>
      <el-table-column label="位版本" align="center" prop="bit">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SOFTWARE_BIT" :value="scope.row.bit" />
        </template>
      </el-table-column>
      <el-table-column label="今日更新" align="center" prop="todayUpdateCount">
        <template #default="scope">
          {{ getTodayUpdateCount(scope.row.todayUpdateCount, scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="总更新" align="center" prop="totalUpdateCount" />
      <el-table-column label="系统版本" align="center" prop="osRelease" />
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['infra:software-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:software-record:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SoftwareRecordForm ref="formRef" @success="getList" />
  <SoftwareRecordDetail ref="detailRef" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SoftwareRecordApi, SoftwareRecordVO } from '@/api/infra/gtnes/softwarerecord'
import SoftwareRecordForm from './SoftwareRecordForm.vue'
import SoftwareRecordDetail from './SoftwareRecordDetail.vue'

/** 软件使用记录 列表 */
defineOptions({ name: 'SoftwareRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SoftwareRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  appType: undefined,
  version: undefined,
  platform: undefined,
  bit: undefined,
  deviceFingerprint: undefined,
  osRelease: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SoftwareRecordApi.getSoftwareRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SoftwareRecordApi.deleteSoftwareRecord(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SoftwareRecordApi.exportSoftwareRecord(queryParams)
    download.excel(data, '软件使用记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/** 获取今日更新数量 */
const getTodayUpdateCount = (todayUpdateCount: number, updateTime: number) => {
  if (!updateTime) return 0
  // 获取当前日期（YYYY-MM-DD格式）
  const today = new Date().toISOString().split('T')[0]
  // 获取更新时间的日期部分（YYYY-MM-DD格式）
  const updateDate = new Date(updateTime).toISOString().split('T')[0]
  return today === updateDate ? todayUpdateCount : 0
}

const detailRef = ref()
const showDetail = (id: number) => {
  detailRef.value.open(id)
}
</script>
