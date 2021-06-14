// 根据 戴卡部件号 projectNumber 获取 img

import { getImgStrByProjectNumber } from '@/api/api'

export const GetImgByProjectNumMixin = {
  methods: {
    getImg(projectNumber) {

      getImgStrByProjectNumber({projectNumber: projectNumber}).then( imgData => {
        if (imgData.success) {
          console.log('pic', imgData.result);

          // let testHex = [data.imgUrl].join('');
          let testHex = [imgData.result.pic].join('');
          function blobToDataURI(blob, callback) {
            let reader = new FileReader();
            reader.onload = function (e) {
              callback(e.target.result);
            }
            reader.readAsDataURL(blob);
          }
          function toPngBlob(str){
            let hexStr = str.slice(2);
            // console.log('hexStr', hexStr);
            let buf = new ArrayBuffer(hexStr.length/2);
            let byteBuf = new Uint8Array(buf);
            for (let i=0; i<hexStr.length; i+=2) {
              byteBuf[i/2] = parseInt(hexStr.slice(i,i+2),16);
            }
            let blob = new Blob([byteBuf], {type: "image/jpg"});
            return blob;
          };
          blobToDataURI(toPngBlob(testHex),  (data) => {
            this.srccc = data;
          });

        } else {
          this.$message.destroy();
          this.$message.error(imgData.message);
        }
      } )
    }
  }
}
