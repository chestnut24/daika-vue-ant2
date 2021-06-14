<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button v-if="isShow" key="submit" type="primary" @click="handleOk" :disabled="isDisabled">确认</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-card class="card1">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :pagination="false"
          :dataSource="dataSource"
         >
          <!--用途-->
          <template slot="purposesTab" slot-scope="text, record" class="operate-row">
            <row-table maxWidth="620px" style="width:100%;max-width: none" :columns="rowColumns" :data-source="record.purposes"></row-table>
          </template>
          <template slot="deliverDt" slot-scope="text, record">
            <span>{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
          </template>
        </a-table>
      </a-card>
      <a-form :form="form">
        <!-- 子表单区域 -->
        <a-card>
            <div>
              <a-row type="flex" :gutter="16">
                <a-col :span="5" class="title_bg" >试制单编号</a-col>
                <a-col :span="2" class="title_bg">工序</a-col>
                <a-col :span="2" class="title_bg">子工序</a-col>
                <a-col :span="4" class="title_bg">试制数量</a-col>
                <a-col :span="4" class="title_bg">用途</a-col>
                <a-col :span="5" class="title_bg">备注</a-col>
                <a-col :span="2" class="title_bg last_bg" style="text-align: center;padding-left:8px !important;">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom:10px" class="row_body" :gutter="16" v-for="(item, index) in orderMainModel.taskWorkSplitList" :key="index">
                <a-col :span="6"  style="display: none">
                  <a-form-model-item>
                    <a-input v-decorator="['taskWorkSplitList['+index+'].id', {'initialValue':item.id}]"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <a-input v-decorator="['taskWorkSplitList['+index+'].taskId', {'initialValue':item.taskId}]"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <a-input v-decorator="['taskWorkSplitList['+index+'].formBaseId', {'initialValue':item.formBaseId}]"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <a-input v-decorator="['taskWorkSplitList['+index+'].taskWorkId', {'initialValue':item.taskWorkId}]"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <a-input v-decorator="['taskWorkSplitList['+index+'].trialProductionSite', {'initialValue':item.trialProductionSite}]"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5" style="text-align: center" class="title_body">
                  <a-form-item>
                      <a-input class="disInput" readonly v-decorator="['taskWorkSplitList['+index+'].formBaseNo', {'initialValue':item.formBaseNo}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="2" style="text-align: center" class="title_body">
                  <a-form-item>
                    <a-input class="disInput" readonly v-decorator="['taskWorkSplitList['+index+'].processTechnology', {'initialValue':item.processTechnology}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="2" style="text-align: center" class="title_body">
                  <a-form-item>
                    <a-input class="disInput" readonly v-decorator="['taskWorkSplitList['+index+'].subNo', {'initialValue':item.subNo}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4" class="parent title_body">
                  <a-form-item class="box_parent">
                    <a-input-number :disabled="isDisabled" @change="(v)=>handleCount(v,index)" :min="1" style="width: 100%;text-align: center;" placeholder="试制数量" v-decorator="['taskWorkSplitList['+index+'].trialProductionNumber', {'initialValue':item.trialProductionNumber,rules: [{ required: true, message: '请输入试制数量!' }]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4" class="parent title_body" >
                  <a-form-model-item class="box_parent formSelect">
                    <a-select :disabled="isDisabled" v-decorator="['taskWorkSplitList['+index+'].purpose', {'initialValue':item.purpose,rules: [{ required: true, message: '请选择用途!' }]}]" placeholder="用途">
                      <a-select-option v-for="item in purposesList" :key="item.value" :value="item.text">
                          {{item.text}}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5" class="parent title_body">
                  <a-form-model-item class="box_parent beizhu">
                    <a-textarea :disabled="isDisabled" rows="1" placeholder="备注" v-decorator="['taskWorkSplitList['+index+'].remarks', {'initialValue':item.remarks}]" style="resize: none;"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="2" style="text-align: center" class="title_body last_bg">
                  <a-icon v-if="isDisabled" type="minus-circle" title="删除" style="fontSize :20px;color: #d9d9d9" />
                  <a-icon v-else type="minus-circle" title="删除" @click="delRowCustom(index,item)"  style="fontSize :20px" />
                </a-col>
              </a-row>
              <a-button v-if="!isDisabled" type="primary" style="width: 98%;margin-top: 10px" @click="addRowCustom">
                <a-icon type="plus" />
              </a-button>
            </div>

        </a-card>
     <!-- </a-form-model>-->
</a-form>
      <div class="instruction-msg" v-if="instructionMessage !== ''">过程指令：{{instructionMessage}}</div>

    </a-spin>
  </a-modal>
</template>

<script>
    import { onMachineQuery } from '@api/api';
    import { httpAction,getAction,deleteAction } from '@/api/manage'
    import moment from "moment"
    import RowTable from '../../component/RowTable'
    import { postAction } from '../../../api/manage'
    import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
    let clickIndex=0
    export default {
        name: "SplitTheBillModel",
        components: { RowTable },
        data () {
            return {
                isDisabled:false,
                width:window.innerWidth-400+'px',
                description: '拆单填报',
                title:"操作",
                moment,
                form: this.$form.createForm(this),
                visible: false,
                orderMainModel: {
                    taskWorkSplitList: [{}],
                },
                isShow:false,
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                confirmLoading: false,
                dataSource:[],
                rowColumns: [ // 行内表格
                    { title: '试制用途', dataIndex: 'purpose' },
                    { title: '数量', dataIndex: 'number' },
                ],
                columns: [ // 表头
                    { title: '试制单编号', dataIndex: 'trialProductionFormNo'},
                    { title: '工序', dataIndex: 'processTechnologyName'},
                    { title: '交付日期', dataIndex: 'deliverDt',scopedSlots: { customRender: 'deliverDt' }},
                    { title: '试制数量', dataIndex: 'planRoughcastNum'},
                    { title: '试制用途',width: 620, dataIndex: 'purposesTab',scopedSlots: { customRender: 'purposesTab' } },
                ],
                record:{},
                formBaseId:'',
                trialProductionSite:'',//试制地
                purposesList:[],
                count:0,
                url: {
                    add: "/test/jeecgOrderMain/add",
                    edit: "/test/jeecgOrderMain/edit",
                    orderCustomerList: "/test/jeecgOrderMain/queryOrderCustomerListByMainId",
                    orderTicketList: "/test/jeecgOrderMain/queryOrderTicketListByMainId",
                },
                instructionMessage: '', // 试制指令信息
            }
        },
        computed: {
            userInfo() {
                //userInfo.siteList     (负责多个试制地，大概率是一条数据)
                //userInfo.technologyList   (负责多个工序)
                return this.$store.getters.userInfo
            },
        },
        created () {
            this.initDictConfig();
            // this.getInstruction();
        },
        methods: {
            getInstruction() {
            let param = {
              formBaseId: this.formBaseId,
              aopTrialSegment: '车间试制策划',
            };
            onMachineQuery(param).then((data) => {
              if (data.success) {
                console.log('data data', data);
                data = data.result;
                // instructionMessage
                for (let i = 0; i < data.length; i++ ) {
                  if (data[i].taskWorkSplitId === null) {  // 第一个表单 拆单 如果 taskWorkSplitId 为null 拼接 message
                    this.instructionMessage = this.instructionMessage + ' ' + data[i].message;
                  }
                }
                // console.log('message', this.instructionMessage);
              } else {
                this.$message.destroy();
                this.$message.error(data.message);
              }
            });
          },

            handleCount(num,it){
                this.count=0
                console.log(num)
                let count1=0
            this.orderMainModel.taskWorkSplitList.forEach((item,index)=>{
                if(index!=it){
                  count1 +=  Number(document.getElementById('taskWorkSplitList['+index+'].trialProductionNumber').querySelector('input').value)
                }
                })
                if(count1==0){
                    this.count=num
                }else{
                    this.count=count1+num
                }
                console.log(this.count)
                if(this.count>this.dataSource[0].planRoughcastNum){
                    this.$message.warning('试制数量不能大于总的试制数量')
                }
            },
            initDictConfig(){
                //初始化字典 - 用途
                initDictOptions('noun').then((res) => {
                    if (res.success) {
                        this.purposesList = res.result;
                    }
                });
            },
            add (record,index) {
                this.orderMainModel= {
                    taskWorkSplitList: [{}],
                }
                this.form.resetFields();
                this.record=record
                this.dataSource=[{...record}]
                if(this.userInfo.technologyList){
                    this.userInfo.technologyList.forEach(item=>{
                        if(item==this.dataSource[0].processTechnologyName){
                            this.isShow=true
                        }
                    })
                }
                /*拆单弹窗查询*/
                    getAction('/trial/taskWork/getWorkTaskById',{workTaskId:record.workTaskId}).then(res=>{
                        if(res.result){
                            this.visible = true;
                            this.formBaseId=res.result.formBaseId
                            this.trialProductionSite=res.result.trialProductionSite
                            if(res.result.taskWorkSplitList.length>0){
                                this.orderMainModel = Object.assign({
                                    taskWorkSplitList:res.result.taskWorkSplitList,
                                });
                                clickIndex= res.result.taskWorkSplitList[res.result.taskWorkSplitList.length-1].subNo.charCodeAt()-65
                                console.log(clickIndex)
                                console.log(this.orderMainModel)
                            }else{
                                let firstObject={
                                    taskId:record.id,
                                    formBaseId:this.formBaseId,
                                    trialProductionSite:this.trialProductionSite,
                                    taskWorkId:record.workTaskId,
                                    formBaseNo:record.trialProductionFormNo,
                                    processTechnology:record.processTechnologyName,
                                    subNo:"A",
                                    id:null,
                                }
                                this.orderMainModel = Object.assign({});
                                this.orderMainModel.taskWorkSplitList=[{...firstObject}]
                            }
                        }
                    })
            },
            close () {
                this.isDisabled=false
                this.$emit('close');
                this.visible = false;
                this.orderMainModel= {
                    taskWorkSplitList: [{}],
                }
                clickIndex=0
                this.count=0
                this.isShow=false
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                if(this.count>this.dataSource[0].planRoughcastNum){
                    this.$message.warning('试制数量不能大于总的试制数量')
                    return false
                }else{
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            that.confirmLoading = true;
                            let orderMainData = Object.assign(this.orderMainModel, values);
                            postAction('/trial/task/splitWorkTask',this.orderMainModel.taskWorkSplitList).then((res)=>{
                                if(res.success){
                                    that.$message.success(res.message);
                                    that.$emit('ok');
                                }else{
                                    that.$message.warning(res.message);
                                }
                            }).finally(() => {
                                that.confirmLoading = false;
                                that.close();
                            })

                        }
                    })
                }
            },
            handleCancel () {
                this.close()
            },
            addRowCustom () {
                ++clickIndex
                let subNo=''
              if(clickIndex >= 26){
                  let num=clickIndex-26
                  subNo= String.fromCharCode(65+num)+'1'
              }else{
                  subNo= String.fromCharCode(65+clickIndex)
              }
                let firstObject={
                    trialProductionSite:this.trialProductionSite,
                    taskId:this.record.id,
                    formBaseId:this.formBaseId,
                    taskWorkId:this.record.workTaskId,
                    formBaseNo:this.record.trialProductionFormNo,
                    processTechnology:this.record.processTechnologyName,
                    subNo,
                    // id:clickIndex
                    id:null,
                }
                console.log(firstObject)
                this.orderMainModel.taskWorkSplitList.push(firstObject);
                this.$forceUpdate();
            },
            delRowCustom (index,item) {
                if(item.subNo=='A'){
                    this.$message.warning('子工序A不可删除')
                    return false
                }else{
                    let all = this.orderMainModel
                    deleteAction('trial/task/delSplitWorkTask', {taskWorkSplitId: this.orderMainModel.taskWorkSplitList[index].id}).then((res) => {
                        if (res.success) {
                            //this.$message.success(res.message);
                        } else {
                            console.log('拆单删除失败：'+res.message)
                        }
                    })
                   // all['taskWorkSplitList'].splice(index,1);
                    this.orderMainModel.taskWorkSplitList.splice(index,1);
                    this.$forceUpdate();
                }
            },
        }
    }
