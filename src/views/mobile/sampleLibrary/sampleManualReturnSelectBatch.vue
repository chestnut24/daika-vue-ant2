<template>
  <div class="all-frame" >
    <div style="width: 340px; margin: 0px auto;">
      <a-input-search placeholder="请输入批次号"  :disabled="true" v-model="searchParams.projectNo"/>
    </div>
    <div class="projectNo-frame" >
      <div class="input-select" v-for="(item,index) in dataSource" :key="index" @click="selectAndSendProjectNo(item)">
        <span style="font-size: 15px;color: rgba(0,0,0,0.45)">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBatch,getMouldOptions} from '@api/api'
  export default {
    name: 'sampleManualReturnSelectBatch',
    mounted() {
      this.getDic();
      setTimeout(()=>{
        this.searchParams.projectNo = this.$route.query.projectNo;
        this.searchParams.purposeLabel = this.$route.query.purpose;
        this.dic.purpose.forEach((item)=>{
          if(item.label === this.$route.query.purpose ){
            this.searchParams.purpose = item.value;
          }
        })
        this.getList();
      },300)

    },
    data(){
      return{
        searchParams:{
          projectNo:'',
          purpose:'',
          purposeLabel:'',
        },
        dataSource:[],
        dic:{
          noun:[],
        }
      }
    },
    methods:{
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
        getBatch(this.searchParams).then((data)=>{
          console.log('data233', data);
          if (!data.result.length) {
            console.log('当前页数据妹有');
          }else {
            this.dataSource = data.result;
          }
        })
      },
      // scrollInformation(){//监听滚轮滑动条事件 到底部自动刷新数据
      //   console.log("开始滚动！");
      //   let scrollHeight = document.getElementsByClassName('all-frame')[0].scrollHeight;
      //   let scrollTop = document.getElementsByClassName('all-frame')[0].scrollTop;
      //   let offsetHeight = document.getElementsByClassName('all-frame')[0].offsetHeight;
      //   if((scrollTop + offsetHeight) == scrollHeight) {
      //     console.log('到底了');
      //     this.searchParams.pageNo++;
      //     this.getList();
      //   }
      // },
      selectAndSendProjectNo(number){
        this.$router.replace({
          path:'/app/sampleManualReturnBord',
          query:{
            projectNumber:this.searchParams.projectNo,
            purpose:this.searchParams.purposeLabel,
            batch:number,
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    height: 40px;
  }
  .all-frame {
    width: 100%;
    height: 1000px;
    overflow-y: auto;
    padding-top: 7px;
    background: #E8F1F6;
    .projectNo-frame{
      width: 100%;
      background: #fff;
      border-radius: 10px 10px 0 0;
      margin-top: 8px;
      .input-select{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 15px 22px;
        border-width: 1px 0 1px 0;
        border-color: #F6F6F7;
        border-style: solid;
        &:active{
          background: #E8F1F6;
        }
      }
    }
  }

</style>