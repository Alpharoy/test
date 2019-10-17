<template>
    <div class="flex-container">
        <el-row class="top-container">
            <el-col :span="24">
                <el-button type="primary" @click="infoFunc()">创建企业</el-button>
            </el-col>
        </el-row>
        <el-card-table :list-data="listData">
            <el-table-column prop="enterprise_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="enterprise_name" label="企业名称" min-width="150" fixed show-overflow-tooltip/>
            <el-table-column prop="industry_type_name" label="行业类型" width="150" show-overflow-tooltip/>
            <el-table-column prop="usci_number" label="统一社会编码" min-width="120"/>
            <el-table-column prop="artificial_person_name" label="法人姓名" min-width="120"/>
            <el-table-column prop="artificial_person_phone_number" label="法人手机" min-width="120"/>
            <el-table-column prop="contact_name" label="联系人" min-width="120"/>
            <el-table-column prop="contact_phone_number" label="联系人号码" min-width="120"/>
            <el-table-column prop="tax_identification_number" label="纳税人识别号" min-width="120"/>
            <el-table-column prop="invoice_title" label="发票抬头" min-width="120"/>
            <el-table-column prop="bank_name" label="银行名称" min-width="120"/>
            <el-table-column prop="status_name" label="状态" width="80"/>
            <el-table-column label="创建时间" width="180">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.enterprise_uuid)">编辑</el-button>
                    <el-button type="text" @click="auditFunc(scope.row.enterprise_uuid)"
                               v-if="scope.row.can_audit_passed || scope.row.can_reverse_audit">审核
                    </el-button>
                    <el-button type="text" @click="userDialog(scope.row.enterprise_uuid)">管理员</el-button>
                </template>
            </el-table-column>
        </el-card-table>

        <info-dialog :visible.sync="showInfoDialog" :type="infoDialogType" :enterprise-uuid="dialogEnterpriseUUID"
                     @close="onInfoDialogClose">
        </info-dialog>
        <enterprise-user-dialog :visible.sync="showUserDialog"
                                :enterprise-uuid="dialogEnterpriseUUID"></enterprise-user-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/admin/enterprise/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';
    import EnterpriseUserDialog from '../../../components/admin/enterprise/UserDialog';

    export default {
        name: 'EnterpriseIndex',
        components: {ElCardTable, Search, InfoDialog, EnterpriseUserDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'enterprise_name',
                    'usci_number',
                    'create_time',
                    'audit_status',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },

                showInfoDialog: false,
                showUserDialog: false,
                dialogEnterpriseUUID: '',
                infoDialogType: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchEnterprise(query.page, query);
            },
            fetchEnterprise(page, query) {
                api.admin().get(this.convertURL(adminURL.enterprise_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(enterpriseUUID = '') {
                this.dialogEnterpriseUUID = enterpriseUUID;
                this.infoDialogType = 'info';
                this.showInfoDialog = true;
            },
            auditFunc(enterpriseUUID = '') {
                this.dialogEnterpriseUUID = enterpriseUUID;
                this.infoDialogType = 'audit';
                this.showInfoDialog = true;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
            userDialog(enterpriseUUID = '') {
                this.dialogEnterpriseUUID = enterpriseUUID;
                this.showUserDialog = true;
            },
        },
    };
</script>
<style scoped>
</style>
