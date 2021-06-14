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
    <a-card id="pdfDomMachining" ref="pdfDomMachining">
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
          <!--生产要求-->
          <template slot="requirement" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanMachine">
              <span v-if="record.trialProductionTaskPlanMachine.planStatus==1">已策划</span>
              <span v-else>未策划</span>
            </template>
            <span v-else>未策划</span>
          </template>
          <!--气密平衡-->
          <template slot="balance" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
              <span v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==1}) ">已策划</span>
              <span v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==0}) ">未策划</span>
              <span v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='气密平衡' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</span>
            </template>
            <span v-else>未策划</span>
          </template>
          <!--三坐标-->
          <template slot="coordinate" slot-scope="text, record">
            <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
              <span v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==1}) ">已策划</span>
              <span v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==0}) ">未策划</span>
              <span v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='三坐标' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</span>
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
                    label="表面状态" >
                    <a-input v-decorator="[ 'surfaceState', {}]" placeholder="请输入"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12" >
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
                <a-col :span="24" >
                  <a-form-item
                    label="加工控制要点">
                    <a-textarea :rows="3" placeholder="请输入" v-decorator="['machiningControlRequire', {}]"/>
                  </a-form-item>
                </a-col>
              </a-col>
              <a-col :span="8">
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
                <a-col :span="24" >
                  <a-form-item>
                    <div style="height: 200px;">
                      <h3 style="height: 200px;width:5%;float: left;font-weight: 800">正面造型图</h3>
                      <div style="border: 1px solid #ccc;height: 200px;float: right;width: 90%;text-align: center">
                        <img  alt="" :src="srccc" width="200px"/>
                      </div>
                    </div>
                  </a-form-item>
                </a-col>
              </a-col>
            </a-row>
            <div>
              <span style="background-color: #eeeeee;padding:2px">工艺质量要求</span>
            </div>
            <hr style="color: #c5c5c5">
            <a-row :gutter="24">
              <a-col :span="8">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-baqh" rowspan="5">加工中心钻头</th>
                    <th class="tg-0lax">螺栓孔钻头</th>
                    <th class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningCenterBit['螺栓孔钻头']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0lax">螺栓孔划窝钻头</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningCenterBit['螺栓孔划窝钻头']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">气门孔钻头</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningCenterBit['气门孔钻头']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">气门孔划窝钻头</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningCenterBit['气门孔划窝钻头']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">防转槽铣刀</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningCenterBit['防转槽铣']"/>
                    </td>
                  </tr>
                  </thead>
                </table>
              </a-col>
              <a-col :span="8">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-0x09" rowspan="4">检具</th>
                    <th class="tg-0lax">中心孔止通规</th>
                    <th class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCheckingTool['中心孔止通规']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0lax">位置度规</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCheckingTool['位置度规']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">刹车板</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCheckingTool['刹车板']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0lax">帽止口直径帽槽深度检板</td>
                    <td class="tg-0lax">
                      <a-input placeholder="请输入" v-model="craftQuantityCheckingTool['帽止口直径帽槽深度检板']"/>
                    </td>
                  </tr>
                  </thead>
                </table>
              </a-col>
              <a-col :span="8">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-266k" rowspan="5">孔位加工信息</th>
                    <th class="tg-0pky">气门孔角度</th>
                    <th class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityHoleMachining['气门孔角度']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pky">气门孔距离</td>
                    <td class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityHoleMachining['气门孔距离']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0pky">气门孔与螺栓孔角度</td>
                    <td class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityHoleMachining['气门孔与螺栓孔角度']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0pky">气门孔高度</td>
                    <td class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityHoleMachining['气门孔高度']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0pky">中心孔</td>
                    <td class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityHoleMachining['中心孔']"/>
                    </td>
                  </tr>
                  </thead>
                </table>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 10px">
              <a-col :span="14">
                <table class="tg">
                  <thead>
                  <tr>
                    <td class="tg-gpkyp" rowspan="4">工艺参数(以程序中为准)</td>
                    <td class="tg-0pkyz" rowspan="2">转速（r/min）</td>
                    <td class="tg-0pkyc">CNC1</td>
                    <td class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityParam['转速(r/min)-CNC1']"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="tg-0pkyc">CNC2</td>
                    <th class="tg-0pky">
                      <a-input placeholder="请输入"v-model="craftQuantityParam['转速(r/min)-CNC2']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyz" rowspan="2">进给率（mm/r）</td>
                    <td class="tg-0pkyc">CNC1</td>
                    <th class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityParam['进给率(mm/r)-CNC1']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyc">CNC2</td>
                    <th class="tg-0pky">
                      <a-input placeholder="请输入" v-model="craftQuantityParam['进给率(mm/r)-CNC2']"/>
                    </th>
                  </tr>
                  </thead>
                </table>
              </a-col>
              <a-col :span="10">
                <table class="tg">
                  <thead>
                  <tr>
                    <th class="tg-zpky" rowspan="4">加工中心</th>
                    <th class="tg-0pkyb">螺栓孔</th>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningFirst['螺栓孔']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">螺栓孔划倒角</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningFirst['螺栓孔划窝']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">气门孔</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningFirst['气门孔']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">气门孔划窝</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningFirst['气门孔划窝']"/>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td class="tg-zpky" rowspan="4">加工中心</td>
                    <td class="tg-0pkyb">螺栓孔</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningSecond['螺栓孔']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">螺栓孔划倒角</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningSecond['螺栓孔划窝']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">气门孔</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningSecond['气门孔']"/>
                    </th>
                  </tr>
                  <tr>
                    <td class="tg-0pkyb">气门孔划窝</td>
                    <th class="tg-0pkyb">
                      <a-input placeholder="请输入" v-model="craftQuantityMachiningSecond['气门孔划窝']"/>
                    </th>
                  </tr>
                  </tbody>
                </table>
              </a-col>
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
    import { postAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
    import pick from 'lodash.pick'
    import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
    export default {
        name: 'MachiningModal',
        components: { ProjectInformation },
        mixins: [GetImgByProjectNumMixin],
        data() {
            return {
                description: '生产要求',
                title:'生产要求',
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
                model:{},
                record:{},
                id:'',
                columns: [ // 表头
                    { title: '试制单编号', dataIndex: 'formBaseNo', align: 'center',scopedSlots: { customRender: 'formBaseNo' }},
                    { title: '戴卡部件号', dataIndex: 'projectNo',align: 'center',scopedSlots: { customRender: 'projectNo' }},
                    { title: '工序', dataIndex: 'processTechnology',align: 'center' },
                    { title: '子序号', dataIndex: 'subNo', align: 'center' ,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'center' },
                    { title: '用途', dataIndex: 'purpose',align: 'center',scopedSlots: { customRender: 'deliverDt'  }},
                    { title: '备注', dataIndex: 'remarks', align: 'center',scopedSlots: { customRender: 'purposesTab' } },
                    { title: '生产要求', dataIndex: 'requirement', align: 'center',scopedSlots: { customRender: 'requirement' } },
                    { title: '气密平衡', dataIndex: 'balance', align: 'center',scopedSlots: { customRender: 'balance' } },
                    { title: '三坐标', dataIndex: 'coordinate', align: 'center',scopedSlots: { customRender: 'coordinate' } },
                ],
                craftQuantityCheckingTool:{
                    '中心孔止通规':'','位置度规':'','刹车板':'','帽止口直径帽槽深度检板':''
                },
                craftQuantityHoleMachining:{
                    '气门孔角度':'','气门孔距离':'','气门孔与螺栓孔角度':'','气门孔高度':'','中心孔':''
                },
                craftQuantityMachiningCenterBit:{
                    '螺栓孔钻头':'','螺栓孔划窝钻头':'','气门孔钻头':'','气门孔划窝钻头':'','防转槽铣':''
                },
                craftQuantityMachiningFirst:{
                    '螺栓孔':'','螺栓孔划窝':'','气门孔':'','气门孔划窝':''
                },
                craftQuantityMachiningSecond:{
                    '螺栓孔':'','螺栓孔划窝':'','气门孔':'','气门孔划窝':''
                },
                craftQuantityParam:{
                    '转速(r/min)-CNC1':'','转速(r/min)-CNC2':'','进给率(mm/r)-CNC1':'','进给率(mm/r)-CNC2':''
                },
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
            setFormValues(data){
                this.form.resetFields();
                this.model=JSON.parse(data.projectInfo);
                this.craftQuantityCheckingTool=JSON.parse(data.craftQuantityCheckingTool)
                this.craftQuantityHoleMachining=JSON.parse(data.craftQuantityHoleMachining)
                this.craftQuantityMachiningCenterBit=JSON.parse(data.craftQuantityMachiningCenterBit)
                this.craftQuantityMachiningFirst=JSON.parse(data.craftQuantityMachiningFirst)
                this.craftQuantityMachiningSecond=JSON.parse(data.craftQuantityMachiningSecond)
                this.craftQuantityParam=JSON.parse(data.craftQuantityParam)
                this.model.machiningControlRequire=data.machiningControlRequire;
                this.id=data.id
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'firstTrialProductionTime', 'trialProductionBatch', 'size', 'customerName',
                        'trialTime', 'blankPlanNumber', 'surfaceState', 'lastTrialMachine', 'projectManager','machiningControlRequire'))
                });
            },
            /*获取项目信息*/
            getProjectInfo(record){
                getAction('/project/getProjectById',{id:record.formBase.project.id}).then(res=>{
                    if(res.success){
                        this.form.resetFields();
                        this.model = Object.assign({}, res.result);
                        this.$nextTick(() => {
                            this.form.setFieldsValue(pick(this.model, 'firstTrialProductionTime', 'trialProductionBatch', 'size', 'customerName',
                                'trialTime', 'blankPlanNumber', 'surfaceState', 'lastTrialMachine', 'projectManager'))
                        });
                    }
                })
            },
            getFormInfo(record){
                getAction('/trial/task/plan/machine/getPlanMachineByWorkSplitId',{workSplitId:record.id}).then(res=>{
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
                this.model={}
                this.record={}
                this.craftQuantityCheckingTool={}
                this.craftQuantityHoleMachining={}
                this.craftQuantityMachiningCenterBit={}
                this.craftQuantityMachiningFirst={}
                this.craftQuantityMachiningSecond={}
                this.craftQuantityParam={}
                this.srccc=null
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            that.confirmLoading = true;
                            //let formData = Object.assign(values);
                            let formData={}
                            if(this.id!=''){
                                formData.id=this.id
                            }
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
                            formData.craftQuantityCheckingTool=JSON.stringify(this.craftQuantityCheckingTool)
                            formData.craftQuantityHoleMachining=JSON.stringify(this.craftQuantityHoleMachining)
                            formData.craftQuantityMachiningCenterBit=JSON.stringify(this.craftQuantityMachiningCenterBit)
                            formData.craftQuantityMachiningFirst=JSON.stringify(this.craftQuantityMachiningFirst)
                            formData.craftQuantityMachiningSecond=JSON.stringify(this.craftQuantityMachiningSecond)
                            formData.craftQuantityParam=JSON.stringify(this.craftQuantityParam)
                            formData.projectInfo=JSON.stringify(formData.projectInfo)
                            postAction('/trial/task/plan/machine/commit',formData).then((res)=>{
                                if(res.success){
                                    that.$message.success(res.message);
                                    that.$emit('ok');
                                    that.confirmLoading = false;
                                    that.getPdf('粗车','pdfDomMachining',that.$refs.pdfDomMachining)
                                }else{
                                    that.$message.warning(res.message);
                                }
                            }).finally(() => {
                                //that.confirmLoading = false;
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
  .tg td,.tg th{border:#d9d9d9 solid 1px;}
  .tg .tg-baqh,.tg .tg-0x09,.tg .tg-266k{text-align:center;height: 200px; background-color: #8d8d8d; color: #fff;width: 25%}
  .tg .tg-0lax,.tg .tg-0pky{
    width: 35%;
    text-align: center;
  }
  .tg .tg-gpkyp{
    text-align:center;height: 200px; background-color: #8d8d8d; color: #fff;width: 10%
  }
  .tg .tg-zpky{
    text-align:center;height: 50px; background-color: #8d8d8d; color: #fff;width: 15%
  }
  .tg .tg-0lax input,.tg .tg-0pky input,.tg .tg-0pkyb input{
    border: none;
  }
  .tg-0pkyb{
  text-align: center;
  }
  .tg-0pkyb /deep/ .ant-input{
    height: 22px;
  }
  .tg-0pkyz{
    width: 16%;
    background-color: #ababab; color: #fff;
    text-align: center;
  }
  .tg-0pkyc{
    width: 10%;
    text-align: center;
  }
</style>