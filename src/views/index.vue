<template>
  <div class="app-container home">
    <div v-if="tableData.length > 0">
      <IndexEchart :fileList="fileList" :key="imgKey"></IndexEchart>
    </div>
    
    <div class="home-title mb10">客户来样</div>
    <div class="mb10">
      <!-- <el-button type="primary" size="small">执行</el-button> -->
      <el-button type="warning" size="small">配置</el-button>
      <el-button type="warning" size="small" @click="uploadClick">上传</el-button>
      <el-button type="primary" size="small" :disable="tableData.length > 0" @click="saveClick">保存</el-button>
      <el-button type="primary" size="small" :disabled="tableData.length > 0" @click="submitClick">提交</el-button>
    </div>
    <div>
      <el-table :data="tableData"  stripe style="width: 100%" size="small">
        <el-table-column prop="index" label="序号" width="180" align="center">
          <template #default="{scope,$index}">
            {{$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="代码" width="180" align="center" />
        <el-table-column prop="batchNumber" label="批次号" align="center" ></el-table-column>
        <el-table-column prop="fillerPrice" label="填充剂价格" align="center" >
          <template #default="scope">
            <el-input
              v-model="scope.row.fillerPrice"
              size="small"
              placeholder=""
              class="priceInput"
              @blur="fillerPriceBlur($event,$index)"
          />
          </template>
        </el-table-column>
        <el-table-column prop="workFee" label="加工费" align="center" >
          <template #default="scope">
            <el-input
             size="small"
              v-model="scope.row.workFee"
              placeholder=""
              class="priceInput"
              @blur="processingCostBlur($event,$index)"
          />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template #default="{scope,$index}">            
            <el-button link type="primary" @click="handleDelete(scope.row,$index)">删除</el-button>
            <!-- <el-button link type="primary" @click="handleUpdate(scope.row)">保存</el-button>
            <el-button link type="primary" @click="handleResetPwd(scope.row)">匹配</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <selectSearchMore /> -->
      <el-select
        v-model="selectValue"
        filterable
        placeholder="请选择来样"
        @change="selectChange"
      >
        <el-option
          v-for="item in selectData"
          :key="item.customerSampleId"
          :label="item.code"
          :value="item.customerSampleId"
        />
      </el-select>
    </div>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
        <DocumentUpload @handleUploadSuccess="listToString" />
        <!-- <FileUpload /> -->
        <!-- <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template> -->
    </el-dialog>
  </div>
</template>

<script setup>
import IndexEchart from '@/components/IndexEcharts.vue'
import { sampleDelete,list } from "@/api/client/index";
const tableData = ref([])   // 表格数据
const selectData = ref([])   // 下拉框数据
const fileList=ref([]);    // 传给图表的数据
const selectValue = ref(null) // 下拉框选中的值 
const imgKey=ref(new Date().getTime())   // 时间戳，用来更新组件
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
});
function uploadClick() {  // 点击上传按钮
  upload.open = true
  upload.title = "上传";                     
}
const fillerPriceBlur = (event) => {  
  console.log(event.target.value,'event1')
}
const processingCostBlur = (event) => {
  console.log(event.target.value,'event2')
}
const listToString = (val) => {
  echartsLogic(val)
  upload.open = false
}
const handleDelete = (row) => {
  let customerSampleIds = []
  customerSampleIds.push(row.id)
  const customerSampleIdstr = customerSampleIds.toString()
  sampleDelete({customerSampleIds:customerSampleIdstr}).then(res => {
    if(res.code === 200){
      // this.$message
    }
  })
}
const selectChange = (e) => {
  let obj = selectData.value.filter(item => item.customerSampleId === e)[0]
  obj.uvData = JSON.parse(obj.uvData)
  echartsLogic(obj)
}

const saveClick = () => {

} 
const submitClick = () => {

}

function echartsLogic(val){
  tableData.value.push({
    date: val.createTime,
    name: val.code,
    batchNumber:val.batchNumber,
    fillerPrice:val.fillerPrice,
    workFee:val.workFee,
    customerSampleId:val.customerSampleId,
  });
  const fileObj={
    xData:[],
    yData:[],
    code:''
  }
  val.uvData.forEach((element,index) => {
    fileObj.xData.push(element.x)
    fileObj.yData.push(element.y)   
  });
  fileObj.code = val.code
  fileList.value.push(fileObj)
  imgKey.value=new Date().getTime()
  selectValue.value = null
}

onMounted(() => {
  list().then(res => {
    selectData.value = []
    if(res.code === 200){
      selectData.value = res.rows
    }
  })
})
</script>

<style lang="scss" scoped>
.home {
  .home-title{
    font-size: 14px;
  }
}
.priceInput{
  width: 80%;
  text-align:center;
}
::v-deep .el-input--small .el-input__inner{
  text-align: center;
}
</style>
