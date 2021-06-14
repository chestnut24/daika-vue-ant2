<template>
    <div class="about-container">
      <img src="../../../assets/mobile/footer/mine/about_logo.png"/>
      <div class="name">新产品敏捷终端</div>
      <div class="version">当前版本：{{version}}</div>
    </div>
</template>

<script>
  export default {
    name: 'about',
    data() {
      return {
        version: 'V1.0.2.1'
      }
    }
  };
</script>

<style scoped lang="less">
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: url("../../../assets/mobile/footer/mine/about_bg.png") no-repeat;
    background-size: 100%;
    img {
      width: 30vw;
      margin-top: 100px;
    }

    .name {
      margin: 24px 0 5px 0;
      font-size: 18px;
      color: #ffffff;
    }

    .version {
      font-size: 12px;
      color: #a4c5d9;
    }
  }
</style>