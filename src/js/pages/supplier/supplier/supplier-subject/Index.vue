<template>
    <div class="flex-container">
        <el-row class="top-container">
            <el-col :span="24">
                <el-button type="primary" @click="infoFunc()">新增科目</el-button>
            </el-col>
        </el-row>
        <el-card-table :list-data="listData">
            <el-table-column prop="supplier_subject_uuid" label="UUID" width="150" fixed/>
            <el-table-column prop="industry_type_name" label="行业类型"/>
            <el-table-column prop="supplier_subject_name" label="科目名称"/>
            <el-table-column prop="introduce" label="科目描述"/>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{ scope.row.is_open ? '启用' : '未启用' }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-card-table>

        <info-dialog :visible.sync="showInfoDialog" :supplier-subject="dialogSupplierSubject"
                     @close="onInfoDialogClose"></info-dialog>
    </div>
</template>

<script>
    import api from '../../../../api';
    import supplierURL from '../../../../api/url/supplier';
    import mixins from '../../../../extends/mixins';
    import InfoDialog from '../../../../components/supplier/supplier/supplier-subject/InfoDialog';
    import Search from '../../../../components/search/Search';
    import helpers from '../../../../extends/helpers';
    import ElCardTable from '../../../../components/table/ElCardTable';

    export default {
        name: 'SupplierSubjectIndex',
        components: {ElCardTable, Search, InfoDialog},
        mixins: mixins,
        data() {
            return {
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },

                showInfoDialog: false,
                dialogSupplierSubject: null,
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchSupplierSubject(query.page, query);
            },
            fetchSupplierSubject(page, query) {
                api.supplier().get(this.convertURL(supplierURL.supplier_subject_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(dialogSupplierSubject) {
                this.dialogSupplierSubject = dialogSupplierSubject;
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