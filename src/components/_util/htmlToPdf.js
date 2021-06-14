
// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { axios } from '@/utils/request'
import { fileToObject } from 'ant-design-vue/lib/upload/utils'
import base64Pdf from './base64Pdf'
export default{
  install(Vue, options) {
    Vue.prototype.getPdf = function (type,id,ele) {
      var title = this.title
      let that = this
      that.$message.success('正在上传pdf')
      let eleW = ele.$el.offsetWidth// 获得该容器的宽
      let eleH = ele.$el.scrollHeight// 获得该容器的高
      let eleOffsetTop = ele.$el.offsetTop// 获得该容器到文档顶部的距离
      let eleOffsetLeft = ele.$el.offsetLeft// 获得该容器到文档最左的距离
      var canvas = document.createElement("canvas")
      var abs = 0
      let win_in = document.documentElement.clientWidth || document.body.clientWidth// 获得当前可视窗口的宽度（不包含滚动条）
      let win_out = window.innerWidth// 获得当前窗口的宽度（包含滚动条）
      if (win_out>win_in) {
        abs = (win_out - win_in) / 2// 获得滚动条宽度的一半
      }
      canvas.width = eleW * 2// 将画布宽&&高放大两倍
      canvas.height = eleH * 2
      var context = canvas.getContext("2d")
      context.scale(2, 2) // 增强图片清晰度
      context.translate(-eleOffsetLeft - abs, -eleOffsetTop)
      html2Canvas(document.querySelector('#'+id), {
        dpi:300,
        useCORS:true//允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      }).then(canvas=> {
        var contentWidth = canvas.width
        var contentHeight = canvas.height
        //一页pdf显示html页面生成的canvas高度;
        var pageHeight = (contentWidth / 592.28) * 841.89 // 这样写的目的在于保持宽高比例一致 pageHeight/canvas.width = a4纸高度/a4纸宽度// 宽度和canvas.width保持一致
        //未生成pdf的html页面高度
        var leftHeight = contentHeight
        //页面偏移
        var position = 0
        //a4纸的尺寸[595.28,841.89],单位像素，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28
        var imgHeight = (595.28 / contentWidth) * contentHeight
        var pageData = canvas.toDataURL("image/jpeg", 1.0)
        var pdf = new JsPDF("", "pt", "a4")
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight<pageHeight) {
          //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
          pdf.addImage(pageData, "JPEG", 5, 0, imgWidth, imgHeight)
          // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
        } else {
          // 分页
          while (leftHeight>0) {
            pdf.addImage(pageData, "JPEG", 5, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            //避免添加空白页
            if (leftHeight>0) {
              pdf.addPage()
            }
          }
        }
        that.pdfPage=pdf
        var datauri = that.pdfPage.output('dataurlstring');
        let file= that.base64ToFile(datauri,that.title)
        let formData = new FormData();
        formData.append('file', file);
        formData.append('taskWorkSplitId', that.record.id);
        if(type=="热处理"){
          formData.append('planType', 'heat');
        }else if(type=="压铸"){
          formData.append('planType', 'cast');
        }else if(type=="X光"){
          formData.append('planType', 'castx');
        }else if(type=="粗车"){
          formData.append('planType', 'machine');
        }else if (type=="精车"){
          formData.append('planType', 'technology');
        }
        that.$http({
          url:'/trial/taskWorkSplit/upload/pdf',
          data:formData, //在此处上传文件
          method: "post",
          headers:{
            'Content-Type':'multipart/form-data' //值得注意的是，这个地方一定要把请求头更改一下
          }
        }).then((res)=>{
          that.$message.success('上传pdf成功')
        }).catch((err) => {
          that.$message.error('上传pdf失败')
        }).finally(() => {
          that.close()
        })
        //pdf.save(title + ".pdf")

      })

    }

  }
  /* install (Vue, options) {
    Vue.prototype.getPdf = function (title,id) {
      var title = this.title
      let that = this
      that.$message.success('正在上传pdf')
      html2Canvas(document.querySelector('#'+id), {
        allowTaint: true,
      }).then(function (canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position =0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(title + '.pdf')
        /!* that.pdfPage=PDF
         var datauri = that.pdfPage.output('dataurlstring');
         let file= that.base64ToFile(datauri,that.title)
         let formData = new FormData();
          formData.append('file', file);
          formData.append('taskWorkSplitId', that.record.id);
        if(type=="热处理"){
          formData.append('planType', 'heat');
        }else if(type=="压铸"){
          formData.append('planType', 'cast');
        }else if(type=="X光"){
          formData.append('planType', 'castx');
        }else if(type=="粗车"){
          formData.append('planType', 'machine');
        }else if (type=="精车"){
          formData.append('planType', 'technology');
        }
        that.$http({
          url:'/trial/taskWorkSplit/upload/pdf',
          data:formData, //在此处上传文件
          method: "post",
          headers:{
            'Content-Type':'multipart/form-data' //值得注意的是，这个地方一定要把请求头更改一下
          }
        }).then((res)=>{
          that.$message.success('上传pdf成功')
        }).catch((err) => {
              that.$message.error('上传pdf失败')
        }).finally(() => {
          that.close()
        })*!/
        }
      )
    }
  }*/
}
