<template>

  <div class='off-machine-operation-wrap'>
    <div class='off-machine-top-bar'>
      <div>{{taskInfo.nowTrialSite}}</div>
      <span class='select-split'></span>
      <p>{{taskInfo.processTechnology}}</p>
      <span class='select-split'></span>
      <p>{{taskInfo.machineIndex }}</p>
    </div>


    <a-card :class='device'>
      <div class='off-machine-operation-wrap'>
        <div class='off-machine-operation-head'>
          {{ taskInfo.formBaseNo }}
        </div>
        <img src='@/assets/trialExe/on_machine_page_split.png' style='margin-top: 5px'>
        <div class='off-machine-operation-message-wrap'>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="12">轮型：<span class='grey-text'>{{taskInfo.projectNo}}</span></a-col>
            <a-col :span="12">
              <a-row type="flex"  align="middle">
                <a-col :span="24">产品尺寸：<span class='grey-text'>{{taskInfo.pSize}}</span></a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row  type="flex" justify="space-between" align="middle"  class='grid-margin'>
            <a-col :span="12">试制数量：<span class='grey-text'>{{taskInfo.trialProductionNumber}}</span></a-col>
            <a-col :span="12">
              <a-row type="flex"  align="middle">
                <a-col :span="24" class="gutter-row">试制用途：<span class='grey-text'>{{taskInfo.purpose}}</span></a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type="flex" align="middle" class='grid-margin'>
            <a-col :span='24' class="gutter-row">当前工序预计完成日期：<span class='grey-text'>{{taskInfo.planCompletionTime&&taskInfo.planCompletionTime.substr(0,10)}}</span></a-col>
          </a-row>
          <a-row type="flex" align="middle" class='grid-margin'>
            <a-col :span='24' class="gutter-row">上机时间：<span class='grey-text'>{{taskInfo.onMachineTime&&taskInfo.onMachineTime.substr(0,10)}}</span></a-col>
          </a-row>
          <a-row type="flex" align="middle" class='grid-margin'>
            <a-col :span='24'>工序流程：   <span class='grey-text' :class="{'blue-text':isNowProcess(workFlowItem[0])}">{{workFlowItem[0]}}</span>
              <span v-for='item in workFlowItem.slice(1)' :key='item' class='grey-text'  :class="{'blue-text':isNowProcess(item)}">-<span>{{item}}</span></span></a-col>

          </a-row>
        </div>
        <div class='btn-wrap'>
          <div v-for='(btnItem,index) in jumpBtn' :key='index' class='opt-btn' @click="jumpPath(btnItem.path)">
            <img :src="require(`@/assets/trialExe/`+`${btnItem.imgName}`+`.png`)" style='width: 75px;height:75px'>
            <p style="color: #aaaaaa" v-if="btnItem.name === '现场反馈' && taskInfo.processTechnology !== '精车' && taskInfo.processTechnology !== '粗车' && taskInfo.processTechnology !== '压铸'">{{btnItem.name}}</p>
            <p v-else>{{btnItem.name}}</p>
          </div>

        </div>



        <!--      底部图片部分-->


      </div>
    </a-card>


    <a-card :class='device' style='margin-top: 10px'>
      <div class='off-machine-operation-form-wrap'>
        <div class='number-input-wrap'>
          <span>下转数量</span>
          <div class='number-input-area'>
            <input v-model='offMachineQuery.offNumber' type='number' placeholder='请输入' @blur='testNegative'></input>
          </div>
        </div>
        <div class='form-item'>
          <span>当前班次</span>
          {{userInfor.currentShift}}
        </div>
        <div class='form-item'>
          <span>操作手</span>
          {{userInfor.username }}
        </div>
        <div class='number-input-wrap' style='margin-top: 10px'>
          <span>注意事项</span>
          <div class='number-input-area'>
            <textarea v-model='offMachineQuery.offAttention' rows='5' placeholder='请输入' ></textarea>
          </div>
        </div>
      </div>
      <div class="clearfix off-machine-operation-imgs" :class="{'special-margin':fileList.length===0}" >
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :customRequest='myImgUpload'
          :data="{biz:bizPath}"
          :headers="uploadHeaders"
          @preview="handlePreview"
          @change="handleChange"
          :disabled="disabled"
        >
          <div v-if="fileList.length < 8">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
      </div>
      <div class='off-machine-operation-btn'>
        <a-button type="danger" v-if="taskInfo.taskState==='上机'" style='width: 130px;height: 40px;' @click="showModal('中断')">
          异常中断
        </a-button>
        <a-button type="danger" v-else style='width: 130px;height: 40px;' @click="showModal('重启')">
          任务重启
        </a-button>
       <a-spin :spinning='spinning'>
        <a-button type="primary" style='width: 130px;height: 40px;' @click=' offMachineSubmit()'>
          下机
        </a-button>
       </a-spin>
      </div>
      <!--异常中断弹窗-->
      <a-drawer
        title="异常中断确认"
        placement="bottom"
        :closable='false'
        :visible="interuptModalVisible"
        wrapClassName='restartDrawer'
        height='280'
        :maskClosable='true'
        @close='drawerClose'
      >
        <a-spin :spinning="spinning">
        <span class='drawer-item'>
        <p style='margin-bottom: 10px;color: #5c6374'>中断说明</p>
        <textarea placeholder='请输入' v-model='modalSubmitQuery.abnormalInterruptExplain' rows='5' style='width: 100%;height: 100px'></textarea>
          </span>
        <div class="drawerFooter">
          <a-button type="primary" @click="interuptSubmit" style='background-color: #2e7af1;width:100%;height:38px'>提交</a-button>
        </div>
        </a-spin>
      </a-drawer>



      <!--      任务重启弹窗-->
      <a-drawer
        title="任务重启确认"
        placement="bottom"
        :closable='false'
        :visible="restartModalVisible"
        wrapClassName='restartDrawer'
        height='336'
        :maskClosable='true'
        @close='drawerClose'
      >

      <span class='drawer-item' style='display: flex;flex-direction: row;align-items: center;justify-content: space-between'>
        <p style='margin:0;color: #5c6374'>重启机台</p>
          <a-select v-model='modalRestartQuery.restartMachine' style="width: 120px;margin-left: 10px">
            <a-select-option v-for='item in selectOptions.machineIndexs' :key='item'>
              {{item}}
            </a-select-option>
          </a-select>
       </span>
        <span class='drawer-item'>
        <p style='color: #5c6374'>重启说明</p>
        <textarea placeholder='请输入' v-model='modalRestartQuery.restartExplain'  rows='5' style='width: 100%;height: 100px'></textarea>
          </span>
        <div class="drawerFooter">
          <a-spin :spinning="spinning">

          <a-button type="primary" @click="restartSubmit" style='background-color: #2e7af1;width:100%;height:38px'>提交</a-button>
          </a-spin>
        </div>

      </a-drawer>

    </a-card>
  </div>

