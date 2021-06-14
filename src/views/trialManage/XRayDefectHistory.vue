<template>
    <div class="history-container">
        <a-button @click="go()">返回首页</a-button>
        <div class="history-item" v-for="data in pageDataArr" :key="data.appXMachiningDefectHistoryId" >
            <div>
                <img v-if="data.imgUrl" :src="data.imgUrl" style="width: 100px;height: 100px;">
                <img v-else src="../../assets/wheel.png" height="100" width="100"/>
            </div>
            <div style="height: 40px;width:100px;background-color: #293C57;color:#fff;opacity: .7;position: absolute;top:40px;left: 10px;line-height: 40px;text-align: center">
                {{data.wheelModel}}
            </div>
            <div style="width: 100%;padding:16px 16px 0 16px">
                <table style="width: 100%">
                    <tr>
                        <td style="width:300px">结果</td>
                        <td>操作手</td>
                        <td>时间</td>
                    </tr>
                    <tr style="font-size: 22px;">
                        <td>{{data.machiningType | machiningType}} {{data.machiningType == 2 ? data.defectCode : ''}}</td>
                        <td>{{data.operatorName}}</td>
                        <td>{{data.operatorTime}}</td>
                    </tr>
                </table>
                <div style="height: 1px;width: 100%;background-color: #D4D8DF;margin: 10px 0;"></div>
            </div>
            <div style="display: flex;align-items: center">
                <a-button type="danger" size="large" @click="revoke(data)">撤销</a-button>
            </div>
        </div>

    </div>
</template>

<script>
    import {machiningDefectHistoryRevoke, selectAllXMachiningDefectHistory} from '@/api/api'
    export default {
        name: 'XRayDefectHistory',
        data() {
            return {
                pageParams: {
                    pageNo: 1,
                    pageSize: 9999
                },
                pageDataArr: []
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                selectAllXMachiningDefectHistory(this.pageParams).then(res => {
                    this.pageDataArr = res.result;
                })
            },
            go() {
                this.$router.push('/trial/xRayDefect');
            },
            revoke(data) {
                machiningDefectHistoryRevoke({appXMachiningDefectHistoryId: data.appXMachiningDefectHistoryId, xMachiningDefectId: data.appXMachiningDefectId}).then(res => {
                    this.init();
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .history-container{
        background-color: #fff;
        padding:16px;
        .history-item{
            background-color: #E9EBF2;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            position:relative;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #D4D8DF;
        }
    }
</style>
