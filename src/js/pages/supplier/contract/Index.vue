<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="contract_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="contract_no" label="合约编码" min-width="150"/>
            <el-table-column prop="contract_name" label="合约名称" min-width="150"/>
            <el-table-column prop="enterprise_name" label="企业名称" min-width="120"/>
            <el-table-column prop="status_name" label="合约状态" min-width="120"/>
            <el-table-column prop="valid_time" label="合约有效期" width="100">
                <template slot-scope="scope">
                    {{scope.row.valid_time | qlDate}}
                </template>
            </el-table-column>
            <el-table-column prop="applicant_name" label="申请人姓名" min-width="120"/>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.contract_uuid)">详情</el-button>
                </template>
            </el-table-column>
        </el-card-table>

        <info-dialog :visible.sync="showInfoDialog" :contract-uuid="infoContractUUID" @close="onInfoDialogClose">
        </info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/supplier/contract/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';

    export default {
        name: 'ContractIndex',
        components: {ElCardTable, Search, InfoDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'contract_no',
                    'contract_name',
                    'enterprise_name',
                    'audit_status',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },
                showInfoDialog: false,
                infoContractUUID: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchContract(query.page, query);
            },
            fetchContract(page, query) {
                api.supplier().get(this.convertURL(supplierURL.contract_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(contractUUID = '') {
                this.infoContractUUID = contractUUID;
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
