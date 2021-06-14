<template>
  <div class="all-frame">
    <div class="frame-title">
      <p style="color: #fff;font-size: 32px;margin-left: 20px;opacity: 85%">{{mouldTitle}}</p>
    </div>
    <a-card>
<!--      <div class="title" style="display: flex;">-->
<!--        <span style="font-size: 17px;"><b>{{mouldTitle}}</b></span>-->

<!--      </div>-->
      <div class="number-frame frame-padding">
        <a-row>
          <div class="baseItemClass">
            <span style="font-size: 16px;color: #000;opacity: 85%" class="left-text1">戴卡部件号:</span>
            <div class="input-border1">
              <a-input   v-model="partNumber" placeholder="请选择"  :disabled="true" style="width: 200px;"/>
            </div>
            <a-button  @click="openSelect()" v-if="!(mouldTitle == '模具制造详细信息' || mouldTitle == '模具维护')" style="margin-left: 8px"><a-icon type="folder" /></a-button>
          </div>
        </a-row>
      </div>
      <div class="basic-title frame-padding">
        <div>
          <span class="divide"> </span>
          <span style="font-size: 16px;color: #000;opacity: 85%">基本信息</span>
        </div>
      </div>
      <div class="basic-information-frame frame-padding">
        <div v-for="(item, index) of basicInformation" :key="index"  class="baseItem" >
            <span class="left-text">
              {{item.title}}
            </span>
          <div class="input-border" :class="index === 2?'rightBorder':''">
            <a-input    v-model="item.value" :placeholder="item.placeHolder" :disabled="mouldTitle == '模具制造详细信息'" />
          </div>
        </div>
        <div class="baseItem">
          <span class="left-text">要求交付日期</span>
          <div class="input-border rightBorder" >
            <a-date-picker   @change="deliverOnChange" v-model="deliverDate" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="!(mouldTitle == '模具制造详细信息')"/>
            <a-date-picker   @change="deliverOnChange" v-model="deliverDate" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="mouldTitle == '模具制造详细信息'"  placeholder=" "/>
          </div>
        </div>
        <div class="baseItem" >
          <span class="left-text bottomBorder" >下单日期</span>
          <div class="input-border bottomBorder" >
            <a-date-picker v-model:value="orderDate" @change="orderOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'"  v-if="!(mouldTitle == '模具制造详细信息')"/>
            <a-date-picker v-model:value="orderDate" @change="orderOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'"  v-if="mouldTitle == '模具制造详细信息'"  placeholder=" "/>
          </div>
        </div>
        <div class="baseItem">
          <span class="left-text bottomBorder" ></span>
          <div class="input-border bottomBorder" >
          </div>
        </div>
        <div class="baseItem">
          <span class="left-text bottomBorder" ></span>
          <div class="input-border bottomBorder rightBorder" >
          </div>
        </div>
      </div>
      <div class="basic-title frame-padding">
        <div>
          <span class="divide"> </span>
          <span style="font-size: 16px;color: #000;opacity: 85%">时间跟踪信息</span>
        </div>
      </div>
      <div class="basic-information-frame frame-padding">
        <div v-for="(item, index) of timeCatcher" :key="index"  class="baseItem">
            <span class="left-text" :class="index === 6 ?'bottomBorder':''">{{item.title}}</span>
            <div class="input-border" :class="[index === 2 ||index === 5 ?'rightBorder':'', index === 6 ?'bottomBorder':'']" >
              <a-date-picker v-model:value="item.value"  @change="item.changeFunction" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="!(mouldTitle == '模具制造详细信息')"/>
              <a-date-picker v-model:value="item.value"  @change="item.changeFunction" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="mouldTitle == '模具制造详细信息'" placeholder=" "/>
            </div>
        </div>
        <div class="baseItem">
          <span class="left-text bottomBorder"></span>
          <div class="input-border bottomBorder">
          </div>
        </div>
        <div class="baseItem">
          <span class="left-text bottomBorder"></span>
          <div class="input-border bottomBorder rightBorder">
          </div>
        </div>
        <div class="baseItem" style="margin-top: 12px">
          <span class="left-text bottomBorder">协调日期</span>
          <div class="input-border bottomBorder">
            <a-date-picker v-model:value="coordinateDate" @change="CoordinateDateOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="!(mouldTitle == '模具制造详细信息')"/>
            <a-date-picker v-model:value="coordinateDate" @change="CoordinateDateOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="mouldTitle == '模具制造详细信息'" placeholder=" "/>
          </div>
        </div>
        <div class="baseItem" style="margin-top: 12px">
          <span class="left-text bottomBorder">模具合格日期</span>
          <div class="input-border bottomBorder">
            <a-date-picker v-model:value="qualifiedDate"  @change="qualifiedOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="!(mouldTitle == '模具制造详细信息')"/>
            <a-date-picker v-model:value="qualifiedDate"  @change="qualifiedOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具制造详细信息'" v-if="mouldTitle == '模具制造详细信息'" placeholder=" "/>
          </div>
        </div>
        <div class="baseItem" style="margin-top: 12px">
          <span class="left-text bottomBorder"></span>
          <div class="input-border bottomBorder rightBorder">
          </div>
        </div>
      </div>
      <div class="basic-title frame-padding">
        <a-space align="center">
          <span class="divide"> </span>
          <span>加工状态</span>
        </a-space>
      </div>
      <div class="basic-information-frame frame-padding">
        <div v-for="(item, index) of machiningType" :key="index" class="baseItem">
          <span class="left-text" :class="index === 3 || index === 4|| index === 5?'bottomBorder':''">{{item.title}}</span>
          <div class="input-border" :class="[index === 2 ||index === 5 ?'rightBorder':'', index === 3 || index === 4|| index === 5?'bottomBorder':'']">
            <a-input v-model="item.value" :placeholder="item.placeHolder" :disabled="mouldTitle == '模具制造详细信息'"/>
          </div>
        </div>
      </div>
      <div class="basic-title frame-padding">
        <a-space align="center">
          <span class="divide"> </span>
          <span>备注分析</span>
        </a-space>
      </div>
      <div class="basic-information-frame">
        <a-textarea
          v-model="textArea"
          placeholder="请输入备注"
          :auto-size="{ minRows: 2}"
          style="border-width: 1px !important;"
          :disabled="mouldTitle == '模具制造详细信息'"
        />
      </div>
      <div class="bottom-frame1" >
        <a-button  @click="goBack()" style="margin-left: 20px">返回</a-button>
        <a-button type="primary" @click="submitModel()" v-if="!(mouldTitle == '模具制造详细信息')">提交</a-button>
      </div>
      <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
    </a-card>
  </div>
