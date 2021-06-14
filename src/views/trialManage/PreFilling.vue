<template>
  <div style="overflow-x: auto">
    <div v-if="dataResource" class="pf-container jn-public-table" style="min-width: 1600px">
      <table>
        <tr>
          <th>试制单编号</th>
          <th>戴卡部件号</th>
          <th>试制单创建日期</th>
          <th>项目经理</th>
          <th>计划发样时间</th>
          <th>计划毛坯数</th>
          <th>交付日期</th>
          <th style="width: 432px">试制用途</th>
          <th>计划量产地</th>
        </tr>
        <tr>
          <td>{{dataResource.trialProductionFormNo}}</td>
          <td>{{dataResource.projectNo}}</td>
          <td>{{dataResource.createTime}}</td>
          <td>{{dataResource.project.projectManager}}</td>
          <td>{{dataResource.planSendSamplesDt}}</td>
          <td>{{dataResource.planRoughcastNum}}</td>
          <td>{{dataResource.deliverDt}}</td>
          <td style="overflow-x: auto;max-width: 400px;width: 400px" >
            <table class="inner-table" :style="{width: (dataResource.purposes.length + 1)*100 + 'px'}">
              <tr>
                <td>试制用途</td>
                <td v-for="purpose in dataResource.purposes">{{purpose.purpose}}</td>
              </tr>
              <tr>
                <td>数量</td>
                <td v-for="purpose in dataResource.purposes">{{purpose.number}}</td>
              </tr>
            </table>
          </td>
          <td>{{dataResource.planProductPlace}}</td>
        </tr>
      </table>
      <table style="margin-top: 20px;">
        <tr>
          <th>工序</th>
          <th>试制地</th>
          <th>选择试制完成日期</th>
          <th>当前序号</th>
        </tr>
        <tr v-for="craft in dataResource.formWorks">
          <td>{{craft.technologyName}}</td>
          <td>
            <a-select style="width: 244px"  placeholder="请选择"
                      v-model="craft.prearrangement.trialProductionSite"
                      @change="trialProductionSiteChange($event, craft)">
              <a-select-option :value="opt.label" v-for="opt in option.trial_production_site" :key="opt.id">
                {{opt.label}}
              </a-select-option>
            </a-select>
            &nbsp;
            <span style="width: 150px" :style="{color: getItemCurrentLoadRate(craft).currentLoadRate >= getItemCurrentLoadRate(craft).alarmLoadRate ? 'red':'green'}">
              （负荷率： {{getItemCurrentLoadRate(craft).currentLoadRate}}）
          </span>
            &nbsp;
            <a @click="goPaiChan"> 排产计划表 </a>
          </td>
          <td>
            <a-date-picker style="width: 244px" :disabled="isSee" v-model="craft.prearrangement.completionDate" />
          </td>
          <td>
            <a-input placeholder="请输入" :disabled="isSee" style="width: 244px" v-model="craft.prearrangement.currentNo"/>
          </td>
        </tr>
      </table>
      <div v-if="massageArr && massageArr.length">
        <div style="margin-top: 20px;display: flex;justify-content: space-between">
          <span style="font-size: 24px;font-weight: bold;color: red">过程指令</span>
          <!--        <span>-->
          <!--          <a-checkbox @change="onChange">-->
          <!--            过程指令接收-->
          <!--          </a-checkbox>-->
          <!--        </span>-->
        </div>
        <div style="border: 1px solid #e8e8e8;color: red">
          <div v-for="data in massageArr" style="padding: 8px;">{{data.message}}</div>
        </div>
      </div>
      <div style="text-align: right;margin-top: 10px;">
        <a-button type="primary" @click="save" :disabled="isSee" :loading="isPending">保存</a-button>
      </div>
    </div>
  </div>

</template>

