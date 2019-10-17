<template>
    <div class="flex-container">
        <el-card-table :list-data="listData">
            <el-table-column prop="admin_uuid" label="UUID" width="140"/>
            <el-table-column prop="admin_name" label="名称"/>
            <el-table-column label="添加时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" @click="infoDialog(scope.row.admin_uuid)">编辑</el-button>
                    <el-button type="text" @click="userDialog(scope.row.admin_uuid)">管理员</el-button>
                </template>
            </el-table-column>
        </el-card-table>
        <info-dialog :visible.sync="showInfoDialog" :uuid="dialogAdminUUID" @close="onInfoDialogClose"></info-dialog>
        <admin-user-dialog :visible.sync="showUserDialog" :admin-uuid="dialogAdminUUID"></admin-user-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import InfoDialog from '../../../components/admin/admin/InfoDialog';

    import ElCardTable from '../../../components/table/ElCardTable';
    import AdminUserDialog from '../../../components/admin/admin/UserDialog';

    export default {
        name: 'AdminIndex',
        components: {AdminUserDialog, ElCardTable, InfoDialog},
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
                showUserDialog: false,
                dialogAdminUUID: '',
            };
        },
        methods: {
            urFetchData() {
                api.admin().get(this.convertURL(adminURL.admin_list)).then(response => this.listData = response);
            },
            infoDialog(adminUUID = '') {
                this.dialogAdminUUID = adminUUID;
                this.showInfoDialog = true;
            },
            userDialog(adminUUID = '') {
                this.dialogAdminUUID = adminUUID;
                this.showUserDialog = true;
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
