<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="标题" :label-col="{ span: 2 }" :wrapper-col="{ span: 15}">
        <a-input
          v-decorator="['title', { rules: [{ required: true, message: '请填写文章标题!' }] }]"
          placeholder="填写文章标题"
        />
      </a-form-item>
      <a-form-item label="简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 15 }">
        <a-textarea
          placeholder="Basic usage"
          :rows="4"
          v-decorator="['introduce', { rules: [{ required: true, message: '请输入文章介绍!' }] }]"
        />
      </a-form-item>
      <a-form-item label="图片" :label-col="{ span: 2 }" :wrapper-col="{ span: 15 }">
        <a-upload
          name="image"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :beforeUpload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <!-- <a-form-item label="栏目" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          v-decorator="[
            'category',
            { rules: [{ required: true, message: '请选择文章栏目!' }] },
          ]"
          placeholder="选择文章栏目"
        >
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item label="Gender" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <we v-model="defaultHtml" @change="handleChange" :customConfig="customConfig" />
      </a-form-item> -->
      <a-form-item label="内容" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
        <mavon-editor v-model="value" />
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
import we from '@/components/Editor/WangEditor'
import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import { getBlogDetail } from '@/api/blog'

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
      form: this.$form.createForm(this, { name: 'coordinated' }),
      html: '',
      defaultHtml: `
        <p>欢迎使用<b>wangEditor 富文本编辑器</b>，请输入内容...</p><p><br></p>
      `,
      customConfig: {
        uploadImgShowBase64: true,
        zIndex: 1
      },
      detail: null,
      value: null
    }
  },
  components: { we, getBlogDetail },
  created () {
    if (this.id) {
      console.log(1)
      this.getDetail()
    }
  },
  methods: {
    getDetail () {
      getBlogDetail({ id: 1 }).then(res => {
        console.log(res)
        res = res.result
        this.detail = res
        setTimeout(() => {
          this.value = res.content
          this.form.setFieldsValue({
            title: res.title,
            introduce: res.introduce,
            content: res.content
            // name: res.data.name,
            // source_url: res.data.source_url,
            // classify_id: res.data.classify_id,
            // icon_url: res.data.icon_url,
            // price: res.data.price,
            // service_id: res.data.service_id
          })
        }, 1)
      })
    },
    handleChange (info) {
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
      }
    },
    handleChange2 (html) {
      console.log('change', html)
      this.html = html
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
