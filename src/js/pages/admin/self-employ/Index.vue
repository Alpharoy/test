<template>
    <div class="flex-container">
        <el-row class="top-container">
            <el-col :span="24">
                <el-button type="primary" @click="infoFunc()">创建个体</el-button>
            </el-col>
        </el-row>
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="self_employ_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="self_employ_name" label="企业名称" min-width="150" fixed show-overflow-tooltip/>
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
            <el-table-column label="创建时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.self_employ_uuid)">编辑</el-button>
                    <el-button type="text" @click="auditFunc(scope.row.self_employ_uuid)"
                               v-if="scope.row.can_audit_passed || scope.row.can_reverse_audit">审核
                    </el-button>
                    <el-button type="text" @click="userDialog(scope.row.self_employ_uuid)">管理员</el-button>
                </template>
            </el-table-column>
        </el-card-table>

        <info-dialog :visible.sync="showInfoDialog" :type="infoDialogType" :self-employ-uuid="dialogSelfEmployUUID"
                     @close="onInfoDialogClose">
        </info-dialog>
        <self-employ-user-dialog :visible.sync="showUserDialog"
                                 :self-employ-uuid="dialogSelfEmployUUID"></self-employ-user-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/admin/self-employ/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';
    import SelfEmployUserDialog from '../../../components/admin/self-employ/UserDialog';

    export default {
        name: 'SelfEmployIndex',
        components: {ElCardTable, Search, InfoDialog, SelfEmployUserDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'self_employ_name',
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
                dialogSelfEmployUUID: '',
                infoDialogType: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchSelfEmploy(query.page, query);
            },
            fetchSelfEmploy(page, query) {
                api.admin().get(this.convertURL(adminURL.self_employ_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(selfEmployUUID = '') {
                this.dialogSelfEmployUUID = selfEmployUUID;
                this.infoDialogType = 'info';
                this.showInfoDialog = true;
            },
            auditFunc(selfEmployUUID = '') {
                this.dialogSelfEmployUUID = selfEmployUUID;
                this.infoDialogType = 'audit';
                this.showInfoDialog = true;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
            userDialog(selfEmployUUID = '') {
                this.dialogSelfEmployUUID = selfEmployUUID;
                this.showUserDialog = true;
            },
        },
    };
</script>
<style scoped>
</style>
