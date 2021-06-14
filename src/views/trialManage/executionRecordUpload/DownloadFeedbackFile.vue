<template>
  <div class='download-file-wrap'>
  <a-button type="primary" ghost @click='downloadFile'>下载文件</a-button>
  </div>
</template>

<script>
import {downloadFeedbeckFile} from '@/api/api'
export default {
  name: 'DownloadFeedbackFile',
  props:['fileUrl'],
  methods:{
    downloadFile(){


      this.$message.warning('此处在部署到服务器前会报错',);
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = `${this.fileUrl}`;
        link.target="_blank";
        link.setAttribute('download', 'fileName')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) //下载完成移除元素


    },
  }
}
</script>

<style scoped>
.download-file-wrap{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>