</template>

<script>
  import SelectNumber from './SelectNumber'
  import {postMould , searchMouldById} from '@/api/api'
  export default {
    name: 'newMould',
    inject:['closeCurrent'],
    components: {SelectNumber},
    mounted() {
      this.mouldTitle = localStorage.getItem('mouldTitle');
      if (localStorage.getItem('selectId')) {
        this.mouldId = localStorage.getItem('selectId');
        console.log('233333333' ,this.mouldId );
        searchMouldById({id: this.mouldId}).then( (data) => {
          console.log('data233333', data);
          this.partNumber = data.result.component;
          this.basicInformation[0].value = data.result.sizeWheelShape?data.result.sizeWheelShape:' ';
          this.basicInformation[1].value = data.result.modelNumber?data.result.modelNumber: ' ';
          this.basicInformation[2].value = data.result.productionProject?data.result.productionProject: ' ';
          this.basicInformation[3].value = data.result.modelType?data.result.modelType: ' ';
          this.basicInformation[4].value = data.result.factory?data.result.factory:' ';
          this.deliverDate = data.result.deliveryState?data.result.deliveryState: ' ';
          this.orderDate = data.result.placeDate?data.result.placeDate: ' ';
          this.timeCatcher[0].value = data.result.materialPreparationDrawingDate;
          this.timeCatcher[1].value = data.result.topBottomMaterialsDate;
          this.timeCatcher[2].value = data.result.processingDrawingDate;
          this.timeCatcher[3].value = data.result.sideFormsMaterialsDate;
          this.timeCatcher[4].value = data.result.verticalLatheDate;
          this.timeCatcher[5].value = data.result.cavityBackedDate;
          this.timeCatcher[6].value = data.result.millingMachiningDate;
          this.coordinateDate = data.result.coordinationDate;
          this.qualifiedDate = data.result.mouldQualifiedDate;
          this.machiningType[0].value = data.result.mouldPreparationState?data.result.mouldPreparationState: ' ';
          this.machiningType[1].value = data.result.topDieState?data.result.topDieState: ' ';
          this.machiningType[2].value = data.result.dieBlockState?data.result.dieBlockState: ' ';
          this.machiningType[3].value = data.result.dieBlockRingState?data.result.dieBlockRingState: ' ';
          this.machiningType[4].value = data.result.dieSetState?data.result.dieSetState: ' ';
          this.machiningType[5].value = data.result.sideFormState?data.result.sideFormState: ' ';
          this.textArea = data.result.remark?data.result.remark: ' ';
        })
      }
    },
    data() {
      return{
        mouldId: '', // 查询id
        mouldTitle: '', // 页面标题
        partNumber: '', //戴卡部件号
        basicInformation: [
          {
            title: '轮形尺寸',
            value: '',
            placeHolder: '请输入轮形尺寸'
          },
          {
            title: '模号',
            value: '',
            placeHolder: '请输入模号'
          },
          {
            title: '制作项目',
            value: '',
            placeHolder: '请输入制作项目'
          },
          {
            title: '模具制作类型',
            value: '',
            placeHolder: '请输入模具制作类型'
          },
          {
            title: '使用单位',
            value: '',
            placeHolder: '请输入使用单位'
          },

        ],
        deliverDate: '', // 要求交付日期
        orderDate:'', // 下单日期
        timeCatcher:[ //时间追踪
          {
            title: '备料图日期',
            value: '',
            date: '',
            changeFunction: (value1, dateString)=>{
              this.timeCatcher[0].date = dateString;
            },
          },
          {
            title: '顶底坯料到厂日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              this.timeCatcher[1].date = dateString;
            },
          },
          {
            title: '加工图日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              this.timeCatcher[2].date = dateString;
            },
          },
          {
            title: '边模坯料到厂日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              this.timeCatcher[3].date = dateString;
            },
          },
          {
            title: '立车程序日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              this.timeCatcher[4].date = dateString;
            },
          },
          {
            title: '底模背腔程序日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              this.timeCatcher[5].date = dateString;
            },
          },
          {
            title: '铣加工日期',
            value: '',
            date: '',
            changeFunction: (value, dateString)=>{
              // const Timestamp = new Date(dateString[0]).getTime();
              this.timeCatcher[6].date = dateString;
            },
          }
        ],
        coordinateDate:'', //协调日期
        qualifiedDate: '', // 合格日期
        machiningType: [ // 加工状态
          {
            title: '整模状态',
            value: '',
            placeHolder: '请输入整模状态'
          },
          {
            title: '顶模状态',
            value: '',
            placeHolder: '请输入顶模状态'
          },
          {
            title: '底模状态',
            value: '',
            placeHolder: '请输入底模状态'
          },
          {
            title: '底模环状态',
            value: '',
            placeHolder: '请输入底模环状态'
          },
          {
            title: '模架状态',
            value: '',
            placeHolder: '请输入模架状态'
          },
          {
            title: '边模状态',
            value: '',
            placeHolder: '请输入边模状态'
          },
        ],
        textArea:'',//备注

      }
    },
    methods:{
      openSelect() {
        this.$refs.modal.add();
      },
      getProjectNumber(e) { // 父组件监听子组件值
        this.partNumber = e.projectNumber;
        this.basicInformation[0].value = e.size;
        this.basicInformation[1].value = e.modelNumber;
        this.basicInformation[2].value = e.productionProject;
        this.basicInformation[3].value = e.productionType;

      },
      deliverOnChange(value, dateString){ // 交付日期数据改变函数
        this.deliverDate = dateString;
      },
      orderOnchange(value, dateString) {
        this.orderDate = dateString;
      },
      CoordinateDateOnchange(value, dateString) {
        // const Timestamp = new Date(dateString[0]).getTime();
        this.coordinateDate = dateString;
      },
      qualifiedOnchange(value, dateString) {
        this.qualifiedDate = dateString;
      },
      submitModel( ) { // 提交
        const obj = {};
        if(this.mouldTitle == '模具维护'){
          obj.id = this.mouldId;
        }
        obj.component = this.partNumber;
        obj.sizeWheelShape = this.basicInformation[0].value; //轮形尺寸
        obj.modelNumber = this.basicInformation[1].value; //模号
        obj.productionProject = this.basicInformation[2].value; // 制作项目
        obj.modelType = this.basicInformation[3].value; // 模具制造类型
        obj.factory = this.basicInformation[4].value; // 使用单位
        obj.deliveryState = this.deliverDate; // 要求交付日期
        obj.placeDate = this.orderDate; // 下单日期
        obj.materialPreparationDrawingDate = this.timeCatcher[0].date;// 备料图日期
        obj.topBottomMaterialsDate = this.timeCatcher[1].date; // 顶底坯料到厂日期
        obj.processingDrawingDate = this.timeCatcher[2].date; // 加工图日期
        obj.sideFormsMaterialsDate = this.timeCatcher[3].date; // 边模坯料到厂日期
        obj.verticalLatheDate = this.timeCatcher[4].date; // 立车程序日期
        obj.cavityBackedDate = this.timeCatcher[5].date; // 底模背腔程序日期
        obj.millingMachiningDate = this.timeCatcher[6].date; // 铣加工日期
        obj.coordinationDate = this.coordinateDate; // 协调日期
        obj.mouldQualifiedDate = this.qualifiedDate; // 模具合格日期
        obj.mouldPreparationState = this.machiningType[0].value; //整模状态
        obj.topDieState = this.machiningType[1].value; // 顶模状态
        obj.dieBlockState = this.machiningType[2].value; // 底模状态
        obj.dieBlockRingState = this.machiningType[3].value; // 底模环状态
        obj.dieSetState = this.machiningType[4].value; // 模架状态
        obj.sideFormState = this.machiningType[5].value; // 边模状态
        obj.remark = this.textArea;
        postMould(obj).then( (data)=>{
          this.$message.info(data.message);
          if(data.message == '成功'){
            this.closeCurrent();
            this.$router.push({
              path: `/system/MouldCreate`,
            })
          }

        });
        console.log('23333', obj);
      },
      goBack() {
        this.$router.push({
          path: `/system/MouldCreate`,
        })
        this.closeCurrent();
      }

    }
  }