</template>



<script>
// import * as count from 'ant-design-vue'

const sessionStorge=window.sessionStorage;
import { mixinDevice } from '@/utils/mixin.js';
import store from '@/store/';
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  submitInterupt,
  submitrestartMachine,
  getDictItemsFromCache,
  submitOffMahine,
  offMachineUploadImg
} from '@/api/api';
const FILE_TYPE_IMG = "image"
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: 'OffMachineOperation',
  mixins: [mixinDevice],
  props:{
    text:{
      type:String,
      required:false,
      default:"上传"
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath:{
      type:String,
      required:false,
      default:"temp"
    },
    value:{
      type:[String,Array],
      required:false
    },
    propDisabled:{
      type:Boolean,
      required:false,
      default: false
    },
    isMultiple:{
      type:Boolean,
      required:false,
      default: false
    },
    //update-begin-author:wangshuai date:20201021 for:LOWCOD-969 新增number属性，用于判断上传数量
    number:{
      type:Number,
      required:false,
      default:0
    }
    //update-end-author:wangshuai date:20201021 for:LOWCOD-969 新增number属性，用于判断上传数量
  },
  data(){
    return{
      spinning:false,
      picUrl:false,
      taskInfo: {},
      workFlowItem: [],
      userInfor: {
      },

      //跳转按钮
      jumpBtn:[
        {
          name:'试制记录',
          path:'/app/trialHistory',
          imgName:'process_records'
        },
        {
          name:'工序策划',
          path:'/app/processPlan',
          imgName:'process_plan'
        },
        {
          name:'现场反馈',
          path:'/app/trail/FineFeedback',
          imgName:'process_feedback'
        },
      ],


    //  图片部分
      previewVisible: false,
      previewImage: '',
      fileList: [
      ],
      disabled:false,
    //  异常中断弹窗部分
      interuptModalVisible:Boolean,

      modalStyle:{
        top:'250px',
        display:'flex',
        'flex-direction':'column',
        'border-radius':'10px'
      },
      //异常中断接口请求参数
      modalSubmitQuery:{
        abnormalInterruptExplain:'',

        id:'',
        operator:'',
        processFlowName :'',
        taskOperatingState:''
      },

      //任务重启弹窗
      restartModalVisible:Boolean,
      selectOptions:{
        machineIndexs:[]
      },
      modalRestartQuery:{
        restartMachine:String,
        restartExplain:'',
      },



      //下机部分
      offMachineQuery:{
        offNumber:undefined,
        offAttention:'',
        fileUrlList:[]
      },


    }
  },
  computed:{
    uploadHeaders() {
      // let {originColumn: col} = this
      let headers = {}

        headers['X-Access-Token'] = this.$ls.get(ACCESS_TOKEN)

      return headers
    },
  },
  activated() {
    console.log("activated");
    console.log("this.$route.query.ifFromInterupt",this.$route.query.ifFromInterupt);
  },
  created() {
    this.getMachineOperationInfo();
    this.getUserInfo()
    console.log("created");
    console.log("this.$route.query.ifFromInterupt",this.$route.query.ifFromInterupt);
    if(this.$route.query.ifFromInterupt==='true')
      this.interuptModalVisible=true
    else
      this.interuptModalVisible=false
    if(this.$route.query.ifFromRestart==='true') {

      this.restartModalVisible = true
    }
    else
      this.restartModalVisible=false
  },
  beforeRouteEnter(to,from,next){
    console.log("to",to);
    console.log("from",from);
    next(vm=>{
      if(from.name==='app-taskQuery'&&vm.$route.query.ifFromInterupt==='true')
        vm.interuptModalVisible=true
      else
        vm.interuptModalVisible=false
      if(from.name==='app-taskQuery'&&vm.$route.query.ifFromRestart==='true')
        vm.restartModalVisible =true
      else
        vm.restartModalVisible=false
    })
  },
  mounted() {
    this.getMachineIndexs()
  },

  methods:{
    test() {
      console.log('fileList', this.fileList);
    },
    testNegative(){

      console.log("testNegative")
      let  regu = /(^\d+$)|''/;
      if(!this.offMachineQuery.offNumber) {
        this.offMachineQuery.offNumber = '';
        return;
      }
      let numStr=this.offMachineQuery.offNumber.toString();

      console.log("numStr",numStr)
      if(!regu.test(numStr)){
        this.$message.warning('下转数量不能为负数',1);
        this.offMachineQuery.offNumber= undefined;
      }

    },
    uploadImage() {
      return window._CONFIG['domianURL'] + '/sys/common/upload'

    },
    jumpPath(path) {

      let jumpQuery={}
      if(path==='/app/trialHistory'){
        jumpQuery = {
          taskId: this.taskInfo.appTaskId,
        }
      }
      else if(path==='/app/processPlan'){
        jumpQuery={
          formBaseId: this.taskInfo.formBaseId,
        }
      } else if (path==='/app/trail/FineFeedback') {
        jumpQuery = {
          obj: {
            projectNo: this.taskInfo.projectNo,
            trialProductionNumber: this.taskInfo.trialProductionNumber,
            formBaseNo: this.taskInfo.formBaseNo,
            psize: this.taskInfo.pSize,
            processTechnology: this.taskInfo.processTechnology,
            appTaskId: this.taskInfo.appTaskId,
          },
          tabs: 2,
        }
      }
      // console.log('task infor111', this.taskInfo);
      let process = this.taskInfo.processTechnology;
      if(path==='/app/trail/FineFeedback' && process !== '精车' && process !== '粗车' && process !== '压铸') {
        this.$message.destroy();
        this.$message.warning('只有工序为精车、粗车、压铸可查看现场反馈！');
      } else {
        this.$router.push({
          path: path,
          query:jumpQuery
        },);
      }
    },
    getMachineOperationInfo(){   //获取下机任务详情（任务查询页面->查看任务 存于Session中)
      this.taskInfo=JSON.parse(sessionStorge.getItem('machineOperationInfo'))

      this.workFlowItem=this.taskInfo.workFlow.split('-')

      this.modalRestartQuery.restartMachine=this.taskInfo.machineIndex;
    },

    getUserInfo(){  //获取当前登录人信息
      this.userInfor = store.getters.userInfo;
      console.log("userInfor in 下机", this.userInfor)
      let newDate = new Date();
      console.log("newDate.toTimeString()",newDate.toTimeString())
      let currentHour=newDate.toTimeString().substr(0,2)
      if(currentHour>=8&&currentHour<20)
        this.userInfor.currentShift='白班'
      else
        this.userInfor.currentShift='夜班'
    },
    isNowProcess(pro){
      return pro===this.taskInfo.processTechnology
    },

  //  图片部分
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    myImgUpload(info){

      console.log("info",info);
      const formdata = new FormData();
      formdata.append('file', info.file)
      formdata.append('taskId', this.taskInfo.appTaskId)
      offMachineUploadImg(formdata).then((data)=>{
        console.log("上传图片返回结果",data)
        if (data.success) {
         console.log("上传图片返回结果",data);
         info.onSuccess()
          this.offMachineQuery.fileUrlList.push(data.result.fileUrl)
          console.log("fileUrlList",this.offMachineQuery.fileUrlList)
        } else {
          this.$message.destroy()
          this.$message.error(data.message)
        }
      });

    },
    handleChange(info) {

      console.log("info in handleChange",info)


      // this.fileList = [...fileList] //重点
      // console.log("imgFileList:",fileList)
      this.picUrl = false;
      let fileList = info.fileList
      //update-begin-author:wangshuai date:20201022 for:LOWCOD-969 判断number是否大于0和是否多选，返回选定的元素。
      if(this.number>0 && this.isMultiple){
        fileList = fileList.slice(-this.number);
      }

      this.fileList = fileList


    },

    handlePathChange(){
      let uploadFiles = this.fileList
      let path = ''
      if(!uploadFiles || uploadFiles.length==0){
        path = ''
      }
      let arr = [];
      if(!this.isMultiple){
        arr.push(uploadFiles[uploadFiles.length-1].response.message)
      }else{
        for(let a=0;a<uploadFiles.length;a++){
          // update-begin-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
          if(uploadFiles[a].status === 'done' ) {
            arr.push(uploadFiles[a].response.message)
          }else{
            return;
          }
          // update-end-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
        }
      }
      if(arr.length>0){
        path = arr.join(",")
      }
      this.$emit('change', path);
    },
    handleDelete(file){
      //如有需要新增 删除逻辑
      console.log(file)
    },

  //  异常中断弹窗部分
    showModal(modalType) {
      if(modalType==='中断') {
        this.interuptModalVisible = true;
        this.restartModalVisible =false;
      }
      else {
        this.interuptModalVisible = false;
        this.restartModalVisible = true;
      }
    },
    interuptSubmit(e) {
      this.spinning=true;
      this.ModalText = 'The modal will be closed after two seconds';

      this.modalSubmitQuery.operator=this.userInfor.username;
      this.modalSubmitQuery.processFlowName=this.taskInfo.processTechnology;

      this.modalSubmitQuery.taskOperatingState='3';
      this.modalSubmitQuery.id=this.taskInfo.appTaskId.toString()
      this.modalSubmitQuery.trialProductionSite = this.taskInfo.nowTrialSite;
      console.log("异常中断提交参数",this.modalSubmitQuery)
      submitInterupt(this.modalSubmitQuery).then((data)=>{

        this.spinning=false
        if (data.success) {
          console.log("成功一次")
          this.$message.success(
            '任务已中断',
            10,
          );
          console.log("正在中断")
          this.interuptModalVisible=false;
          this.$router.go(-1)
        } else {
          this.$message.destroy()
          this.$message.error(data.message)
        }
      });

    },
    handleMadalCancel(e) {
      this.interuptModalVisible = false;
    },

    //任务重启弹窗
    getMachineIndexs(){   //获取任务重启弹框中的机台选择内容（从数据字典）
      let name='trial_machine';
      let tempDict=getDictItemsFromCache(name);
      for(let data of tempDict){
        this.selectOptions.machineIndexs.push(data.text)
      }

    },
    drawerClose() {
      this.restartModalVisible= false;
      this.interuptModalVisible=false;
    },
    restartSubmit(){
      this.spinning=true;
      let params={}
      let stateShift={
        '上机':'0',
        '下机':'1',
        '待生产':'2',
        '中断':'3',
        '重启':'4'
      };
      params.operator=this.userInfor.username;
      params.processFlowName=this.taskInfo.processTechnology;
      let nowState=this.taskInfo.taskState;
      params.taskOperatingState='4';
      params.restartExplain=this.modalRestartQuery.restartExplain;
      params. restartMachineNo=this.modalRestartQuery.restartMachine;
      params.id=this.taskInfo.appTaskId.toString();
      params.trialProductionSite = this.taskInfo.nowTrialSite;
      console.log("任务重启接口传参：",params);

      submitrestartMachine(params).then((data)=>{
        this.spinning=false;
        if (data.success) {
          console.log('任务重启接口返回结果', data);
          this.$message.success(
            '任务已重启',
            2,
          );
          this.restartModalVisible=false;
          this.$router.go(-1);
        } else {


         if(data.message==='当前机台有未下机的任务')
          {
            this.cannotRestartMessage()
          }
          else {
            this.$message.destroy()
            this.$message.error(data.message)
          }
        }
      });

    },
    cannotRestartMessage() {
      const vm=this
      this.$message.warning({content:'当前机台有未下机任务',
        duration:2,
      onClose(){
        vm.restartModalVisible=false
      }},
    );
    },


    //下机提交
    offMachineSubmit(){
      this.spinning=true;
      let stateShift={
        '上机':'0',
        '下机':'1',
        '待生产':'2',
        '中断':'3',
        '重启':'4'
      };
      let params={};
      params.currentShift=this.userInfor.currentShift;
      params.fileUrlList=this.offMachineQuery.fileUrlList;
      params.id=this.taskInfo.appTaskId.toString();
      params.trialProductionSite = this.taskInfo.nowTrialSite;
      if(!this.offMachineQuery.offNumber) {
        this.$message.warning('请输入下转数量',2);
        this.spinning=false;
        return;
      }
      params.loomTacklingNumber=this.offMachineQuery.offNumber.toString();


      params.mattersNeedingAttention=this.offMachineQuery.offAttention;
      params.operator=this.userInfor.username;
      params.processFlowName=this.taskInfo.processTechnology;
      params.taskOperatingState='1';
      console.log("下机接口所传参数：",params)
      submitOffMahine(params).then((data)=>{

        this.spinning=false;

        if (data.success) {
          console.log("成功一次")
          this.$message.success(

            '下机成功',
            2,
          );
         this.$router.go(-1);

        } else {
          if(data.message==='操作失败，For input string: \"function Number() { [native code] }\"'){
            this.$message.warning('请输入下转数量',2);
          }
          else {
            this.$message.destroy()
            this.$message.error(data.message)
          }
        }
      });
    }
  },




}
</script>