</script>

<style scoped lang="less">
  .instruction-msg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    margin: 0 20px;
    color: red;
    font-size: 18px;
  }
  .title_bg{
    text-align: left;
    border: 1px solid #e8e8e8;
    border-right: none;
    background: #fafafa;
    color: rgba(0, 0, 0, 0.85);
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-left:16px !important;
  }
  .title_body{
    border: 1px solid #e8e8e8;
    border-right: none;
    border-top: none;
    text-align: left;
  }
  .last_bg{
    border-right: 1px solid #e8e8e8;
  }
  .parent{
    display: -webkit-box;-webkit-box-align: center;
    height:60px;
    line-height: 60px;
  }
  .box_parent{
    display: flex;justify-content: left;align-items: center;width: 100%;padding-left: 10px;
  }
  .disInput{
    border: none;
    text-align: left;
    padding-left:10px
  }
  .row_body{
    margin-bottom: 0 !important;
    height: 60px;
    line-height:60px;
  }
  .formSelect,.beizhu{
    padding-left: 10px;
  }
  .formSelect /deep/ .ant-form-item-control-wrapper{
    width: 100%;
  }
  .ant-btn {
    padding: 0 10px;
    margin-left: 3px;
  }
  .ant-form-item-control {
    line-height: 0px;
  }
  /** 主表单行间距 */
  .ant-form .ant-form-item {
    margin-bottom: 10px;
  }
  /** Tab页面行间距 */
  .ant-tabs-content .ant-form-item {
    margin-bottom: 0px;
  }
  /deep/ .ant-card-bordered{
    border: none;
  }
  /deep/ .ant-btn{
    margin-left: 8px !important;
  }
  /deep/ .ant-row-flex{
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  @import '~@assets/less/custom-table-search.less';
  /deep/ .ant-table-thead > tr > th{
    padding: 16px 0 16px 16px !important;
  }
  .table-container{
    padding: 16px 0 !important;
  }
</style>
