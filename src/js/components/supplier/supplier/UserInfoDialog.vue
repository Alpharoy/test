<template>
    <el-dialog title="" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog" append-to-body>
        <el-tabs v-model="activeName" v-if="creating">
            <el-tab-pane label="创建管理员" name="create">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="管理员姓名">
                        <el-input v-model="supplierUser.user_name" maxlength="10" placeholder="管理员姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号">
                        <el-input v-model="supplierUser.user_phone" maxlength="11"
                                  placeholder="手机号码（将以此为登录账号）"></el-input>
                    </el-form-item>

                    <el-form-item label="登录密码">
                        <el-input :value="supplierUser.password" placeholder="账户登录密码" :disabled="true"></el-input>
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
                        <el-input :value="supplierUser.user_uuid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员姓名">
                        <el-input v-model="supplierUser.user_name" maxlength="10" placeholder="管理员姓名"></el-input>
                    </el-form-item>

                    <el-form-item label="登录账号">
                        <el-input :value="supplierUser.user_phone" :disabled="true"></el-input>
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
        </el-tabs>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import supplierURL from '../../../api/url/supplier';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'UserInfoDialog',
        components: {QlDatePicker},
        data: () => ({
            elVisible: false,

            activeName: '',
            supplierUser: {can_update_role: true, user_login_pwd: {}},
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
            uuid: {
                type: String,
                default: '',
            },
        },
        computed: {
            creating: function () {
                return !this.uuid;
            },

            canUpdateRole: function () {
                return this.supplierUser.can_update_role;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['activeName', 'supplierUser', 'password', 'lock', 'roles', 'selectedRoleIds', 'suppliers', 'selectedSuppliers']);
                if (this.creating) {
                    this.activeName = 'create';
                    this.supplierUser.password = '123456';
                    this.fetchRole();
                } else {
                    this.activeName = 'update';
                    api.supplier().get(helpers.convertURL(supplierURL.get_supplier_user, {
                        supplierUUID: this.supplierUuid,
                        userUUID: this.uuid
                    })).then(response => this.supplierUser = response.data).then(() => {
                        if (this.canUpdateRole) {
                            this.fetchRole();
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
                this.supplierUser.role_ids = this.selectedRoleIds;
                api.supplier().post(helpers.convertURL(supplierURL.add_supplier_user), this.supplierUser).then(response => {
                    this.$message({type: 'success', message: '管理员创建成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                this.supplierUser.role_ids = this.selectedRoleIds;
                api.supplier().put(helpers.convertURL(supplierURL.update_supplier_user, {
                    userUUID: this.uuid
                }), this.supplierUser).then(response => {
                    this.$message({type: 'success', message: '管理员信息更新成功'});
                    this.onClose(true);
                });
            },
            submitResetPassword() {
                api.supplier().patch(helpers.convertURL(supplierURL.reset_supplier_user_password, {
                    userUUID: this.uuid
                }), this.password).then(response => {
                    this.$message({type: 'success', message: '重置管理员密码成功'});
                    this.onClose();
                });
            },
            submitLockLogin() {
                api.supplier().patch(helpers.convertURL(supplierURL.supplier_user_lock, {
                    userUUID: this.uuid
                }), this.lock).then(response => {
                    this.$message({type: 'success', message: '禁止用户登录成功'});
                    this.onClose(true);
                });
            },
            submitUnlockLogin() {
                const message = '该管理员被禁止登录原因：' + this.supplierUser.user_login_pwd.lock_reason + ' <br/>'
                    + ' 解禁时间为：' + this.$options.filters.qlDateTime(this.supplierUser.user_login_pwd.unlock_time) + '，<br/>确定要提前解禁吗？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                }).then(() => {
                    return api.supplier().patch(helpers.convertURL(supplierURL.supplier_user_unlock, {
                        userUUID: this.uuid
                    }));
                }).then(response => {
                    this.$message({type: 'success', message: '解除禁止登录成功'});
                    this.onClose(true);
                }).catch(() => {
                });
            },
            fetchRole() {
                api.supplier().get(helpers.convertURL(supplierURL.role_list)).then(response => this.roles = response.data);
            },
            fetchUserRole() {
                api.supplier().get(helpers.convertURL(supplierURL.get_supplier_user_role, {
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