<style lang="less" scoped>

&.mobile {
  *{
    margin: 0;
    padding: 0;
  }
  /deep/.ant-card-body{
    padding: 5px 5px 15px 5px;
  }
  .grid-margin{
    margin-top:7px
  }
  .off-machine-operation-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .off-machine-operation-head{
    width: 100%;
    height: 45px;
    font-size: 18px;
    padding: 15px;
  }
  .grey-text{
    color: #878787;
    font-size: 14px;
  }
  .blue-text{
    color: #2e7af1;
    font-weight: bolder;
    font-size: 14px;
  }


  .off-machine-operation-message-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 15px 0 15px 12px;
    border-bottom: 2px solid #f6f6f7;
  }
  .btn-wrap{
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 10px;
  }
  .opt-btn{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 75px;
    height: 100px;
    color: #262626;
    font-size: 16px;

  }


  //  下方表单部分
  //  下方表单部分（第二个a-card)
  .off-machine-operation-form-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    padding: 15px 12px 15px 12px;
  }
  .number-input-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 2px solid #f6f6f7;
  }
  .number-input-area{
    background-color: #f5f8fa;
    border-radius: 5px;
    padding: 6px;
    width: 100%;
    margin-top: 6px;

  }
  .number-input-area textarea{
   width: 100%;
    height: 100%;
    background-color: transparent;
    border:none;
    outline: none;
  }

  .number-input-area input{
    outline: none;
    border: none;
    width: 100%;
    height: 30px;
    text-align: left;
    color: #a2a2a2;
    background-color: transparent;
  }
  .number-input-area input::-webkit-input-placeholder{
    color: #a2a2a2;
  }


  .form-item{
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    box-sizing: border-box;

    border-bottom: 2px solid #f6f6f7;
    color: #a2a2a2;

  }
  .form-item /deep/.ant-switch{
    min-width: 30px;
  }
  .form-item span{
    color: #333333;
  }

  .form-item input{
    outline: none;
    border: none;
    width: 80px;
    text-align: right;
    color: #a2a2a2;
  }
  .form-item input::-webkit-input-placeholder{
    color: #a2a2a2;
  }
  .none-bottem-border{
    border-bottom: none !important;
  }


  //下机按钮
  .off-machine-operation-btn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin:15px auto 0 auto;
  }

  /deep/.ant-btn-primary{
    background-color: #2e7af1;
    border-color: #2e7af1;
  }
  /deep/.ant-btn-danger{
    border-color:  #f86162;
    background-color: #f86162;

  }


