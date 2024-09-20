import request from '@/utils/request'

// 上传
export function upload(data) {
  return request({
    url: '/customer/sample/upload',
    method: 'post',
    data: data
  })
}
//  查询客户来样列表
export function list(query) {
  return request({
    url: '/customer/sample/list',
    method: 'get',
    params: query
  })
}

// 导出客户来样列表
export function exportList(data) {
  return request({
    url: '/customer/sample/export',
    method: 'post',
    data: data
  })
}

// 查询客户来样细信息
export function sampleDetail(customerSampleId) {
  return request({
    url: '/customer/sample/' + customerSampleId,
    method: 'get'
  })
}

// 新增客户来样
export function sampleAdd(data) {
  return request({
    url: '/customer/sample',
    method: 'post',
    data: data
  })
}


// 删除客户来样
export function sampleDelete(customerSampleIds) {
  return request({
    url: '/customer/sample/' + customerSampleIds.customerSampleIds,
    method: 'delete'
  })
}

// 配置保存
export function saveClient(data) {
  return request({
    url: '/customer/sample',
    method: 'put',
    data: data
  })
}

// 配置保存
export function saveMoreClient(data) {
  return request({
    url: '/customer/sample/batchSave',
    method: 'put',
    data: data
  })
}



