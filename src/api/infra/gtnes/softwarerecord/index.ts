import request from '@/config/axios'

// 软件使用记录 VO
export interface SoftwareRecordVO {
  appType: number // 软件类别 1=9GridTools
  version: string // 版本号
  platform: number // 软件平台: 1=win, 3=macOS, 5=Linux
  bit: number // 位版本：0=通用, 1=32位, 2=64位,
  deviceFingerprint: string // 设备指纹
  osRelease: string // 系统版本
  description: string // 描述
}

// 软件使用记录 API
export const SoftwareRecordApi = {
  // 查询软件使用记录分页
  getSoftwareRecordPage: async (params: any) => {
    return await request.get({ url: `/infra/software-record/page`, params })
  },

  // 查询软件使用记录详情
  getSoftwareRecord: async (id: number) => {
    return await request.get({ url: `/infra/software-record/get?id=` + id })
  },

  // 新增软件使用记录
  createSoftwareRecord: async (data: SoftwareRecordVO) => {
    return await request.post({ url: `/infra/software-record/create`, data })
  },

  // 修改软件使用记录
  updateSoftwareRecord: async (data: SoftwareRecordVO) => {
    return await request.put({ url: `/infra/software-record/update`, data })
  },

  // 删除软件使用记录
  deleteSoftwareRecord: async (id: number) => {
    return await request.delete({ url: `/infra/software-record/delete?id=` + id })
  },

  // 导出软件使用记录 Excel
  exportSoftwareRecord: async (params) => {
    return await request.download({ url: `/infra/software-record/export-excel`, params })
  },
}