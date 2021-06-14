<template>
  <div class='total-frame'>
    <!--    如果是添加工艺记录-->
    <span v-if="mode==='add'">
    <div class='technology-frame' v-for='(item, index) in technologyArr' :key='index'>
      <div class='technology-title' style='height: 30px'>
        <span class='divide'> </span>
        <span><b>{{ item.title }}</b></span>
      </div>
      <div class='technology-input' v-for='(data, index2) in item.dataArr' :key='index2'>
        <span style='width: 30%'>{{ data.name }}</span>
        <span v-if="data.name === '保压时间' " style='width: 45%'>
        <a-date-picker
          v-model='holdPressureTime'
          format='YYYY-MM-DD HH:mm:ss'
          show-time
          @change='onChange2'
          @ok='onOk'
          />
          </span>
         <span v-if="data.name === '冷却时间' " style='width: 45%'>
        <a-date-picker
          v-model='coolingTime'
          format='YYYY-MM-DD HH:mm:ss'
          show-time
          @change='onChange3'
          @ok='onOk'
       />
         </span>
        <a-input placeholder='请输入' style='width: 45%' v-model='data.input'
                 v-if="data.name !== '保压时间' && data.name !== '冷却时间' " />
      </div>
    </div>
    <div class='table-frame'>
           <div class='table-title'>
        <span class='divide'> </span>
        <span><b>进给率</b></span>
      </div>
      <a-table
        :dataSource='dataSource'
        :columns='columns'
        bordered
        :pagination=false
      >
        <a-space slot='cooling' slot-scope='text, record, i' class='operate-row'>
          <a-input v-model='record.cooling' style='width: 100%' />
        </a-space>
        <a-space slot='startTime' slot-scope='text, record, i' class='operate-row'>
          <!--          <a-input  v-model="record.startTime" style="width: 100%"/>-->
          <a-date-picker
            v-model='record.startTime'
            format='YYYY-MM-DD HH:mm:ss'
            show-time
            placeholder='日期'
            @change='onChange(record.startTime , i)'
            @ok='onOk' />
        </a-space>
        <a-space slot='delayTime' slot-scope='text, record, i' class='operate-row'>
          <!--          <a-input  v-model="record.delayTime" style="width: 100%"/>-->
          <a-date-picker
            v-model='record.delayTime'
            format='YYYY-MM-DD HH:mm:ss'
            show-time
            placeholder='日期'
            @change='onChange1(record.delayTime, i)'
            @ok='onOk' />
        </a-space>
        <a-space slot='flow' slot-scope='text, record, i' class='operate-row'>
          <a-input v-model='record.flow' style='width: 100%' />
        </a-space>
      </a-table>
    </div>
    <div class='button-frame'>
      <a-button class='submit-button' type='primary' @click='submitData'>提交</a-button>
    </div>
      </span>
    <span v-if="mode==='show'">
 <div class='technology-frame' v-for='(item, index) in technologyShowArr' :key='index'>
      <div class='technology-title' style='height: 30px'>
        <span class='divide'> </span>
        <span><b>{{ item.title }}</b></span>
      </div>
      <div class='technology-input' v-for='(data, index2) in item.dataArr' :key='index2'>
         <span style='width: 30%'>{{ data.name }}</span>
        <span style='width: 30%'>{{ recordObj[data.param] }}</span>
      </div>
    </div>


  <div class='table-frame'>
    <a-table
      :dataSource='showDataSource'
      :columns='columns'
      bordered
      :pagination=false
    >

    </a-table>
  </div>
    </span>
  </div>
</template>

