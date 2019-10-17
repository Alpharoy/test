<template>
    <div class="flex-container">
        <el-tabs v-model="currentTabName" @tab-click="handleClick">
            <el-tab-pane label="角色管理" name="role">
                <div class="top-container">
                    <el-button type="primary" @click="infoDialogFunc(0)">创建角色</el-button>
                </div>
                <el-table :data="roles">
                    <el-table-column type="index" label="序号" width="50"/>
                    <el-table-column prop="name" label="角色名" width="200"/>
                    <el-table-column prop="description" label="角色简介" min-width="300"/>
                    <el-table-column label="最后修改时间" width="160">
                        <template slot-scope="scope">
                            {{scope.row.last_modified_time | qlDateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_user_name" label="创建人" width="100"/>
                    <el-table-column prop="update_user_name" label="修改人" width="100"/>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <template v-if="scope.row.can_modify">
                                <el-button type="text" @click="infoDialogFunc(scope.row.id)">编辑</el-button>
                                <el-button type="text" @click="deleteRole(scope.row.id)">删除</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="菜单管理" name="menu"></el-tab-pane>
        </el-tabs>

        <role-info-dialog :visible.sync="showRoleDialog" :id="dialogRoleId" :group="group"
                          @close="closeInfoDialogFunc"></role-info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import RoleInfoDialog from '../../../components/admin/permission/RoleInfoDialog';

    export default {
        name: 'RoleIndex',
        components: {RoleInfoDialog},
        mixins: mixins,
        data() {
            return {
                roles: [],
                group: 0,
                menuRouteName: '',
                currentTabName: '',

                showRoleDialog: false,
                dialogRoleId: 0,
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                this.restoreDataToDefault();
                this.currentTabName = 'role';
                const routeName = this.$route.name;
                if (routeName === 'admin-roles') {
                    this.group = 99;
                    this.menuRouteName = 'admin-menus';
                } else if (routeName === 'enterprise-roles') {
                    this.group = 10;
                    this.menuRouteName = 'enterprise-menus';
                } else if (routeName === 'supplier-roles') {
                    this.group = 20;
                    this.menuRouteName = 'supplier-menus';
                } else {
                    this.group = 0;
                    this.menuRouteName = '';
                }

                api.admin().get(this.convertURL(adminURL.role_list), {group: this.group}).then((response) => {
                    this.roles = response.data;
                });
            },
            deleteRole(id) {
                this.$confirm('删除将会影响所有拥有此角色用户的权限 是否继续?', '提示', {type: 'warning'}).then(() => {
                    return api.admin().delete(this.convertURL(adminURL.delete_role, {id: id}));
                }).then(() => {
                    this.$message({type: 'success', message: '删除角色成功'});
                    this.urFetchData();
                }).catch(() => {
                });
            },
            handleClick(tab) {
                const tabName = tab.name;
                if (tabName === 'role') {
                    return;
                }
                this.$router.replace({name: this.menuRouteName});
            },
            infoDialogFunc(roleId) {
                this.dialogRoleId = roleId;
                this.showRoleDialog = true;
            },
            closeInfoDialogFunc(refresh) {
                if (refresh) {
                    this.urFetchData();
                }
            }
        },
    };
</script>
<style scoped>
</style>