//  图片部分
  .off-machine-operation-imgs{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content:space-around;
    margin-top: 10px;
    padding:0 15px
  }
  //去除预览图标
  .off-machine-operation-imgs /deep/.anticon-eye-o{
    display: none;
  }
  .off-machine-operation-imgs /deep/.ant-upload-list-item-info::before{
    background-color: transparent;
  }
  .special-margin{
    margin-left:-15px
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .off-machine-operation-imgs /deep/.ant-upload-picture-card-wrapper{
    display: flex;
    flex-direction: row;
  }
  .off-machine-operation-imgs /deep/.ant-upload-list{
    display: flex;
    flex-direction: row;
    overflow: auto;
    max-width: 60%;
  }
  .off-machine-operation-imgs /deep/.ant-upload-select-picture-card{
    margin-left: 15px;
  }



}



</style>
<style  scoped>
/*  异常中断弹窗部分*/
/deep/.ant-modal-footer{
  text-align: center;
  border-radius: 0 0 15px 15px;
}
/deep/.ant-modal-header{
  border-radius: 15px 15px 0 0;
}
/deep/.ant-modal-content{
  border-radius: 15px;
}
/deep/.ant-modal-title{
  font-weight: 700;
}
.modalFooter /deep/.ant-btn-primary{
  background-color: #7f7f7f;
  border-color: #7f7f7f;
}

 /*任务重启弹窗调整select样式使其右对齐*/
  .restartDrawer /deep/.ant-select-selection{
    border: none;
  }
