<template>
  <div class="all-frame" @scroll="scrollInformation">
    <div class="search-frame">
      <div style="width: 250px;">
        <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
      </div>
      <div class="goWaitingBord" @click="goOutBuy">
        <img src="../../../assets/sampleLibrary/goWaitingBord.png" height="21" width="20"/>
      </div>
    </div>
    <div class="information-frame" v-for="(item,index) in dataSource" :key="index">
      <div class="information-item-top">
        <div class="item-top-left">
          <img src="../../../assets/sampleLibrary/inBordLogo.png" height="24" width="24"/>
          <span style="font-size: 16px;margin: 0 10px">{{item.projectNo}}</span>
          <span style="font-size: 16px;">{{item.purpose}}</span>
        </div>
        <div class="item-top-right">
          <span style="font-size: 14px;color: #B0B0B0;margin-right: 12px">{{item.projectManager}}</span>
          <span style="font-size: 14px;color: #B0B0B0" @click="goInBordModal(item)"><a-icon type="right" /></span>
        </div>
      </div>
      <div class="information-item-middle">
        <div class="item-top-left">
          <div style="width: 24px;"></div>
          <span style="font-size: 13px;margin: 0 10px">{{item.projectNo}}</span>
          <span style="font-size: 13px;">{{item.trialProductionFormNo}}</span>
        </div>
      </div>
      <div class="information-item-down">
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线数量</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.offlineCount}}</b></span>
        </div>
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线时间</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.offlineTime}}</b></span>
        </div>
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线车间</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.trialProductionSite}}</b></span>
        </div>
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待入数量</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.waitIntoNumber}}</b></span>
        </div>
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">已入库数量</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.intoWarehouse}}</b></span>
        </div>
        <div class="information">
          <span style="color:rgba(0,0,0,0.45);font-size: 14px;">预入库位</span>
          <span style="color: #347EF2;font-size: 18px;"><b>{{item.inventoryLocation}}</b></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getWarehousingManagement,getMouldOptions} from '@api/api';
  export default {
    name: 'sampleInbord',
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
          pageSize:20//展示条数
        },
        dataSource:[],
        dic:{
          noun:[],
          trialProductionSite:[],//工厂仓库
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
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
            if (name === 'noun') {
              this.dic.purpose = this.dic.noun;
            }
          });
        }
        console.log('dic', this.dic);
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
        getWarehousingManagement(this.searchParams).then((data)=>{
          console.log('data', data);
          data = data.result;
          if (!data.records.length) {
            this.$message.warning('没有更多数据！');
          }else {
            data.records.forEach((item,index)=>{
              if(item.offlineTime){
                item.offlineTime = item.offlineTime.replace(/-/g,"/");
                console.log('item.offlineTime',item.offlineTime);
              }
            })
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
      goInBordModal(item){
        this.$router.push({
          path:'/app/sampleInbordModal',
          query:{
            item:item
          }
        })
      },
      goOutBuy(){
        this.$router.push({
          path:'/app/sampleOutBuy',
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
    height: 1000px;
    overflow-y: auto;
    padding: 7px 16px;
    background: #E8F1F6;
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
    .information-frame{
      width: 100%;
      background: #fff;
      border-radius: 5px;
      margin: 12px auto;
      padding: 0 12px 13px 12px;
      .information-item-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item-top-left{
          width: 80%;
          padding: 9px 0 5px 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .item-top-right{
          padding: 7px 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
      .information-item-middle{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        .item-top-left{
          width: 80%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
      .information-item-down{
        width: 100%;
        background: #F5F8FA;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding:5px 10px;
        .information{
          width: 30%;
          display: flex;
          flex-direction: column;
          text-align: left;
        }
      }
    }

  }

</style>