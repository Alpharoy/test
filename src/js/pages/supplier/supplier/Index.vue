<template>
    <div class="flex-container">
        <el-card-table :list-data="listData">
            <el-table-column prop="supplier_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="supplier_name" label="供应商名称" min-width="150" fixed show-overflow-tooltip/>
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
            <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.supplier_uuid)">编辑</el-button>
                    <el-button type="text" @click="userDialog(scope.row.supplier_uuid)">管理员</el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :supplier-uuid="dialogSupplierUUID"
                     @close="onInfoDialogClose">
        </info-dialog>
        <supplier-user-dialog :visible.sync="showUserDialog" :supplier-uuid="dialogSupplierUUID"></supplier-user-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/supplier/supplier/InfoDialog';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';
    import SupplierUserDialog from '../../../components/supplier/supplier/UserDialog';


    export default {
        name: 'SupplierIndex',
        components: {ElCardTable, InfoDialog, SupplierUserDialog},
        mixins: mixins,
        data() {
            return {
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },

                dialogSupplierUUID: '',
                showInfoDialog: false,
                showUserDialog: false,

            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchSupplier(query.page, query);
            },
            fetchSupplier(page, query) {
                api.supplier().get(this.convertURL(supplierURL.supplier_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(supplierUUID = '') {
                this.dialogSupplierUUID = supplierUUID;
                this.showInfoDialog = true;
            },
            onInfoDialogClose(refresh = false) {
                if (refresh) {
                    this.urFetchData();
                }
            },
            userDialog(supplierUUID = '') {
                this.dialogSupplierUUID = supplierUUID;
                this.showUserDialog = true;
            },
        },
    };
</script>
<style scoped>
</style>
