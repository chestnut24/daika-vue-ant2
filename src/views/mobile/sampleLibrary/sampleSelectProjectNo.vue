<template>
  <div class="all-frame" @scroll="scrollInformation">
    <div style="width: 340px; margin: 0px auto;">
      <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
    </div>
    <div class="projectNo-frame" >
      <div class="input-select" v-for="(item,index) in dataSource" :key="index" @click="selectAndSendProjectNo(item.projectNumber)">
        <span style="font-size: 15px;color: rgba(0,0,0,0.45)">{{item.projectNumber}}</span>
        <span style="font-size: 11px;margin-left: 16px;"><b>{{item.size}}</b></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProject} from '@api/api';
  export default {
    name: 'sampleSelectProjectNo',
    mounted() {
      this.getList();
    },
    data(){
      return{
        searchParams:{
          projectNumber:'',
          pageNo:1,
          pageSize:20,
        },
        dataSource:[],
        timer:null,
      }
    },
    methods:{
      onSearch(value) {
        console.log(value);
        this.searchParams.projectNumber = value;
        this.searchParams.pageNo = 1;
        this.dataSource = []
        this.getList();
      },
      getList(){
        getProject(this.searchParams).then((data)=>{
          console.log('data233', data);
          if (!data.result.records.length) {
            this.$message.warning('没有更多数据！');
          }else {
            this.dataSource = this.dataSource.concat(data.result.records);
          }
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
            this.searchParams.pageNo++;
            this.getList();
          }
        }, 1000)

      },
      selectAndSendProjectNo(number){
        this.$router.replace({
          path:'/app/sampleOutBuy',
          query:{
            projectNumber:number,
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