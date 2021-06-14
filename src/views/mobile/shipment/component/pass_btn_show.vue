<template>
  <div>
    <div class="dis_f" :style="'width: '+getWidth()+'px;'">
      <!-- <a-icon type="check" :class="showData?'op1':'op0'"/> -->
      <div class="round_btn">
        <div class="round_btn_nei" :class="showData?'op1':'op0'"></div>
      </div>
      <div :style="'margin-right: '+(Number(both_margin) || 10)+'px;'">合格</div>
      <!-- <a-icon type="check" :class="getF0(showData)?'op1':'op0'"/> -->
      <div class="round_btn">
        <div class="round_btn_nei" :class="getF0(showData)?'op1':'op0'"></div>
      </div>
      <div>不合格</div>
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
  props: ['showData', 'both_margin'],
  methods: {
    getF0(data) {
      if (data === false) {
        return true
      } else {
        return false
      }
    },
    getWidth(){
      return Number(this.both_margin) + 130
    }
  }
}
</script>

<style scoped>
.dis_f {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width: 130px; */
  margin: 0 auto;
}
.round_btn {
  width: 18px;
  height: 18px;
  background: #e9f0fd;
  border: 1px solid #317ff2;
  border-radius: 50%;
  position: relative;
}
.round_btn_nei {
  width: 10px;
  height: 10px;
  background: #317ff2;
  border-radius: 50%;
  position: absolute;
  left: 3px;
  top: 3px;
}

.op1 {
  background: #317ff2;
}
.op0 {
  background: #e9f0fd;
}
</style>