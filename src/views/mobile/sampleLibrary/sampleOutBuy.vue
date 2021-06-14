<template>
    <div class="all-frame">
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">戴卡部件号：</span>
        <div style="margin-right: 2px" @click="goSelectProjectNo">
          <span v-if="projectNumber === ''" style="color: rgba(0,0,0,0.45)">请选择</span>
          <span v-else style="color: rgba(0,0,0,0.45)">{{projectNumber}}</span>
          <a-icon type="right" style="color: rgba(0,0,0,0.45)"/>
        </div>
      </div>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">用途：</span>
        <a-dropdown>
          <div style="margin-right: 2px">
            <span v-if="purpose === ''" style="color: rgba(0,0,0,0.45)">请选择</span>
            <span v-else style="color: rgba(0,0,0,0.45)">{{purpose}}</span>
            <a-icon type="right" style="color: rgba(0,0,0,0.45)"/>
          </div>
          <a-menu slot="overlay" @click="purposeClick">
            <a-menu-item v-for="data in dic.purpose" :key="data.value">
              <span>{{data.label}}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">项目经理：</span>
        <div>
          <a-input style="width: 68px" placeholder="请输入" v-model="projectManager"></a-input>
        </div>
      </div>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">库位：</span>
        <a-dropdown>
          <div style="margin-right: 2px">
            <span v-if="inventoryLocation === ''" style="color: rgba(0,0,0,0.45)">请选择</span>
            <span v-else style="color: rgba(0,0,0,0.45)">{{inventoryLocation}}</span>
            <a-icon type="right" style="color: rgba(0,0,0,0.45)"/>
          </div>
          <a-menu slot="overlay" @click="inventoryLocationClick">
            <a-menu-item v-for="data in dic.inventoryLocation" :key="data.label">
              <span>{{data.label}}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">样件位置：</span>
        <div>
          <a-input style="width: 68px" placeholder="请输入" v-model="samplePosition"></a-input>
        </div>
      </div>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">入库数量：</span>
        <div>
          <a-input style="width: 68px" placeholder="请输入" v-model="inBordNumber"></a-input>
        </div>
      </div>
      <div class="remark-frame">
        <span style="color: rgba(0,0,0,0.45)">备注：</span>
        <div>
          <a-textarea
            placeholder="请输入备注"
            v-model="remark"
            :auto-size="{ minRows: 4}"
            style="margin-top: 5px;background: #F5F8FA !important;"
          />
        </div>
      </div>
      <div class="button-frame">
        <a-button type="primary" style="width: 100%" @click="submitOutBuy">提交</a-button>
      </div>
    </div>
</template>

<script>
  import {getMouldOptions,submitBuy} from '@api/api';
  export default {
    name: 'sampleOutBuy',
    mounted() {
      this.getDic();
      if(this.$route.query.projectNumber){
        this.projectNumber = this.$route.query.projectNumber;
      }
    },
    data(){
      return{
        dic: {
          purpose: [],
          inventoryLocation:[],
          factoryWareHouse:[],
        },
        remark:'',//选择的备注
        purpose:'',//选择的用途
        purposeValue:0,//选择用途的value
        inventoryLocation:'',//选择的库位
        projectNumber:'',//戴卡部件号
        samplePosition:'',//样件位置
        inBordNumber:'',//入库数量
        projectManager:'',//项目经理
      }
    },
    methods:{
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },
      purposeClick({ key }){//选择用途
        this.purposeValue = key;
        this.dic.purpose.forEach((item)=>{
          if(item.value === key){
            this.purpose = item.label;
          }
        })

      },
      inventoryLocationClick({ key }){//选择用途
        this.inventoryLocation = key;
      },
      goSelectProjectNo(){//选择戴卡部件号
        this.$router.replace({
          path:'/app/sampleSelectProjectNo',
        });
      },
      submitOutBuy(){
        const obj = {
          projectNo:this.projectNumber,
          purpose:this.purposeValue,
          projectManager:this.projectManager,
          inventoryLocation:this.inventoryLocation,
          exemplarLocation:this.samplePosition,
          intoWarehouse:this.inBordNumber,
          remark:this.remark,
        };
        submitBuy(obj).then((data)=>{
          console.log('data',data);
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleInbord',
            });
          }else{
            this.$message.warning(data.message);



          }
        })

      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    border-width: 0px;
    height: 20px;
  }
  .all-frame{
    width: 100%;
    background: #fff;
    border-radius: 10px 10px 0 0;
    padding: 16px 0;
    .input-select{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 22px;
      border-width: 1px 0 1px 0;
      border-color: #F6F6F7;
      border-style: solid;
    }
    .remark-frame{
      width: 100%;
      padding: 15px 14px;
      border-width: 1px 0 1px 0;
      border-color: #F6F6F7;
      border-style: solid;
    }
    .button-frame{
      width: 100%;
      padding: 15px 24px;
    }
  }

</style>