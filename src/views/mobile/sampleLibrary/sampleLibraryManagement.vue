<template>
   <div class="all-frame">
     <div class="navigation">
       <div class="top-frame">

       </div>
       <div class="down-frame">

       </div>
       <div class="navigation-frame">
         <div class="navigation-item" @click="goInBord">
           <img src="../../../assets/sampleLibrary/inbold.png" height="40" width="40"/>
           <span style="font-size: 13px">入库管理</span>
         </div>
         <div class="navigation-item" @click="goOutBord">
           <img src="../../../assets/sampleLibrary/outBold.png" height="40" width="40"/>
           <span style="font-size: 13px">出库管理</span>
         </div>
         <div class="navigation-item" @click="goWaitingBord">
           <img src="../../../assets/sampleLibrary/waitingbold.png" height="40" width="40"/>
           <span style="font-size: 13px">待发库</span>
         </div>
         <div class="navigation-item" @click="goReturnBord">
           <img src="../../../assets/sampleLibrary/returnbold.png" height="40" width="40"/>
           <span style="font-size: 13px">回库管理</span>
         </div>
         <div class="navigation-item" @click="goOffline">
           <img src="../../../assets/sampleLibrary/Offline.png" height="40" width="40"/>
           <span style="font-size: 13px">即将下线</span>
         </div>
       </div>
     </div>
     <div class="information-frame" @scroll="scrollInformation">
       <div style="width: 340px; margin: 66px auto 0 auto;">
         <a-input-search placeholder="请输入戴卡部件号" style="height: 40px" @search="onSearch" />
       </div>
       <a-divider/>
       <div class="information-item" v-for="(item,index) in dataSource" :key="index">
         <div class="information-item-top">
           <div class="item-top-left">
             <img src="../../../assets/sampleLibrary/item.png" height="24" width="24"/>
             <span style="font-size: 16px;margin: 0 10px">{{item.projectNo}}</span>
             <span style="font-size: 16px;">{{item.purpose}}</span>
           </div>
           <div class="item-top-right">
             <span style="font-size: 14px;color: #B0B0B0;margin-right: 12px">{{item.projectManager}}</span>
             <span style="font-size: 14px;color: #B0B0B0" @click="goInformation(item)"><a-icon type="right" /></span>
           </div>
         </div>
         <div class="information-item-down">
           <div class="information">
             <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待查：</span>
             <span style="color: #347EF2;font-size: 18px;"><b>{{item.stock}}</b></span>
           </div>
           <div class="information">
             <span style="color:rgba(0,0,0,0.45);font-size: 14px;">包装中：</span>
             <span style="color: #347EF2;font-size: 18px;"><b>{{item.packNum}}</b></span>
           </div>
           <div class="information">
             <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待发：</span>
             <span style="color: #347EF2;font-size: 18px;"><b>{{item.needSendNum}}</b></span>
           </div>
           <div class="information">
             <span style="color:rgba(0,0,0,0.45);font-size: 14px;">批次：</span>
             <span style="color: #347EF2;font-size: 18px;"><b>{{item.batchNum}}</b></span>
           </div>

         </div>

       </div>
     </div>

   </div>
</template>

<script>
  import {getMouldOptions,getSampleList, getSampleById} from '@/api/api'
  export default {
    name: 'sampleLibraryManagement',
    mounted() {
      this.getDic();
      setTimeout(()=>{
        this.getList();
      },300)
    },
    data(){
      return{
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageNO:1,//当前页
          pageSize:20//展示条数
        },
        dataSource:[],
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
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
        console.log('当前页',this.searchParams.pageNO);
        getSampleList(this.searchParams).then((data)=>{
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
      scrollInformation(){//监听滚轮滑动条事件 到底部自动刷新数据
        console.log("开始滚动！");
        let scrollHeight = document.getElementsByClassName('information-frame')[0].scrollHeight;
        let scrollTop = document.getElementsByClassName('information-frame')[0].scrollTop;
        let offsetHeight = document.getElementsByClassName('information-frame')[0].offsetHeight;
        clearTimeout(this.timer);
        this.timer = setTimeout( ()=> {
          if((scrollTop + offsetHeight) == scrollHeight) {
            console.log('到底了');
            this.searchParams.pageNO++;
            this.getList();
          }
        }, 1000)

      },
      goInformation(item){ //去详细信息页
        console.log('item', item);
        this.$router.push({
          path:'/app/sampleInformation',
          query:{
            projectNo:item.projectNo,
            purpose:item.purpose,
            id:item.id,
            projectManager:item.projectManager,
            stock:item.stock,
            packNum:item.packNum,
            needSendNum:item.needSendNum
          }
        })
      },
      goOffline(){ //进入即将下线界面
        this.$router.push({
          path:'/app/sampleOffline',
        })
      },
      goInBord(){ //进入即将下线界面
        this.$router.push({
          path:'/app/sampleInbord',
        })
      },
      goReturnBord(){ //进入回库管理
        this.$router.push({
          path:'/app/sampleReturnBord',
        })
      },
      goOutBord(){ //进入出库管理
        this.$router.push({
          path:'/app/sampleOutBord',
        })
      },
      goWaitingBord(){ //进入待发库管理
        this.$router.push({
          path:'/app/sampleWaitingBord',
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    height: 40px;
  }
  /deep/.ant-divider-horizontal{
    margin: 7px 0 ;
  }
  .all-frame{
    width: 100%;
    height: 100%;
    .navigation{
      width: 100%;
      position: relative;
      .navigation-frame{
        width: 348px;
        height: 100px;
        position: absolute;
        top: 80px;
        left: 50%;
        z-index: 2;
        border-radius: 5px;
        margin-left: -174px;
        margin-top: -50px;
        background: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .navigation-item{
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
      .top-frame{
        width: 100%;
        height: 70px;
        background: #3185B4;
      }
      .down-frame{
        width: 100%;
        height: 30px;
        background: #E8F1F6;
      }
    }

    .information-frame{
      width: 100%;
      height: 650px;
      overflow-y: auto;
      background: #E8F1F6;
      .information-item{
        width: 340px;
        background: #fff;
        border-radius: 5px;
        margin: 12px auto;
        padding: 0 15px 12px 15px;
        .information-item-top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          .item-top-left{
            width: 80%;
            padding: 7px 0;
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
        .information-item-down{
          width: 100%;
          height: 56px;
          background: #F5F8FA;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          padding:5px 10px;
          .information{
            width: 20%;
            display: flex;
            flex-direction: column;
            text-align: left;
          }
        }
      }
    }
  }

</style>