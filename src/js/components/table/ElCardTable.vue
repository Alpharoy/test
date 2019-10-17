<template>
    <div class="flex-container">
        <el-card class="box-card flex-container">
            <only-table
                    :list-data="listData" v-bind="$attrs"
                    @onTableCurrentChange="onTableCurrentChange"
                    @onTableSelectionChange="onTableSelectionChange"
                    @onTableRowDblclick="onTableRowDblclick"
                    @onTableSortChange="onTableSortChange"
                    :index="index"
            >
                <slot></slot>
            </only-table>
        </el-card>
        <only-page :list-data="listData" :use-page-current-change-func="usePageCurrentChangeFunc"
                   @onPageCurrentChange="onPageCurrentChange"></only-page>
    </div>
</template>
<script>
    import OnlyPage from './OnlyPage';
    import OnlyTable from './OnlyTable';

    export default {
        name: 'ElCardTable',
        components: {OnlyTable, OnlyPage},
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
            // 是否使用内置的翻页函数处理
            usePageCurrentChangeFunc: {
                type: Boolean,
                default: true,
            }
        },
        computed: {},
        methods: {
            onPageCurrentChange(page) {
                this.$emit('onPageCurrentChange', page);
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
