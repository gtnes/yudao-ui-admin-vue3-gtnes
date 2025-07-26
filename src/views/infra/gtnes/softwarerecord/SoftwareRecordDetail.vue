<template>
  <Dialog :title="`软件记录详情`" v-model="dialogVisible" :close-on-click-modal="false" width="750px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="编号" :span="2">{{ detail.id }}</el-descriptions-item>
      <el-descriptions-item label="ip">{{ detail.ip }}</el-descriptions-item>
      <el-descriptions-item label="ip归属地">{{ detail.ipHomeLocation }}</el-descriptions-item>
      <el-descriptions-item label="软件类别">{{ getDictLabel(DICT_TYPE.SOFTWARE_TYPE, detail.appType) }}</el-descriptions-item>
      <el-descriptions-item label="App版本号">{{ detail.version }}</el-descriptions-item>
      <el-descriptions-item label="软件平台">{{ getDictLabel(DICT_TYPE.SOFTWARE_PLATFORM, detail.platform) }}</el-descriptions-item>
      <el-descriptions-item label="位版本">{{ getDictLabel(DICT_TYPE.SOFTWARE_BIT, detail.bit) }}</el-descriptions-item>
      <el-descriptions-item label="设备指纹" :span="2">{{ detail.deviceFingerprint }}</el-descriptions-item>
      <el-descriptions-item label="系统版本" :span="2">{{ detail.osRelease }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatTime(detail.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ formatTime(detail.updateTime) }}</el-descriptions-item>
      <el-descriptions-item label="今日更新">{{ detail.todayUpdateCount }}</el-descriptions-item>
      <el-descriptions-item label="总更新">{{ detail.totalUpdateCount }}</el-descriptions-item>
      <el-descriptions-item label="描述" :span="2">
        <div v-html="detail.description"></div>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { SoftwareRecordApi } from '@/api/infra/gtnes/softwarerecord'
import { ref } from 'vue'
import { dateFormatter } from '@/utils/formatTime'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

const dialogVisible = ref(false)
const detail = ref<any>({})

function formatTime(val: any) {
  if (!val) return ''
  // 这里建议用 dayjs 或 formatTime 工具，避免类型报错
  return new Date(val).toLocaleString()
}

function getDictLabel(type: string, value: any) {
  const options = getIntDictOptions(type)
  const found = options.find(item => item.value === value)
  return found ? found.label : value
}

const open = async (id: number) => {
  dialogVisible.value = true
  const data = await SoftwareRecordApi.getSoftwareRecord(id)
  // 防止 description 为 null
  if (data.description == null) data.description = ''
  detail.value = data
}
defineExpose({ open })
</script> 