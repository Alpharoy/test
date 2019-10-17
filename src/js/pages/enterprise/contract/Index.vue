<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="supplier_name" label="供应商名称" width="200" fixed/>
            <el-table-column prop="industry_type_name" label="行业"/>
            <el-table-column prop="business_scope" label="经营范围"/>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.contract">
                        {{ scope.row.contract.can_renew ? '失效' : scope.row.contract.status_name }}
                    </template>
                    <template v-else>
                        未合约
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="合约编码">
                <template slot-scope="scope">
                    <template v-if="scope.row.contract">
                        {{ scope.row.contract.contract_no }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="合约名称">
                <template slot-scope="scope">
                    <template v-if="scope.row.contract">
                        {{ scope.row.contract.contract_name }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="合约期限" width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.contract">
                        {{ scope.row.contract.valid_time | qlDate }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="合约申请人">
                <template slot-scope="scope">
                    <template v-if="scope.row.contract">
                        {{ scope.row.contract.applicant_name }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc('', scope.row)" v-if="!scope.row.contract">签约
                    </el-button>
                    <el-button type="text" @click="infoFunc(scope.row.contract.contract_uuid, null)"
                               v-if="scope.row.contract">详情
                    </el-button>
                    <el-button type="text" @click="infoFunc('', scope.row)"
                               v-if="scope.row.contract && scope.row.contract.can_renew">续签
                    </el-button>
                    <el-button type="text" @click="deleteFunc(scope.row.contract.contract_uuid)"
                               v-if="scope.row.contract && scope.row.contract.can_delete">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :contract-uuid="infoContractUUID" :supplier="infoSupplier"
                     @close="onInfoDialogClose"></info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/enterprise/contract/InfoDialog';
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
                    'supplier_name',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },
                showInfoDialog: false,
                infoContractUUID: '',
                infoSupplier: null,
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                query.audit_status = 99;    // 只获取审核通过的供应商列表
                query.with_contract = 1;    // 附带合约信息
                api.enterprise().get(this.convertURL(enterpriseURL.supplier_list), helpers.buildQuery(query.page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(contractUUID = '', supplier = null) {
                this.infoContractUUID = contractUUID;
                this.infoSupplier = supplier;
                this.showInfoDialog = true;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
            deleteFunc(contractUUID) {
                this.$confirm('将删除此合约, 是否继续?', '提示', {type: 'warning'}).then(() => {
                    api.enterprise().delete(this.convertURL(enterpriseURL.delete_contract, {contractUUID: contractUUID})).then(response => {
                        this.$message({type: 'success', message: '合约删除成功'});
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
