<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="ip" prop="version">
        <el-input v-model="formData.ip" placeholder="请输入ip" />
      </el-form-item>
      <el-form-item label="软件类别" prop="appType">
        <el-select v-model="formData.appType" placeholder="请选择软件类别">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="App版本号" prop="version">
        <el-input v-model="formData.version" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="软件平台" prop="platform">
        <el-radio-group v-model="formData.platform">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_PLATFORM)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位版本" prop="bit">
        <el-radio-group v-model="formData.bit">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.SOFTWARE_BIT)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="设备指纹" prop="deviceFingerprint">
        <el-input v-model="formData.deviceFingerprint" placeholder="请输入设备指纹" />
      </el-form-item>
      <el-form-item label="系统版本" prop="osRelease">
        <el-input v-model="formData.osRelease" placeholder="请输入系统版本" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { SoftwareRecordApi, SoftwareRecordVO } from '@/api/infra/gtnes/softwarerecord'

/** 软件使用记录 表单 */
defineOptions({ name: 'SoftwareRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  ip: undefined,
  appType: undefined,
  version: undefined,
  platform: undefined,
  bit: undefined,
  deviceFingerprint: undefined,
  osRelease: undefined,
  description: undefined
})
const formRules = reactive({
  appType: [{ required: true, message: '软件类别 1=9GridTools不能为空', trigger: 'change' }],
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
  platform: [
    { required: true, message: '软件平台: 1=win, 3=macOS, 5=Linux不能为空', trigger: 'blur' }
  ],
  deviceFingerprint: [{ required: true, message: '设备指纹不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SoftwareRecordApi.getSoftwareRecord(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SoftwareRecordVO
    if (formType.value === 'create') {
      await SoftwareRecordApi.createSoftwareRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await SoftwareRecordApi.updateSoftwareRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    appType: undefined,
    version: undefined,
    platform: undefined,
    bit: undefined,
    deviceFingerprint: undefined,
    osRelease: undefined,
    description: undefined
  }
  formRef.value?.resetFields()
}
</script>
