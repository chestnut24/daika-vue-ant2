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
    <a-card id="pdfDomHeatTreatmer" ref="pdfDomHeatTreatmer">
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
          <!--热处理要求-->
          <template slot="TrialProductionTaskPlanHeat" slot-scope="text, record">
            <template v-if="record.TrialProductionTaskPlanHeat">
              <span v-if="record.TrialProductionTaskPlanHeat.planStatus==1">已策划</span>
              <span @click="handleHeat(record)" v-else>未策划</span>
            </template>
            <span v-else>未策划</span>
          </template>
        </a-table>
      </div>
      <div>
          <a-form :form="form">
            <a-row>
              <a-col :span="18" :push="4">
                <a-form-item label="对热处理要求">
                <!-- <div style="width: 100%;height: 50px">{{heatr}}</div>-->
                  <a-textarea placeholder="请输入" v-model="heatr" class="hideBorder"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <div>
              <span style="background-color: #eeeeee;padding:2px">过程性能验证</span>
            </div>
            <hr style="color: #c5c5c5">
            <a-row>
              <a-col :span="12">
                <div class="table1">
                  <a-row type="flex"  :gutter="16">
                    <template v-for="item in performanceVerifyFirst.title">
                      <a-col class="table1_title" style="border: 1px solid #ddd" :span="6" >{{item}}</a-col>
                    </template>
                  </a-row>
                  <a-row type="flex" style="border: 1px solid #ddd;border-top: none" :gutter="16" v-for="(item, index) in performanceVerifyFirst.rows" :key="index">
                      <a-col style="border-right: 1px solid #ddd" :span="6" v-for="(itt,ind) in item" :key="ind">
                        <a-form-item>
                          <a-input placeholder="请输入" v-model="performanceVerifyFirst.rows[index][ind]"  style="text-align: center"/>
                        </a-form-item>
                      </a-col>
                  </a-row>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="table1">
                  <a-row type="flex"  :gutter="16">
                    <template v-for="item in performanceVerifySecond.title">
                      <a-col class="table1_title" style="border: 1px solid #ddd" :span="6" >{{item}}</a-col>
                    </template>
                  </a-row>
                  <a-row type="flex" style="border: 1px solid #ddd;border-top: none" :gutter="16" v-for="(item, index) in performanceVerifySecond.rows" :key="index">
                    <a-col style="border-right: 1px solid #ddd" :span="6" v-for="(itt,ind) in item" :key="ind">
                      <a-form-item>
                        <a-input placeholder="请输入" v-model="performanceVerifySecond.rows[index][ind]" style="text-align: center"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-col>
            </a-row>
            <a-row >
              <a-button type="primary" style="width: 98%;margin-top: 10px" @click="addRowCustom">
                <a-icon type="plus" />
              </a-button>
            </a-row>
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
    export default {
        name: 'HeatTreatmentModal',
        components: { ProjectInformation },
        data() {
            return {
                description: '热处理工艺策划',
                title:'热处理工艺策划',
                width:21+'cm',
                height:29.7+'cm',
                /* table加载状态 */
                loading:false,
                visible:false,
                confirmLoading:false,
                dataSource:[],
                pdfPage:null,
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
                    { title: '热处理', dataIndex: 'TrialProductionTaskPlanHeat', align: 'center',scopedSlots: { customRender: 'TrialProductionTaskPlanHeat' } },
                ],
                heatr:'',
                performanceVerifyFirst:{
                    title:["一次","屈服","抗拉","延伸率"],
                    rows:[["外","","",""],["外","","",""],["外","","",""],["内","","",""],["内","","",""],["内","","",""]]
                  },
                performanceVerifySecond:{
                    title:["二次","屈服","抗拉","延伸率"],
                    rows:[["辐","","",""],["辐","","",""],["辐","","",""],["心","","",""],["辋","","",""],["FEA","","",""]]
                },
            }
        },
        methods:{
            addRowCustom () {
                this.performanceVerifyFirst.rows.push([])
                this.performanceVerifyFirst.title.forEach(item=>{
                    this.performanceVerifyFirst.rows[this.performanceVerifyFirst.rows.length-1].push('');
                })
                this.performanceVerifySecond.rows.push([])
                this.performanceVerifySecond.title.forEach(item=>{
                    this.performanceVerifySecond.rows[this.performanceVerifySecond.rows.length-1].push('');
                })
                this.$forceUpdate();
            },
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
                this.heatr=''
                this.record=record
                this.visible=true
                this.dataSource=[{...record}]
                /*获取热处理要求*/
                this.getPlanHeatRequire(record)
                if(tag=='已策划'){
                    /*获取表单信息*/
                    this.getFormInfo(record)
                }else if(record.workSplitVOList.trialProductionTaskPlanTechnology){
                    this.setFormValues(record.workSplitVOList.trialProductionTaskPlanTechnology)
                }
            },

            setFormValues(data){
                this.form.resetFields();
                this.id=data.id
                this.performanceVerifyFirst=JSON.parse(data.performanceVerifyFirst)
                this.performanceVerifySecond=JSON.parse(data.performanceVerifySecond)
            },
            getPlanHeatRequire(record){
                getAction('/trial/task/plan/heat/getPlanHeatRequireByWorkSplitId',{workSplitId:record.id}).then(res=>{
                    if(res.success){
                        this.heatr=res.result
                    }
                })
            },
            getFormInfo(record){
                getAction('/trial/task/plan/heat/getPlanHeatByWorkSplitId',{workSplitId:record.id}).then(res=>{
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
                this.performanceVerifyFirst={
                    title:["一次","屈服","抗拉","延伸率"],
                        rows:[["外","","",""],["外","","",""],["外","","",""],["内","","",""],["内","","",""],["内","","",""]]
                };
                this.performanceVerifySecond={
                    title:["二次","屈服","抗拉","延伸率"],
                        rows:[["辐","","",""],["辐","","",""],["辐","","",""],["心","","",""],["辋","","",""],["FEA","","",""]]
                };
                this.id=''
                this.heatr=''
            },
            handleOk () {
                console.log(this.performanceVerifyFirst)
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let formData = Object.assign(this.model, values);
                        if(that.id!=''){
                            formData.id=that.id
                        }
                        //拆单（子单）主键 taskWorkSplitId
                        //工序任务主键  taskWorkId    record.id
                        //车间任务单主键 taskId
                        //试制流转单主键-与主表关联  formBaseId
                        formData.taskWorkSplitId=that.record.id
                        formData.taskId=that.record.taskId
                        formData.taskWorkId=that.record.taskWorkId
                        formData.formBaseId=that.record.formBaseId
                        formData.performanceVerifyFirst=JSON.stringify(that.performanceVerifyFirst)
                        formData.performanceVerifySecond=JSON.stringify(that.performanceVerifySecond)
                        let trialProductionTaskPlanCastx=formData
                        postAction('/trial/task/plan/heat/commit', trialProductionTaskPlanCastx).then((res)=>{
                            if(res.success){
                                that.$message.success(res.message);
                                that.$emit('ok');
                                that.confirmLoading = false;
                                that.getPdf('热处理','pdfDomHeatTreatmer',that.$refs.pdfDomHeatTreatmer)
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
  .tg  {border-collapse:collapse;border-spacing:0;width: 100%;}
  .tg td,.tg th{border:#d9d9d9 solid 1px;}
  .tg-0lax, /deep/ .ant-form-item-control{
    line-height: 30px;
    height: 30px;
  }
  .hideBorder ,.tg-0lax input,/deep/ .ant-calendar-picker input{
    border: none;
  }
  /deep/ .ant-calendar-picker i{
    display: none;
  }
  .table1 /deep/ .ant-form-item{
    margin-bottom: 0;
  }
  .table1_title{
    text-align: center;
    padding: 5px;
    color: #fff;
    background-color: #ababab;
  }
  .table1 input{
    height: 30px;
    border: none;
  }
</style>