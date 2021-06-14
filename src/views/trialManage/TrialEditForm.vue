<template>
  <!-- 新建编辑试制流转单 -->
  <div style="display: flex">
    <a-card :bordered="false" style="width: 900px;">
      <div class="top-title" >{{topTitle}}</div>

      <a-form layout="inline">
        <a-row type="flex" align="middle" :gutter="[30,16]">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>戴卡部件号</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-input disabled style="width: 186px" placeholder="请选择戴卡部件号" v-model="formData.projectNo"></a-input>
              <a-button style="margin-left: 12px" :disabled="editId?true:false" type="default" icon="folder-open" @click="openSelect()"></a-button>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4" class="flex-right">
            <div>模具信息</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-input style="width: 186px" placeholder="请输入模具信息" v-model="selectMouldStr"></a-input>
<!--              <a-button style="margin-left: 12px" :disabled="editId?true:false" type="default" icon="folder-open" @click="openMouldPop()"></a-button>-->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>戴卡订单号</div>
          </a-col>
          <a-col :md="16" :sm="16">
            <a-form-item>
              <a-textarea disabled style="width: 230px;height: 80px;" placeholder="请选择戴卡订单号" v-model="selectOrderStr"></a-textarea>
              <a-button style="margin-left: 12px" :disabled="(editId || !formData.projectNo)?true:false" type="default" icon="folder-open" @click="openOrderPop()"></a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="title-text" style="margin: 16px 0">
          <span>试制信息</span>
        </div>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>计划毛坯数</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-input type="number" :disabled="editId?true:false" style="width: 150px" placeholder="请输入计划毛坯数" v-model="formData.planRoughcastNum"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4" class="flex-right">
            <div>计划发样日期</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-date-picker :disabled="editId?true:false" v-model="formData.planSendSamplesDt" style="width: 150px">
              </a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>交付日期</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-date-picker :disabled="editId?true:false" v-model="formData.deliverDt" style="width: 150px">
              </a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4" class="flex-right">
            <div>共模信息</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-input :disabled="editId?true:false" placeholder="请输入共模信息" v-model="formData.sameMouldInfo" style="width: 150px">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>特殊说明</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-textarea :disabled="editId?true:false" style="width: 590px" placeholder="请输入" v-model="formData.remarks"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>轮型防措</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-textarea :disabled="editId?true:false" style="width: 590px" placeholder="请输入" v-model="formData.wheeledPokaYoke"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
            <div>计划量产地</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-select
                :disabled="editId?true:false"
                v-model="formData.planProductPlace"
                placeholder="请选择"
                style="width: 200px"
                @select="selectplanProductPlace"
              >
                <a-select-option v-for="data in option.plan_place" :key="data.value" :value="data.label">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
<!--            <div>试制用途</div>-->
          </a-col>
          <a-col :md="16" :sm="16">
            <a-form-item style="width: 100%">
<!--              <a-table-->
<!--                ref="purposesTab"-->
<!--                style="width: 590px;"-->
<!--                bordered-->
<!--                :columns="purposesTabColumns"-->
<!--                :dataSource="formData.purposes"-->
<!--                :pagination=false>-->
<!--              </a-table>-->
              <table>
                <tr style="background-color: #F5F8FA">
                  <th colspan="3">试制用途</th>
                </tr>
                <tr style="background-color: #F5F8FA">
                  <th>试制用途</th>
                  <th>试制数量</th>
                  <th>操作</th>
                </tr>
<!--                <tr v-for="data in formData.purposes">-->
<!--                  <td>{{data.purpose}}</td>-->
<!--                  <td>{{data.number}}</td>-->
<!--                  <td></td>-->
<!--                </tr>-->
                <tr v-for="(data,index)  in purposes4new" :key="data.value">
                  <td>
                    <a-select placeholder="请选择" v-model="data.value">
                      <a-select-option v-for="opt in option.noun" :value="opt.id" :key="opt.id" >
                        {{opt.label}}
                      </a-select-option>
                    </a-select>
                  </td>
                  <td>
                    <a-input :disabled="!data.value" type="number" v-model="data.inputValue" @change="inputValueChange($event, data.value)"/>
                  </td>
                  <td><a @click="deleteData(index)">删除</a></td>
                </tr>
              </table>
              <a-button type="primary" icon="plus" style="width: 100%;" @click="addRows"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 10px">
          <a-col :md="4" :sm="4" class="flex-right">
