<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="project_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="project_name" label="项目名称" min-width="150"/>
            <el-table-column prop="supplier_name" label="供应商名称" width="150"/>
            <el-table-column prop="enterprise_name" label="企业名称" min-width="120"/>
            <el-table-column prop="charge_person_name" label="负责人姓名" min-width="120"/>
            <el-table-column prop="charge_person_phone_number" label="负责人手机号码" min-width="120"/>
            <el-table-column prop="industry_type_name" label="行业类型名称" min-width="120"/>
            <el-table-column prop="employment_type_name" label="用工类型名称" min-width="120"/>
            <el-table-column prop="service_charge" label="服务费率" width="100">
                <template slot-scope="scope">
                    {{ scope.row.service_charge / 100 }} %
                </template>
            </el-table-column>
            <el-table-column prop="status_name" label="状态" width="80"/>
            <el-table-column prop="address_name" label="项目地区" width="80"/>
            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.project_uuid)">详情</el-button>
                </template>
            </el-table-column>
        </el-card-table>

        <info-dialog :visible.sync="showInfoDialog" :project-uuid="infoProjectUUID" @close="onInfoDialogClose">
        </info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/admin/project/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';

    export default {
        name: 'ProjectIndex',
        components: {ElCardTable, Search, InfoDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'project_name',
                    'supplier_name',
                    'enterprise_name',
                    'industry_type_code',
                    'employment_type_code',
                    'creat_time',
                    'audit_status',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },
                showInfoDialog: false,
                infoProjectUUID: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchProject(query.page, query);
            },
            fetchProject(page, query) {
                api.admin().get(this.convertURL(adminURL.project_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(projectUUID = '') {
                this.showInfoDialog = true;
                this.infoProjectUUID = projectUUID;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
        },
    };
</script>
<style scoped>
</style>
