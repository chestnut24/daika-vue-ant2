<template>
    <div>
        <!-- 列表自动过滤项 -->
        <div>
            <a-card>
                <a-space direction="vertical" size="middle">
                    <a-input placeholder="回车搜索列" @change="onSearchIpt" @keyup.enter.stop="doSearch">
                        <a-icon slot="suffix" type="search" />
                    </a-input>
                    <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                        <a-row style="width: 400px">
                            <template v-for="(item,index) in columns">
                                    <a-col :span="12">
                                        <a-checkbox :value="item.dataIndex" :disabled="index === columns.length - 1">
                                            <j-ellipsis :value="item.title" :length="10"></j-ellipsis>
                                        </a-checkbox>
                                    </a-col>
                            </template>
                        </a-row>
                    </a-checkbox-group>
                </a-space>
            </a-card>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'jnFilterTable',
        data(){
            return {
                // 列设置
                settingColumns: [],
                // 搜索列
                searchColTxt: ''
            }
        },
        props:{
            columns: {
                type: Array,
                default() {
                    return []
                }
            },
            showColumns: {
                type: Array,
                default() {
                    return []
                }
            },
        },
        mounted() {
            this.initColumns();
        },
        methods: {
            //列设置更改事件
            onColSettingsChange(checkedValues) {
                var key = this.$route.name + ':colsettings';
                Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000);
                this.settingColumns = checkedValues;
                const cols = this.columns.filter(item => {
                    if (item.key == 'rowIndex' || item.dataIndex == 'action') {
                        return true;
                    }
                    if (this.settingColumns.includes(item.dataIndex)) {
                        return true;
                    }
                    return false;
                })
                this.$emit('showColumnsChange', cols);
            },
            initColumns() {
                var key = this.$route.name + ':colsettings';
                let colSettings = Vue.ls.get(key);
                if (colSettings == null || colSettings == undefined) {
                    let allSettingColumns = [];
                    this.columns.forEach(function(item, i, array) {
                        allSettingColumns.push(item.dataIndex);
                    });
                    this.settingColumns = allSettingColumns;
                    this.$emit('showColumnsChange', this.columns);
                } else {
                    this.settingColumns = colSettings;
                    const cols = this.columns.filter(item => {
                        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
                            return true;
                        }
                        if (colSettings.includes(item.dataIndex)) {
                            return true;
                        }
                        return false;
                    });
                    this.$emit('showColumnsChange', cols);
                }
            },
            onSearchIpt(e) {
                this.searchColTxt = e.target.value;
            },
            doSearch() {
                const cols = this.columns.filter((item, index) => {
                    if (index === this.columns.length - 1 ||
                        item.title.indexOf(this.searchColTxt) > -1) {
                        return true;
                    }
                    return false;
                });
                this.settingColumns = cols.map(item => item.dataIndex);
                this.$emit('showColumnsChange', cols);
            }
        }
    }
</script>

<style scoped>

</style>
