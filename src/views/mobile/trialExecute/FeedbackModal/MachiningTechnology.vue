<template>
  <div class="total-frame">
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
        <a-input placeholder="请输入" style="width: 30%" v-model="data.input"/>
      </div>
    </div>
    <div class="table-input-frame">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>进给率mm/r</b></span>
      </div>
      <div class="input-frame" v-for="(data, index) in tableInputArr" :key="index">
        <div class="table-title">
          <span>{{data.name}}</span>
        </div>
        <div class="table-input">
          <a-input placeholder="请输入" style="width: 100%" v-model="data.input"/>
        </div>
      </div>
    </div>
    <div class="button-frame">
      <a-button class="submit-button" type="primary" @click="submitData">提交</a-button>
    </div>
  </div>
</template>

<script>
  import {machiningTechnologySubmit} from  '@/api/api';
  export default {
    name: 'MachiningTechnology',
    props:['itemObj'],
    data(){
      return{
        machiningTime:'',//单件加工时间
        technologyArr:[
          {
            title:'转速r/min',
            dataArr:[
              { name:'气门孔划窝',  input:'' },
              { name:'气门孔',  input:'' },
              { name:'cnc1',  input:'' },
              { name:'cnc2',  input:'' },
              { name:'螺栓孔',  input:'' },
              { name:'螺栓孔倒角或背窝',  input:'' },
            ]
          },
        ],
        tableInputArr:[
          { name:'两驼峰间',  input:'' },
          { name:'帽口',  input:'' },
          { name:'胎圈座及驼峰',  input:'' },
          { name:'正面',  input:'' },
          { name:'内轮阀',  input:'' },
          { name:'螺栓孔',  input:'' },
          { name:'贴平衡块处',  input:'' },
          { name:'螺栓孔倒角或背窝',  input:'' },
          { name:'法兰面及中心孔',  input:'' },
          { name:'气门孔',  input:'' },
          { name:'毛刺',  input:'' },
          { name:'气门孔划窝',  input:'' },
        ]

      }
    },
    methods:{
      submitData(){
        const obj = {
          jglLtfj: this.tableInputArr[0].input,
          jglMk: this.tableInputArr[1].input,
          jglTqzjtf: this.tableInputArr[2].input,
          jglZm: this.tableInputArr[3].input,
          jglNlw: this.tableInputArr[4].input,
          jglLsk: this.tableInputArr[5].input,
          jglTphk: this.tableInputArr[6].input,
          jglLskhdj: this.tableInputArr[7].input,
          jglFlmjzxk: this.tableInputArr[8].input,
          jglQmk: this.tableInputArr[9].input,
          jglMc: this.tableInputArr[10].input,
          jglQmkho: this.tableInputArr[11].input,
          taskId:this.itemObj.appTaskId,
          zsQmkho:this.technologyArr[0].dataArr[0].input,
          zsQmk:this.technologyArr[0].dataArr[1].input,
          zsCncA:this.technologyArr[0].dataArr[2].input,
          zsCncB:this.technologyArr[0].dataArr[3].input,
          zsLsk:this.technologyArr[0].dataArr[4].input,
          zsLskHdj:this.technologyArr[0].dataArr[5].input,
        }
        machiningTechnologySubmit(obj).then((data)=>{
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
        this.tableInputArr = [
          { name:'两驼峰间',  input:'' },
          { name:'帽口',  input:'' },
          { name:'胎圈座及驼峰',  input:'' },
          { name:'正面',  input:'' },
          { name:'内轮阀',  input:'' },
          { name:'螺栓孔',  input:'' },
          { name:'贴平衡块处',  input:'' },
          { name:'螺栓孔倒角或背窝',  input:'' },
          { name:'法兰面及中心孔',  input:'' },
          { name:'气门孔',  input:'' },
          { name:'毛刺',  input:'' },
          { name:'气门孔划窝',  input:'' },
        ]
        this.technologyArr = [
          {
            title:'转速r/min',
            dataArr:[
              { name:'气门孔划窝',  input:'' },
              { name:'气门孔',  input:'' },
              { name:'cnc1',  input:'' },
              { name:'cnc2',  input:'' },
              { name:'螺栓孔',  input:'' },
              { name:'螺栓孔倒角或背窝',  input:'' },
            ]
          },
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  .total-frame{
    width: 100%;
  }
  .technology-frame{
    width: 100%;
    margin-bottom: 10px;
    .technology-title{
      width: 100%;
      height: 30px;
      display: flex;
      background-color: #F4F5F7;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px;
      .divide{
        padding-left: 2px;
        height:20px;
        background-color: #2E7AF1;
        margin-right: 10px
      }
    }
    .technology-input{
      width: 100%;
      padding: 10px 10px;
      border-width: 0 0 1px 0;
      border-color: #F2F2F4;
      border-style: solid;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  .top-input{
    width: 100%;
    padding: 10px 5px;
    border-width: 0 0 1px 0;
    border-color: #F2F2F4;
    border-style: solid;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .table-input-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .technology-title{
      width: 100%;
      height: 30px;
      display: flex;
      background-color: #F4F5F7;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px;
      .divide{
        padding-left: 2px;
        height:20px;
        background-color: #2E7AF1;
        margin-right: 10px
      }
    }
    .input-frame{
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #F2F4F6;;
      .table-title{
        width: 50%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: #F5F8FA;
      }
      .table-input{
        width: 50%;
        height: 50px;
        background-color: #fff;
        display: flex;
        align-items: center;
      }
    }
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

</style>