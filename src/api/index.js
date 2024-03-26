import request from '@/axios'
export function exportToWordNode(data) {
  return request({
    url: '/exportToWord',
    data: data,
    responseType: 'blob'
  })
}