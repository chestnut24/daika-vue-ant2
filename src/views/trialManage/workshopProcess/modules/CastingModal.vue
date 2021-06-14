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
  <a-card ref="pdfDomCasting" id="pdfDomCasting">
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
            <a-row :gutter="24" style="margin-bottom: 50px;">
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="首次试制时间">
                  <j-date style="width: 85%" :showTime="true" v-decorator="['firstTrialProductionTime', {}]" date-format="YYYY-MM-DD" placeholder="请选择" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="试制次数">
                  <a-input-number placeholder="请输入" v-decorator="['trialProductionBatch', {}]" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="毛坯尺寸">
                  <a-input placeholder="请输入" v-decorator="['size', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="客户名称">
                  <a-input  placeholder="请输入" v-decorator="['customerName', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="试制日期">
                  <a-date-picker placeholder="请选择" showTime format='YYYY-MM-DD' v-decorator="[ 'trialTime', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="铝液温度">
                  <a-input placeholder="请输入" v-decorator="['alTemperature', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="表面状态">
                  <a-input v-decorator="[ 'surfaceState', {}]" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="上次试制机台">
                  <a-input placeholder="请输入" v-decorator="['lastTrialMachine', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="毛坯重量">
                  <a-input placeholder="请输入" v-decorator="['roundWeight', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="项目经理">
                  <a-input placeholder="请输入" v-decorator="['projectManager', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="模具工程师">
                  <a-input placeholder="请输入" v-decorator="['mouldEngineer', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="冒口单边加工量">
                  <a-input placeholder="请输入" v-decorator="['singleSideProcess', {}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item
                  label="风道，保温设置（模具要求）">
                  <a-textarea :rows="3" placeholder="请输入" v-model="mouldRequire"/>
                </a-form-item>
              </a-col>
            </a-row>
            <div>
              <span style="background-color: #eeeeee;padding:2px">铸造工艺  状态-性能</span>
              <a-button type="primary" style="float: right;position: relative;top:-4px;padding-top: 2px" @click="handleReset">清空</a-button>
            </div>
            <hr style="color: #c5c5c5">
            <table style="border-bottom: none;margin-bottom: 10px" class="tg">
              <td style="width: 100px;background-color: #656565;color: #fff" class="tg-x">毛坯沾水方式</td>
              <td style="width: 70px" class="tg-x">冒口朝上</td>
              <td>
                <a-form-item>
                  <a-input placeholder="请输入" v-model="craftBlankWetWay['冒口朝上']" class="hideBorder"/>
                </a-form-item>
              </td>
              <td style="width: 70px" class="tg-x">冒口朝下</td>
              <td>
                <a-form-item>
                  <a-input placeholder="请输入" v-model="craftBlankWetWay['冒口朝下']" class="hideBorder"/>
                </a-form-item>
              </td>
              <td style="border-top: #fff;border-bottom: #fff"></td>
              <td style="width: 90px" class="tg-x">过滤网尺寸</td>
              <td>
                <a-form-item>
                  <a-input placeholder="请输入" v-model="craftFilter['过滤网尺寸']" class="hideBorder"/>
                </a-form-item>
              </td>
              <td style="width:50px" class="tg-x">类型</td>
              <td>
                <a-form-item>
                  <a-input placeholder="请输入" v-model="craftFilter['类型']" class="hideBorder"/>
                </a-form-item>
              </td>
            </table>
            <table class="tg">
                <thead>
                <tr>
                  <th class="tg-frde">压力参数</th>
                  <th class="tg-0pkyT">一段</th>
                  <th class="tg-0pky">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftPressureParam['一段']" class="hideBorder"/>
                    </a-form-item>
                  </th>
                  <th class="tg-0pkyT">二段</th>
                  <th class="tg-0pky">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftPressureParam['二段']" class="hideBorder"/>
                    </a-form-item>
                  </th>
                  <th class="tg-0pkyT">三段</th>
                  <th class="tg-0pky">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftPressureParam['三段']" class="hideBorder"/>
                    </a-form-item>
                  </th>
                  <th class="tg-0pkyT">四段</th>
                  <th class="tg-0pky">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftPressureParam['四段']" class="hideBorder"/>
                    </a-form-item>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="tg-0pkyT t_02">保压时间</td>
                  <td class="tg-0pky t_02" colspan="2">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftPressureHoldTime" class="hideBorder"/>
                    </a-form-item>
                  </td>
                  <td class="tg-dvpl t_02">冷却时间</td>
                  <td class="tg-0pky t_02" colspan="2">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftCoolingTime" class="hideBorder"/>
                    </a-form-item>
                  </td>
                  <td class="tg-0pkyT t_02">补偿压力</td>
                  <td class="tg-0pky t_02" colspan="3">
                    <a-form-item>
                      <a-input placeholder="请输入" v-model="craftChargingPressure" class="hideBorder"/>
                    </a-form-item>
                  </td>
                </tr>
                </tbody>
              </table>
            <div class="table2">
                <a-row type="flex"  :gutter="24" style="margin-left: -7px;margin-right:-7px">
                  <template v-for="(item,dex) in craftCooling.title">
                    <a-col :key="dex" class="table1_title" style="border: 1px solid #ddd;width: 30px;padding-left: 0;padding-right: 0" :flex="1" :span="1/15" v-if="dex < 14 && dex>0">{{item}}</a-col>
                    <a-col :key="dex" class="table1_title" style="border: 1px solid #ddd;padding-left: 0;padding-right: 0;width: 50px" :flex="2" :span="1/15" v-else-if="dex < 14 && dex==0">{{item}}</a-col>
                  </template>
                </a-row>
                <a-row type="flex" style="border: 1px solid #ddd;border-top: none" :gutter="14" v-for="(item, index) in craftCooling.rows" :key="index">
                      <a-col style="border-right: 1px solid #ddd;padding-right: 0;padding-left: 0" v-if="ind<14" :flex="1" :span="1/15" v-for="(itt,ind) in item" :key="ind">
                        <a-input placeholder="请输入" v-if="ind!=0"  v-model="craftCooling.rows[index][ind]"  style="text-align: center"/>
                        <div v-else style="width:110px;text-align: center">{{craftCooling.rows[index][ind]}}</div>
                      </a-col>
                </a-row>
              </div>
              <div class="table2">
                <a-row type="flex"  :gutter="24" style="margin-left: -7px;margin-right:-7px">
                  <template v-for="(item,dex) in craftCooling.title">
                    <a-col class="table1_title" style="border: 1px solid #ddd;width: 30px;padding-left: 0;padding-right: 0" :flex="1" :span="1/15" v-if="dex > 13 && dex>13">{{item}}</a-col>
                    <a-col class="table1_title" style="border: 1px solid #ddd;padding-left: 0;padding-right: 0;width: 50px" :flex="2" :span="1/15" v-else-if="dex > 13 || dex==0">{{item}}</a-col>
                  </template>
                </a-row>
                <a-row type="flex" style="border: 1px solid #ddd;border-top: none" :gutter="14" v-for="(item, index) in craftCooling.rows" :key="index">
                  <a-col style="border-right: 1px solid #ddd;padding-right: 0;padding-left: 0" v-if="ind>13 || ind==0" :flex="1" :span="1/15" v-for="(itt,ind) in item">
                    <a-input placeholder="请输入" v-if="ind!=0"  v-model="craftCooling.rows[index][ind]"  style="text-align: center"/>
                    <div v-else style="width:110px;text-align: center">{{craftCooling.rows[index][ind]}}</div>
                  </a-col>
                </a-row>
              </div>
            <div style="margin-top: 10px">
              <span style="background-color: #eeeeee;padding:2px">过程性能验证</span>
            </div>
            <hr style="color: #c5c5c5">
            <a-row style="margin-bottom: 10px;">
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
                      <a-col class="table1_title" style="border: 1px solid #ddd;border-right:none" :span="6" >{{item}}</a-col>
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
            <div>
              <span style="background-color: #eeeeee;padding:2px">试制要求</span>
            </div>
            <hr style="color: #c5c5c5">
            <table class="items" style="margin-bottom: 10px">
              <tr>
                <td class="tg-0lax11" style="text-align: center">模具改动</td>
                <td class="tg-0lax11">
                  <a-form-item>
                    <a-input placeholder="请输入" v-model="requireMouldModify" class="hideBorder"/>
                  </a-form-item>
                </td>
              </tr>
            </table>
            <a-row :gutter="24" style="margin-left:0;margin-bottom:30px">
              <a-col :span="6" style="border:#d9d9d9 solid 1px;padding: 5px">
                <span>模具是否修改完成</span>
              </a-col>
              <a-col :span="8" style="border:#d9d9d9 solid 1px;padding: 5px;border-left: none">
                <a-radio-group name="radioGroup" :default-value="1" v-model="requireMouldModifyStatus">
                  <a-radio :value="1">
                    是
                  </a-radio>
                  <a-radio :value="2">
                    否
                  </a-radio>
                </a-radio-group>
              </a-col>
              <a-col :span="24" >
                <a-form-item
                  label="生产要求">
                  <a-textarea :rows="3" placeholder="请输入" v-model="requireProduceRequire"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-left:0;margin-bottom: 40px;">
              <a-col :span="24" >
                <a-form-item
                  label="对热处理要求">
                  <a-textarea :rows="3" placeholder="请输入" v-decorator="['remark', {}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-left: 12px;margin-right:-1px">
            <a-col :span="6" style="border:#d9d9d9 solid 1px;padding: 5px;text-align: center">
              <span>端面到螺栓孔距离</span>
            </a-col>
            <a-col :span="6"  class="last" >
              <a-form-item>
                <a-input placeholder="请输入" v-model="requireBoltHole" class="hideBorder"/>
              </a-form-item>
            </a-col>
            <a-col :span="6" style="border:#d9d9d9 solid 1px;padding: 5px;text-align: center">
              <span>轮辋深度</span>
            </a-col>
            <a-col  :span="6" class="last" >
              <a-form-item>
                <a-input placeholder="请输入" v-model="requireRimDepth" class="hideBorder"/>
              </a-form-item>
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
    export default {
        name: 'CastingModal',
        components: { ProjectInformation },
        data() {
            return {
                description: '压铸工艺策划单',
                title:'压铸工艺策划单',
                width:21+'cm',
                height:29.7+'cm',
                pdfPage:null,
                /* table加载状态 */
                loading:false,
                visible:false,
                confirmLoading:false,
                dataSource:[],
                model:{},
                record:{},
                imgA:null,
                id:'',
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
                    { title: '压铸工艺', dataIndex: 'trialProductionTaskPlanCast', align: 'center',scopedSlots: { customRender: 'trialProductionTaskPlanCast' } },
                    { title: 'X光机控制要求', dataIndex: 'trialProductionTaskPlanCastx', align: 'center',scopedSlots: { customRender: 'trialProductionTaskPlanCastx' } },
                ],
                mouldRequire:'',//风道，保温设置
                craftBlankWetWay:{"冒口朝上":"","冒口朝下":""},
                craftFilter:{"过滤网尺寸":"","类型":""},
                craftPressureParam:{"一段":"","二段":"","三段":"","四段":""},
                craftChargingPressure:'',//补偿压力
                craftCoolingTime:'',//冷却时间
                craftPressureHoldTime:'',//保压时间
                craftCooling:{
                    "title":["冷却","B1水","B1吹风","B2","B3","B4","B5水","B5吹风","T1","T1吹风","T2","T3水","T3吹风","T4",
                        "T5水","T6","T7水","T7吹风","T8","S1水","S1吹风","S2水","S2吹风","S3水","S3吹风","S4水","S4吹风"],
                    "rows":[
                        ["开启时间","","","","","","","","","","","","","","","","","","","","","","","","","",""],
                        ["延迟时间","","","","","","","","","","","","","","","","","","","","","","","","","",""],
                        ["流量","","","","","","","","","","","","","","","","","","","","","","","","","",""]
                    ]
                },
                performanceVerifyFirst:{
                    "title":["一次","屈服","抗拉","延伸率"],
                    "rows":[["外","","",""],["外","","",""],["外","","",""],["内","","",""],["内","","",""],["内","","",""]]
                },
                performanceVerifySecond:{
                    "title":["二次","屈服","抗拉","延伸率"],
                    "rows":[["辐","","",""],["辐","","",""],["辐","","",""],["心","","",""],["辋","","",""],["FEA","","",""]]
                },
                requireBoltHole:'',//试制要求-端面到螺栓孔距离
                requireHeatRequire:'',//试制要求-对热处理要求
                requireMouldModify:'',//试制要求-模具改动
                requireProduceRequire:"",//试制要求-生产要求
                requireRimDepth:'',//试制要求-轮辋深度
                requireMouldModifyStatus:0
            }
        },
        methods:{
            handleReset(){
                this.mouldRequire = ''//风道，保温设置
                this.craftBlankWetWay = {"冒口朝上":"","冒口朝下":""}
                this.craftFilter = {"过滤网尺寸":"","类型":""}
                this.craftPressureParam = {"一段":"","二段":"","三段":"","四段":""}
                this.craftChargingPressure = '' //补偿压力
                this.craftCoolingTime = '' //冷却时间
                this.craftPressureHoldTime = '' //保压时间
                this.craftCooling={
                    "title":["冷却","B1水","B1吹风","B2","B3","B4","B5水","B5吹风","T1","T1吹风","T2","T3水","T3吹风","T4",
                        "T5水","T6","T7水","T7吹风","T8","S1水","S1吹风","S2水","S2吹风","S3水","S3吹风","S4水","S4吹风"],
                        "rows":[
                            ["开启时间","","","","","","","","","","","","","","","","","","","","","","","","","",""],
                            ["延迟时间","","","","","","","","","","","","","","","","","","","","","","","","","",""],
                            ["流量","","","","","","","","","","","","","","","","","","","","","","","","","",""]
                    ]
                }
                this.performanceVerifyFirst={
                    "title":["一次","屈服","抗拉","延伸率"],
                        "rows":[["外","","",""],["外","","",""],["外","","",""],["内","","",""],["内","","",""],["内","","",""]]
                }
                this.performanceVerifySecond={
                    "title":["二次","屈服","抗拉","延伸率"],
                        "rows":[["辐","","",""],["辐","","",""],["辐","","",""],["心","","",""],["辋","","",""],["FEA","","",""]]
                }
                 this.requireBoltHole = '' //试制要求-端面到螺栓孔距离
                 this.requireHeatRequire = '' //试制要求-对热处理要求
                 this.requireMouldModify = '' //试制要求-模具改动
                 this.requireProduceRequire = "" //试制要求-生产要求
                 this.requireRimDepth = '' //试制要求-轮辋深度
                 this.requireMouldModifyStatus = 0
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
                this.visible=true
                this.record=record
                this.dataSource=[{...record}]
                if(tag=='已策划'){
                    /*获取表单信息*/
                    this.getFormInfo(record)
                }else if(record.workSplitVOList.trialProductionTaskPlanTechnology){
                    this.setFormValues(record.workSplitVOList.trialProductionTaskPlanTechnology)
                }else{
                    this.getProjectInfo(record)
                    /*获取过程性能验证 */
                    this.getPlanHeat(record)
                }
            },
            setFormValues(data){
                this.form.resetFields();
                this.model=JSON.parse(data.projectInfo);
                this.id=data.id
                this.mouldRequire=data.mouldRequire
                this.craftBlankWetWay=JSON.parse(data.craftBlankWetWay)
                this.craftFilter=JSON.parse(data.craftFilter)
                this.craftPressureParam=JSON.parse(data.craftPressureParam)
                this.craftCooling=JSON.parse(data.craftCooling)
                this.performanceVerifyFirst=JSON.parse(data.performanceVerifyFirst)
                this.performanceVerifySecond=JSON.parse(data.performanceVerifySecond)
                this.craftChargingPressure=data.craftChargingPressure
                this.craftCoolingTime=data.craftCoolingTime
                this.craftPressureHoldTime=data.craftPressureHoldTime
                this.requireBoltHole=data.requireBoltHole
                this.requireHeatRequire=data.requireHeatRequire
                this.requireMouldModify=data.requireMouldModify
                this.requireProduceRequire=data.requireProduceRequire
                this.requireRimDepth=data.requireRimDepth
                this.requireMouldModifyStatus=data.requireMouldModifyStatus
                this.projectInfo=JSON.parse(data.projectInfo)
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'firstTrialProductionTime', 'trialProductionBatch', 'size', 'customerName',
                        'trialTime','alTemperature', 'surfaceState', 'lastTrialMachine', 'roundWeight','projectManager','mouldEngineer','singleSideProcess'))
                });
            },
            /*获取过程性能验证*/
            getPlanHeat(record){
                getAction('/trial/task/plan/cast/getPlanHeatByPlanCasrWorkSplitId',{workSplitId:record.id}).then(res=>{
                    if(res.success){
                        if(res.result? res.result.performanceVerifyFirst:false){
                            this.performanceVerifyFirst=JSON.parse(res.result.performanceVerifyFirst)
                        }else if(res.result.performanceVerifySecond){
                            this.performanceVerifySecond=JSON.parse(res.result.performanceVerifySecond)
                        }
                    }
                })
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
                                'trialTime','alTemperature', 'surfaceState', 'lastTrialMachine', 'roundWeight','projectManager','mouldEngineer','singleSideProcess'))
                        });
                    }
                })
            },
            getFormInfo(record){
                getAction('/trial/task/plan/cast/getPlanCastByWorkSplitId',{workSplitId:record.id}).then(res=>{
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
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let formData={}
                        if(that.id!=''){
                            formData.id=that.id
                        }
                        formData.mouldRequire=that.mouldRequire
                        formData.craftBlankWetWay=JSON.stringify(that.craftBlankWetWay)
                        formData.craftFilter=JSON.stringify(that.craftFilter)
                        formData.craftPressureParam=JSON.stringify(that.craftPressureParam)
                        formData.craftCooling=JSON.stringify(that.craftCooling)
                        formData.performanceVerifyFirst=JSON.stringify(that.performanceVerifyFirst)
                        formData.performanceVerifySecond=JSON.stringify(that.performanceVerifySecond)
                        formData.craftChargingPressure=that.craftChargingPressure

                        formData.craftCoolingTime=that.craftCoolingTime
                        formData.craftPressureHoldTime=that.craftPressureHoldTime
                        formData.requireBoltHole=that.requireBoltHole
                        formData.requireHeatRequire=that.requireHeatRequire
                        formData.requireMouldModify=that.requireMouldModify
                        formData.requireProduceRequire=that.requireProduceRequire
                        formData.requireRimDepth=that.requireRimDepth
                        formData.requireMouldModifyStatus=that.requireMouldModifyStatus

                        formData.projectInfo=JSON.stringify(values)
                        //拆单（子单）主键 taskWorkSplitId
                        //工序任务主键  taskWorkId    record.id
                        //车间任务单主键 taskId
                        //试制流转单主键-与主表关联  formBaseId
                        formData.taskWorkSplitId=that.record.id
                        formData.taskId=that.record.taskId
                        formData.taskWorkId=that.record.taskWorkId
                        formData.formBaseId=that.record.formBaseId
                        postAction('/trial/task/plan/cast/commit',formData).then((res)=>{
                            if(res.success){
                                that.$message.success(res.message);
                                that.$emit('ok');
                                that.confirmLoading = false;
                                that.getPdf('压铸','pdfDomCasting',that.$refs.pdfDomCasting)
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
  /deep/ .ant-form-item{
    margin-bottom: 0px;
  }
  /deep/ .ant-calendar-picker{
    min-width: 180px !important;
  }
  .tg  {border-collapse:collapse;border-spacing:0;margin-left: -7px;margin-right:-7px}
  .tg td,.tg th{border:#d9d9d9 solid 1px;font-family:Arial, sans-serif;font-size:14px}
  .tg .tg-frde{background-color:#656565;border-color:#d9d9d9;color:#fff;text-align:center;vertical-align:top;height: 40px;line-height: 40px}
  .tg .tg-0pky{border-color:#d9d9d9;text-align:center;vertical-align:top}
  .tg .tg-dvpl{border-color:#d9d9d9;text-align:center;vertical-align:top}
  .tg .tg-0lax{text-align:left;vertical-align:top}
  .tg-x{
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .hideBorder{
    border: none;
  }
  .item{
    width: 100%;
  }
  .items{
    width: 100%;
    border-collapse:collapse;border-spacing:0
  }
  .tg-0pkyT{
    width: 10%;
    text-align: center;
    height: 27px;
    line-height: 27px;
  }
  .item /deep/ .ant-form-item{
    height:27px;
    line-height: 27px;
  }
  .t_02 {
    height: 27px;
    line-height: 27px;
    text-align: center;
  }
  .t_02 /deep/ .ant-form-item,.t_02 /deep/ .ant-form-item-control{
    height: 25px;
    line-height: 25px;
  }
  .tg-0pkyS{
    width: 7%;
  }
  .tg-0pkyH{
    width: 6%;
  }
  .tg .tg-0lax11{
    width: 70%;
  }
  .tg-0lax11{
    border:#d9d9d9 solid 1px;

  }
  .tg-0lax11 /deep/ .ant-form-item{
    margin-bottom: 0;
  }
  .tg-0lax11, /deep/ .ant-form-item-control {
    line-height:40px;
    height: 40px;
  }
  .last{
    border:#d9d9d9 solid 1px;padding: 5px;border-left: none;
    padding: 0px;
    height: 33px;
    line-height: 33px;
  }
  .last /deep/ .ant-form-item,.last /deep/ .ant-form-item-control,.last /deep/ input{
    height: 30px;
    line-height: 30px;
  }

  .table1 /deep/ .ant-row-flex{
    margin-left: 0 !important;
    margin-right: 0 !important;
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
  .table2 /deep/ input{
    height: 20px;
    width: 60px;
    border: none;
    text-align: center;
  }
  .table2 /deep/ .a-col{
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
.table1{
  margin-top: 10px;
}
</style>