<!--            <div>工序选择</div>-->
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button :disabled="(editId || !formData.projectNo)?true:false" type="primary" @click="openFormWorksPop()" style="margin-bottom: 10px">配置工艺</a-button>
            <a-modal v-model="visible" title="工序选择" @ok="handleOk" :width="600">
              <template v-if="processList && processList.length">
                <a-transfer
                        :data-source="processList"
                        :titles="['备选工序', '已选工序']"
                        :target-keys="targetKeys"
                        :selected-keys="selectedKeys"
                        :render="renderFun"
                        :list-style="{
                  width: '250px',
                  height: '300px',
                }"
                        @change="handleChange"
                        @selectChange="handleSelectChange"
                        show-search
                        :filter-option="filterOption"
                />
              </template>
            </a-modal>
            <a-form-item>
<!--              <a-table-->
<!--                ref="formWorksTab"-->
<!--                style="width: 590px;"-->
<!--                bordered-->
<!--                :columns="formWorksTabColumns"-->
<!--                :dataSource="formData.formWorks"-->
<!--                :pagination=false>-->
<!--              </a-table>-->
              <table>
                <tr style="background-color: #F5F8FA">
                  <th colspan="3">工序选择</th>
                </tr>
                <tr style="background-color: #F5F8FA">
                  <th>工艺流程</th>
                  <th>负责人</th>
                  <th>注意事项</th>
                </tr>
               <!-- <template  v-for="data in formData.formWorks">
                  <tr v-if="targetKeys.includes(data.technologyId.toString())">
                    <td>{{data.technologyName}}</td>
                    <td>{{data.managerName}}</td>
                    <td>{{data.remarks}}</td>
                  </tr>
                </template>-->
                <tr v-for="data in formWorks4new">
                  <td>
                    {{data.technologyName}}
                  </td>
                  <td>
                    {{data.managerName}}
                  </td>
                  <td>
                    <a-input v-model="data.remarks" />
                  </td>
                </tr>
              </table>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div style="display: flex; justify-content: flex-start; margin-top: 20px;">
        <a-button :disabled="editId  ? true : false" style="margin-left: 20px;" type="primary" @click="submitForm(true)">保存为草稿</a-button>
        <a-button :disabled="editId  ? true : false" style="margin-left: 20px;" @click="submitForm(false)" :loading="isPending">提交</a-button>
      </div>
    </a-card>
    <!-- 右侧展示列 -->
    <a-card :bordered="false" style="width: 750px; margin-left: 20px;">
      <div class="title-text">
        项目信息
      </div>
      <table class="project-table" style="margin-top:16px;">
        <tr>
          <td class="td-bgc">戴卡部件号</td>
          <td>{{selectProject.projectNumber}}</td>
          <td class="td-bgc">模具信息</td>
          <td>{{selectMouldStr}}</td>
          <td rowspan="4">{{selectProject.imgUrl}}
            <img style="width: 120px" :src="srccc" alt="">
          </td>
        </tr>
        <tr>
          <td class="td-bgc">表面状态</td>
          <td>{{selectProject.surfaceState}}</td>
          <td class="td-bgc">车轮尺寸</td>
          <td>{{selectProject.wheelDiameter}} * {{selectProject.wheelWidth}}</td>
        </tr>
        <tr>
          <td class="td-bgc">试制批次</td>
          <td>{{selectProject.trialProductionBatch}}</td>
          <td class="td-bgc">首次试制时间</td>
          <td>{{selectProject.firstTrialProductionTime}}</td>
        </tr>
        <tr>
          <td class="td-bgc">项目阶段</td>
          <td colspan="3">{{selectProject.projectPhase}}</td>
        </tr>
        <tr>
          <td class="td-bgc">共模信息</td>
          <td colspan="3">{{selectProject.commonMouldInfo}}</td>
          <td class="td-bgc">外观图片</td>
        </tr>
      </table>
      <div class="title-text" style="margin-top: 16px;margin-bottom: 16px">
        订单信息
      </div>
      <table class="project-table">
        <tr>
          <th>序号</th>
          <th>戴卡订单号</th>
          <th>客户名称</th>
          <th>订单数量</th>
          <th>操作</th>
        </tr>
        <tr v-for="(data,index) in selectOrder" :key="data.dkOrdersNumber">
