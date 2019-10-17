<template>
    <el-pagination v-show="totalCount" background layout="total, prev, pager, next, jumper"
                   :current-page="currentPage" :page-size="perPage"
                   :total="totalCount" @current-change="onPageCurrentChange"
                   v-bind="$attrs"
    ></el-pagination>
</template>

<script>
    import helpers from '../../extends/helpers';

    export default {
        name: 'OnlyPage',
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
            usePageCurrentChangeFunc: {
                type: Boolean,
                default: true,
            }
        },
        computed: {
            totalCount() {
                return _.toSafeInteger(_.get(this.listData, 'page.totalCount'));
            },
            currentPage() {
                let currentPage = _.toSafeInteger(_.get(this.listData, 'page.currentPage'));
                return currentPage <= 0 ? 1 : currentPage;
            },
            perPage() {
                return _.toSafeInteger(_.get(this.listData, 'page.perPage'));
            }
        },
        methods: {
            onPageCurrentChange(page) {
                if (this.usePageCurrentChangeFunc) {
                    helpers.queryRoute(this.$router, page, this.$route);
                    return;
                }
                this.$emit('onPageCurrentChange', page);
            },
        },
    };
</script>

<style scoped>

</style>