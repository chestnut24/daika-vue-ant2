<template>
  <div>
    <div class="dis_f">
      <!-- <a-icon type="check" :class="showData?'op1':'op0'"/> -->
      <a-icon type="check-circle" theme="filled" :class="showData?'op1':'op0'" style="color:#347EF2;" />
      <!-- style="margin-right: 10px;" -->
      <div style="margin-left: 10px;" :class="showData?'op1':'op0'">合格</div>
      <!-- <a-icon type="check" :class="getF0(showData)?'op1':'op0'"/> -->
      <a-icon type="close-circle" theme="filled" :class="getF0(showData)?'op1':'op0'" style="color:#F86162;" />
      <div style="margin-left: 10px;" :class="getF0(showData)?'op1':'op0'">不合格</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassBtnShow',
  data() {
    return {
      pageData: {}
    }
  },
  props: ['showData'],
  methods: {
    getF0(data){
      if (data === false){
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
.dis_f {
  display: flex;
  /* justify-content: space-between; */
  justify-content: center;
  align-items: center;
  width: 130px;
  margin: 0 auto;
  text-align: center;
}
.op1{
  opacity: 1;
  display: block;
}
.op0{
  opacity: 0;
  display: none;
}
</style>