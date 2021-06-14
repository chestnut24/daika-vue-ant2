<template>
  <div class="total-frame">
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
        <a-input
          v-model="holdPressureTime"
          placeholder="请输入"
          style="width: 60%"
        v-if="data.name === '保压时间' "/>
        <a-input
          v-model="coolingTime"
          placeholder="请输入"
          style="width: 60%"
          v-if="data.name === '冷却时间' "/>
        <a-input placeholder="请输入" style="width: 60%" v-model="data.input" v-if="data.name !== '保压时间' && data.name !== '冷却时间' "/>
      </div>
    </div>
    <div class="table-frame">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
        style="width: 100%"
      >
        <a-space slot="cooling" slot-scope="text, record, i" >
          <a-input  v-model="record.cooling" />
        </a-space>
        <a-space slot="startTime" slot-scope="text, record, i" >
<!--          <a-input  v-model="record.startTime" style="width: 100%"/>-->
          <a-input v-model="record.startTime"/>
        </a-space>
        <a-space slot="delayTime" slot-scope="text, record, i" >
<!--          <a-input  v-model="record.delayTime" style="width: 100%"/>-->
          <a-input v-model="record.delayTime"/>
        </a-space>
        <a-space slot="flow" slot-scope="text, record, i">
          <a-input  v-model="record.flow" />
        </a-space>
      </a-table>
    </div>
    <div class="button-frame">
      <a-button class="submit-button" type="primary" @click="submitData">提交</a-button>
    </div>
  </div>
</template>

<script>
  import {castingTechnologySubmit} from  '@/api/api';
  export default {
    name: 'CastingTechnology',
    props:['itemObj'],
    mounted() {
      console.log('item', this.itemObj);
    },
    data(){
      return{
        holdPressureTime:'',//保压时间
        coolingTime:'',//冷却时间
        technologyArr:[
          {
            title:'压力参数',
            dataArr:[
              { name:'一段',  input:'' },
              { name:'二段',  input:'' },
              { name:'三段',  input:'' },
              { name:'四段',  input:'' },
              { name:'保压时间',  input:'' },
              { name:'冷却时间',  input:'' },
              { name:'补偿压力',  input:'' },
            ]
          },
        ],
        dataSource:[
          {monitor:'T5水'},
          {monitor:'T5吹风'},
          {monitor:'T6'},
          {monitor:'T7水'},
          {monitor:'T7吹风'},
          {monitor:'T8'},
          {monitor:'S1水'},
          {monitor:'S1吹风'},
          {monitor:'S2水'},
          {monitor:'S2吹风'},
          {monitor:'S3水'},
          {monitor:'S3吹风'},
          {monitor:'S4水'},
          {monitor:'S4吹风'},
          {monitor:'B1水'},
          {monitor:'B1吹风'},
          {monitor:'B2'},
          {monitor:'B3'},
          {monitor:'B4'},
          {monitor:'B5水'},
          {monitor:'B5吹风'},
          {monitor:'T1水'},
          {monitor:'T1吹风'},
          {monitor:'T2'},
          {monitor:'T3水'},
          {monitor:'T3吹风'},
          {monitor:'T4'},
        ],
        columns :[
          { title: '检测项', dataIndex: 'monitor', key: 'monitor', align: 'center', width:70,},
          { title: '冷却', dataIndex: 'cooling', key: 'cooling', align: 'center', scopedSlots: { customRender: 'cooling' },},
          { title: '开始时间', dataIndex: 'startTime', key: 'startTime', align: 'center', scopedSlots: { customRender: 'startTime' },},
          { title: '延迟时间', dataIndex: 'delayTime', key: 'delayTime', align: 'center',scopedSlots: { customRender: 'delayTime' }, },
          { title: '流量', dataIndex: 'flow', key: 'flow', align: 'center', scopedSlots: { customRender: 'flow' },},
        ]

      }
    },
    methods:{
      onChange(value,i) {
        console.log('Selected Time: ', value.format('YYYY-MM-DD HH:mm:ss'));
        this.dataSource[i].startTime = value.format('YYYY-MM-DD HH:mm:ss');
      },
      onChange1(value, i) {
        this.dataSource[i].delayTime = value.format('YYYY-MM-DD HH:mm:ss');
      },
      onOk(value,i) {
        console.log('onOk: ', value);
      },
      onChange2(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.holdPressureTime = dateString;
      },
      onChange3(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.coolingTime = dateString;
      },
      submitData(){
        let appCastCraftParamSubclassDTOList = [];
        this.dataSource.forEach((item,index)=>{
          console.log('this',Object.keys(item).length);
          if(Object.keys(item).length > 1){
            appCastCraftParamSubclassDTOList.push({
              monitor: item.monitor,
              cooling: item.cooling,
              startTime: item.startTime,
              delayTime: item.delayTime,
              flow: item.flow,
              // appCastCraftParamId:index,
            })
          }
        })
        const obj = {
          oneStage: this.technologyArr[0].dataArr[0].input,
          twoStage: this.technologyArr[0].dataArr[1].input,
          threeStage: this.technologyArr[0].dataArr[2].input,
          fourStage: this.technologyArr[0].dataArr[3].input,
          pressureTime: this.holdPressureTime,
          coolingTime: this.coolingTime,
          compensatePressure: this.technologyArr[0].dataArr[6].input,
          taskId:this.itemObj.appTaskId,
          appCastCraftParamSubclassDTOList:appCastCraftParamSubclassDTOList,
        }
        castingTechnologySubmit(obj).then((data)=>{
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
        this.dataSource = [
          {monitor:'T5水'},
          {monitor:'T5吹风'},
          {monitor:'T6'},
          {monitor:'T7水'},
          {monitor:'T7吹风'},
          {monitor:'T8'},
          {monitor:'S1水'},
          {monitor:'S1吹风'},
          {monitor:'S2水'},
          {monitor:'S2吹风'},
          {monitor:'S3水'},
          {monitor:'S3吹风'},
          {monitor:'S4水'},
          {monitor:'S4吹风'},
          {monitor:'B1水'},
          {monitor:'B1吹风'},
          {monitor:'B2'},
          {monitor:'B3'},
          {monitor:'B4'},
          {monitor:'B5水'},
          {monitor:'B5吹风'},
          {monitor:'T1水'},
          {monitor:'T1吹风'},
          {monitor:'T2'},
          {monitor:'T3水'},
          {monitor:'T3吹风'},
          {monitor:'T4'},
        ];
        this.holdPressureTime='';//保压时间
        this.coolingTime='';//冷却时间
        this.technologyArr=[
          {
            title:'压力参数',
            dataArr:[
              { name:'一段',  input:'' },
              { name:'二段',  input:'' },
              { name:'三段',  input:'' },
              { name:'四段',  input:'' },
              { name:'保压时间',  input:'' },
              { name:'冷却时间',  input:'' },
              { name:'补偿压力',  input:'' },
            ]
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-table-body{
    min-width: 100px!important;
  }
  .total-frame{
    width: 100%;
    .table-frame{
      width: 100%;
    }
  }
  .technology-frame{
    width: 100%;
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