<template>
    <el-dialog title="" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="700px"
               class="ql-dialog" append-to-body>
        <el-card-table :list-data="listData" :usePageCurrentChangeFunc="false"
                       @onPageCurrentChange="onPageCurrentChange">
            <el-table-column label="登录时间" width="200">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="登录IP" width="180"/>
            <el-table-column prop="type" label="登录方式"/>
            <el-table-column prop="group" label="分组"/>
        </el-card-table>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';

    import adminURL from '../../../api/url/admin';
    import ElCardTable from '../../table/ElCardTable';

    export default {
        name: 'LoginLogDialog',
        components: {ElCardTable},
        data: () => ({
            elVisible: false,

            currentPage: 1,
            listData: {
                data: [],
                page: {
                    currentPage: 1,
                },
            },
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            uuid: {
                type: String,
            },
            enterpriseUuid: {
                type: String,
            },
        },
        computed: {},
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                this.currentPage = 1;
                this.fetchData();
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            onPageCurrentChange(page) {
                this.currentPage = page;
                this.fetchData();
            },
            fetchData() {
                api.admin().get(helpers.convertURL(adminURL.enterprise_user_log_list, {enterpriseUUID:this.enterpriseUuid,userUUID: this.uuid}), helpers.buildQuery(this.currentPage, {})).then(response => {
                    this.listData = response;
                });
            },
        },
    };
</script>
<style scoped>
</style>