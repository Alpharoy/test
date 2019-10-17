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
    import adminURL from '../../../api/url/admin';
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
            supplierUuid: {
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
                    api.admin().get(helpers.convertURL(adminURL.get_supplier_user, {
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
                api.admin().post(helpers.convertURL(adminURL.add_supplier_user, {supplierUUID: this.supplierUuid}), this.supplierUser).then(response => {
                    this.$message({type: 'success', message: '管理员创建成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                this.supplierUser.role_ids = this.selectedRoleIds;
                this.supplierUser.supplier_uuid = this.supplierUuid;
                api.admin().put(helpers.convertURL(adminURL.update_supplier_user, {
                    userUUID: this.uuid,
                    supplierUUID: this.supplierUuid
                }), this.supplierUser).then(response => {
                    this.$message({type: 'success', message: '管理员信息更新成功'});
                    this.onClose(true);
                });
            },
            fetchRole() {
                api.admin().get(helpers.convertURL(adminURL.role_list), {group: 20}).then(response => this.roles = response.data);
            },
        },
    };
</script>
<style scoped>
</style>