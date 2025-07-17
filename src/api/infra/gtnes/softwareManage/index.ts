import request from '@/config/axios'

// 软件管理 VO
export interface SoftwareManageVO {
  name: string // 软件名称
  version: string // 版本号
  platform: number // 软件平台
  description: string // 简介
  downloadUrl: string // 下载地址
}

// 软件管理 API
export const SoftwareManageApi = {
  // 查询软件管理分页
  getSoftwareManagePage: async (params: any) => {
    return await request.get({ url: `/infra/software-manage/page`, params })
  },

  // 查询软件管理详情
  getSoftwareManage: async (id: number) => {
    return await request.get({ url: `/infra/software-manage/get?id=` + id })
  },

  // 新增软件管理
  createSoftwareManage: async (data: SoftwareManageVO) => {
    return await request.post({ url: `/infra/software-manage/create`, data })
  },

  // 修改软件管理
  updateSoftwareManage: async (data: SoftwareManageVO) => {
    return await request.put({ url: `/infra/software-manage/update`, data })
  },

  // 删除软件管理
  deleteSoftwareManage: async (id: number) => {
    return await request.delete({ url: `/infra/software-manage/delete?id=` + id })
  },

  // 导出软件管理 Excel
  exportSoftwareManage: async (params) => {
    return await request.download({ url: `/infra/software-manage/export-excel`, params })
  },
}