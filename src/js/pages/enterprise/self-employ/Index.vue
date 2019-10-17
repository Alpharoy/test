<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="self_employ_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="self_employ_name" label="企业名称" min-width="150" fixed show-overflow-tooltip/>
            <el-table-column prop="self_employ.industry_type_name" label="行业类型" width="150" show-overflow-tooltip/>
            <el-table-column prop="self_employ.usci_number" label="统一社会编码" min-width="120"/>
            <el-table-column prop="self_employ.artificial_person_name" label="法人姓名" min-width="120"/>
            <el-table-column prop="self_employ.artificial_person_phone_number" label="法人手机" min-width="120"/>
            <el-table-column prop="self_employ.contact_name" label="联系人" min-width="120"/>
            <el-table-column prop="self_employ.contact_phone_number" label="联系人号码" min-width="120"/>
            <el-table-column prop="self_employ.tax_identification_number" label="纳税人识别号" min-width="120"/>
            <el-table-column prop="self_employ.invoice_title" label="发票抬头" min-width="120"/>
            <el-table-column prop="self_employ.bank_name" label="银行名称" min-width="120"/>
            <el-table-column prop="self_employ.status_name" label="状态" width="80"/>
            <el-table-column label="创建时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.self_employ.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.self_employ_uuid)">查看</el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :self-employ-uuid="dialogSelfEmployUUID"
                     @close="onInfoDialogClose">
        </info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/enterprise/self-employ/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';

    export default {
        name: 'SelfEmployIndex',
        components: {ElCardTable, Search, InfoDialog},
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
                dialogSelfEmployUUID: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchSelfEmploy(query.page, query);
            },
            fetchSelfEmploy(page, query) {
                api.enterprise().get(this.convertURL(enterpriseURL.self_employ_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(selfEmployUUID = '') {
                this.dialogSelfEmployUUID = selfEmployUUID;
                this.showInfoDialog = true;
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
