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
      boundaryGap: false,
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
    },
    // xAxis:[
    //   {
    //     type: 'category',
    //     data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
    //     // 坐标轴刻度，设置朝内
    //     axisTick: {
    //       inside: true
    //     },
    //     axisPointer: {
    //       type: 'shadow',
    //       shadowStyle: {
    //         color: 'rgba(200, 200, 200, 0.1)'
    //       }
    //     }
    //   }
    // ],
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
    series: [
      {
        type: 'line',
        name: '售后订单总额',
        yAxisIndex: 1,
        label: {
          show: true,
          color: '#333'
        },
        smooth: true,
        data: [120, 332, 101, 534, 900, 230, 210],
      },
      {
        type: 'line',
        name: '售后订单总额2',
        yAxisIndex: 1,
        label: {
          show: true,
          color: '#333'
        },
        smooth: true,
        data: [120, 182, 191, 234, 290, 330, 310],
      },
      {
        type: 'line',
        name: '售后订单总额3',
        yAxisIndex: 1,
        label: {
          show: true,
          color: '#333'
        },
        smooth: true,
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        type: 'line',
        name: '售后订单总额4',
        yAxisIndex: 1,
        label: {
          show: true,
          color: '#333'
        },
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        type: 'line',
        name: '售后订单总额5',
        yAxisIndex: 1,
        label: {
          show: true,
          color: '#333'
        },
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      }
    ],
    color: generateRandomColors(6)
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
