<template>
    <el-dialog title="管理员列表" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <login-log-dialog :visible.sync="showLoginLogDialog" :uuid="dialogUserUUID"
                          :enterprise-uuid="dialogEnterpriseUUID"></login-log-dialog>
        <user-info-dialog :visible.sync="showUserInfoDialog" :uuid="dialogUserUUID"
                          :enterprise-uuid="dialogEnterpriseUUID"
                          @close="closeUserInfoDialogFunc"></user-info-dialog>
        <el-button type="primary" @click="userInfoFunc('')" style="margin-bottom: 10px;">新建管理员</el-button>
        <el-card-table :list-data="listData">
            <el-table-column prop="user_uuid" label="UUID" width="140"/>
            <el-table-column prop="user_phone" label="登录手机号码" width="120"/>
            <el-table-column prop="user_name" label="用户名"/>
            <el-table-column label="添加时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" @click="userInfoFunc(scope.row.user_uuid)">编辑
                    </el-button>
                    <el-button type="text" @click="loginLogFunc(scope.row.user_uuid)">登录历史
                    </el-button>
                </template>
            </el-table-column>
        </el-card-table>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';

    import adminURL from '../../../api/url/admin';
    import ElCardTable from '../../table/ElCardTable';
    import LoginLogDialog from './LoginLogDialog';
    import UserInfoDialog from './UserInfoDialog';

    export default {
        name: 'EnterpriseUserDialog',
        components: {UserInfoDialog, LoginLogDialog, ElCardTable},
        data: () => ({
            elVisible: false,

            listData: {
                data: [],
                page: {
                    currentPage: 1,
                },
            },
            showUserInfoDialog: false,
            showLoginLogDialog: false,
            dialogUserUUID: '',
            dialogEnterpriseUUID: ''
        }),
        props: {
            enterpriseUuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            enterpriseUUID() {
                return this.enterpriseUuid;
            }
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['listData']);
                api.admin().get(helpers.convertURL(adminURL.enterprise_user_list, {enterpriseUUID: this.enterpriseUuid})).then(response => this.listData = response);
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            loginLogFunc(userUUID) {
                this.dialogUserUUID = userUUID;
                this.dialogEnterpriseUUID = this.enterpriseUuid;
                this.showLoginLogDialog = true;
            },
            userInfoFunc(userUUID) {
                this.dialogUserUUID = userUUID;
                this.dialogEnterpriseUUID = this.enterpriseUuid;
                this.showUserInfoDialog = true;
            },
            closeUserInfoDialogFunc(refresh) {
                if (refresh) {
                    this.onOpen();
                }
            },
        }
    };
</script>
<style scoped>
</style>