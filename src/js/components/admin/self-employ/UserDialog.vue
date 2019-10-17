<template>
    <el-dialog title="管理员列表" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <user-info-dialog :visible.sync="showUserInfoDialog" :uuid="dialogUserUUID"
                          :self-employ-uuid="dialogSelfEmployUUID"
                          @close="closeUserInfoDialogFunc"></user-info-dialog>
        <el-card-table :list-data="listData">
            <el-table-column prop="user_uuid" label="UUID" width="140"/>
            <el-table-column prop="user_phone" label="登录手机号码" width="120"/>
            <el-table-column prop="user_name" label="用户名"/>
            <el-table-column label="添加时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.create_time | qlDateTime}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="userInfoFunc(scope.row.user_uuid)">编辑
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
    import UserInfoDialog from './UserInfoDialog';

    export default {
        name: 'SelfEmployUserDialog',
        components: {ElCardTable, UserInfoDialog},
        data: () => ({
            elVisible: false,
            listData: {
                data: [],
                page: {
                    currentPage: 1,
                },
            },
            dialogSelfEmployUUID: '',
            dialogUserUUID: '',
            showUserInfoDialog: false
        }),
        props: {
            selfEmployUuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            selfEmployUUID() {
                return this.selfEmployUuid;
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
                api.admin().get(helpers.convertURL(adminURL.self_employ_user_list, {selfEmployUUID: this.selfEmployUuid})).then(response => this.listData = response);
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            userInfoFunc(userUUID) {
                this.dialogUserUUID = userUUID;
                this.dialogSelfEmployUUID = this.selfEmployUuid;
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