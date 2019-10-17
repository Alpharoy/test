<template>
    <el-table :data="listData.data"
              :index="index"
              v-bind="$attrs"
              @current-change="onTableCurrentChange"
              @selection-change="onTableSelectionChange"
              @row-dblclick="onTableRowDblclick"
              @sort-change="onTableSortChange"
    >
        <el-table-column type="index" :index="listIndex" label="序号" width="50" v-if="index" fixed/>
        <slot></slot>
    </el-table>
</template>
<script>
    export default {
        name: 'OnlyTable',
        data: () => ({}),
        props: {
            listData: {
                type: Object,
                default: () => ({
                    data: [],
                    page: {
                        currentPage: 1,
                        perPage: 20,
                        totalCount: 0,
                    },
                }),
            },
            // 是否需要序列号
            index: {
                type: Boolean,
                default: true,
            },
        },
        computed: {
            currentPage() {
                let currentPage = _.toSafeInteger(_.get(this.listData, 'page.currentPage'));
                return currentPage <= 0 ? 1 : currentPage;
            },
            perPage() {
                return _.toSafeInteger(_.get(this.listData, 'page.perPage'));
            }
        },
        methods: {
            listIndex(index) {
                return index + this.perPage * (this.currentPage - 1) + 1;
            },
            onTableCurrentChange(currentRow, oldCurrentRow) {
                this.$emit('onTableCurrentChange', currentRow, oldCurrentRow);
            },
            onTableSelectionChange(val) {
                this.$emit('onTableSelectionChange', val);
            },
            onTableRowDblclick(val) {
                this.$emit('onTableRowDblclick', val);
            },
            onTableSortChange({column, prop, order}) {
                this.$emit('onTableSortChange', {column, prop, order});
            },
        },
    };
</script>
<style scoped>
</style>
