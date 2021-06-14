<template>
  <div class="all-frame" @scroll="scrollInformation">
    <div class='trial-exe-tab-wrap'>
      <a-tabs @change="changeTab">
        <a-tab-pane key="1" tab="出库任务">
          <div class='tab-pane-scroll'>
            <div class="search-frame">
              <div style="width: 100%">
                <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
              </div>
            </div>
            <div class="information-frame" v-for="(item,index) in dataSource1" :key="index">
              <div class="information-item-top">
                <div class="item-top-left">
                  <img src="../../../assets/sampleLibrary/sampleOutBordLogo.png" height="24" width="24"/>
                  <span style="font-size: 16px;margin: 0 10px">{{item.projectNo}}</span>
                  <span style="font-size: 16px;">{{item.purpose}}</span>
                </div>
                <div class="item-top-right">
                  <span style="font-size: 14px;color: #B0B0B0;margin-right: 12px">{{item.projectManager}}</span>
                  <span style="font-size: 14px;color: #B0B0B0" @click="goOutBordModal(item)"><a-icon type="right" /></span>
                </div>
              </div>
              <div class="information-item-middle">
                <div class="item-top-left">
                  <div style="width: 24px;"></div>
                  <span style="font-size: 13px;margin: 0 10px">{{item.projectNo}}</span>
                  <span style="font-size: 13px;">{{item.shippingFlowSheet}}</span>
                </div>
              </div>
              <div class="information-item-down">
                <div class="information1">
                  <span style="color:rgba(0,0,0,0.45);font-size: 14px;">包装中</span>
                  <span style="color: #347EF2;font-size: 18px;"><b>{{item.packNum}}</b></span>
                </div>
                <div class="information1">
                  <span style="color:rgba(0,0,0,0.45);font-size: 14px;">发样数量</span>
                  <span style="color: #347EF2;font-size: 18px;"><b>{{item.sendSample}}</b></span>
                </div>
                <div class="information1">
                  <span style="color:rgba(0,0,0,0.45);font-size: 14px;">已出库数量</span>
                  <span style="color: #347EF2;font-size: 18px;"><b>{{item.outWarehouse}}</b></span>
                </div>
              </div>
              <div class="information-batch-frame">
                <div class="batch" v-for="(item2,index2) in item.batchArr" :key="index2">
                  <span style="color: #399DBC">{{item2}}</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="转轮任务">
          <div class='tab-pane-scroll'>
            <div class="search-frame">
              <div style="width: 100%">
                <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
              </div>
            </div>
            <div class="information-frame" v-for="(item,index) in dataSource2" :key="index">
              <div class="information-item-top">
                <div class="item-top-left">
                  <img src="../../../assets/sampleLibrary/sampleReturnBordInformationLogo.png" height="24" width="24"/>
                  <span style="font-size: 16px;margin: 0 10px">{{item.projectNo}}</span>
                  <span style="font-size: 16px;">{{item.purpose}}</span>
                </div>
                <div class="item-top-right">
                  <span style="font-size: 14px;color: #B0B0B0;margin-right: 12px">{{item.projectManager}}</span>
                  <span style="font-size: 14px;color: #B0B0B0"  @click="goOutBordModal(item)"><a-icon type="right" /></span>
                </div>
              </div>
              <div class="information-item-middle">
                <div class="item-top-left">
                  <div style="width: 24px;"></div>
                  <span style="font-size: 13px;margin: 0 10px">{{item.projectNo}}</span>
                  <span style="font-size: 13px;">{{item.shippingFlowSheet}}</span>
                </div>
              </div>
              <div class="information-item-down">
                <div class="information">
                  <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待回数量</span>
                  <span style="color: #347EF2;font-size: 18px;"><b>{{item.needReturnNum}}</b></span>
                </div>
                <div class="information">
                  <span style="color:rgba(0,0,0,0.45);font-size: 14px;">已回数量</span>
                  <span style="color: #347EF2;font-size: 18px;"><b>{{item.returnNum}}</b></span>
                </div>
              </div>
              <div class="information-batch-frame">
                <div class="batch" v-for="(item2,index2) in item.batchArr" :key="index2">
                  <span style="color: #399DBC">{{item2}}</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import {getMouldOptions,getWarehouseOut} from '@api/api'
  export default {
    name: 'sampleOutBord',
    mounted() {
      this.getDic();
      setTimeout(()=>{
        this.getList();
      },300);
    },
    data(){
      return{
          searchParams:{
            projectNo:'',
            pageNO:1,//当前页
            pageSize:20,//展示条数
            judgeReel:false
          },
          dataSource1:[],
          dataSource2:[],
          dic:{
            noun:[],
          },
        selectTab:'1',//默认选中的tab页
        timer:null,

      }
    },
    methods:{
      changeTab(key){
        console.log('key',key);
        this.selectTab = key;
        this.searchParams.projectNo = '';
        this.onSearch('');
      },
      onSearch(value) {
        console.log(value);
        this.searchParams.projectNo = value;
        this.searchParams.pageNO = 1;
        if(this.selectTab == '1'){
          this.dataSource1 = [];
          this.searchParams.judgeReel = false;
        }else{
          this.dataSource2 = [];
          this.searchParams.judgeReel = true;
        }
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
            if(this.selectTab == '1'){
              this.searchParams.judgeReel = false;
            }else{
              this.searchParams.judgeReel = true;
            }
            this.getList();
          }
        }, 1000)

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
        getWarehouseOut(this.searchParams).then((data)=>{
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
          if(this.selectTab == '1'){
            this.dataSource1 = this.dataSource1.concat(data.records);
            this.dataSource1.forEach((item,index)=>{
              this.dataSource1[index].batchArr = [];
              item.batch.split(',').forEach((item2)=>{
                if(item2!=''){
                  this.dataSource1[index].batchArr.push(item2);
                }
              })
            });
          }else{
            this.dataSource2 = this.dataSource2.concat(data.records);
            this.dataSource2.forEach((item,index)=>{
              this.dataSource2[index].batchArr = [];
              item.batch.split(',').forEach((item2)=>{
                if(item2!=''){
                  this.dataSource2[index].batchArr.push(item2);
                }
              })
            });
          }
        })
      },
      goOutBordModal(item){
        this.$router.push({
          path:'/app/sampleOutBordModal',
          query:{
            id:item.id,
            judgeReel:this.selectTab
          }
        })

      }
    },
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    height: 40px;
  }
  /deep/.ant-tabs-nav{
    width: 100%;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab{
    width: 45%;
    text-align: center;
  }
  .all-frame{
    width: 100%;
    height: 1000px;
    overflow-y: auto;
    background: #E8F1F6;
    .trial-exe-tab-wrap{
      width: 100%;
      padding: 7px 16px;
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
          .information1 {
            width: 33%;
            display: flex;
            flex-direction: column;
            text-align: left;
          }
        }
        .information-batch-frame{
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .batch{
            width: 48%;
            background: #F5F8FA;
            border-radius: 13px;
            padding: 5px 5px;
            display: flex;
            align-items: center;
            margin-top: 12px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
          }
        }
      }
    }

  }


</style>