<!--          {{selectOrder}}-->
          <td>订单{{index+1}}</td>
<!--          <td> <span v-if="data.orderType!=1">{{data.dkOrdersNumber}}</span></td>-->
          <td>{{data.dkOrdersNumber}}</td>
          <td>{{data.customerName}}</td>
          <td>{{data.orderNumber}}</td>
          <td>
            <a v-if="data.orderType!=1" @click="isSubmit(data)" style="margin-right: 8px">详情</a>
            <a @click="deleteItem(data,index)">删除</a>
<!--            <router-link  :to="{path:'/order/orderDetail', query: { id: data.id }}" >详情</router-link>-->
          </td>
        </tr>
      </table>


    </a-card>

    <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
    <select-mould-pop ref="mould" v-on:get-text="getMould"></select-mould-pop>
    <select-order-pop ref="order" v-on:get-text="getOrder" :projectNo="formData.projectNo"></select-order-pop>
  </div>
</template>

<script>
    import {
        getOptions,
        saveFormBase,
        updateFormBase,
        getFormById,
        getProcessAndManager,
      delFormOrderByOrderNo
    } from '@/api/api';
    import SelectNumber from '../system/SelectNumber';
    import SelectMouldPop from '../system/SelectMouldPop';
    import SelectOrderPop from '../system/SelectOrderPop';
    import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
    export default {
        name: 'TrialEditForm',
        components: { SelectOrderPop, SelectNumber, SelectMouldPop}, //引入组件
        inject:['closeCurrent'],
        mixins: [GetImgByProjectNumMixin],
        data() {
            return {
                hasNoSaveData: 0,
                topTitle: '订单', // 顶部title
                editId: 0, // 获取到的id
                formId: 0,
                purposes4new: [],
                formWorks4new: [],
                formData: {// 表单数据
                    projectNo: '',
                    sameMouldInfo: '',//共模信息
                    ordersNo: [],
                    purposes: [],
                    formWorks: [],
                    mouldInfoId: -1, //模具信息
                },
                selectProject:{}, //选择的项目信息
                selectMouldStr:'', // 选择的模具信息，例如：M01  M1模具  CM
                selectOrderStr:'', //展示订单号
                selectOrder:[], //展示订单信息
                option: { // 下拉选项
                    plan_place: [], // 计划量产地
                    noun: [] // 试制用途
                },
                //工序表格
                formWorksTabColumns: [
                    { title: '工艺流程', dataIndex: 'technologyName', width: 150, align: 'center' },
                    { title: '负责人', dataIndex: 'managerName', width: 150, align: 'center' },
                    { title: '注意事项', dataIndex: 'remarks', width: 150, align: 'center' },
                ],
                //用途表格
                purposesTabColumns: [
                    { title: '用途', dataIndex: 'purpose', width: 150, align: 'center' },
                    { title: '数量', dataIndex: 'number', width: 150, align: 'center' },
                ],
                visible: false, // 弹窗
                processList: [], // 备选的工序列表
                targetKeys: [],
                selectedKeys: [],
                isPending: false,
                srccc: null
            }
        },
        mounted() {
            this.getAppointOption(); // 获取下拉框
            // this.editId = Number(this.$route.query.id) || 0;
            this.formId = Number(this.$route.query.id) || 0;
            if (this.formId) {
                this.topTitle = '试制流转单维护';
                this.$nextTick(() => {
                    this.recoverForm();
                });
            } else {
                this.topTitle = '试制流转单创建';
            };
            this.initProcessAndManager();
        },
        watch: {
            formData: {
                handler () {
                    this.hasNoSaveData++;
                },
                deep: true
            }
        },
        methods: {
            //提交
            submitForm(isDraft) {
              this.isPending = true;
                this.formData.purposes = [ ...this.option.noun.filter(item => this.purposes4new.map(a => a.value).includes(item.id)).map(item => {
                    return {
                        purposeId: item.id,
                        purpose: item.label,
                        number: item.value
                    }
                })]
                this.formData.formWorks = [...this.formWorks4new];
                this.formData.formWorks.forEach((item, index) => item.sort = index);
                this.formWorks4new = [];
                if (this.formData.ordersNo) {
                  this.formData.ordersNo = this.formData.ordersNo.map(item => {
                    if ((typeof item) !== 'string') {
                      return item.dkOrdersNumber;
                    }
                    return item;
                  })
                }
                console.log('this.formData', this.formData.ordersNo)
                let param = JSON.parse(JSON.stringify(this.formData));
                this.formData.purposes = [];
                if (this.formId) {
                    param.id = this.formId;
                }
                if (isDraft) {
                    // 草稿
                    saveFormBase(param).then((data) => {
                        if (data.success) {
                            this.$message.success(data.message);
                            this.closeCurrent();
                            this.$router.push({
                                path: `/trial/trialList`,
                            });
                        } else {
                            this.$message.error(data.message);
                        }
                        this.isPending = false;
                        // this.purposes4new = [];
                    });
                } else {
                    // 提交
                    updateFormBase(param).then((data) => {
                        if (data.success) {
                            this.$message.success(data.message);
                            this.closeCurrent();
                            this.$router.push({
                                path: `/trial/trialList`,
                            });
                        } else {
                            this.$message.error(data.message);
                        }
                      this.isPending = false;
                      // this.purposes4new = [];
                    });
                }

            },
            isSubmit(data) {
                if (this.hasNoSaveData > 1) {
                    this.$confirm({
                        title: '确定要跳转吗',
                        content: '当前页面还有未提交的数据，确定要跳转吗？',
                        onOk:()=> {
                            this.routerJump(data);
                        },
                    });
                } else {
                    this.routerJump(data);
                }
            },
            //编辑时回填页面
            recoverForm() {
                getFormById({ id: this.formId }).then((data) => {
                    if (data.result) {
                        data = data.result;
                        this.formData = data;
                        this.purposes4new = this.formData.purposes.map(item => {
                          return {
                            value: item.purposeId,
                            inputValue: item.number
                          }
                        });
                        console.log('this.purposes4new',this.purposes4new)
                        if (this.formData.projectNo) this.getImg(this.formData.projectNo);
                        this.targetKeys = this.formData.formWorks.map(item => item.technologyId.toString());
                        this.formWorks4new = JSON.parse(JSON.stringify(this.formData.formWorks));
                        console.log('this.targetKeys',this.targetKeys)
                        // 回写一些数据变量
                        if (data.mouldSafeguardVO) {
                            this.selectMouldStr = (data.mouldSafeguardVO.modelNumber ?data.mouldSafeguardVO.modelNumber:'')
                                    + ' '
                                    + (data.mouldSafeguardVO.modelType?data.mouldSafeguardVO.modelType:'')
                                    + ' '
                                    + (data.mouldSafeguardVO.productionProject?data.mouldSafeguardVO.productionProject:'');
                            if (!data.mouldSafeguardVO.modelNumber && !data.mouldSafeguardVO.modelType && !data.mouldSafeguardVO.productionProject) {
                              this.selectMouldStr = '请选择模具信息';
                            }
                        }
                        this.selectProject = data.project;
                        if (data.ordersList && data.ordersList.length > 0) {
                            const array = data.ordersList;
                            array.forEach((item, index) => {
                                this.selectOrderStr = this.selectOrderStr + item.dkOrdersNumber + '\n';
                                this.selectOrder.push(item);
                            });
                            this.formData.ordersNo = JSON.parse(JSON.stringify(this.selectOrder)) || [];
                        }
                        this.initProcessAndManager();
                    }
                });
            },

            // 试制地下拉框选择事件
            selectplanProductPlace(value, option) {
                this.formData.planProductPlaceId = option.data.key;
            },

            openSelect() {
                this.$refs.modal.add();
            },

            openMouldPop() {
                this.$refs.mould.add();
            },

            openOrderPop() {
                this.$refs.order.add();
            },

            openFormWorksPop() {
                this.visible = true;
            },

            getProjectNumber(event) { // 父组件监听子组件值
                this.formData.projectNo = event.projectNumber;
                this.formData.sameMouldInfo = event.commonMouldInfo;
                this.selectProject = event;
                this.formData.formWorks = [];
                this.initProcessAndManager();
                this.getImg(event.projectNumber);
                this.selectMouldStr = (event.modelNumber ?event.modelNumber:'')
                        + ' '
                        + (event.productionType?event.productionType:'')
                        + ' '
                        + (event.productionProject?event.productionProject:'');
            },

            getMould(event) { // 父组件监听子组件值
                // this.formData.mouldInfoId = event.id;
                this.selectMouldStr = (event.modelNumber ?event.modelNumber:'')
                + ' '
                + (event.modelType?event.modelType:'')
                + ' '
                + (event.productionProject?event.productionProject:'');
                if (!event.modelNumber && !event.modelType && !event.productionProject) {
                  this.selectMouldStr = '请选择模具信息';
                }
            },

            getOrder(eventArr) { // 父组件监听子组件值
                console.log('eventArr', eventArr)
                eventArr.forEach(event => {
                    if (event.dkOrdersNumber) {
                      if (this.formData.ordersNo) this.formData.ordersNo.push(event.dkOrdersNumber);
                        this.selectOrderStr = this.selectOrderStr + event.dkOrdersNumber + '\n';
                        this.selectOrder.push(event);
                    } else if (event.customerName) {
                      if (this.formData.ordersNo) this.formData.ordersNo.push(event.customerName);
                        this.selectOrderStr = this.selectOrderStr + event.customerName + '\n';
                        this.selectOrder.push(event);
                    }

                })
            },

            getAppointOption() { // 获取指定的下拉框
                for (let name in this.option) {
                    getOptions(name, '').then((data) => {
                        this.option[name] = data;
                        if (name === 'noun') this.option.noun.forEach(item => item.value = 0);
                    });
                }
            },
            addRows() {
              this.purposes4new.push({value: null, inputValue: null});
            },
            handleChange(nextTargetKeys, direction, moveKeys) {
                this.targetKeys = nextTargetKeys;

                console.log('targetKeys: ', nextTargetKeys);
                console.log('direction: ', direction);
                console.log('moveKeys: ', moveKeys);
            },
            handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
                this.selectedKeys = [...targetSelectedKeys, ...sourceSelectedKeys];

                console.log('sourceSelectedKeys: ', sourceSelectedKeys, '-------', this.selectedKeys);
                console.log('targetSelectedKeys: ', targetSelectedKeys);
            },
            initProcessAndManager(){
                if (this.formData.projectNo) {
                  getProcessAndManager({projectNo: this.formData.projectNo}).then(res => {
                    this.processList = res.result.map(item => {
                      return {
                        key: item.id.toString(),
                        title: item.name,
                        dutyName: item.dutyName,
                        managerId: item.dutyUserId,
                      }
                    });
                    // this.targetKeys = res.result.map(item => {
                    //   return {
                    //     key: item.id.toString(),
                    //   }
                    // });
                    // console.log('this.targetKeys++',this.targetKeys)
                  })
                }

            },
            filterOption(inputValue, option) {
                return option.title.indexOf(inputValue) > -1;
            },
            handleOk() {
                this.formWorks4new = this.processList.filter(item => this.targetKeys.includes(item.key)).map(item => {
                  let remarks = null;
                  this.formData.formWorks.forEach(f => {
                     if(f.technologyId == item.key) {
                       remarks = f.remarks;
                     }
                  })

                  return {
                        technologyId: item.key,
                        technologyName: item.title,
                        managerName: item.dutyName,
                        managerId: item.managerId,
                        remarks: remarks ? remarks : ''
                    }
                });
              this.formWorks4new.sort((a,b)=> {
                return this.targetKeys.indexOf(a.technologyId.toString()) - this.targetKeys.indexOf(b.technologyId.toString())
              })

                this.visible = false;
            },
            // getPurposes4newById(id) {
            //     return id ? this.option.noun.find(item => item.id == id).value : '';
            // },
            inputValueChange(e, id) {
                console.log(e.target.value)
                this.option.noun.find(item => item.id == id).value = e.target.value;
            },
            routerJump(data) {
                this.$router.push({path:'/order/orderDetail', query: { id: data.id }})
            },
            deleteData(index) {
              this.purposes4new.splice(index,1);
            },
          deleteItem(data, index) {
              // console.log(data);
              delFormOrderByOrderNo({id: this.formId, orderNo: data.dkOrdersNumber}).then(res => {
                this.selectOrder.splice(index, 1);
                this.selectOrderStr = this.selectOrder.map(item => item.dkOrdersNumber).join('\n');
                this.formData.ordersList.splice(index, 1);
                this.formData.ordersNo.splice(index, 1);
                console.log('this.formData',this.formData)
              });
          },
          renderFun(item){
            let customLabel;
              if (this.targetKeys.includes(item.key)) {

                customLabel= (
                        <div class="custom-item" style="display:flex;justify-content: space-between;">
                        <span>{item.title} </span>
                        <a-icon type="vertical-align-top" vOn:click_stop_prevent={this.iconTopClick(item)} />
                  </div>
               );
              } else {
                customLabel = (<span>{item.title} </span>)
              }

            return {
              label: customLabel, // for displayed item
              value: item.title, // for title and filter matching
            };

          },
          iconTopClick(item) {
            this.targetKeys.splice(this.targetKeys.indexOf(item.key),1);
            this.targetKeys.unshift(item.key);
            // const index = this.formWorks4new.map(item => item.technologyId).indexOf(Number(item.key));
            // const toUnShift = this.formWorks4new.splice(index, 1);
            // this.formWorks4new.unshift(toUnShift);
          }
        },
    }
