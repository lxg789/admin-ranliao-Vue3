<template>
  <div id="container" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import * as echarts from 'echarts'
onMounted(() => {
  var dom = document.getElementById('container')
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  })
  var option
  option = {
    title: {
      text: '月工资展示'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['2019年', '2020年', '2021年', '2022年', '2023年']
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
      boundaryGap: false,
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '2019年',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '2020年',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '2021年',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: '2022年',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '2023年',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
  if (option && typeof option === 'object') {
    myChart.setOption(option)
  }
})
</script>

<style lang="scss" scoped></style>