.restartDrawer /deep/.ant-select-arrow{
  right: 0;
}
.restartDrawer /deep/.ant-select-selection-selected-value{
  margin-right: 20px;
  float: none;
  text-align: right;
  color: #a2a2a2;
}
.restartDrawer /deep/.ant-select-selection__rendered{
  margin-right: 0;
}

.restartDrawer /deep/.ant-select-search__field__placeholder, .restartDrawer /deep/.ant-select-selection__placeholder{
  text-align: right;
  right: 15px;
  color: #a2a2a2;
}

.restartDrawer /deep/.ant-select-open,.restartDrawer /deep/.ant-select-selection{
  box-shadow: none;
}
.restartDrawer .drawer-item{
  padding: 10px 15px;
  border-bottom: 2px solid #f6f6f7;
}
.restartDrawer /deep/.ant-drawer-body{
  padding: 0;
  display: flex;
  flex-direction: column;
}
.restartDrawer /deep/.ant-drawer-content{
  border-radius: 12px 12px 0 0;
}
.restartDrawer /deep/.ant-drawer-header{
  text-align: center;
}
.restartDrawer /deep/.ant-drawer-title{
  font-weight: 600;
}
.restartDrawer textarea{
  border: 0;
  outline: 0;
  background-color: #f5f8fa;
}
.restartDrawer .drawerFooter{
  width: 80%;
  margin:10px auto;
}
/*顶部a-card之外*/
 .off-machine-top-bar{
   display: flex;
   flex-direction: row;
   width: 97%;
   box-sizing: border-box;
   border-radius: 5px;
   padding: 8px;
   background:-webkit-linear-gradient(top,#0a243c,#032b56);
   margin: 0 auto 10px auto;
   box-shadow: 0 3px 6px rgba(0,0,0,0.16);
 }
.off-machine-top-bar p,.off-machine-top-bar div{
  height: 30px;
  line-height: 30px;
  color: white;
  margin-left: 20px;
  flex: 1;
}
.off-machine-top-bar .select-split{
  width: 2.5px;
  background-color: #1B3958;
}

</style>
