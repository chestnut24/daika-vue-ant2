<template>
  <div style="overflow-x: auto">
    <a-card style="min-width: 1600px;" >
      <div v-if="refresh">
        <a-spin />
      </div>
      <div class="content-frame" v-else>
        <div class="content-frame-left">
          <div class="title">
            <span class="divide"> </span>
            <span><b>试制流转单信息</b></span>
          </div>
          <div class="fundamental-information">
            <div class="fundamental-information-left">
              <div class="fundamental-information-item">
                <div class="item-text make-center-left" >
                  <span><b>戴卡部件号</b></span>
                </div>
                <div class="item-info-left make-center-left" style="padding-left:16px;">
                  <span>{{showParams.projectNo}}</span>
                </div>
              </div>
              <div class="fundamental-information-item">
                <div class="item-text make-center-left">
                  <span><b>试制流转单号</b></span>
                </div>
                <div class="item-info-right make-center-left" style="padding-left:16px;">
                  <span>{{showParams.trialProductionFormNo}}</span>
                </div>
              </div>
              <!--                <div class="fundamental-inforamtion-item">-->
              <!--                  <div class="item-text make-center">-->
              <!--                    <span><b>戴卡订单号</b></span>-->
              <!--                  </div>-->
              <!--                  <div class="item-info make-center">-->
              <!--                    <span>{{showParams.projectNo}}</span>-->
              <!--                  </div>-->
              <!--                </div>-->
              <div class="fundamental-information-item">
                <div class="item-text make-center-left">
                  <span><b>模具信息</b></span>
                </div>
                <div class="item-info-left make-center-left" style="padding-left:16px;">
                  <span>{{showParams.selectMouldStr}}</span>
                </div>
              </div>
            </div>
            <div class="fundamental-information-right make-center">
              <img :src="srccc" height="100" width="100"/>
            </div>
          </div>
          <div class="title" style="margin-top: 16px;margin-bottom: 12px;">
            <span class="divide"> </span>
            <span><b>试制流转单信息</b></span>
          </div>
          <div class="trial-information">
            <div class="trial-information-item">
              <div class="item-text make-center-left">
                <span><b>计划毛坯数</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.planRoughcastNum}}</span>
              </div>
            </div>
            <div class="trial-information-item">
              <div class="item-text make-center-left">
                <span><b>计划发样日期</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.planSendSamplesDt}}</span>
              </div>
            </div>
            <div class="trial-information-item">
              <div class="item-text make-center-left">
                <span><b>交付日期</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.deliverDt}}</span>
              </div>
            </div>
            <div class="trial-information-item">
              <div class="item-text make-center-left">
                <span><b>计划量产地</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.planProductPlace}}</span>
              </div>
            </div>
            <div class="trial-information-item-long">
              <div class="item-text make-center-left">
                <span><b>轮型防措</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.wheeledPokaYoke}}</span>
              </div>
            </div>
            <div class="trial-information-item-long">
              <div class="item-text make-center-left">
                <span><b>特殊说明</b></span>
              </div>
              <div class="item-info make-center-left">
                <span>{{showParams.remarks}}</span>
              </div>
            </div>
            <div class="table-showFrame">
              <div style="width: 100%">
                <a-table
                  ref="table"
                  size="middle"
                  bordered
                  :columns="columnsPurpose"
                  :dataSource="showParams.purposes"
                  :pagination=false>
                  <template slot="title" slot-scope="currentPageData">
                    用途
                  </template>
                </a-table>
              </div>
            </div>
            <div class="table-showFrame">
              <div style="width: 100%">
                <a-table
                  ref="table"
                  size="middle"
                  bordered
                  :columns="columns"
                  :dataSource="showParams.formWorks"
                  :pagination=false>
                  <template slot="title" slot-scope="currentPageData">
                    工序选择
                  </template>
                </a-table>
              </div>
            </div>
            <div class="trial-information-item-long" v-if="order" style="margin-top: 8px;">
              <div class=" make-center-left" style="background: #fff">
                <span style="color:red;font-size: 16px;margin-right: 12px;"><b>过程指令:</b></span>
              </div>
              <div class=" make-center-left">
                <span style="color: red;font-size: 16px;">{{order}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="content-frame-right">
          <div class="title-frame">
            <div class="trial-title-frame">
              <span>工艺维护</span>
              <div
                class="ignore-frame make-center"
                v-if="showParams.formWorks[selectTab].technologyName == '喷涂' || showParams.formWorks[selectTab].technologyName == '粗车' || showParams.formWorks[selectTab].technologyName == '精车'">
                <a-popconfirm
                  ok-text="是"
                  cancel-text="否"
                  placement="rightBottom"
                >
                  <template slot="title" v-if="ignoreArr.length != 0">
                    <p v-for="(item,index) in ignoreArr" :key = index>{{ item.sapNumber }}物资 数量不足</p>
                  </template>
                  <template slot="title" v-else>
                    <p></p>
                  </template>
                  <span style="font-size: 20px">
                     物资齐套率:<b style="color: #00DB00;" class="underLine" @click="checkIgnore">{{showParams.formWorks&&showParams.formWorks[selectTab]&&showParams.formWorks[selectTab].fullSetRate.toFixed(2)}}%</b>
                  </span>
                </a-popconfirm>
              </div>
            </div>
          </div>
          <div class="tab-frame">
            <div class="check-trail-manager">
              <a-button v-has="'trial:checkAuditUser'" @click="openDuty" v-if="showButton"  ghost>查看工艺维护负责人</a-button>
            </div>
            <a-tabs  v-if="showParams.formWorks && showParams.formWorks.length" :default-active-key="activeTab" :animated = "false" @change="callback" >
              <a-tab-pane v-for="(item, index) in showParams.formWorks" :key="index" :tab="item.technologyName" >
                <div v-if="tabFresh">
                  <a-spin/>
                </div>
                <div v-else>
                  <div class="top-msg" >
                    <div class="msg-item">
                      <span class="msg-title">注意事项：</span>
                      <span class="msg-content">{{ item.remarks }}</span>
                    </div>
                    <div class="msg-item">
                      <span class="msg-title">负责人：</span>
                      <span class="msg-content">{{ item.managerName }}</span>
                    </div>
                  </div>
                  <div class="mid-table">
                    <a-table
                      ref="table"
                      size="middle"
                      bordered
                      :columns="rightColumns"
                      :dataSource="rightDataSource"
                      :pagination=false
                      class="bluetable"
                    >
                      <a-space slot="status" slot-scope="text, record, i" :class="record.status === '已核对'?'column-green':'column-red'" >
                        {{text}}
                      </a-space>
                      <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                        <a-button type="link" @click="openCheck(operate, i)" v-if="showButton">策划</a-button>
                      </a-space>
                    </a-table>
                  </div>
                  <div class="input-frame">
                    <a-row class="row">
                      <a-col :span="12">
                        <div>
                          <div  style="margin-bottom: 9px">
                            <span style="font-size: 16px ">试制地推荐:</span>
                          </div>
                          <a-select
                            mode="multiple"
                            style="width: 250px"
                            @change="handleChange"
                            v-model="updateParams.trialProductionRecommend"
                            placeholder="请选择试制地推荐"
                            :disabled="!showButton"
                          >
                            <a-select-option v-for="(item, index) in dic.trial_production_site" :key="item.text">
                              {{item.text}}
                            </a-select-option>
                          </a-select>
                        </div>
                      </a-col>
                    </a-row>
                    <a-row class="row">
                      <a-col :span="12">
                        <a-checkbox :disabled="!showButton" @change="ignoreOnchange" :defaultChecked = "isIgnore">是否忽略齐套率</a-checkbox>
                      </a-col>
                    </a-row>
                    <a-row class="row">
                      <a-col :span="12">
                        <div>
                          <div style="margin-bottom: 9px">
                            <span style="font-size: 16px;">解决方案:</span>
                          </div>
                          <a-textarea
                            v-model="updateParams.solution"
                            placeholder="请输入解决方案"
                            :auto-size="{ minRows: 4}"
                            style="width: 400px"
                            :disabled="!showButton"
                          />
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="submit-button make-center-left" v-if="showButton">
            <a-button type="primary" @click="CheckBeforeTrialProduction"
                      :disabled="!((canCheck&&!isIgnore) || (canCheck&&isIgnore&&updateParams.solution))">工序试制前核对</a-button>
          </div>
        </div>
      </div>
      <a-modal v-model:visible="confirmationDocumentVisible" :title="modalTitle">
        <div class="modal-table-frame">
          <a-table
            ref="table"
            size="middle"
            bordered
            :columns="modalColumns"
            :dataSource="modalDataSource"
            :pagination=false
          >
            <template slot="fileName" slot-scope="text, record, i">
              <template v-if="fileArr.length">
                <a-space  class="operate-row" >
                  <a-select  placeholder="请选择" v-model="record.fileName"  style="width: 200px;" @change="selectChange(record,i)">
                    <a-select-option v-for="(data,index) in fileArr" :key="data">
                      {{ data }}
                    </a-select-option>
                  </a-select>
                </a-space>
              </template>
              <template v-else>
                {{record.fileName}}
              </template>
            </template>
            <a-space slot="operate" slot-scope="text, operate, i"  class="operate-row" >
              <a-button type="link" v-if="!showRadio" @click="changeVersion">更换版本</a-button>
              <a-radio v-if="showRadio" :checked="ifChecked" @change="modalCheck"></a-radio>
            </a-space>
          </a-table>
        </div>
        <template #footer>
          <a-button key="submit" type="primary"  @click="handleOk" :disabled="showRadio&&!ifChecked">确定</a-button>
          <a-button key="back" @click="handleCancel()">取消</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="managerVisible" title="查看工艺维护负责人" width="800px">
        <div class="duty-show-frame">
          <div class="fundamental-information">
            <a-row class="row">
              <a-col :span="12">
                <a-space align="center">
                  <div class="left-text">
                    <span style="font-size: 14px ">试制单编号:</span>
                  </div>
                  <span >{{showParams.trialProductionFormNo}}</span>
                </a-space>
              </a-col>
              <a-col :span="12">
                <a-space align="center">
                  <div class="left-text1">
                    <span style="font-size: 14px ">戴卡部件号:</span>
                  </div>
                  <span >{{showParams.projectNo}}</span>
                </a-space>
              </a-col>
            </a-row>
          </div>
          <div class="manager-table">
            <h3 style="margin-bottom: 10px"><b>工序工艺维护负责人</b></h3>
            <a-table
              ref="table"
              size="middle"
              bordered
              :columns="managerColumns"
              :dataSource="managerDataSource"
              :pagination=false
              :scroll="{ y: 200 }"
            >
              <a-space slot="operate" slot-scope="text, record, i"  class="operate-row" >
                <a-button type="link" v-if="record.dutyName" @click="changeManager(record, i)">更换负责人</a-button>
                <a-button type="link" v-if="!record.dutyName" @click="changeManager(record, i)">选择负责人</a-button>
              </a-space>
            </a-table>
          </div>
          <div class="manager-table">
            <h3 style="margin-bottom: 10px"><b>工序工艺维护子核对项配置</b></h3>
            <a-table
              ref="table"
              size="middle"
              bordered
              :columns="managerChildrenColumns"
              :dataSource="managerChildrenDataSource"
              :pagination=false
              :scroll="{ y: 200 }"
            >
              <a-space slot="operate" slot-scope="text, record, i"  class="operate-row" >
                <a-button type="link" v-if="record.dutyName" @click="changeManager(record, i)">更换负责人</a-button>
                <a-button type="link" v-if="!record.dutyName" @click="changeManager(record, i)">选择负责人</a-button>
              </a-space>
            </a-table>
          </div>
        </div>
        <template #footer>
          <a-button key="submit" type="primary"  @click="dutyHandleOk">提交</a-button>
          <a-button key="back" @click="dutyHandleCancel()">取消</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="managerShowVisible" title="负责人">
        <div class="check-manager make-center">
          <a-input  placeholder="请选择" v-model="selectManagerRealName"  style="width: 200px;" @change="checkManager" >
          </a-input>
          <a-button @click="goCheckManager" style="margin-left: 8px">选择</a-button>
        </div>
        <template #footer>
          <a-button key="submit" type="primary"  @click="managerCheck">选择</a-button>
          <a-button key="back" @click="managerCancel">取消</a-button>
        </template>
      </a-modal>
      <select-trial-manager ref="modal" v-on:get-text="getProjectNumber"></select-trial-manager>

    </a-card>
  </div>

</template>

<script>
  import {getTrialFormById,
    getDictItemsFromCache,
    confirmWorkPlan,
    SearchPlanByPLM,
    getManager,
    submitManager,
    confirmWork,
    getOrder,
    getIgnoreInfo} from '@/api/api';
  import store from '@/store/';
  import RowTable from '../component/RowTable';
  import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin';
  import selectTrialManager from './selectTrialManager'
  export default {
    name: 'TrialProductionMaintenance',
    components: { RowTable,selectTrialManager },
    mixins: [GetImgByProjectNumMixin],
    inject:['closeCurrent'],
    mounted() {
      this.getList();
      this.getDic();
      this.getManagerList();
      if(localStorage.getItem('selectTab')){
        console.log('localStorage.getItem(\'selectTab\');',localStorage.getItem('selectTab'))
        this.selectTab = localStorage.getItem('selectTab');
        this.activeTab = (Number(localStorage.getItem('selectTab')));
        console.log('activeTab',this.activeTab);
      }

    },
    watch:{
      rightDataSource(val,oldVal){
        console.log('val',val,'oldVal',oldVal);
        const nowUserId = store.getters.userInfo.id;
        let okNum = 0;
        val.forEach((item , index)=>{
          if(item.status == '已核对'){
            okNum++;
          }
        })
        console.log(nowUserId == this.showParams.formWorks[this.selectTab].managerId,okNum == val.length,okNum);
        if(nowUserId == this.showParams.formWorks[this.selectTab].managerId && okNum == val.length){
          this.canCheck = true;
        }else{
          this.canCheck = false;
        }
        console.log('canCheck',this.canCheck);
      }
    },
    data(){
      return{
        selectManagerRealName:'',//选择负责人的真正姓名，用于双向绑定
        srccc: null,
        ignoreArr:[],//忽略齐套率的数组
        projectId:'',
        managerParams:{
          pageNo:1,
          pageSize:20,
        },
        showButton:true,//用于控制查看不显示按钮
        timer: 0,//计时器
        order:'',//过程指令
        tabFresh:true,//是否tab页刷新
        okNum:0,//已核对的数量
        refresh:true,//是否页面数据刷新
        positionArr:['试制地1','试制地2','试制地3'],//试制地推荐数组
        positionStr:'',//试制地推荐数组拼接字符串
        rightDataSource:[],// 右侧展示得工艺表格数据源
        canCheck:true,//工序试制前核对是否禁用
        activeTab: 0,//默认展开的tab页
        showParams:{
          projectNo:'', //戴卡部件号
          trialProductionFormNo:'', //试制单编号
          selectMouldStr:'',//模具信息
          planRoughcastNum:'',//计划毛坯数
          planSendSamplesDt:'',//计划发样日期
          deliverDt:'',//交付日期
          remarks:'',//特殊说明
          wheeledPokaYoke:'',//轮形防挫
          planProductPlace:'',//计划量产地
          formWorks:[],//工序选择
        },
        updateParams:{
          trialProductionRecommend:[],//试制地推荐
          solution:'',//解决方案
        },
        confirmationDocumentVisible:false,//文件类核对项确认
        showRadio:false,// 弹窗是否展示radio
        modalTitle:'',//弹窗标题
        managerVisible:false,//查看工艺维护负责人
        dic:{
          check_trial_production:[],
          trial_production_site:[] ,//试制地推荐
        },
        fileArr:[],// 弹窗更换文件数组
        selectTab:0,//右侧选中的tab页
        columns:[
          { title: '工序流程', dataIndex: 'technologyName', key: 'technologyName', align: 'center', },
          { title: '负责人', dataIndex: 'managerName', key: 'managerName', align: 'center', },
          { title: '注意事项', dataIndex: 'remarks', key: 'remarks', align: 'center', },
        ],
        columnsPurpose:[
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '数量', dataIndex: 'number', key: 'number', align: 'center', },
        ],
        rightColumns:[
          { title: '是否核对', dataIndex: 'status', key: 'status', align: 'left', scopedSlots: { customRender: 'status' }},
          { title: '确认人', dataIndex: 'managerName', key: 'managerName', align: 'left', },
          { title: '试制前策划项', dataIndex: 'technologyName', key: 'technologyName', align: 'left', },
          { title: '交付文件', dataIndex: 'fileName', key: 'fileName', align: 'left', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'left',scopedSlots: { customRender: 'operate' } },
        ],
        rowColumns: [ // 行内表格
          { title: '试制用途', dataIndex: 'purpose' },
          { title: '数量', dataIndex: 'number' },
        ],
        modalColumns:[ //文件类核对项确认弹窗表格
          { title: '文件名', dataIndex: 'fileName',align: 'center' ,width:150,scopedSlots: { customRender: 'fileName' } },
          { title: '操作', dataIndex: 'number',align: 'center',width:150,scopedSlots: { customRender: 'operate' } },
        ],
        managerColumns:[
          { title: '工序名', dataIndex: 'name',align: 'center' ,width:150 },
          { title: '工序维护总监批人', dataIndex: 'dutyName',align: 'center' ,width:150 },
          { title: '操作', dataIndex: 'operatle',align: 'center',width:150,scopedSlots: { customRender: 'operate' } },
        ],
        managerChildrenColumns:[
          { title: '工序名', dataIndex: 'childrenName',align: 'center' ,width:110 },
          { title: '工艺维护核对项', dataIndex: 'name',align: 'center' ,width:110 },
          { title: '分项核对人', dataIndex: 'dutyName',align: 'center' ,width:110 },
          { title: '操作', dataIndex: 'operate',align: 'center',width:110,scopedSlots: { customRender: 'operate' } },
        ],
        managerChildrenDataSource:[],//工序工艺维护负责人子数据源
        managerDataSource:[],//工序工艺维护负责人数据源
        modalDataSource:[],//文件类核对项确认弹窗表格数据源
        ifChecked:false,//弹窗radio是否被选中
        selectOption:'',
        selectId:'',
        managerShowVisible:false,//负责人弹窗
        selectManager:undefined,//选择的负责人
        managerArr:[],//负责人数组
        editManagerArr:[],//修改的负责人
        selectProject:'',//选择的工艺名
        urlId:'', //获取到的主键id
        isIgnore:false,//是否忽略齐套率
        selectTable:'',//更换工艺维护人时选中的表格
        selectTableIndex:'',//更换工艺维护人时选中的表格的索引
      }
    },
    methods:{
      goCheckManager(){
        this.$refs.modal.add();
      },
      getProjectNumber(e) { // 父组件监听子组件值
        console.log('e', e);
        this.selectManager = e.username;
        this.selectManagerRealName = e.realname;
        this.checkManager(e);
        this.managerCheck();
        // this.partNumber = e.projectNumber;
        // this.basicInformation[0].value = e.size;
        // this.basicInformation[1].value = e.modelNumber;
        // this.basicInformation[2].value = e.productionProject;
        // this.basicInformation[3].value = e.productionType;
      },
      ignoreOnchange(e){
        console.log(`checked = ${!((this.canCheck&&!this.isIgnore) || (this.canCheck&&this.isIgnore&&this.updateParams.solution))}`);
        this.isIgnore = e.target.checked;
      },
      checkIgnore(){
        const obj = {
          projectId:this.projectId,
          technologyName:this.showParams.formWorks[this.selectTab].technologyName
        }
        getIgnoreInfo(obj).then((data)=>{
          this.ignoreArr = data.result;
        })

      },
      getList(){
        const url = location.search; //获取url中"?"符后的字串
        const urlId = url.split('=')[1];
        console.log('2333455',url.split('='));
        if(url.split('=')&&url.split('=')[2]=='check'){
          this.showButton = false;
          this.urlId = urlId.split('&')[0];
        }else{
          this.urlId = urlId;
        }
        getOrder({
          formBaseId:this.urlId,
          TrialSegment:'试制工艺维护'
        }).then((data)=>{
          console.log('orderData', data);
          this.order = '';
          data.result.forEach((item,index)=>{
            this.order = this.order +' '+ item.message;
          })
        })
        getTrialFormById(this.urlId).then((data)=>{
          console.log('data', data);
          data = data.result;
          this.showParams = data;
          this.showParams.selectMouldStr = data.mouldSafeguardVO.modelNumber + ' ' + data.mouldSafeguardVO.modelType + ' ' + data.mouldSafeguardVO.productionProject;
          this.$nextTick(()=>{
            this.showParams.formWorks.forEach((item)=>{
              for(let i = 0; i<item.workPlanList.length;i++){
                this.dic.check_trial_production.forEach((item2 , index)=>{
                  if(item2.value == item.workPlanList[i].status){
                    item.workPlanList[i].status = item2.text;
                  }
                })
              }
            })
            this.rightDataSource = this.showParams.formWorks[this.selectTab].workPlanList;
            this.isIgnore = (this.showParams.formWorks[this.selectTab].ignoreFullSetRate == 1);
            this.projectId = data.project.id;
            if(this.showParams.formWorks[this.selectTab]&&(this.showParams.formWorks[this.selectTab].trialProductionRecommend)&&this.showParams.formWorks[this.selectTab].trialProductionRecommend.split(',')[0] !== ''){
              this.updateParams.trialProductionRecommend = this.showParams.formWorks[this.selectTab].trialProductionRecommend.split(',');

            }else{
              this.updateParams.trialProductionRecommend = this.showParams.formWorks[this.selectTab].trialProductionRecommend = [];
            }
            this.updateParams.solution = this.showParams.formWorks[this.selectTab].solution;
            this.refresh = false;
            this.tabFresh = false;
            this.getImg(this.showParams.projectNo);
            console.log('showParams.purposes', this.showParams.purposes);
          })
        })
      },
      callback(key) {
        console.log('key', key);
        this.selectTab = key;
        this.okNum = 0;
        this.tabFresh = true;
        this.rightDataSource = [];
        this.getList();
      },
      selectChange(record, i){
        this.selectOption = record.fileName;
      },
      openCheck(operate, i){
        this.fileArr = [];
        this.selectId = operate.id;
        const nowUserId = store.getters.userInfo.id;
        if(operate.managerId != nowUserId){
          this.$message.error('该登陆人无该权限');
        }else{
          if(operate.technologyName == '产品标准' || operate.technologyName == '机加程式准备'){
            this.modalTitle = '事项类核对项确认';
            this.showRadio = true;
            let arr = [];
            arr.push({fileName: operate.technologyName,id:operate.id});
            this.modalDataSource = arr;
          }else {
            this.modalTitle = '文件类核对项确认';
            this.showRadio = false;
            let arr = [];
            arr.push({fileName: operate.fileName,id:operate.id});
            this.modalDataSource = arr;
          }
          this.confirmationDocumentVisible = true;
        }
      },
      handleOk(){
        if(this.modalTitle == '文件类核对项确认'){
          let obj = {
            id: this.selectId,
            fileName: this.selectOption
          }
          confirmWorkPlan(obj).then((data)=>{
            if(data.message == '成功') {
              this.confirmationDocumentVisible = false;
              this.$message.success('确认成功');
            } else {
              this.$message.warning('确认失败');
            }
          })
        }else {
          let obj = {
            id: this.selectId,
          }
          confirmWorkPlan(obj).then((data)=>{
            if(data.message == '成功') {
              this.confirmationDocumentVisible = false;
              this.$message.success('确认成功');
            } else {
              this.$message.warning('确认失败');
            }
          })
        }
        this.getList()
      },
      handleCancel() {
        this.fileArr = [];
        this.confirmationDocumentVisible = false;
      },
      changeVersion(){
        const  obj = {
          projectNO: this.showParams.projectNo,
          technologyName: this.showParams.formWorks[this.selectTab].technologyName
        };
        SearchPlanByPLM(obj).then((data)=>{
          console.log('data' ,data);
          this.fileArr = data.result;
        })
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name)
          }
          console.log('dic233', this.dic);
        }
      },
      modalCheck(){
        this.ifChecked = !this.ifChecked;
        console.log('this.ifChecked', this.ifChecked);
      },
      dutyHandleOk(){
        console.log('editManagerArr', this.editManagerArr);
        submitManager(this.editManagerArr).then((data)=>{
          if(data.message == '操作成功！'){
            this.managerVisible = false;
            this.editManagerArr = [];
            this.getList();
            this.$message.success('提交成功');
          } else {
            this.$message.warning('提交失败');
          }
        })
      },
      dutyHandleCancel(){
        this.managerVisible = false;
      },
      openDuty(){ //查看工艺维护负责人
        this.managerVisible = true;
        this.managerDataSource = [];
        this.managerChildrenDataSource = [];
        this.showParams.formWorks.forEach((item,index)=>{
          const obj = {
            name:item.technologyName,
            dutyName: item.managerName,
            table: 'upTable',
          }
          this.managerDataSource.push(obj);
          item.workPlanList.forEach((item2,index2)=>{
            this.managerChildrenDataSource.push({
                      childrenName:item.technologyName,
                      name:item2.technologyName,
                      dutyName: item2.managerName,
                      table: 'downTable',
           })
          })
        })
      },
      managerCheck(){
        if(this.selectTable === 'upTable'){
          const arr = [...this.managerDataSource];
          arr[this.selectTableIndex].dutyName = this.selectManagerRealName;
          this.managerDataSource = arr;
        }else{
          const arr = [...this.managerChildrenDataSource];
          arr[this.selectTableIndex].dutyName = this.selectManagerRealName;
          this.managerChildrenDataSource = arr;
        }
        this.managerShowVisible = false;
        this.selectManagerRealName = undefined;
      },
      managerCancel(){
        this.managerShowVisible = false;
      },
      getManagerList(){
        getManager(this.managerParams).then((data)=>{
          this.managerArr = data.result.records;
        })
      },
      changeManager(record, i){
        this.$refs.modal.add();
        // this.managerShowVisible = true;
        this.selectProject = record.name;
        this.selectTable = record.table;
        this.selectTableIndex = i;
      },
      checkManager(option){
        console.log('option',option);
        // this.managerArr.forEach((item,index)=>{
        //   if(item.username == option){
        this.editManagerArr.push({
          dutyId:option.id,
          dutyName:option.realname,
          projectNO: this.showParams.projectNo,
          name:this.selectProject,
          dutyLoginName:option.username
        })
        //   }
        // })
      },
      CheckBeforeTrialProduction(){
        console.log('this.isIgnore',this.isIgnore);
        const obj = {
          formBaseId: this.urlId,
          fullSetRate: this.showParams.formWorks[this.selectTab].fullSetRate,
          id: this.showParams.formWorks[this.selectTab].id,
          ignoreFullSetRate: this.isIgnore?1:0,
          // trialProductionRecommend: this.updateParams.trialProductionRecommend,
          trialProductionRecommend:  this.positionStr,
          solution:this.updateParams.solution
        }
        confirmWork(obj).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.closeCurrent();
            this.$router.push({
              path:'/trialManage/ProcessMaintenance'
            })
          } else {
            this.$message.warning(data.message);
          }

        })
      },
      handleChange(value){
        this.positionStr = value.toString();
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-table.ant-table-bordered .ant-table-title{
    display: flex;
    justify-content: center;
    background: #F5F8FA;
  }
  /deep/.ant-table-thead tr th{
    background: #F5F8FA;
  }
  .title{
    width: 100%;
    margin-bottom: 20px;
    background: #F4F5F7;
    padding: 6px 4px;
    border-radius: 5px;
    span{
      font-size: 16px;
    }
    .divide{
      padding-left: 2px;
      height:20px;
      background-color: #2E7AF1;
      margin-right: 10px;
      border-radius: 5px;
    }
  }
  .check-manager{
    width: 100%;
  }
  .make-center-left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .make-center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-frame{
    width: 100%;
    display: flex;
    .content-frame-left{
      width: 50%;
      .fundamental-information{
        width: 100%;
        display: flex;
        .fundamental-information-left{
          width: 85%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          .fundamental-information-item{
            display: flex;
            .item-text{
              width: 121px;
              height: 53px;
              background: #F5F8FA;
              border-color: #F0F2F5;
              border-width: 1px;
              border-style: solid;
              padding-left: 11px;
              span{
                font-size: 16px;
              }
            }
            .item-info-left{
              width: 200px;
              height: 53px;
              background: #fff;
              border-color: #F0F2F5;
              border-width: 1px;
              border-style: solid;
              span{
                font-size: 16px;
                color: #75A7F6;
              }
            }
            .item-info-right{
              width: 245px;
              height: 53px;
              background: #fff;
              border-color: #F0F2F5;
              border-width: 1px;
              border-style: solid;
              span{
                font-size: 16px;
                color: #75A7F6;
              }
            }
          }
        }
        .fundamental-information-right{
          width: 108px;
          height: 108px;
          border-color: #F0F2F5;
          border-width: 2px;
          border-style: solid;
        }

      }
    }
    .content-frame-right{
      width: 49%;
      margin-left: 20px;
      border: 2px #F2F2F2 solid;
      .trial-title-frame{
        width: 100%;
        height: 120px;
        background: url("./../../assets/shizhiliuzhuandanchuangjian.png") no-repeat 50% 50%;
        background-size: 100%;
        padding: 20px 50px;
        span{
          color: #fff;
          font-size: 30px;
        }
        .ignore-frame{
          width: 185px;
          height: 39px;
          background: #042A51;
          border-radius: 5px;
        }
      }
      .tab-frame{
        width: 100%;
        padding: 0 30px;
        position: relative;
        margin-top: 20px;
        .check-trail-manager{
          position: absolute;
          right: 5%;
          top:-10%;
          z-index: 200;
        }
      }

    }
  }
  .row{
    margin-bottom: 20px;
    span{
      font-size: 15px;
    }
  }
  .trial-information{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .trial-information-item{
      width: 50%;
      display: flex;
      .item-text{
        width: 121px;
        height: 53px;
        background: #F5F8FA;
        border-color: #F0F2F5;
        border-width: 1px;
        border-style: solid;
        padding-left: 11px;
        span{
          font-size: 16px;
        }
      }
      .item-info{
        flex: 1;
        height: 53px;
        background: #fff;
        border-color: #F0F2F5;
        border-width: 1px;
        border-style: solid;
        padding-left: 18px;
        span{
          font-size: 16px;
        }
      }
    }
    .trial-information-item-long{
      width: 100%;
      display: flex;
      .item-text{
        width: 121px;
        height: 53px;
        background: #F5F8FA;
        border-color: #F0F2F5;
        border-width: 1px;
        border-style: solid;
        padding-left: 11px;
        span{
          font-size: 16px;
        }
      }
      .item-info{
        flex: 1;
        height: 53px;
        background: #fff;
        border-color: #F0F2F5;
        border-width: 1px;
        border-style: solid;
        padding-left: 18px;
        span{
          font-size: 16px;
        }
      }
    }
    .table-showFrame{
      width: 100%;
      margin-top: 19px;
      margin-bottom: 11px;
    }
  }

  .left-text{
    margin-right: 10px;
  }
  .left-text1{
    margin-right: 24px;
  }
  .top-msg {
    width: 98%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .msg-item {
    font-size: 16px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .msg-title {
    font-weight: bold;
  }
  .msg-content {
    color: #878787;
  }
  .input-frame{
    margin-top: 20px;
  }
  .submit-button{
    padding:0 30px;
    width: 100%;
  }
  .duty-show-frame{
    width: 100%;
    .fundamental-information{
      width: 100%;
      .manager-table{


      }
    }
  }
  .column-green{
    color: #7DBD1A;
  }
  .column-red{
    color: #A30014;
  }
  .selectManager{
    height: 20px;
    overflow-y: auto;
  }
  .mid-table{
    width: 100%;
    .bluetable{
      /deep/.ant-table-thead tr th{
        background: #E3F1FA;
      }
    }
  }

</style>