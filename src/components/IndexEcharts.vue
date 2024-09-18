<template>
  <div id="container" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { toRefs } from 'vue';
const props = defineProps({
  
  fileList: {
    type: Array,
    // default: () => ["doc", "xls", "ppt", "txt", "pdf","xlsx"],
    default: () => {},
  },
  // 是否显示提示
  
});
const { fileList }=toRefs(props)
const series=ref([]);
onMounted(() => {
  console.log(fileList.value,"fileList")
 
  fileList.value.forEach((item,i)=>{
     const itemList=[];
    item.xData.forEach((ele,index)=>{
   
    itemList.push([ele, item.yData[index]])
    
    })
    series.value.push(
      {
        connectNulls: false,
        type: 'line',
        name: '售后订单总额',
        lineStyle:{
          width:2,
          type:"solid",
          color: generateRandomColors(i)
        },
        smooth: false,
       
        data:itemList,
        // data:[[320, 0.3194239306605805],[220, 0.2194239306605805],[120, 0.1194239306605805],[420, 0.4194239306605805]],
        
        showSymbol: false
      }
      
    )
    
  })
 console.log(series.value)
  var dom = document.getElementById('container')
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  })
  var option
  option = {
    title: {
      text: '对比折线图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      
    },
    grid: {
      left: '1%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false
    },
    yAxis:[
      {
        type: 'value',
        alignTicks: true
      },
      {
        type: 'value',
        name: `单位：`,
        nameTextStyle: {
          color: '#22b8c8',
          fontWeight: 'bold'
        }
      }
    ],
    series:  series.value,
    
  }
  if (option && typeof option === 'object') {
    myChart.setOption(option)
  }

  function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256); // 红色值
      const g = Math.floor(Math.random() * 256); // 绿色值
      const b = Math.floor(Math.random() * 256); // 蓝色值
      colors.push(`rgb(${r},${g},${b})`);
    }
    return colors;
  }
})
</script>

<style lang="scss" scoped></style>