</script>

<style lang="less" scoped>

  .ant-input {
    width: 200px;
  }

  .top-title {
    font-size: 20px;
    /*font-weight: bold;*/
    margin-bottom: 20px;
    background: url("./../../assets/shizhiliuzhuandanchuangjian.png") no-repeat 50% 50%;
    height: 80px;
    line-height: 80px;
    color: white;
    padding-left: 30px;
  }

  .part-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #f2f2f2;
    padding-left: 10px;
    margin: 20px 0;
  }

  .flex-left {
    display: flex;
    justify-content: start;
  }

  .flex-right {
    display: flex;
    justify-content: flex-end;
  }

  /*.flex-right {*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*}*/

  .bottom-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }

  /*弹窗*/
  /deep/ .ant-modal-title {
    font-weight: bold;
  }

  .search-frame {
    margin-bottom: 20px;
  }

  .left-text {
    width: 120px;
  }

  .search-table {
    min-height: 300px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }

  table{
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    td,th{
      /*padding: 16px;*/
      min-width: 200px;
      text-align: center;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .title-text {
    padding: 6px;
    padding-left: 20px;
    /*border-left: 4px solid #1790FA;*/
    background-color: #F4F5F7;
    font-weight: bold;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 10px;
      height: 20px;
      width: 4px;
      background-color:  #1790FA;
      border-radius: 2px;
    }
  }
  .project-table{
      border-left: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      width: 100%;
    .td-bgc{
      background-color: #F5F8FA;
    }
      td,th{
        padding: 16px;
        min-width: 100px;
        text-align: center;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
      }
  }
  /deep/ .ant-transfer-list-content-item{
    display: flex;
    width: 100%;
    justify-content: space-between;
    .ant-transfer-list-content-item-text{
      width: 100%;
    }
  }
</style>