<script>
    import {getFormPrearrangementByFormId, getOptions, saveOrUpdatePrearrangement, getPrearrangementSiteLoadRate, getProcessInstruction, processInstructionHandle} from '@/api/api';
    export default {
        name: 'PreFilling',
        inject:['closeCurrent'],
        data() {
            return {
                dataResource: null,
                option: { // 下拉选项
                    trial_production_site: [], // 试制地
                },
                selectArr: [],
                isSee: false,
                massageArr: [],
                isPending: false,
            }
        },
        mounted() {
            this.isSee = this.$route.query.isSee === 'true';
            console.log(this.$route, typeof this.$route.query.isSee, 'this.isSee', this.isSee)
            this.getAppointOption();
            getFormPrearrangementByFormId({formId: this.$route.query.id}).then(res => {
              this.dataResource = res.result;
              this.dataResource.formWorks.forEach(item => {
                if (!item.prearrangement.trialProductionSite) {
                  item.prearrangement.trialProductionSite = undefined;
                }
              });
            })
            getPrearrangementSiteLoadRate().then(res => {
                this.selectArr = res.result;
            })
            getProcessInstruction({formBaseId: this.$route.query.id, aopTrialSegment:'试制预排'}).then(res => {
                this.massageArr = (res.result && res.result.length) ? res.result : [];
                console.log('res', res)
            })
        },
        methods: {
            getAppointOption() { // 获取指定的下拉框
                for (let name in this.option) {
                    getOptions(name, '').then((data) => {
                        this.option[name] = data;
                    });
                }
            },
            save() {
                this.isPending = true;
                saveOrUpdatePrearrangement(
                    this.dataResource.formWorks.map(craft => {
                        return {
                            formBaseId: this.$route.query.id,
                            id: craft.prearrangement.id,
                            completionDate: new Date(craft.prearrangement.completionDate).getTime(),
                            currentNo: craft.prearrangement.currentNo,
                            loadRate: this.getItemCurrentLoadRate(craft).currentLoadRate,
                            processTechnologyName: craft.technologyName,
                            trialProductionSite: craft.prearrangement.trialProductionSite
                        }
                    })
                ).then(res => {
                    if (res.success) {
                        this.$message.success('保存成功');
                        this.isPending = false;
                        this.closeCurrent();
                      this.$router.push({path:'/trial/planningScheduling'})
                    } else {
                      this.isPending = false;
                        this.$message.error(`保存失败 ${res.message}`);
                    }
                }, error => {
                  this.isPending = false;
                    this.$message.error('保存失败');
                });
            },
            trialProductionSiteChange(e, craft) {
                // this.$set(craft, 'currentLoadRate', this.selectArr.find(item => item.processTechnology === craft.technologyName && item.productPlace === craft.prearrangement.trialProductionSite).currentLoadRate)
                // craft.currentLoadRate = this.selectArr.find(item => item.processTechnology === craft.technologyName && item.productPlace === craft.prearrangement.trialProductionSite).currentLoadRate;
                console.log(' craft ',craft)
            },
            getItemCurrentLoadRate(craft) {
                const a = this.selectArr.find(item => item.processTechnology === craft.technologyName && item.productPlace === craft.prearrangement.trialProductionSite);
                if (a) return {alarmLoadRate: a.alarmLoadRate, currentLoadRate: a.currentLoadRate};
                return {alarmLoadRate: null, currentLoadRate: null};
            },
            // onChange(e) {
            //     processInstructionHandle(this.massageArr.map(item => {
            //       return {
            //           id: item.id,
            //           status: e.target.checked ? 1 : 0
            //       }
            //     })).then();
            //     console.log(e.target.checked)
            //
            // }

            goPaiChan() {
              this.$router.push({path:'/trialManage/productionScheduling/ProductionSchedulingList'})
            }

        }
    }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .pf-container{
    padding: 16px;
    background-color: #fff;
    table{
      border-left: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      width: 100%;
      td,th{
        padding: 16px;
        /*min-width: 200px;*/
        text-align: center;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
      }
      th{
        font-size: 16px;
        color: rgba(0,0,0,.65) !important;
        padding: 12px 16px !important;
        background-color: #F4F5F7;
        text-align: left;
      }
      td {
        font-size: 16px;
        color: rgba(0, 0, 0, .85) !important;
        padding: 8px 16px !important;
        text-align: left;
      }
      tr:nth-child(odd){
        background-color: #F3F7F9
      }
      .inner-table{
        border-left: 1px solid #e8e8e8;
        border-top: 1px solid #e8e8e8;
        width: 400px;
        td,th{
          padding: 4px 16px !important;
          text-align: center;
          border-right: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          max-width: 100px;
          min-width: 100px;
          /*width: 100px!important;*/
        }
        tr:nth-child(even){
          background-color: #fff;
        }
        tr:nth-child(odd){
          background-color: #F3F7F9
        }
      }
    }
  }
</style>
