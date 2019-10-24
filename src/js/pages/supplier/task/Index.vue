<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData" :show-summary="true" :summary-method="getSummaries">
            <el-table-column prop="task_uuid" label="任务编号" width="150" fixed/>
            <el-table-column label="订单日期" width="100">
                <template slot-scope="scope">
                    {{scope.row.record_time | qlDate}}
                </template>
            </el-table-column>
            <el-table-column prop="task_name" label="任务名称"/>
            <el-table-column prop="project_name" label="项目"/>
            <el-table-column prop="enterprise_name" label="企业"/>
            <el-table-column prop="contact_name" label="联系人" width="100"/>
            <el-table-column prop="handler_object_name" label="接单人"/>
            <el-table-column prop="introduce" label="任务描述" width="150" show-overflow-tooltip/>
            <el-table-column prop="industry_type_name" label="行业类型" width="100"/>
            <el-table-column prop="supplier_subject_name" label="科目" width="100"/>
            <el-table-column prop="task_fees" label="订单金额" width="80">
                <template slot-scope="scope">
                    {{scope.row.task_fees / 100 }}
                </template>
            </el-table-column>
            <el-table-column prop="service_charge_fees" label="服务费" width="80">
                <template slot-scope="scope">
                    {{scope.row.service_charge_fees / 100 }}
                </template>
            </el-table-column>
            <el-table-column prop="total_fees" label="费用合计" width="80">
                <template slot-scope="scope">
                    {{scope.row.total_fees / 100 }}
                </template>
            </el-table-column>
            <el-table-column prop="status_name" label="状态" width="100"/>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.task_uuid)">详情</el-button>
                    <el-button type="text" @click="rejectFunc(scope.row.task_uuid)" v-if="scope.row.can_reject">拒接
                    </el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :task-uuid="infoTaskUUID" @close="onInfoDialogClose">
        </info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/supplier/task/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';

    export default {
        name: 'TaskIndex',
        components: {ElCardTable, Search, InfoDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'task_uuid',
                    'task_name',
                    'enterprise_name',
                    'industry_type_code',
                    'task_status',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },
                showInfoDialog: false,
                infoTaskUUID: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchTask(query.page, query);
            },
            fetchTask(page, query) {
                api.supplier().get(this.convertURL(supplierURL.task_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(infoTaskUUID = '') {
                this.infoTaskUUID = infoTaskUUID;
                this.showInfoDialog = true;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
            getSummaries(param) {
                const conversion = {'task_fees': 100, 'service_charge_fees': 100, 'total_fees': 100};
                return helpers.getSummaries(param, conversion);
            },
            rejectFunc(taskUUID) {
                this.$confirm('将拒绝此任务订单, 是否继续?', '提示', {type: 'warning'}).then(() => {
                    api.supplier().put(this.convertURL(supplierURL.task_reject, {taskUUID: taskUUID})).then(response => {
                        this.$message({type: 'success', message: '任务订单拒绝完成'});
                        this.urFetchData();
                    })
                }).catch(err => {
                });
            },
        },
    };
</script>
<style scoped>
</style>
