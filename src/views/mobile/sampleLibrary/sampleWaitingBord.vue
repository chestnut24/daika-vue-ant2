<template>
   <div class="all-frame">
     <div class="echarts-frame">
       <div class="echarts-background-top"></div>
       <div class="echarts-background-down"></div>
       <div class="echarts-information-frame">
         <img class="samplePie" src="../../../assets/sampleLibrary/samplePieLogo.png" height="60" width="60"/>
         <div id="myChart" :style="{width: '200px', height: '200px'}"></div>
         <div class="information-frame">
           <div class="information-item">
             <div class="item-title">
               <div class="circle" style="background:#347EF2; "> </div>
               <span style="color: rgba(0,0,0,0.45)">待发总库存</span>
             </div>
             <span style="margin-left: 16px;">{{waitingNumber}}</span>
           </div>
           <div class="information-item">
             <div class="item-title">
               <div class="circle" style="background:#09C199; "> </div>
               <span style="color: rgba(0,0,0,0.45)">包装确认报废</span>
             </div>
             <span style="margin-left: 16px;">{{sureBadNumber}}</span>
           </div>
           <div class="information-item">
             <div class="item-title">
               <div class="circle" style="background:#FF9C19; "> </div>
               <span style="color: rgba(0,0,0,0.45)">待发库存报废</span>
             </div>
             <span style="margin-left: 16px;">{{waitingBadNumber}}</span>
           </div>
         </div>
       </div>
     </div>
     <div class="table-frame" @scroll="scrollInformation">
       <div class="search-frame">
         <div style="width: 250px;">
           <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
         </div>
         <div class="goWaitingBord" @click="goGetSample">
           <img src="../../../assets/sampleLibrary/goGetSample.png" height="21" width="20"/>
         </div>
       </div>
       <div class="information-frame" v-for="(item,index) in dataSource" :key="index">
         <div class="information-item-top">
           <div class="item-top-left">
             <img src="../../../assets/sampleLibrary/sampleReturnBordInformationLogo.png" height="24" width="24"/>
             <span style="font-size: 16px;margin: 0 10px">{{item.projectNo}}</span>
             <span style="font-size: 16px;">{{item.purpose}}</span>
           </div>
           <div class="item-top-right">
             <span style="font-size: 14px;color: #B0B0B0;margin-right: 12px">{{item.projectManager}}</span>
             <span style="font-size: 14px;color: #B0B0B0" ><a-icon type="right" /></span>
           </div>
         </div>
         <div class="information-item-middle">
           <div class="item-top-left">
             <div style="width: 24px;"></div>
             <span style="font-size: 13px;margin: 0 10px">{{item.projectNo}}</span>
             <span style="font-size: 13px;">{{item.batch}}</span>
           </div>
         </div>
         <div class="information-item-down">
           <div class="information">
             <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待发库库存</span>
             <span style="color: #347EF2;font-size: 18px;"><b>{{item.needSendNum}}</b></span>
           </div>
           <img src="../../../assets/sampleLibrary/sampleWatingBordBackground.png" height="57" width="152"/>
         </div>
       </div>
     </div>

   </div>
</template>

