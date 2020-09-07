<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="标题" :label-col="{ span: 2 }" :wrapper-col="{ span: 15}">
        <a-input v-decorator="['title', { rules: [{ required: true, message: '请填写文章标题!' }] }]" placeholder="填写文章标题" />
      </a-form-item>
      <a-form-item label="简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 15 }">
        <a-textarea placeholder="Basic usage" :rows="4" v-decorator="['introduce', { rules: [{ required: true, message: '请输入文章介绍!' }] }]" />
      </a-form-item>
      <a-form-item label="SEO关键字" :label-col="{ span: 2 }" :wrapper-col="{ span: 15 }">
        <a-textarea placeholder="请输入关键字，关键字之间使用空格隔开!" :rows="4" v-decorator="['keywords', { rules: [{ required: true, message: '请输入关键字，关键字之间使用空格隔开!' }] }]" />
      </a-form-item>
      <a-form-item label="图片" :label-col="{ span: 2 }" :wrapper-col="{ span: 15 }">
        <a-upload
          v-decorator="['image', { rules: [{ required: false, message: '请选择图片!' }] }]"
          name="image"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="baseUrl + '/admin/blog/upload'"
          @change="handleChange">
          <img style="width: 200px;" v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="内容" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
        <mavon-editor ref="md" v-model="value" @imgAdd="$imgAdd"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 2 }">
        <a-button type="primary" html-type="submit">
          发布
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>

</template>

<script>
import { axios } from '@/utils/request'
import we from '@/components/Editor/WangEditor'
import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import {
  getBlogDetail,
  submitArticle,
  updateArticle
} from '@/api/blog'

// markdown-it对象：md.s_markdown, md => mavonEditor实例
//                 or
//                 mavonEditor.markdownIt
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data () {
    return {
      id: this.$route.query.id,
      loading: false,
      imageUrl: '',
      description: '来发表一章文章吧',
      form: this.$form.createForm(this, {
        name: 'coordinated'
      }),
      html: '',
      defaultHtml: `
        <p>欢迎使用<b>wangEditor 富文本编辑器</b>，请输入内容...</p><p><br></p>
      `,
      customConfig: {
        uploadImgShowBase64: true,
        zIndex: 1
      },
      detail: null,
      value: null,
      baseUrl: process.env.VUE_APP_API_BASE_HOST
    }
  },
  components: {
    we,
    getBlogDetail
  },
  created () {
    console.log('环境-----------------')
    console.log(process.env.NODE_ENV)
    if (this.id) {
      console.log(1)
      this.getDetail()
    }
  },
  methods: {
    // 图片上传
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      var that = this
      formdata.append('image', $file)
      axios({
        url: that.baseUrl + '/admin/blog/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((url) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        console.log(url)
        var imgUrl = that.baseUrl + url.result.src
        this.$refs.md.$img2Url(pos, imgUrl)
      })
    },
    getDetail () {
      getBlogDetail({
        id: this.id
      }).then(res => {
        console.log(res)
        res = res.result
        this.detail = res
        this.imageUrl = this.baseUrl + '/upload/' + res.image
        setTimeout(() => {
          this.value = res.content
          this.form.setFieldsValue({
            title: res.title,
            introduce: res.introduce,
            content: res.content,
            keywords: res.keywords
          })
        }, 1)
      })
    },
    handleChange (info) {
      console.log('2222')
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
        this.imageName = info.file.response.result.name
        this.imageUrl = info.file.response.result.src
        this.loading = false
      }
    },
    handleChange2 (html) {
      console.log('change', html)
      this.html = html
    },
    handleSubmit (e) {
      var that = this
      e.preventDefault()
      console.log('test')
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.content = that.value
          values.image = that.imageName
          if (!that.id) {
            submitArticle(values).then(res => {
              console.log(res)
            })
          } else {
            values.id = that.id
            updateArticle(values).then(res => {
              console.log(res)
            })
          }
        }
      })
    }
  }
}
</script>
