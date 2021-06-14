<template>
<!--  展示页面上方 标题+背景  输入参数： 1. level1 一级标题  2.  level2 二级标题（可不传）-->
    <div class="title-container">
      <div class="font-container">
        <div class="level--1">{{ level1 }}</div>
        <div class="level--2" v-if="level2">{{ level2 }}</div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'TabTitle',
    props: ['level1', 'level2'],
  };
</script>

<style scoped lang="less">
  .title-container {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: url("../../assets/tab_title_bg.png") no-repeat;
    background-size: 100% 100%;
    .font-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: white;
      margin-left: 8%;
      .level--1 {
        /*font-weight: bold;*/
        font-size: 24px;
        margin: 5px 0;
        letter-spacing: 3px;
      }
      .level--2 {
        font-size: 18px;
        margin: 5px 0;
      }
    }
  }
</style>