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

export function submitArticle (params) {
  return axios({
    url: '/blog/add',
    method: 'post',
    data: params
  })
}

export function updateArticle (params) {
  return axios({
    url: '/blog/update',
    method: 'post',
    data: params
  })
}
