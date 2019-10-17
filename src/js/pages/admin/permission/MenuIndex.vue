<template>
    <div class="flex-container">
        <el-tabs v-model="currentTabName" @tab-click="handleClick">
            <el-tab-pane label="角色管理" name="role"></el-tab-pane>
            <el-tab-pane label="菜单管理" name="menu">
                <el-card class="box-card">
                    <el-tree :data="menuTree" :props="treeProps"
                             :highlight-current="true"
                             :default-expand-all="true"
                             :check-on-click-node="true"
                             :expand-on-click-node="false"
                             node-key="id"
                             ref="menuTree">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ data.name }}{{ data.description ? '（' + data.description + '）':'' }}</span>
                            <span v-if="data.id">
                                <el-button type="text" @click="infoDialogFunc(0, data.parent_id)">新增同级</el-button>
                                <el-button type="text" @click="infoDialogFunc(0, data.id)">新增下级</el-button>
                                <el-button type="text" @click="infoDialogFunc( data.id, null)">编辑</el-button>
                                <el-button type="text" @click="deleteMenu(data.id)"
                                           v-if="!data.children || data.children.length === 0">删除</el-button>
                            </span>
                            <span v-else>
                                <el-button type="text" @click="infoDialogFunc(0, null)">新增下级</el-button>
                            </span>
                        </span>
                    </el-tree>
                </el-card>
            </el-tab-pane>
        </el-tabs>

        <menu-info-dialog :visible.sync="showMenuDialog" :id="dialogMenuId"
                          :parent-id="dialogMenuParentId" :group="group"
                          @close="closeInfoDialogFunc"></menu-info-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import mixins from '../../../extends/mixins';
    import helpers from '../../../extends/helpers';
    import MenuInfoDialog from '../../../components/admin/permission/MenuInfoDialog';

    export default {
        name: 'MenuIndex',
        components: {MenuInfoDialog},
        mixins: mixins,
        data() {
            return {
                menuTree: [],
                treeProps: {
                    children: 'children',
                    label: 'name',
                },

                group: 0,
                roleRouteName: '',
                currentTabName: '',

                showMenuDialog: false,
                dialogMenuId: 0,
                dialogMenuParentId: 0,
            };
        },
        computed: {},
        methods: {
            urFetchData() {
                this.restoreDataToDefault();
                const routeName = this.$route.name;
                this.currentTabName = 'menu';
                if (routeName === 'admin-menus') {
                    this.group = 99;
                    this.roleRouteName = 'admin-roles';
                } else if (routeName === 'enterprise-menus') {
                    this.group = 10;
                    this.roleRouteName = 'enterprise-roles';
                } else if (routeName === 'supplier-menus') {
                    this.group = 20;
                    this.roleRouteName = 'supplier-roles';
                } else {
                    this.group = 0;
                    this.roleRouteName = '';
                }

                api.admin().get(this.convertURL(adminURL.menu_list), {group: this.group}).then((response) => {
                    this.tree(response.data);
                });
            },
            tree(menuList) {
                let root = {name: '全部', id: null, children: []};
                root.children = helpers.tree(menuList, null, 'id', 'parent_id', 'children');
                this.menuTree = [root];
            },
            deleteMenu(id) {
                this.$confirm('将删除此菜单, 是否继续?', '提示', {type: 'warning'}).then(() => {
                    return api.admin().delete(this.convertURL(adminURL.delete_menu, {id: id}));
                }).then(() => {
                    this.$message({type: 'success', message: '删除菜单成功'});
                    this.urFetchData();
                }).catch(() => {
                });
            },
            handleClick(tab) {
                const tabName = tab.name;
                if (tabName === 'menu') {
                    return;
                }
                this.$router.replace({name: this.roleRouteName});
            },
            infoDialogFunc(id = 0, parentId = null) {
                this.dialogMenuId = id;
                this.dialogMenuParentId = parentId;
                this.showMenuDialog = true;
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
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 20px;
    }
</style>