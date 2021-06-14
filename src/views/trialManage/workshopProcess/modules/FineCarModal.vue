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
    <a-card id="pdfDomFineCar" ref="pdfDomFineCar">
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
          <!--精车要求-->
          <template slot="TrialProductionTaskPlanTechnology" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanTechnology">
              <span v-if="record.trialProductionTaskPlanTechnology.planStatus==1">已策划</span>
              <span v-else>未策划</span>
            </template>
            <span v-else>未策划</span>
          </template>
        </a-table>
      </div>
      <div>
          <a-form :form="form">
            <a-row :gutter="24">
              <a-col :span="16">
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="首次试制时间">
                    <j-date style="width: 85%" :showTime="true" date-format="YYYY-MM-DD" placeholder="请选择" v-decorator="['firstTrialProductionTime', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="试制次数">
                    <a-input-number placeholder="请输入" v-decorator="['trialProductionBatch', {}]" style="width: 100%"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="客户名称">
                    <a-input placeholder="请输入" v-decorator="['customerName', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="试制日期">
                    <a-date-picker placeholder="请选择" showTime format='YYYY-MM-DD' v-decorator="[ 'trialTime', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="表面状态">
                    <a-input v-decorator="[ 'surfaceState', {}]" placeholder="请输入"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="上次试制机台">
                    <a-input placeholder="请输入" v-decorator="['lastTrialMachine', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="项目经理">
                    <a-input placeholder="请输入" v-decorator="['projectManager', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="中心孔直径">
                    <a-input placeholder="请输入" v-decorator="['centerHoleDiameter', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24" >
                  <a-form-item
                    label="加工控制要点">
                    <a-textarea :rows="3" placeholder="请输入" v-decorator="['machiningControlRequire', {}]"/>
                  </a-form-item>
                </a-col>
              </a-col>
              <a-col :span="8">
                <a-row :gutter="24" >
                  <a-col :span="24">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="毛坯尺寸">
                    <a-input placeholder="请输入" v-decorator="['size', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="计划毛坯数">
                    <a-input placeholder="请输入" v-decorator="['blankPlanNumber', {}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item >
                    <div style="height: 200px;">
                      <h3 style="height: 200px;width:5%;float: left;font-weight: 800">正面造型图</h3>
                      <div style="border: 1px solid #ccc;height: 200px;float: right;width: 90%;text-align: center">
                        <img  alt="" :src="srccc" width="200px"/>
                      </div>
                    </div>
                  </a-form-item>
                </a-col>
                </a-row>
              </a-col>
            </a-row>

            <div>
              <span style="background-color: #eeeeee;padding:2px">工艺质量要求</span>
            </div>
            <hr style="color: #c5c5c5">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-0laxd" rowspan="3">刀具信息</th>
                    <th class="tg-0lax">正面抹平</th>
                    <th class="tg-0lax">正面精车</th>
                    <th class="tg-0lax">外圆</th>
                    <th class="tg-0lax">帽口</th>
                  </tr>
                  <tr>
                    <td class="tg-0lax">刀杆/刀片</td>
                    <td class="tg-0lax">刀杆/刀片</td>
                    <td class="tg-0lax">刀杆/刀片</td>
                    <td class="tg-0lax">刀杆/刀片</td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCutter['正面抹平-刀杆/刀片']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCutter['正面精车-刀杆/刀片']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCutter['外圆-刀杆/刀片']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCutter['帽口-刀杆/刀片']"/>
                    </td>
                  </tr>
                  </thead>
                </table>
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-0laxd" rowspan="3">加工参数</th>
                    <th class="tg-0lax">正面抹平</th>
                    <th class="tg-0lax">正面精车</th>
                    <th class="tg-0lax">外圆</th>
                    <th class="tg-0lax">帽口</th>
                  </tr>
                  <tr>
                    <td class="tg-0lax">转速/进给率</td>
                    <td class="tg-0lax">转速/进给率</td>
                    <td class="tg-0lax">转速/进给率</td>
                    <td class="tg-0lax">转速/进给率</td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningParam['正面抹平-转速/进给率']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningParam['正面精车-转速/进给率']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningParam['外圆-转速/进给率']"/>
                    </td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningParam['帽口-转速/进给率']"/>
                    </td>
                  </tr>
                  </thead>
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
    import { postAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
    import pick from 'lodash.pick'
    import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
    export default {
        name: 'FineCarModal',
        components: { ProjectInformation },
        mixins: [GetImgByProjectNumMixin],
        data() {
            return {
                description: '精车工艺要求',
                title:'精车工艺要求',
                width:21+'cm',
                height:29.7+'cm',
                /* table加载状态 */
                loading:false,
                pdfPage:null,
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
                columns: [ // 表头
                    { title: '试制单编号', dataIndex: 'formBaseNo', align: 'center',scopedSlots: { customRender: 'formBaseNo' }},
                    { title: '戴卡部件号', dataIndex: 'projectNo',align: 'center',scopedSlots: { customRender: 'projectNo' }},
                    { title: '工序', dataIndex: 'processTechnology',align: 'center' },
                    { title: '子序号', dataIndex: 'subNo', align: 'center' ,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'center' },
                    { title: '用途', dataIndex: 'purpose',align: 'center',scopedSlots: { customRender: 'deliverDt'  }},
                    { title: '备注', dataIndex: 'remarks', align: 'center',scopedSlots: { customRender: 'purposesTab' } },
                    { title: '精车要求', dataIndex: 'TrialProductionTaskPlanTechnology', align: 'center',scopedSlots: { customRender: 'TrialProductionTaskPlanTechnology' } },
                ],
                record:{},
                id:"",
                craftQuantityCutter:{
                    '正面抹平-刀杆/刀片':'',
                    '正面精车-刀杆/刀片':'',
                    '外圆-刀杆/刀片':'',
                    '帽口-刀杆/刀片':'',
                },
                craftQuantityMachiningParam:{
                    '正面抹平-转速/进给率':'',
                    '正面精车-转速/进给率':'',
                    '外圆-转速/进给率':'',
                    '帽口-转速/进给率':''
                },
                srccc:null
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
                this.visible=true
                this.record=record
                if (this.record.formBase.projectNo) this.getImg(this.record.formBase.projectNo);
                this.dataSource=[{...record}]
                if(tag=='已策划'){
                    /*获取表单信息*/
                    this.getFormInfo(record)
                }else if(record.workSplitVOList.trialProductionTaskPlanTechnology){
                      this.setFormValues(record.workSplitVOList.trialProductionTaskPlanTechnology)
                }else{
                    this.getProjectInfo(record)
                }
            },
            /*获取项目信息*/
            getProjectInfo(record){
                getAction('/project/getProjectById',{id:record.formBase.project.id}).then(res=>{
                    if(res.success){
                        this.form.resetFields();
                        this.model = Object.assign({}, res.result);
                        console.log(this.model)
                        this.$nextTick(() => {
                            this.form.setFieldsValue(pick(this.model, 'firstTrialProductionTime', 'trialProductionBatch', 'size', 'customerName',
                                'trialTime', 'blankPlanNumber', 'surfaceState', 'lastTrialMachine', 'projectManager'))
                        });
                    }
                })
            },
            getFormInfo(record){
                getAction('/trial/task/plan/technology/getPlanTechnologyByWorkSplitId',{workSplitId:record.id}).then(res=>{
                    if(res.success){
                        if(res.result){
                           this.setFormValues(res.result)
                        }
                    }
                })
            },
            setFormValues(data){
                this.form.resetFields();
                this.model=JSON.parse(data.projectInfo);
                this.model.centerHoleDiameter=data.centerHoleDiameter;
                this.model.machiningControlRequire=data.machiningControlRequire;
                this.id=data.id
                console.log(this.model)
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'firstTrialProductionTime', 'trialProductionBatch', 'size', 'customerName',
                        'trialTime', 'blankPlanNumber', 'surfaceState', 'lastTrialMachine', 'projectManager','centerHoleDiameter','machiningControlRequire'))
                    this.craftQuantityMachiningParam=JSON.parse(data.craftQuantityMachiningParam)
                    this.craftQuantityCutter=JSON.parse(data.craftQuantityCutter)
                });
            },
            close () {
                this.$emit('close');
                this.visible = false;
                this.craftQuantityMachiningParam={}
                this.craftQuantityCutter={}
                this.model={}
                this.record={}
                this.srccc=null
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            that.confirmLoading = true;
                            let formData={}
                            if(this.id!=''){
                                formData.id=this.id
                            }
                            formData.centerHoleDiameter=values.centerHoleDiameter
                            formData.machiningControlRequire=values.machiningControlRequire
                            formData.projectInfo={
                                firstTrialProductionTime:values.firstTrialProductionTime,
                                trialProductionBatch:values.trialProductionBatch,
                                size:values.size,
                                customerName:values.customerName,
                                trialTime:values.trialTime,
                                blankPlanNumber:values.blankPlanNumber,
                                surfaceState:values.surfaceState,
                                lastTrialMachine:values.lastTrialMachine,
                                projectManager:values.projectManager
                            }
                            //拆单（子单）主键 taskWorkSplitId
                            //工序任务主键  taskWorkId    record.id
                            //车间任务单主键 taskId
                            //试制流转单主键-与主表关联  formBaseId
                            formData.taskWorkSplitId=that.record.id
                            formData.taskId=that.record.taskId
                            formData.taskWorkId=that.record.taskWorkId
                            formData.formBaseId=that.record.formBaseId
                            formData.craftQuantityMachiningParam=JSON.stringify(this.craftQuantityMachiningParam)
                            formData.craftQuantityCutter=JSON.stringify(this.craftQuantityCutter)
                            formData.projectInfo=JSON.stringify(formData.projectInfo)
                            postAction('/trial/task/plan/technology/commit',formData).then((res)=>{
                                if(res.success){
                                    that.$message.success(res.message);
                                    that.$emit('ok');
                                    that.confirmLoading = false;
                                    that.getPdf('精车','pdfDomFineCar',that.$refs.pdfDomFineCar)
                                }else{
                                    that.$message.warning(res.message);
                                }
                            }).finally(() => {
                               // that.confirmLoading = false;
                                //that.close();
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
  /deep/ .ant-form-item{
    margin-bottom: 0px;
  }
  /deep/ .ant-calendar-picker {
    min-width: 170px !important;
  }
  .tg  {border-collapse:collapse;border-spacing:0;width: 100%}
  .tg td{border:#d9d9d9 solid 1px;font-family:Arial, sans-serif;font-size:14px;
    overflow:hidden;}
  .tg th{border:#d9d9d9 solid 1px;font-family:Arial, sans-serif;font-size:14px;
    font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
  .tg .tg-0lax{text-align:center;vertical-align:top;height: 34px;line-height: 34px}
  .tg .tg-0laxd{
    height: 100px;
    line-height: 100px;
    text-align: center;
    background-color: #8d8d8d;
    color: #fff;
    width: 100px;
  }
  .tg .tg-0lax input{
    text-align: center;
    border: none;
  }
  .j-editable-image {
    height: 32px;
    max-width: 100px !important;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }

  }
</style>