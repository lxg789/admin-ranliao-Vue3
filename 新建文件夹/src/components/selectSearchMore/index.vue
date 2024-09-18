<template>
  <el-select
    ref="selectSearchMoreDom"
    v-model="value"
    v-loadmore="moreData"
    :class="[multiple ? '' : 'select-auto-width']"
    :multiple="multiple"
    filterable
    remote
    clearable
    :allow-create="allowCreate"
    :collapse-tags="collapseTags"
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    :style="{ width: widthUnit }"
    size="mini"
    :disabled="disabled"
    @change="changeFun"
    @clear="clearFun"
    @blur="blurFun"
    @visible-change="handlerVisible"
  >
    <!-- <template v-if="!multiple" #prefix>{{ optionName }}</template> -->
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item[optionsProps.label]"
      :value="item[optionsProps.value]"
    />
  </el-select>
</template>

<script>
import { isArray } from '@/utils/validate'
// import {getMsgDevicePage} from '@/api/workshop/msg/msgDeviceIndex.js';
export default {
  props: {
    id: {
      type: [String, Number, Array],
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => '请输入'
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    request: {
      type: Function,
      // default: getMsgDevicePage
      default: ''
    },
    optionsProps: {
      type: Object,
      default: () => {
        return { label: 'title', value: 'id' }
      }
    },
    searchKey: {
      type: String,
      default: () => {
        return 'title'
      }
    },
    change: {
      type: Function,
      default: () => {}
    },
    filtrationList: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: () => 'auto'
    },
    customForm: {
      type: Object,
      default: () => {}
    },
    // 显示下拉框时获取数据  默认加载获取
    isGetDefaulsData: {
      type: Boolean,
      default: () => true
    },
    collapseTags: {
      type: Boolean,
      default: () => false
    },
    allowCreate: {
      type: Boolean,
      default: () => false
    },
    maxlength: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      page: 1,
      limit: 1,
      total: 0,
      options: [],
      loading: false,
      pageNo: 1,
      pageSize: 10,
      pages: 0,
      query: '',
      requestStatus: true,
    }
  },
  computed: {
    value: {
      get() {
        return this.id
      },
      set(val) {
        this.$emit('update:id', val)
      }
    },
    widthUnit() {
      return /\D/g.test(this.width) ? this.width : this.width + 'px'
    },
    optionName() {
      return this.options ? (this.options.find(i => i[this.optionsProps.value] === this.value) || {})[this.optionsProps.label] : ''
    }
  },
  watch: {
    filtrationList: {
      handler(val) {
        if (val.length > 0) {
          this.getListData()
        }
      },
      immediate: true,
      deep: true
    },
    optionName() {
      this.setTextHandle && this.setTextHandle()
    },
    name: {
      handler(val) {
        this.query = val
        this.getListData()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.isGetDefaulsData) {
      this.getListData()
    }
  },
  mounted() {
    if (this.maxlength) {
      const innerEl = this.$refs.selectSearchMoreDom.$el.querySelector('.el-input__suffix-inner')
      const fragment = document.createDocumentFragment()
      const countEl = document.createElement('span')
      const countInnerEl = document.createElement('span')
      countEl.className = 'el-input__count'
      countInnerEl.className = 'el-input__count-inner'
      this.setTextHandle = () => {
        countInnerEl.textContent = ` ${this.optionName ? this.optionName.length : '0'}/${this.maxlength} `
      }
      fragment.appendChild(countEl).appendChild(countInnerEl)
      innerEl.appendChild(fragment)
    }
  },
  methods: {
    //   滚动加载
    moreData() {
      console.log(!this.requestStatus,'!this.requestStatus')
      console.log(this.pageNo > this.pages,'this.pageNo > this.pages')
      if (!this.requestStatus) {
        return false
      }
      if (this.pageNo > this.pages) return false
      this.pageNo += 1
      this.getListData()
    },
    remoteMethod(val) {
      if (val === '') {
        return false
      }
      this.query = val
      this.pageNo = 1
      this.getListData()
    },
    refreshData() {
      this.query = ''
      this.pageNo = 1
      this.getListData()
    },
    // 请求数据
    getListData() {
      if (!this.requestStatus) {
        return false
      }
      this.requestStatus = false
      const val = this.query
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.customForm
      }
      if (val) {
        data[this.searchKey] = val
      }
      this.request(data)
        .then(res => {
          const arr = res.data.list || res.data
          const arr2 = arr.filter(item => {
            if (item) return item
          })
          this.filterData(arr2)

          // if (this.pageNo === 1) {
          //   // 第一页添加回显数据
          //   this.$set(this, 'options', arr)
          // } else {
          //   this.$set(this, 'options', [...this.options, ...arr])
          // }

          this.total = res.data.total
          this.pages = res.data.total
          // this.pageNo = res.data.pageNo
          this.pageNo = this.pageNo
        })
        .catch(() => {
          this.requestStatus = true
        })
    },
    filterData(arr) {
      // 过滤掉回显数据
      const ids = this.filtrationList.map(item => item[this.optionsProps.value])
      arr = arr.filter(v => ids.indexOf(v[this.optionsProps.value]) === -1)
      if (this.pageNo === 1) {
        // 第一页添加回显数据
        if (this.filtrationList.length > 0) {
          arr = [...this.filtrationList, ...arr]
        }
        this.$set(this, 'options', arr)
      } else {
        this.$set(this, 'options', [...this.options, ...arr])
      }

      this.$nextTick(() => {
        this.requestStatus = true
      })
    },
    changeFun(val) {
      let option = null
      if (isArray(val) && this.multiple) {
        option = this.options.filter(
          item => val.indexOf(item[this.optionsProps.value]) > -1
        )
      } else {
        option = this.options.filter(
          item => item[this.optionsProps.value] === val
        )
      }
      option = this.options.filter(item => item[this.optionsProps.value] === val)
      if (val.length <= 0) {
        this.query = ''
        this.pageNo = 1
        this.getListData()
      }
      this.$emit('change', val, option)
    },
    clearFun() {
      this.query = ''
      this.pageNo = 1
      this.getListData()
      this.$emit('clear')
    },
    handlerVisible(val) {
      if (val) {
        // 显示下拉框时获取数据
        if (!this.isGetDefaulsData && this.options.length <= 0) {
          this.getListData()
        }
      } else {
        // 显示获取数据 需要在隐藏时重置数据
        if (!this.isGetDefaulsData) {
          this.options = []
        }
      }
    },
    blurFun() {
      if (!this.value || this.value.length === 0) {
        setTimeout(() => {
          this.query = ''
          // this.pageNo = 1
          this.getListData()
        }, 300)
      }
    },
    // 获取焦点
    focus() {
      this.$refs.selectSearchMoreDom.focus()
    },
    // 失去焦点
    blur() {
      this.$refs.selectSearchMoreDom.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix-inner{
  .el-icon-circle-close + .el-input__count{
    display: none;
  }
}
::v-deep .el-input.is-disabled .el-input__suffix-inner{
  display: none;
}
</style>
