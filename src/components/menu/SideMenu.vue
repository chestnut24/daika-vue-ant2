<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="208px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  style="position: relative">
    <logo />
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      @select="onSelect"
      :mode="mode"
      :style="smenuStyle">
    </s-menu>
   <!-- <div class="menuImg">
      <img class="img1" src='@/assets/menu.png'>
      <img class="img2" src='@/assets/dk_logo_login.png'>
    </div>-->
  </a-layout-sider>

</template>

<script>
  import ALayoutSider from "ant-design-vue/es/layout/Sider"
  import Logo from '../tools/Logo'
  import SMenu from './index'
  import { mixin, mixinDevice } from '@/utils/mixin.js'

  export default {
    name: "SideMenu",
    components: { ALayoutSider, Logo, SMenu },
    mixins: [mixin, mixinDevice],
    props: {
      mode: {
        type: String,
        required: false,
        default: 'inline'
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsible: {
        type: Boolean,
        required: false,
        default: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      menus: {
        type: Array,
        required: true
      }
    },
    computed:{
      smenuStyle() {
        let style = { 'padding': '0' }
        if (this.fixSiderbar) {
          style['height'] = 'calc(100% - 59px)'
          style['overflow'] = 'auto'
          style['overflow-x'] = 'hidden'
        }
        return style
      }
    },
    methods: {
      onSelect (obj) {
        this.$emit('menuSelect', obj)
      }
    }
  }
</script>
<style lang="less" scoped>

  /* update_begin author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
  .sider {
    @scrollBarSize: 10px;
    background:#2c75a8 ;
    background-image:url("~@/assets/menu.png"),url("~@/assets/logoWhite_with_wordBlack.png");
    background-repeat: no-repeat,no-repeat;
    background-size:100%,90%;
    background-position: 50% 92%,50% 99%;
    ul.ant-menu {

      /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
        display: none;
      }

      & .-o-scrollbar {
        display: none;
      }

      /* 兼容IE */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);

      /* 定义滚动条轨道 */
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* 定义滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: @scrollBarSize;
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: #dddddd;
        }

        &:active {
          background-color: #bbbbbb;
        }
      }
    }

    /** 暗色系滚动条样式 */
    &.dark ul.ant-menu {
      &::-webkit-scrollbar-thumb {
        background-color: #666666;

        &:hover {
          background-color: #808080;
        }

        &:active {
          background-color: #999999;
        }
      }
    }

  }

  /* update_end author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
</style>

<!-- update_begin author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
<style lang="less">
 .ant-menu-dark .ant-menu-inline.ant-menu-sub{
    background: #0e2b49 !important;
  }

 .ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected{
   background: #fff !important;
   border-top-left-radius: 8px;
   border-bottom-left-radius: 8px;
   margin-left: 10px !important;
   overflow: hidden;
   width: 95% !important;
 }
 .ant-menu.ant-menu-dark .ant-menu-item-selected:before {
   content: "";
   width: 5px;
   height: 25px;
   background: #13c5e8;
   position: absolute;
   top: 8px;
   left: 0;
   border-top-right-radius: 4px;
   border-bottom-right-radius: 4px;
 }
 .ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected{
   background: #fff !important;
 }
 .ant-menu-dark .ant-menu-item-selected .anticon + span ,.ant-menu-dark .ant-menu-item-selected > a, .ant-menu-dark .ant-menu-item-selected > a:hover,
 .ant-menu-dark .ant-menu-item-selected .anticon{
   color: #000 !important;
 }

  .ant-menu.ant-menu-root {
    background-image: linear-gradient(#091d38, #2c75a8);
    & > .ant-menu-item-selected{
      background: #fff;
    }
    & > .ant-menu-item:first-child {
      /*background-color: transparent;*/

      & > a, & > a:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: #000;
        }
      }
    }

    &.ant-menu-dark > .ant-menu-item:first-child {
      & > a, & > a:hover {
        color: #fff;
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: #000;
        }
      }
    }
  }
  .menuImg{
    position: absolute;bottom: 10px;left: 0;
    height: 280px;
    background: #217aad;
  }
  .img1{
    max-width: 208px;min-width: 208px;width: 208px;margin-left:-5%;;
  }
  .img2{
    max-width:180px;min-width: 160px;width: 180px;margin-left:3%;margin-top:15%;
  }
</style>
<!-- update_end author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
