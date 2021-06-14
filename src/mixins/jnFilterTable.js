import jnFilterTable from './../views/component/jn-filter-table';
import jnFilterAction from './../views/component/jn-filter-action';
import jnFilterIcon from './../views/component/jn-filter-icon';
import Vue from 'vue';
export const jnFilterTableMixin = {
    data(){
        return {
            // // 显示的列
            showColumns: [],
        }
    },
    components: {jnFilterTable, jnFilterAction, jnFilterIcon},
    mounted(){
        this.initColumns();
        const index = this.columns.length - 1;
        this.$set(this.columns[index].scopedSlots, Object.assign(this.columns[index].scopedSlots,
            {filterDropdown: 'filterDropdown',filterIcon: 'filterIcon'}));
    },
    methods: {
        setShowColumns(val) {
            this.showColumns = val;
        },
        initColumns() {
            var key = this.$route.name + ':colsettings';
            let colSettings = Vue.ls.get(key);
            if (colSettings == null || colSettings == undefined) {
                this.setShowColumns(this.columns);
            } else {
                const cols = this.columns.filter(item => {
                    if (item.key == 'rowIndex' || item.dataIndex == 'action') {
                        return true;
                    }
                    if (colSettings.includes(item.dataIndex)) {
                        return true;
                    }
                    return false;
                });
                this.setShowColumns(cols);
            }
        },
    }
}
