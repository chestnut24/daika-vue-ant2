<template>
  <a-modal
    :title="title"
    :width="1000"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="submit" type="primary" v-if="!disableSubmit" @click="handleOk" :loading="confirmLoading">确认</a-button>
    </template>
    <a-card>
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
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-row style="margin-top: 40px">
              <a-col :span="19" :push="2">
                <a-form-item label="上传附件"
                             :labelCol="labelCol"
                             :wrapperCol="wrapperCol">
                  <a-upload
                    name="file" :showUploadList="false" :multiple="false" :headers="headers" action="" @change="getFile($event)">
                    <a-button type="primary" ghost>点击选择文件上传 </a-button>
                  </a-upload>
                  <div v-if="fileName!=''">
                    <a @click="handleDown">  {{fileName}}</a>
                    <a @click="handleDelet" style="margin-left: 10px">删除</a>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="19" :push="2">
                <a-form-item label="解决方案"
                             :labelCol="labelCol"
                             :wrapperCol="wrapperCol">
                  <a-textarea style="width: 50%" v-model="solution"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>

          </a-form>
        </a-spin>
        <!--跳转-->
        <project-information ref="projectInfor"></project-information>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
    import ProjectInformation from '../../../system/ProjectInformation'
    import { postAction, getAction,downFile } from '@/api/manage'
    import Vue from 'vue'
    import {ACCESS_TOKEN} from "@/store/mutation-types"
    export default {
        name: 'BalanceModal',
        components: { ProjectInformation },
        data() {
            return {
                description: '气密平衡要求',
                title:'',
                width:21+'cm',
                height:29.7+'cm',
                /* table加载状态 */
                loading:false,
                visible:false,
                confirmLoading:false,
                dataSource:[],
                file:'',
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
                file:'',
                fileName:'',
                id:'',
                name:'',
                solution:'',
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
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token}
        },
        methods:{
            handleDown(){
                if(this.fileName.indexOf('\/')!=-1){
                    let taskCommonId=this.id
                    downFile('/trial/task/plan/common/getFileByTaskCommonId',{taskCommonId:this.id}).then((data)=>{
                        if (!data) {
                            this.$message.warning("文件下载失败")
                            return
                        }
                        /*截取文件名*/
                        let name= this.fileName.substring(this.fileName.lastIndexOf("\/") + 1, this.fileName.length);
                        /*截取文件后缀*/
                        let fileType = this.fileName.substring(this.fileName.lastIndexOf('.') + 1, this.fileName.length)
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), name+'.'+fileType)
                        }else{
                            let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
                            let link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download',name+'.'+fileType)
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link); //下载完成移除元素
                            window.URL.revokeObjectURL(url); //释放掉blob对象
                        }
                    })
                }else{
                    this.$message.warning('文件还未上传，不可下载')
                }
            },
            handleDelet(){
                this.fileName=''
                this.file=''
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
            getFile(e){
                this.file=e.file.originFileObj
                console.log(this.file)
                this.fileName=e.file.originFileObj.name
            },
            add(record,tag,name){
                this.record=record
                this.dataSource=[{...record}]
                this.name=name
                if(tag=='已策划'){
                    /*获取表单信息*/
                    getAction('/trial/task/plan/common/getPlanCommon',{workSplitId:record.id,planType:name}).then(res=>{
                        if(res.success){
                            if(res.result){
                                this.setFormValues(res.result)
                            }
                        }
                    })
                }else if(record.workSplitVOList.trialProductionTaskPlanTechnology){
                    this.setFormValues(record.workSplitVOList.trialProductionTaskPlanTechnology)
                }
                this.visible=true
            },
            setFormValues(data){
                this.$nextTick(() => {
                    this.modal =data;
                    this.id=data.id
                    this.solution=data.solution
                    this.fileName=data.fileUrl
                });
            },
            close () {
                this.$emit('close');
                this.visible = false;
                this.file=''
                this.fileName=''
                this.id=''
                this.solution=''
                this.name=''
            },
            handleOk () {
                const that = this;
                console.log(this.id)
                // 触发表单验证
                if(this.file==''){
                    if(this.fileName==''){
                        this.$message.warning('文件不可为空')
                    }else{
                        this.$message.warning('请重新上传文件，再提交')
                    }
                    return false
                }
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        //  let formData = Object.assign(this.model, values);
                        let formData={}
                        if(this.id!=''){
                            formData.id=this.id
                        }
                        formData.file=this.file
                        formData.planType=this.name
                        formData.solution=this.solution
                        //拆单（子单）主键 taskWorkSplitId
                        //工序任务主键  taskWorkId    record.id
                        //车间任务单主键 taskId
                        //试制流转单主键-与主表关联  formBaseId
                        formData.taskWorkSplitId=that.record.id
                        formData.taskId=that.record.taskId
                        formData.taskWorkId=that.record.taskWorkId
                        formData.formBaseId=that.record.formBaseId
                        const formDatas = new FormData();
                        Object.keys(formData).forEach((key) => {
                            formDatas.append(key, formData[key]);
                        });
                        postAction('/trial/task/plan/common/commit', formDatas).then((res)=>{
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
            },
            handleCancel () {
                this.close()
            },
        }
    }
</script>

<style scoped lang="less">

</style>