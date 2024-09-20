<template>
  <div class="app-container home">
    <div v-if="tableData.length > 0">
      <IndexEchart :fileList="fileList" :key="imgKey"></IndexEchart>
    </div>    
    <div class="home-title mb10">客户来样</div>
    <div class="mb10">
      <el-button type="warning" size="small" @click="dispositionClick">配置</el-button>
      <el-button type="warning" size="small" @click="uploadClick">上传</el-button>
      <el-button type="primary" size="small" :disabled="tableData.length === 0" @click="saveClick('save')">保存所有</el-button>
      <el-button type="primary" size="small" :disabled="tableData.length === 0" @click="saveClick('submit')">提交所有</el-button>
    </div>
    <div>
      <el-table :data="tableData"  stripe style="width: 100%" size="small" class="tableDataClass">
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
          <template #default="{row, $index}">            
            <el-button link type="primary" @click="handleDelete(row,$index)">删除</el-button>
            <el-button link type="primary" @click="handlesave(row,'save',$index)">保存</el-button>
            <el-button link type="primary" @click="handlesave(row,'submit',$index)">提交</el-button>
            <!-- <el-button link type="primary" @click="handleResetPwd(scope.row)">匹配</el-button> -->
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
    </el-dialog>
    <!-- 用户导入对话框 -->
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="disposition.title" v-model="disposition.open" width="600px" append-to-body>
         <el-form :model="form" :rules="rules" ref="userRef"  size="small" label-width="140px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="保留N个结果" prop="resultNum">
                     <el-input v-model="form.resultNum" placeholder="请输入保留结果" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                <el-form-item label="精度(保留N位小数)" prop="precisionScale">
                     <el-input v-model="form.precisionScale" placeholder="请输入精度" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="最小波长" prop="minLength">
                     <el-input v-model="form.minLength" placeholder="请输入最小波长" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                <el-form-item label="最大波长" prop="maxLength">
                     <el-input v-model="form.maxLength" placeholder="请输入用户昵称" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="最少重合波段数" prop="errMatchLib">
                     <el-input v-model="form.errMatchLib" placeholder="请输入最少重合波段数" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">                
               </el-col>
               <el-col :span="24">
                  <el-form-item label="填充剂价格" prop="fillerPrice">
                     <el-input v-model="form.fillerPrice" placeholder="请输入填充剂价格" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="加工费" prop="workFee">
                     <el-input v-model="form.workFee" placeholder="请输入加工费" maxlength="30" style="width: 75%;" />
                  </el-form-item>
               </el-col>              
            </el-row>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
  </div>
</template>

<script setup>
import IndexEchart from '@/components/IndexEcharts.vue'
import { sampleDelete,list,saveClient,saveMoreClient } from "@/api/client/index";
const { proxy } = getCurrentInstance();
const tableData = ref([])   // 表格数据
const selectData = ref([])   // 下拉框数据
const fileList=ref([]);    // 传给图表的数据
const selectValue = ref(null) // 下拉框选中的值 
const imgKey=ref(new Date().getTime())   // 时间戳，用来更新组件
const upload = reactive({
  open: false,
  title: "",
  isUploading: false,
});
const disposition = reactive({
  open: false,
  title: "配置",
  isUploading: false,
});
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined
  },
  rules: {
    // fillerPrice: [{ required: true, message: "填充剂价格不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    resultNum: [{ required: true, message: "保留结果不能为空", trigger: "blur" }],
    precisionScale: [{ required: true, message: "精度不能为空", trigger: "blur" }],
    minLength: [{ required: true, message: "最小波长不能为空", trigger: "blur" }],
    maxLength: [{ required: true, message: "最大波长不能为空", trigger: "blur" }],
    errMatchLib: [{ required: true, message: "最少重合波段数不能为空", trigger: "blur"}],
    fillerPrice: [{ required: true, message: "填充剂价格不能为空", trigger: "blur"}],
    workFee: [{ required: true, message: "加工费不能为空", trigger: "blur"}],
  }
});

const { queryParams, form, rules } = toRefs(data);
function dispositionClick() {  // 点击上传按钮
  disposition.open = true
  disposition.title = "配置";                     
}
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
const handleDelete = (row,index) => {
  let customerSampleIds = []
  customerSampleIds.push(row.customerSampleId)
  // const customerSampleIdstr = customerSampleIds.toString()
  // sampleDelete({customerSampleIds:customerSampleIdstr}).then(res => {
  //   if(res.code === 200){
  //     proxy.$modal.msgSuccess("删除成功");
  //     tableData.value.splice(index,1)
  //     fileList.value.splice(index, 1)
  //     imgKey.value=new Date().getTime()
  //   }
  // })  
  proxy.$modal.msgSuccess("删除成功");
  tableData.value.splice(index,1)
  fileList.value.splice(index, 1)
  imgKey.value=new Date().getTime()
}

const handlesave = (row, type, index) => { // 保存提交单条
  row.uvData = JSON.stringify(row.uvData)
  saveClient(row).then(res => {
    proxy.$modal.msgSuccess("保存成功");
    if(type === 'submit'){ // 提交
      tableData.value.splice(index,1)
      fileList.value.splice(index, 1)
      imgKey.value=new Date().getTime()
    }
  })
}
const selectChange = (e) => {
  let obj = selectData.value.filter(item => item.customerSampleId === e)[0]
  obj.uvData = JSON.parse(obj.uvData)
  echartsLogic(obj)
}

const saveClick = (type) => { // 保存提交所有
  console.log(tableData.value,'tableData')
  tableData.value.forEach(item => {
    item.uvData = JSON.stringify(item.uvData)
  })
  saveMoreClient(tableData.value).then(res => {
    proxy.$modal.msgSuccess("保存成功");
    if(type === 'submit'){ // 提交
      tableData.value = []
    }
  })
} 

function echartsLogic(val){
  tableData.value.push({
    date: val.createTime,
    name: val.code,
    batchNumber:val.batchNumber,
    fillerPrice:val.fillerPrice,
    workFee:val.workFee,
    customerSampleId:val.customerSampleId,
    uvData:val.uvData
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

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      form.value. customerSampleId = '4'
      saveClient(form.value).then(response => {
        proxy.$modal.msgSuccess("保存成功");
        disposition.open = false;
      });
    }
  });
};
/** 取消按钮 */
function cancel() {
  disposition.open = false;
  reset();
};
/** 重置操作表单 */
function reset() {
  form.value = {
    resultNum: undefined,
    precisionScale: undefined,
    minLength: undefined,
    maxLength: undefined,
    errMatchLib: undefined,
    fillerPrice: undefined,
    workFee: undefined,
  };
  proxy.resetForm("userRef");
};
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
::v-deep .tableDataClass .el-input--small .el-input__inner{
  text-align: center;
}
</style>