<script>
import {castingTechnologySubmit} from  '@/api/api';
export default {
  name: 'CastingParams',
  props: {
    mode: {
      type: String
    },
    recordObj: {
      type: Object,
      default: () => {
      }
    },
    appTaskId: {
      default:''
    }
  },
mounted() {
    console.log( "mounted text!!!!"  )
  if(this.recordObj) {
    this.showDataSource = this.recordObj.appCastCraftParamSubclassVOs;
  }
},
  data() {
    return {
      holdPressureTime: '',//保压时间
      coolingTime: '',//冷却时间
      showDataSource:[],
      technologyArr: [
        {
          title: '压力参数',
          dataArr: [
            { name: '一段', input: '' },
            { name: '二段', input: '' },
            { name: '三段', input: '' },
            { name: '四段', input: '' },
            { name: '保压时间', input: '' },
            { name: '冷却时间', input: '' },
            { name: '补偿压力', input: '' }
          ]
        }
      ],
      dataSource: [
        { monitor: 'T5水' },
        { monitor: 'T5吹风' },
        { monitor: 'T6' },
        { monitor: 'T7水' },
        { monitor: 'T7吹风' },
        { monitor: 'T8' },
        { monitor: 'S1水' },
        { monitor: 'S1吹风' },
        { monitor: 'S2水' },
        { monitor: 'S2吹风' },
        { monitor: 'S3水' },
        { monitor: 'S3吹风' },
        { monitor: 'S4水' },
        { monitor: 'S4吹风' },
        { monitor: 'B1水' },
        { monitor: 'B1吹风' },
        { monitor: 'B2' },
        { monitor: 'B3' },
        { monitor: 'B4' },
        { monitor: 'B5水' },
        { monitor: 'B5吹风' },
        { monitor: 'T1水' },
        { monitor: 'T1吹风' },
        { monitor: 'T2' },
        { monitor: 'T3水' },
        { monitor: 'T3吹风' },
        { monitor: 'T4' }
      ],
      columns: [
        { title: '检测项', dataIndex: 'monitor', key: 'monitor', align: 'center', width: 80 },
        {
          title: '冷却',
          dataIndex: 'cooling',
          key: 'cooling',
          align: 'center',
          width: 70,
          scopedSlots: { customRender: 'cooling' }
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '延迟时间',
          dataIndex: 'delayTime',
          key: 'delayTime',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'delayTime' }
        },
        {
          title: '流量',
          dataIndex: 'flow',
          key: 'flow',
          align: 'center',
          width: 70,
          scopedSlots: { customRender: 'flow' }
        }
      ],
      technologyShowArr: [
        {
          title: '压力参数',
          dataArr: [
            { name: '一段', param: 'oneStage' },
            { name: '二段', param: 'twoStage' },
            { name: '三段', param: 'threeStage' },
            { name: '四段', param: 'fourStage' },
            { name: '保压时间', param: 'pressureTime' },
            { name: '冷却时间', param: 'coolingTime' },
            { name: '补偿压力', param: 'compensatePressure' }
          ]
        }
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
        taskId: this.appTaskId,
        appCastCraftParamSubclassDTOList:appCastCraftParamSubclassDTOList,
      }
      castingTechnologySubmit(obj).then((data)=>{
        if(data.success){
          this.$message.success('提交成功');
          setTimeout(()=>{
            this.clearData()
          } ,2000)
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

<style scoped lang='less'>
/*/deep/.ant-table-body{*/
/*  min-width: 100px!important;*/
/*}*/
.total-frame {
  width: 100%;

  .table-frame {
    width: 100%;
    .table-title{
      width: 100%;
      height: 30px;
      display: flex;
      background-color: #F4F5F7;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px;
      margin-bottom: 10px;
      .divide{
        padding-left: 2px;
        height:20px;
        background-color: #2E7AF1;
        margin-right: 10px
      }
    };

  }

}

.technology-frame {
  width: 100%;

  .technology-title {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #F4F5F7;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;

    .divide {
      padding-left: 2px;
      height: 20px;
      background-color: #2E7AF1;
      margin-right: 10px
    }
  }

  .technology-input {
    width: 100%;
    padding: 10px 10px;
    border-width: 0 0 1px 0;
    border-color: #F2F2F4;
    border-style: solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.button-frame {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;

  .submit-button {
    width: 80%;
  }
}

/deep/ .ant-input:focus{
  border:none;
  outline: none;
  box-shadow: none;
}
 /deep/ .ant-input{
  border:none;
  outline: none;
  box-shadow: none;
}
/deep/ .ant-table-row td{
  padding: 2px;
}
/deep/ .ant-calendar-picker{
  min-width: 0 !important;
}
</style>