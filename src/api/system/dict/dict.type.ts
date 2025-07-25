import request from '@/config/axios'

export interface DictTypeVO {
  id: number
  name: string
  type: string
  status: number
  remark: string
  createTime: Date
}

// 查询字典（精简)列表
export const getSimpleDictTypeList = (): Promise<DictTypeVO[]> => {
  return request.get({ url: '/system/dict-type/simple-list' })
}

// 查询字典列表
export const getDictTypePage = (params: PageParam) => {
  return request.get({ url: '/system/dict-type/page', params })
}

// 查询字典详情
export const getDictType = (id: number) => {
  return request.get({ url: '/system/dict-type/get?id=' + id })
}

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  return request.post({ url: '/system/dict-type/create', data })
}

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  return request.put({ url: '/system/dict-type/update', data })
}

// 删除字典
export const deleteDictType = (id: number) => {
  return request.delete({ url: '/system/dict-type/delete?id=' + id })
}

// 批量删除字典类型
export const deleteDictTypeList = (ids: number[]) => {
  return request.delete({ url: '/system/dict-type/delete-list', params: { ids: ids.join(',') } })
}

// 导出字典
export const exportDictType = (params) => {
  return request.download({
    url: '/system/dict-type/export-excel',
    params
  })
}
