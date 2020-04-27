import { axios } from '@/utils/request'

export function getBlogList () {
  return axios({
    url: '/blog/list',
    method: 'get'
  })
}

export function getBlogDetail (params) {
  return axios({
    url: '/blog/detail',
    method: 'get',
    params
  })
}
