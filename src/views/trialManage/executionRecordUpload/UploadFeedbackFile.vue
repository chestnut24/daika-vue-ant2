<template>
  <div class='page-wrap'>
<div class='upload-file-wrap'>
  <p style='margin-right: 15px'>上传附件</p>
  <a-upload
    name="file" :multiple="false" @change="handleChange"  action=""  :before-upload="beforeUpload" :fileList='fileList'>
    <a-button type="primary" ghost >点击选择文件</a-button>
  </a-upload>
</div>
    <a-button type="primary" ghost @click='uploadFile'>确认上传</a-button>
  </div>
</template>

<script>
import {uploadFeedbeckFile} from  '@/api/api';
export default {
  name: 'uploadFeedbackFile',
  props:['appTaskId'],
  data(){
    return{
      finalFile:File,
      fileList:[],
    }
  },
  methods:{
    beforeUpload(file){
      this.finalFile=file;
      return false;
    },
    uploadFile(){
      let qualityFile=this.finalFile
      console.log("异常反馈文件",qualityFile)
      const formdata = new FormData();
      formdata.append('file', qualityFile);
      formdata.append('taskId', this.appTaskId);
      formdata.append('taskType', 1);
      uploadFeedbeckFile(formdata).then((data) => {
        if (data.success) {

          console.log("上传异常反馈文件返回结果：",data);
          this.$message.success("上传成功")
          this.$emit('upload-success')
        } else {
          this.$message.destroy()
          this.$message.error(data.message)
        }


      })
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
  }
}
</script>

<style scoped>
*{
  margin: 0;
}
.upload-file-wrap{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

}
.page-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 200px;
}
/deep/ .ant-btn-primary{
  width: 150px !important;
}
</style>