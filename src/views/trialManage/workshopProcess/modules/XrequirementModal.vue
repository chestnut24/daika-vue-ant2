<template>
  <a-modal
    :title="title"
    :width="1000"
    :ok=false
    :visible="visible"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="submit" type="primary" v-if="!disableSubmit" @click="handleOk" :loading="confirmLoading">确认</a-button>
    </template>
    <a-card ref="pdfDomXrequi" id="pdfDomXrequi">
      <div>
        <a-table
          bordered
          ref="table"
          rowKey="id"
          size="middle"
          :columns="columns"
          :loading="loading"
          :dataSource="dataSource"
          :pagination="false">
          <!--试制单编号-->
          <template slot="formBaseNo" slot-scope="text, record">
            <a @click="handleDetails(record)">{{record.formBaseNo}}</a>
          </template>
          <!--戴卡-->
          <template slot="projectNo" slot-scope="text, record">
            <a  @click="showProjectDetail(record.formBase.project.id)">
              {{record.formBase.project.projectNumber}}
            </a>
          </template>
          <!--压铸工艺-->
          <template slot="trialProductionTaskPlanCast" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanCast">
              <span v-if="record.trialProductionTaskPlanCast.planStatus==1">已策划</span>
              <span v-else>未策划</span>
            </template>
            <span  v-else>未策划</span>
          </template>
          <!--X光机控制要求-->
          <template slot="trialProductionTaskPlanCastx" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanCastx">
              <span v-if="record.trialProductionTaskPlanCastx.planStatus==1">已策划</span>
              <span v-else>未策划</span>
            </template>
            <span v-else>未策划</span>
          </template>
        </a-table>
      </div>
      <div>
          <a-form :form="form">
            <a-row>
              <a-col :span="8" :push="7">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="客户名称">
                  <a-input disabled  v-model="record.formBase.project.customerName" class="hideBorder customerName" style="height: 39px;line-height: 39px"/>
                </a-form-item>
              </a-col>
              <a-col :span="8" :push="7">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="试制日期">
                  <j-date disabled :showTime="true" date-format="YYYY-MM-DD"  v-model="record.formBase.project.firstTrialProductionTime"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
               <!-- <img height="200px" src="" onerror="">-->
                <img style="width: 200px" :src="srccc" alt="">
              </a-col>
              <a-col :span="12">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-0lax">表面状态</th>
                    <th class="tg-0lax1">
                      <a-form-item>
                        <a-input placeholder="请输入" v-decorator="['surfaceCondition', {}]" class="hideBorder"/>
                      </a-form-item>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td class="tg-0lax">试制目的</td>
                    <td class="tg-0lax1">
                      <a-form-item>
                        <a-input placeholder="请输入" v-decorator="['trialPurpose', {}]" class="hideBorder"/>
                      </a-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">试制交付物</td>
                    <td class="tg-0lax1">
                      <a-form-item>
                        <a-input placeholder="请输入" v-decorator="['trialDilivery', {}]" class="hideBorder"/>
                      </a-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">计划生产量</td>
                    <td class="tg-0lax1">
                      <a-form-item>
                        <a-input placeholder="请输入" v-decorator="['plannedOutput', {}]" class="hideBorder"/>
                      </a-form-item>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </a-col>
            </a-row>
            <div>
              <span style="background-color: #eeeeee;padding:2px">控制要求</span>
            </div>
            <hr style="color: #c5c5c5">
            <table class="tg item">
              <thead>
              <tr>
                <th class="tg-0lax">轮心</th>
                <th class="tg-0lax1">
                  <a-form-item>
                    <a-input placeholder="请输入" v-decorator="['controlRequireWheelCenter', {}]" class="hideBorder"/>
                  </a-form-item>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="tg-0lax">论辐</td>
                <td class="tg-0lax1">
                  <a-form-item>
                    <a-input placeholder="请输入" v-decorator="['controlRequireWheelSpoke', {}]" class="hideBorder"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="tg-0lax">轮辋</td>
                <td class="tg-0lax1">
                  <a-form-item>
                    <a-input placeholder="请输入" v-decorator="['controlRequireWheelRim', {}]" class="hideBorder"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="tg-0lax">FEA</td>
                <td class="tg-0lax1">
                  <a-form-item>
                    <a-input placeholder="请输入" v-decorator="['controlRequireFea', {}]" class="hideBorder"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="tg-0lax">备注</td>
                <td class="tg-0lax1">
                  <a-form-item>
                    <a-input placeholder="请输入" v-decorator="['controlRequireRemark', {}]" class="hideBorder"/>
                  </a-form-item>
                </td>
              </tr>
              </tbody>
            </table>
          </a-form>
        <!--跳转-->
        <project-information ref="projectInfor"></project-information>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
    import ProjectInformation from '../../../system/ProjectInformation'
    import { postAction, getAction } from '@/api/manage'
    import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
    import pick from 'lodash.pick'
    export default {
        name: 'XrequirementModal',
        components: { ProjectInformation },
        mixins: [GetImgByProjectNumMixin],
        data() {
            return {
                description: 'X光过程控制要求',
                title:'X光过程控制要求',
                width:21+'cm',
                height:29.7+'cm',
                pdfPage:null,
                /* table加载状态 */
                loading:false,
                visible:false,
                confirmLoading:false,
                dataSource:[],
                labelCol: {
                    xs: {span: 24},
                    sm: {span:9},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 15},
                },
                form: this.$form.createForm(this),
                validatorRules: {},
                disableSubmit: false,
                record:{},
                model:{},
                columns: [ // 表头
                    { title: '试制单编号', dataIndex: 'formBaseNo', align: 'center',scopedSlots: { customRender: 'formBaseNo' }},
                    { title: '戴卡部件号', dataIndex: 'projectNo',align: 'center',scopedSlots: { customRender: 'projectNo' }},
                    { title: '工序', dataIndex: 'processTechnology',align: 'center' },
                    { title: '子序号', dataIndex: 'subNo', align: 'center' ,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'center' },
                    { title: '用途', dataIndex: 'purpose',align: 'center',scopedSlots: { customRender: 'deliverDt'  }},
                    { title: '备注', dataIndex: 'remarks', align: 'center',scopedSlots: { customRender: 'purposesTab' } },
                    { title: '压铸工艺', dataIndex: 'trialProductionTaskPlanCast', align: 'center',scopedSlots: { customRender: 'trialProductionTaskPlanCast' } },
                    { title: 'X光机控制要求', dataIndex: 'trialProductionTaskPlanCastx', align: 'center',scopedSlots: { customRender: 'trialProductionTaskPlanCastx' } },
                ],
                srccc: null
            }
        },
        methods:{
            showProjectDetail(id) {
                this.$refs.projectInfor.getData(id);
            },
            handleDetails(record){
                this.$router.push({
                    path: `/trial/trialForm`,
                    query: {
                        id: record.formBaseId,//试制单主键  在你那边接口 formBaseId
                        no: record.formBaseNo,//试制单编号  你那边接口 trialProductionFormNo
                    },
                })
            },
            add(record,tag){
                this.record=record
                if (this.record.formBase.projectNo) this.getImg(this.record.formBase.projectNo);
                this.visible=true
                this.dataSource=[{...record}]
                if(tag=='已策划'){
                    /*获取表单信息*/
                    this.getFormInfo(record)
                }else if(record.workSplitVOList.trialProductionTaskPlanTechnology){
                    this.setFormValues(record.workSplitVOList.trialProductionTaskPlanTechnology)
                }
            },
            setFormValues(data){
                this.form.resetFields();
                this.model = Object.assign({}, data);
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'controlRequireFea', 'controlRequireRemark', 'controlRequireWheelCenter', 'controlRequireWheelRim',
                        'controlRequireWheelSpoke', 'plannedOutput', 'surfaceCondition', 'trialDilivery', 'trialPurpose'))
                });
            },
            getFormInfo(record){
                getAction('/trial/task/plan/castx/getPlanCastxByWorkSplitId',{workSplitId:record.id}).then(res=>{
                  if(res.success){
                      if(res.result){
                          this.setFormValues(res.result)
                      }
                  }
                })
            },
            close () {
                this.$emit('close');
                this.visible = false;
                this.srccc=null
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            that.confirmLoading = true;
                            let formData = Object.assign(this.model, values);
                            //拆单（子单）主键 taskWorkSplitId
                            //工序任务主键  taskWorkId    record.id
                             //车间任务单主键 taskId
                            //试制流转单主键-与主表关联  formBaseId
                            formData.taskWorkSplitId=that.record.id
                            formData.taskId=that.record.taskId
                            formData.taskWorkId=that.record.taskWorkId
                            formData.formBaseId=that.record.formBaseId
                            postAction('/trial/task/plan/castx/commit', formData).then((res)=>{
                                if(res.success){
                                    that.$message.success(res.message);
                                    that.$emit('ok');
                                    that.confirmLoading = false;
                                    that.getPdf('X光','pdfDomXrequi',that.$refs.pdfDomXrequi)
                                }else{
                                    that.$message.warning(res.message);
                                }
                            }).finally(() => {
                                //that.confirmLoading = false;
                               // that.close();
                            })

                        }
                    })
            },
            handleCancel () {
                this.close()
            },
        }
    }
</script>

<style scoped lang="less">
  .tg  {border-collapse:collapse;border-spacing:0; width: 100%;}
  .tg td{border-color:#d9d9d9;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
   padding:10px 5px;}
  .tg th{border-color:#d9d9d9;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
   padding:10px 5px;word-break:normal;}
  .tg .tg-0lax{text-align:center;vertical-align:top; width: 30%;}
  .tg .tg-0lax1{
    width: 70%;
  }
  .tg-0lax1 /deep/ .ant-form-item{
    margin-bottom: 0;
  }
 .tg-0lax, /deep/ .ant-form-item-control{
    line-height: 30px;
    height: 30px;
  }
  .hideBorder ,/deep/ .ant-calendar-picker input{
    border: none;
    line-height: 32px;
    margin-bottom: 5px;
  }
  /deep/ .ant-calendar-picker i{
   display: none;
  }
  .customerName:focus{
    border: none !important;
  }
 /deep/ .ant-input[disabled]{
   background-color: #fff;
   color: #292929;
 }
</style>