<script>
  import {getWarehouseSend, getMouldOptions, getWarehouseStatistics} from '@/api/api'
  export default {
    name: 'sampleWaitingBord',
    mounted() {
      this.getDic();
      setTimeout(()=>{
        this.getList();
      },300);
      getWarehouseStatistics().then((data)=>{

        this.waitingNumber = data.result.needSendNum; // 待发库存
        this.sureBadNumber = data.result.packScrapNum; // 包装确认报废
        this.waitingBadNumber = data.result.sendScrapNum; // 待发库存报废
        this.option.series[0].data[0].value = data.result.needSendNum; // 待发库存
        this.option.series[0].data[1].value = data.result.packScrapNum; // 包装确认报废
        this.option.series[0].data[2].value = data.result.sendScrapNum; // 待发库存报废
        this.$nextTick(()=>{
          this.drawLine();
        })
      })

    },
    data(){
      return{
        searchParams:{
          projectNo:'',
          pageNO:1,//当前页
          pageSize:20,//展示条数
        },
        option:{
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              color:['#347EF2','#09C199','#FF9C19'],
              data: [
                {value: 0, name: '待发总库存'},
                {value: 0, name: '包装确认报废'},
                {value: 0, name: '待发库存报废'},
              ]
            }
          ]
        },
        dataSource:[],
        waitingNumber:'',
        sureBadNumber:'',
        waitingBadNumber:'',
        dic:{
          noun:[],
        },
        timer:null,

      }
    },
    methods:{
      onSearch(value) {
        console.log(value);
        this.searchParams.projectNo = value;
        this.searchParams.pageNO = 1;
        this.dataSource = [];
        this.getList();
      },
      scrollInformation(){//监听滚轮滑动条事件 到底部自动刷新数据
        console.log("开始滚动！");
        let scrollHeight = document.getElementsByClassName('all-frame')[0].scrollHeight;
        let scrollTop = document.getElementsByClassName('all-frame')[0].scrollTop;
        let offsetHeight = document.getElementsByClassName('all-frame')[0].offsetHeight;
        clearTimeout(this.timer);
        this.timer = setTimeout( ()=> {
          if((scrollTop + offsetHeight) == scrollHeight) {
            console.log('到底了');
            this.searchParams.pageNO++;
            this.getList();
          }
        }, 1000)

      },
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption(this.option);
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
            this.$nextTick(()=>{
              this.dic.purpose = this.dic.noun;
              delete this.dic.noun;
              console.log('this.dic',this.dic);
            })
          });
        }
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },
      getList(){
        getWarehouseSend(this.searchParams).then((data)=>{
          data = data.result;
          if (!data.records.length) {
            this.$message.warning('没有更多数据！');
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = this.dataSource.concat(data.records);
        })
      },
      goGetSample(){
        this.$router.push({
          path:'/app/sampleGetSample',
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    height: 40px;
  }
  .all-frame{
    width: 100%;
    .echarts-frame{
      width: 100%;
      position: relative;
      .echarts-background-top{
        width: 100%;
        height: 160px;
        background: #2E7DAC;
      }
      .echarts-background-down{
        width: 100%;
        height: 75px;
        background: #E8F1F6;
      }
      .echarts-information-frame{
        width: 350px;
        height: 200px;
        background: #fff;
        position: absolute;
        top:10%;
        left: 50%;
        margin-left: -175px;
        border-radius: 5px;
        display: flex;
        .samplePie{
          position: absolute;
          top:50%;
          margin-top: -30px;
          left: 20%;
        }
        .information-frame{
          width: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-left: 20px;
          .information-item{
            width: 100%;
            .item-title{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .circle{
                width: 8px;
                height: 8px;
                border-radius: 4px;
                margin-right: 8px;
              }
            }

          }
        }
      }


    }
    .table-frame{
      width: 100%;
      height: 1000px;
      overflow-y: auto;
      background: #E8F1F6;
      padding: 0 15px;
      .search-frame{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goWaitingBord{
          width: 80px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #CDE0F5;
          border-radius: 20px;
          &:active{
            opacity: 0.5;
          }
        }
      }
      .information-frame {
        width: 100%;
        background: #fff;
        border-radius: 5px;
        margin: 12px auto;
        padding: 0 12px 13px 12px;

        .information-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .item-top-left {
            width: 80%;
            padding: 9px 0 5px 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

          .item-top-right {
            padding: 7px 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }

        .information-item-middle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          .item-top-left {
            width: 80%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }

        .information-item-down {
          width: 100%;
          background: #F5F8FA;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          padding: 5px 10px;

          .information {
            width: 50%;
            display: flex;
            flex-direction: column;
            text-align: left;
          }
        }
      }
    }
  }

</style>