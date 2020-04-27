<template>
  <s-table
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
  >
    <span slot="action" slot-scope="text, record">
      <a @click="handleDetail(record)">编辑</a>
      &nbsp
      <a class="red" type="danger" @click="handleDel(record)">删除</a>
    </span>
  </s-table>
</template>

<script>
import { STable } from '@/components'
import { getBlogList } from '@/api/blog'

export default {
  components: { STable, getBlogList },
  data () {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          table: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   return this.$http.get('/blog/api/list', {
      //     params: Object.assign(parameter, this.queryParam)
      //   }).then(res => {
      //     return res.result
      //   })
      // }
      loadData: parameter => {
        return getBlogList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res)
          res = res.result
          console.log(res)
          return res
        })
      }
    }
  },
  methods: {
    handleDetail (record) {
      this.$router.push({
        name: 'blogarticle',
        query: {
          id: record && record.id
        }
      })
    }
  }
}
</script>
