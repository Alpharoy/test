<template>
    <el-dialog title="新增/编辑角色" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off">
            <el-form-item label="角色名称">
                <el-input v-model="role.name" placeholder="角色名称" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="角色简介">
                <el-input v-model="role.description" placeholder="角色简介" maxlength="250"></el-input>
            </el-form-item>
            <el-form-item label="菜单选择" style="height: 400px; overflow-y: auto;">
                <el-tree :data="menuTree" :props="treeProps"
                         :highlight-current="true"
                         :default-expand-all="true"
                         :check-on-click-node="true"
                         :expand-on-click-node="false"
                         node-key="id"
                         show-checkbox
                         :default-checked-keys="role.menu_ids"
                         ref="menuTree">
                </el-tree>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import adminURL from '../../../api/url/admin';

    export default {
        name: 'RoleInfoDialog',
        components: {},
        data: () => ({
            role: {
                menu_ids: []
            },
            menuTree: [],
            treeProps: {
                children: 'children',
                label: 'name',
            },
            elVisible: false,
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            id: {
                type: Number,
                default: 0,
            },
            group: {
                type: Number,
                default: 0,
            },
        },
        computed: {
            creating() {
                return !this.id;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['role', 'menuTree']);
                this.fetchMenu();
                if (this.creating) {
                    return;
                }
                this.fetchRole();
            },
            fetchMenu() {
                api.admin().get(helpers.convertURL(adminURL.menu_list), {group: this.group}).then((response) => {
                    let root = {name: '全部', id: null, children: []};
                    root.children = helpers.tree(response.data, null, 'id', 'parent_id', 'children');
                    this.menuTree = [root];
                });
            },
            fetchRole() {
                api.admin().get(helpers.convertURL(adminURL.get_role, {id: this.id})).then((response) => {
                    this.role = response.data;
                });
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                if (this.creating) {
                    this.submitCreate();
                } else {
                    this.submitUpdate();
                }
            },
            submitCreate() {
                this.role.group = this.group;
                this.role.menu_ids = this.$refs.menuTree.getCheckedKeys();
                api.admin().post(helpers.convertURL(adminURL.add_role), this.role).then(response => {
                    this.$message({type: 'success', message: '角色创建成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                this.role.menu_ids = this.$refs.menuTree.getCheckedKeys();
                api.admin().patch(helpers.convertURL(adminURL.update_role, {id: this.id}), this.role).then(response => {
                    this.$message({type: 'success', message: '角色更新成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
<style scoped>
</style>