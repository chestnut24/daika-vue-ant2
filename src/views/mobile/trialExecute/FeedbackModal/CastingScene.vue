<template>
  <div class="total-frame">
    <div class="technology-frame">
      <div class="technology-input" v-for="(data, index2) in dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
       <span style="width: 30%;text-align: right">{{data.info}}</span>
      </div>
    </div>
    <div class="input-frame"v-for="(item, index) in InputArr" :key="index">
      <span>{{item.name}}：</span>
      <a-input placeholder="请输入"  v-model="item.input" style="margin-top: 10px"/>
    </div>

    <div class="button-frame">
      <a-button class="submit-button" type="primary" @click="submitData">提交</a-button>
    </div>
  </div>
</template>

<script>
  import {castingSceneSubmit} from  '@/api/api';
  export default {
    name: 'CastingScene',
    props:['itemObj'],
    mounted() {
      console.log('item', this.itemObj);
      this.dataArr[0].info = this.itemObj.productionTime;
      this.dataArr[1].info = this.itemObj.productionMachine;
    },
    data(){
      return{
        dataArr:[
          {
            name:'试制日期',info:''
          },
          {
            name:'试制机台',info:''
          },
        ],
        InputArr:[
          {name:'铝液温度',input:''},
          {name:'生产改动工艺',input:''},
          {name:'小结',input:''},
        ]
      }
    },
    methods:{
      submitData(){
        const obj = {
          alTemp: this.InputArr[0].input,
          updateCraft: this.InputArr[1].input,
          summary: this.InputArr[2].input,
          taskId:this.itemObj.appTaskId,
        };
        castingSceneSubmit(obj).then((data)=>{
          if(data.success){
            this.$message.success('提交成功');
            this.$router.back(-1);
            this.clearData();
          }else{
            this.$message.warning('提交失败');
          }
        })
      },
      clearData(){
        this.InputArr = [
          {name:'铝液温度',input:''},
          {name:'生产改动工艺',input:''},
          {name:'小结',input:''},
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  .total-frame{
    width: 100%;
  }
  .technology-input{
    width: 100%;
    padding: 10px 10px;
    border-width: 0 0 1px 0;
    border-color: #F2F2F4;
    border-style: solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button-frame{
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
    .submit-button{
      width: 80%;
    }
  }
  .input-frame{
    width: 100%;
    padding: 10px 10px;
  }

</style>