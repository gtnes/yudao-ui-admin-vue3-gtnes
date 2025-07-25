<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="软件名称" prop="name">
        <el-select v-model="formData.name" placeholder="请选择软件名称">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SOFTWARE_NAME)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
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
      <el-form-item label="简介" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
      <el-form-item label="下载地址" prop="downloadUrl">
        <el-input v-model="formData.downloadUrl" placeholder="请输入下载地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { SoftwareManageApi, SoftwareManageVO } from '@/api/infra/gtnes/softwareManage'

/** 软件管理 表单 */
defineOptions({ name: 'SoftwareManageForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  name: undefined,
  version: undefined,
  platform: undefined,
  bit: undefined,
  description: undefined,
  downloadUrl: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '软件名称不能为空', trigger: 'change' }],
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
  platform: [{ required: true, message: '软件平台不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  downloadUrl: [{ required: true, message: '下载地址不能为空', trigger: 'blur' }],
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
      formData.value = await SoftwareManageApi.getSoftwareManage(id)
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
    const data = formData.value as unknown as SoftwareManageVO
    if (formType.value === 'create') {
      await SoftwareManageApi.createSoftwareManage(data)
      message.success(t('common.createSuccess'))
    } else {
      await SoftwareManageApi.updateSoftwareManage(data)
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
    name: undefined,
    version: undefined,
    platform: undefined,
    description: undefined,
    downloadUrl: undefined,
  }
  formRef.value?.resetFields()
}
</script>