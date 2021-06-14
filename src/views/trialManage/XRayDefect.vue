<template>
    <div style="background-color: white;padding: 10px">
        <div v-for="data in pageDataArr" :key="data.taskId" style="position:relative;display:flex;border: 1px solid #D4D8DF;padding: 10px;margin-bottom: 20px;background-color: #E9EBF2">
            <div>
                <img v-if="data.imgUrl" :src="data.imgUrl" style="width: 100px;height: 100px;">
                <img v-else src="../../assets/wheel.png" height="100" width="100"/>
            </div>
            <div style="height: 40px;width:100px;background-color: #293C57;color:#fff;opacity: .7;position: absolute;top:40px;left: 10px;line-height: 40px;text-align: center">
                {{data.daikaPartNumber}}
            </div>
            <div style="width: 100%;padding: 0 20px;">
                <div style="display: flex;justify-content: space-between">
                    <div>
                        <img src="../../assets/wheel-title-icon.png" height="30" width="30"/>
                        &nbsp;
                        <span>{{data.machineStation}}</span>
                    </div>
                    <div style="padding-top: 10px;">
                        <span style="padding-right: 20px;">合格：{{data.qualifiedNumber || 0}}</span>
                        <span style="padding-right: 20px;">不合格：{{data.unqualifiedNumber || 0}}</span>
                        <span>调机废品：{{data.machineWasteNumber || 0}}</span>
                    </div>
                </div>
                <div style="height: 1px;width: 100%;background-color: #D4D8DF;margin: 10px 0;"></div>
                <div>
                    <a-button @click="selectAddOneQualified(data)" size="large" style="background-color: #035FA6;color: #fff;width: 8%;margin-right: 10px;height: 50px">
                        合格
                    </a-button>
                    <a-button @click="selectAddOneUnQualified(data, index)" style="background-color: #B2BAC6;width: 8%;margin-right: 10px;height: 50px" v-for="index in [101,102,103,104,105,106,107,108,109]" :key="index" size="large">{{index}}</a-button>
                    <a-button @click="selectAddOneWaste(data)" size="large" style="background-color: #A7081C;color: #fff;width: calc(20% - 100px);height: 50px">
                        添加调机废品
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {selectAllOnline,  selectAddOneQualified,
        selectAddOneUnQualified,
        selectAddOneWaste} from '@/api/api';
    export default {
        name: 'XRayDefect',
        data(){
            return {
                pageParams: {
                    pageNo: 1,
                    pageSize: 9999
                },
                pageDataArr: []
            }
        },
        mounted() {
          this.tableInit();
        },
        methods: {
            tableInit() {
                selectAllOnline(this.pageParams).then(res => {
                    this.pageDataArr = res.result;
                });
            },
            selectAddOneQualified(data) {
                selectAddOneQualified({machiningType: 1,taskId: data.taskId,wheelModel: data.daikaPartNumber}).then(res => {
                    if (res.success) {
                        this.tableInit();
                    }
                });
            },
            selectAddOneUnQualified(data, index) {
                selectAddOneUnQualified({machiningType: 0,taskId: data.taskId, defectCode: index,wheelModel: data.daikaPartNumber}).then(res => {
                    if (res.success) {
                        this.tableInit();
                    }
                });
            },
            selectAddOneWaste(data) {
                selectAddOneWaste({machiningType: 2,taskId: data.taskId,wheelModel: data.daikaPartNumber}).then(res => {
                    if (res.success) {
                        this.tableInit();
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
