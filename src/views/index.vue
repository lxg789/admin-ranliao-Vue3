<template>
  <div class="app-container home">
    <IndexEchart :fileList="fileList" :key="imgKey"></IndexEchart>
    <div class="home-title mb10">客户来样</div>
    <div class="mb10">
      <el-button type="primary" size="small">执行</el-button>
      <el-button type="warning" size="small">配置</el-button>
      <el-button type="warning" size="small" @click="uploadClick">上传</el-button>
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
          <!-- @blur="scope.row.fillerPrice = $event.target.value.trim()" -->
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
          <template #default="scope">            
            <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
            <el-button link type="primary" @click="handleUpdate(scope.row)">保存</el-button>
            <el-button link type="primary" @click="handleResetPwd(scope.row)">匹配</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <selectSearchMore /> -->
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
import { getToken } from "@/utils/auth";
import { sampleDelete } from "@/api/client/index";
const tableData = ref([
  // {
  //   date: '2016-05-03',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  //   batchNumber:2,
  //   fillerPrice:'',
  //   workFee:'',
  //   id:'0000001',
  // }
])
const fileList=ref([]);
const imgKey=ref(new Date().getTime())
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
function uploadClick() {
  upload.open = true
  upload.title = "上传";                     
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
};
/** 提交上传文件 */
function submitFileForm() {
  
};
const fillerPriceBlur = (event) => {
  console.log(event.target.value,'event1')
}
const processingCostBlur = (event) => {
  console.log(event.target.value,'event2')
}
const listToString = (val) => {
  console.log(val,'val')
  tableData.value.push({
    date: val.createTime,
    name: val.code,
    batchNumber:val.batchNumber,
    fillerPrice:val.fillerPrice,
    workFee:val.workFee,
    customerSampleId:val.customerSampleId,
  });
  console.log(tableData.value,"")
  const fileObj={
    xData:[],
    yData:[]
  }
  val.uvData.forEach((element,index) => {
    if(index < 300){
      fileObj.xData.push(element.x)
      fileObj.yData.push(element.y)
    }    
  });
  fileList.value.push(fileObj)
  imgKey.value=new Date().getTime()
}
const handleDelete = (row) => {
  console.log(row.name,'row')
  let customerSampleIds = []
  customerSampleIds.push(row.id)
  // const customerSampleIdstr = JSON.stringify(customerSampleIds)
  const customerSampleIdstr = customerSampleIds.toString()
  console.log(customerSampleIdstr,'customerSampleIdstr')
  sampleDelete({customerSampleIds:customerSampleIdstr}).then(res => {
    console.log(res,'res')
  })
}
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
