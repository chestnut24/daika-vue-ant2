<template>
  <div>
    <template v-for="(item, value, index) in tableColumn">
      <div
        :class="value!=='注意事项'&&value!=='中断说明'&&value!=='重启说明'?'form-item':'vertical-form-item'"
        v-if="value !== '是否与热处理工序联机'"
      >
        <p class='grey-text'>{{ value }}</p>
        <p v-if="value!=='上传图片'"  class='black-text'>{{ data && data[item] }}</p>
        <slot name='img-box' v-else></slot>
      </div>
      <div
        :class="value!=='注意事项'&&value!=='中断说明'&&value!=='重启说明'?'form-item':'vertical-form-item'"
        v-else-if="value === '是否与热处理工序联机' && data.processFlowName === '压铸'"
      >
        <p class='grey-text'>{{ value }}</p>
        <p v-if="value!=='上传图片'"  class='black-text'>{{ data && data[item] }}</p>
        <slot name='img-box' v-else></slot>
      </div>
    </template>
  </div>

</template>

<script>
  export default {
    name: 'HistoryTable',
    props: ['tableColumn', 'data'],
    data(){
      return{
        boolShift:{
          '是':true,
          '否':false
        },

      }
    },
    mounted() {
      // console.log("data",this.data)
      // console.log(this.boolShift[this.data['isAccordProductionTime']])
    }
  };
</script>

<style scoped lang="less">
*{
  margin: 0;
  padding: 0;
}
.form-item{
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 50px;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 2px solid #f6f6f7;
  color: #a2a2a2;
  overflow-x: auto;
}
.vertical-form-item{
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 2px solid #f6f6f7;
  color: #a2a2a2;
  overflow-x: auto;
}
.form-item .black-text,.vertical-form-item .black-text{
  color: #262626;
  font-size: 16px;
}
.form-item /deep/.ant-switch{
  min-width: 30px;
}
.form-item span{
  color: #333333;
}
 .grey-text{
   color: #5c6374;
   flex-shrink: 0;
 }
</style>