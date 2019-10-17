<template>
    <el-dialog title="" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog" append-to-body>
        <el-tabs v-model="activeName" v-if="creating">
            <el-tab-pane label="创建管理员" name="create">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="管理员姓名">
                        <el-input v-model="enterpriseUser.user_name" maxlength="10" placeholder="管理员姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号">
                        <el-input v-model="enterpriseUser.user_phone" maxlength="11"
                                  placeholder="手机号码（将以此为登录账号）"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码">
                        <el-input :value="enterpriseUser.password" placeholder="账户登录密码" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="权限角色">
                        <el-select v-model="selectedRoleIds" multiple placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in roles"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitCreate">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" v-else>
            <el-tab-pane label="更新资料" name="update">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="UUID">
                        <el-input :value="enterpriseUser.user_uuid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员姓名">
                        <el-input v-model="enterpriseUser.user_name" maxlength="10" placeholder="管理员姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号">
                        <el-input :value="enterpriseUser.user_phone" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="权限角色" v-if="canUpdateRole">
                        <el-select v-model="selectedRoleIds" multiple placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in roles"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitUpdate">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="重置密码" name="reset-password">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="新密码">
                        <el-input v-model="password.new_password" maxlength="32" placeholder="请输入新密码"
                                  type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码">
                        <el-input v-model="password.new_password_confirmation " maxlength="32" placeholder="请再次输入新密码"
                                  type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitResetPassword">更新密码</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="禁止登录" name="lock-login" v-if="canLock">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="禁止原因">
                        <el-input v-model="lock.lock_reason" maxlength="250" placeholder="禁止原因"></el-input>
                    </el-form-item>
                    <el-form-item label="禁用天数">
                        <el-input v-model="lock.lock_day " maxlength="4" placeholder="禁用天数">
                            <template slot="suffix">天</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitLockLogin">锁定登录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="解除禁止登录" name="unlock-login" v-if="canUnlock">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="禁止原因">
                        <el-input :value="enterpriseUser.user_login_pwd.lock_reason" maxlength="250" placeholder="禁止原因"
                                  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期">
                        <ql-date-picker :value="enterpriseUser.user_login_pwd.unlock_time" :disabled="true"
                                        type="datetime"></ql-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitUnlockLogin">解除禁止登录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';

    import enterpriseURL from '../../../api/url/enterprise';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'UserInfoDialog',
        components: {QlDatePicker},
        data: () => ({
            elVisible: false,

            activeName: '',
            enterpriseUser: {can_update_role: true, user_login_pwd: {}},
            password: {},
            lock: {},

            roles: [],
            selectedRoleIds: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            enterpriseUuid: {
                type: String,
                default: '',
            },
            uuid: {
                type: String,
                default: '',
            },
        },
        computed: {
            creating: function () {
                return !this.uuid;
            },
            canUnlock: function () {
                return this.enterpriseUser.can_lock && this.enterpriseUser.user_login_pwd.can_unlock;
            },
            canLock: function () {
                return this.enterpriseUser.can_lock && this.enterpriseUser.user_login_pwd.can_lock;
            },
            canUpdateRole: function () {
                return this.enterpriseUser.can_update_role;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['activeName', 'enterpriseUser', 'password', 'lock', 'roles', 'selectedRoleIds']);
                if (this.creating) {
                    this.activeName = 'create';
                    this.enterpriseUser.password = '123456';
                    this.fetchRole();
                } else {
                    this.activeName = 'update';
                    api.enterprise().get(helpers.convertURL(enterpriseURL.get_enterprise_user, {
                        userUUID: this.uuid
                    })).then(response => this.enterpriseUser = response.data).then(() => {
                        if (this.canUpdateRole) {
                            this.fetchRole();
                            this.fetchUserRole();
                        }
                    });
                }
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitCreate() {
                this.enterpriseUser.role_ids = this.selectedRoleIds;
                api.enterprise().post(helpers.convertURL(enterpriseURL.add_enterprise_user), this.enterpriseUser).then(response => {
                    this.$message({type: 'success', message: '管理员创建成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                this.enterpriseUser.role_ids = this.selectedRoleIds;
                console.log(this.uuid);
                api.enterprise().put(helpers.convertURL(enterpriseURL.update_enterprise_user, {
                    userUUID: this.uuid,
                }), this.enterpriseUser).then(response => {
                    this.$message({type: 'success', message: '管理员信息更新成功'});
                    this.onClose(true);
                });
            },
            submitResetPassword() {
                api.enterprise().patch(helpers.convertURL(enterpriseURL.reset_enterprise_user_password, {
                    userUUID: this.uuid
                }), this.password).then(response => {
                    this.$message({type: 'success', message: '重置管理员密码成功'});
                    this.onClose();
                });
            },
            submitLockLogin() {
                api.enterprise().patch(helpers.convertURL(enterpriseURL.enterprise_user_lock, {
                    enterpriseUUID: this.enterpriseUuid,
                    userUUID: this.uuid
                }), this.lock).then(response => {
                    this.$message({type: 'success', message: '禁止用户登录成功'});
                    this.onClose(true);
                });
            },
            submitUnlockLogin() {
                const message = '该管理员被禁止登录原因：' + this.enterpriseUser.user_login_pwd.lock_reason + ' <br/>'
                    + ' 解禁时间为：' + this.$options.filters.qlDateTime(this.enterpriseUser.user_login_pwd.unlock_time) + '，<br/>确定要提前解禁吗？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                }).then(() => {
                    return api.enterprise().patch(helpers.convertURL(enterpriseURL.enterprise_user_unlock, {
                        userUUID: this.uuid
                    }));
                }).then(response => {
                    this.$message({type: 'success', message: '解除禁止登录成功'});
                    this.onClose(true);
                }).catch(() => {
                });
            },
            fetchRole() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.role_list)).then(response => this.roles = response.data);
            },
            fetchUserRole() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_enterprise_user_role, {
                    userUUID: this.uuid
                })).then((response) => {
                    this.selectedRoleIds = _.map(response.data, 'role_id');
                });
            },
        },
    };
</script>
<style scoped>
</style>