<template>
    <div class="flex-container">
        <search :search-fields="searchField"></search>
        <el-card-table :list-data="listData">
            <el-table-column prop="user_uuid" label="UUID" width="140" fixed/>
            <el-table-column prop="natural_person.user_name" label="姓名" min-width="80"/>
            <el-table-column prop="natural_person.user_phone" label="联系电话" width="120"/>
            <el-table-column prop="natural_person.id_card_number" label="证件号码" min-width="120"/>
            <el-table-column prop="natural_person.contact_address" label="联系地址" min-width="120"/>
            <el-table-column prop="natural_person.sex_name" label="性别" width="80"/>
            <el-table-column label="生日" width="100">
                <template slot-scope="scope">
                    {{scope.row.natural_person.birthday | qlDate}}
                </template>
            </el-table-column>
            <el-table-column prop="natural_person.status_name" label="状态" width="100"/>
            <el-table-column label="实名认证">
                <template slot-scope="scope">
                    {{ scope.row.natural_person.is_name_verified ? '√' :'×'}}
                </template>
            </el-table-column>
            <el-table-column prop="natural_person.source_from_name" label="用户来源" width="80"/>
            <el-table-column label="注册时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.natural_person.create_time | qlDateTime}}
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoFunc(scope.row.user_uuid)">详情</el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :uuid="dialogUserUUID"
                     @close="onInfoDialogClose">
        </info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/supplier/natural-person/InfoDialog';
    import Search from '../../../components/search/Search';
    import helpers from '../../../extends/helpers';
    import ElCardTable from '../../../components/table/ElCardTable';

    export default {
        name: 'NaturalPersonIndex',
        components: {ElCardTable, Search, InfoDialog},
        mixins: mixins,
        data() {
            return {
                searchField: [
                    'id_card_number',
                    'user_name',
                    'user_phone',
                    'audit_status',
                ],
                listData: {
                    data: [],
                    page: {
                        currentPage: 1,
                    },
                },
                showInfoDialog: false,
                dialogUserUUID: '',
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                const query = this.$route.query;
                this.fetchNaturalPerson(query.page, query);
            },
            fetchNaturalPerson(page, query) {
                api.supplier().get(this.convertURL(supplierURL.natural_person_list), helpers.buildQuery(page, query)).then(response => {
                    this.listData = response;
                });
            },
            infoFunc(userUUID = '') {
                this.dialogUserUUID = userUUID;
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