</script>

<style scoped>
  /deep/.ant-input[disabled]{
    background-color: #fff;
  }
  /deep/.ant-input{
    border-width: 0;
    font-size: 16px;
    color: #000;
  }
  /deep/ .ant-card-body{
    padding:0 24px 30px 24px;
  }
  .all-frame{
    width: 60%;
    margin:  0 auto;
  }
  .frame-title{
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    background: url("../../assets/modalBackground.png") no-repeat;
  }
  .frame-padding{
    padding-left: 4px;
  }
  .number-frame{
    margin-top: 16px;
    margin-bottom: 32px;
  }
  .rightBorder{
    border-right-width:1px !important;
  }
  .bottomBorder{
    border-bottom-width:1px !important;
  }
  .left-text {
    width: 151px;
    height: 100%;
    display: flex;
    font-size: 15px;
    font-family:  Semibold;
    align-items: center;
    background-color: #F5F8FA;
    padding-left: 12px;
    border-color:#e8e8e8;
    border-width: 1px 1px 0 1px;
    border-style:solid ;
  }
  .left-text-long{
    width: 120px;
  }
  .basic-title{
    width: 100%;
    height: 30px;
    background-color: #F2F2F2;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  .basic-information-frame{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 32px;
    margin-top: 12px;
  }
  .baseItemClass{
    height: 50px;
    display: flex;
    align-items: center;
  }
  .baseItem{
    width: 33%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .input-border{
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8;
    border-width: 1px 0 0 0;
    border-style:solid ;
  }
  .rightType{
    margin-left: 100px;
  }
  .rightType2{
    margin-left: 80px;
  }
  .bottom-frame{
    width: 90%;
    display: flex;
    flex-direction: row-reverse;
  }
  .bottom-frame1{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
  }
  .divide{
    padding-left: 3px;
    border-radius: 25%;
    border-width: 0;
    height:20px;
    background-color: #1EAABF;
    margin-right: 8px
  }
  .input-border1{
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8;
    border-width: 1px 1px 1px 0;
    border-style:solid ;
  }
  .left-text1 {
    width: 136px;
    height: 100%;
    display: flex;
    font-size: 15px;
    font-family:  Semibold;
    align-items: center;
    background-color: #F5F8FA;
    padding-left: 12px;
    border-color:#e8e8e8;
    border-width: 1px;
    border-style:solid ;
  }

</style>