<template>
    <div class="all-frame" >
      <div class="title-frame">
        <div class="title-name">
          <img src="../../../assets/sampleLibrary/item.png" height="24" width="24"/>
          <span style="font-size: 18px;margin-left: 8px"><b>样件信息</b></span>
        </div>
        <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
        <div class="title-down">
          <div class="information-item-up">
            <span class="information-item">戴卡部件号：{{titleObj.projectNo}}</span>
            <span class="information-item">用途：{{titleObj.purpose}}</span>
            <span class="information-item">项目经理：{{titleObj.projectManager}}</span>

          </div>
          <div class="information-item-down">
            <div class="information">
              <span style="color:#6F7071;">待查：</span>
              <span style="color: #347EF2;font-size: 18px"><b>{{titleObj.stock}}</b></span>
            </div>
            <div class="information">
              <span style="color:#6F7071;">包装中：</span>
              <span style="color: #347EF2;font-size: 18px"><b>{{titleObj.packNum}}</b></span>
            </div>
            <div class="information">
              <span style="color:#6F7071;">待发：</span>
              <span style="color: #347EF2;font-size: 18px"><b>{{titleObj.needSendNum}}</b></span>
            </div>
          </div>
        </div>
      </div>
      <div class="sample-frame" v-for="(item,index) in dataSource" :key="index">
        <div class="sample-item">
          <div class="status-frame" v-if="item.warehouseIntoStatus">
            <span style="color:#09C199;">外购</span>
          </div>
          <div class="sample-number-frame">
            <span style="font-size: 16px;">{{titleObj.projectNo}}</span>
            <span style="font-size: 16px;margin-left: 14px">{{item.batch}}</span>
          </div>
          <div class="sample-information-frame">
            <span class="information-span" >待查：{{item.stock}}</span>
            <span class="information-span" style="padding-left: 20px">库位：{{item.inventoryLocation}}</span>
            <span class="information-span"  >工厂仓库：{{item.factoryWareHouse}}</span>
            <span class="information-span" style="padding-left: 20px">样件位置：{{item.exemplarLocation}}</span>
          </div>
          <div class="sample-button-frame">
            <a-button class="button-style" style="background: #F86162;color: #fff " @click="goScrap(item)">报废</a-button>
            <a-button class="button-style" type="primary"  @click="goAdjust(item)">调整</a-button>
          </div>

        </div>
      </div>

    </div>
</template>

<script>
  import {getMouldOptions,getDictItemsFromCache, getSampleById} from '@/api/api'
  export default {
    name: 'sampleInformation',
    beforeRouteEnter (to, from, next) {
      // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
        next(vm => {
          if(vm.$route.query.projectNo){
            vm.titleObj = vm.$route.query;
            console.log('titleObj', vm.titleObj);
          }
          vm.getDic();
          setTimeout(()=>{
            vm.dic.purpose.forEach((item)=>{
              if(item.text === vm.titleObj.purpose){
                vm.purposeValue = item.value;
              }
            })
            vm.getList();
          },300)
        })
    },
    mounted() {
      if(this.$route.query.projectNo){
        this.titleObj = this.$route.query;
      }
      this.getDic();
      setTimeout(()=>{
        this.dic.purpose.forEach((item)=>{
          if(item.text === this.titleObj.purpose){
            this.purposeValue = item.value;
          }
        })
        this.getList();
      },300)
    },
    data(){
      return{
        titleObj:{
          projectNo:'',
          purpose:'',
          projectManager:'',
          stock:'',
          packNum:'',
          needSendNum:''
        },
        purposeValue:0,//用途的value
        dataSource:[],
        dic:{
          factoryWareHouse:[],
          noun:[]
        }
      }
    },
    methods:{
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          if (getDictItemsFromCache(searchName)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(searchName);
            if (name === 'noun') {
              this.dic.purpose = this.dic.noun;
            }
          }
          // getMouldOptions(searchName, '').then((data) => {
          //   this.dic[name] = data;
          //
          // });
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
        const obj = {
          projectNo: this.titleObj.projectNo,
          purpose:this.purposeValue
        }
        getSampleById(obj).then((data)=>{
          console.log('data233',data);
          if (!data.result.length) {
            console.log('当前页数据妹有');
          }else {
            for (let i = 0; i < data.result.length; i++) { // 遍历返回的数据列表
              for (let name in data.result[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.result[i][name] && Number(data.result[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.result[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.result;
          this.titleObj.stock = 0;
          this.dataSource.forEach((item,index)=>{
            this.titleObj.stock += item.stock;
          })
        })
      },
      goScrap(item){
        this.$router.replace({
          path:'/app/sampleScrap',
          query:{
            item:item,
            titleObj:this.titleObj,
          }
        })
      },
      goAdjust(item){
        this.$router.replace({
          path:'/app/sampleAdjust',
          query:{
            item:item,
            titleObj:this.titleObj,
          }
        })
      }

    }
  }
</script>

<style scoped lang="less">
  .all-frame{
    width: 100%;
    .title-frame{
      width: 100%;
      height: 200px;
      border-radius: 10px;
      background: #fff;
      .title-name{
        width: 100%;
        padding: 16px 0 0 24px;
        border-radius: 10px 10px 0 0 ;
      }
      .title-down{
        width: 100%;
        padding:12px 14px;
        .information-item-up{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .information-item{
            width: 50%;
            margin-bottom: 9px;
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
    .sample-frame{
      width: 100%;
      padding: 0 14px;
      .sample-item{
        width: 100%;
        height: 162px;
        background: #fff;
        margin-top: 8px;
        position: relative;
        padding: 9px 12px 15px 12px;
        .status-frame{
          width: 64px;
          height: 24px;
          background: #DCF6F1;
          text-align: center;
          border-radius: 0  0 0 24px;
          position: absolute;
          right: 0;
          top:0;
        }
        .sample-number-frame{
          width: 100%;
          margin-bottom: 17px;
        }
        .sample-information-frame{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .information-span{
            width: 50%;
            color: rgba(0,0,0,0.45);
            margin-bottom: 9px;
          }
        }
        .sample-button-frame{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .button-style{
            width: 48%;
            height: 40px;
          }
        }
      }
    }
  }

</style>