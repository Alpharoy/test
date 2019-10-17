<template>
    <el-dialog title="新增/编辑菜单" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs"
               width="1200px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off">
            <el-form-item label="父菜单" v-show="creating">
                <el-input :value="parentMenu.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称">
                <el-input v-model="menu.name" placeholder="菜单名称" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="菜单简介">
                <el-input v-model="menu.description" placeholder="菜单简介" maxlength="120"></el-input>
            </el-form-item>
            <el-form-item>
                <el-row :gutter="10">
                    <el-col :md="12" :lg="8" v-for="(nodeVersion, index) in nodeVersions" :key="index">
                        <el-card class="form-box-card">
                            <div slot="header" class="clearfix">
                                <span>允许权限（ {{ nodeVersion.name }}）</span>
                            </div>
                            <div class="form-box" style="height: 400px; overflow-y: auto;">
                                <el-tree :data="nodeVersion.nodeTree" :props="treeProps"
                                         :highlight-current="true"
                                         :check-on-click-node="true"
                                         :expand-on-click-node="false"
                                         node-key="id"
                                         show-checkbox
                                         :default-checked-keys="menuCheckedNodeIds"
                                         ref="nodeTrees"></el-tree>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
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
    import enterpriseURL from '../../../api/url/enterprise';

    export default {
        name: 'MenuInfoDialog',
        components: {},
        data: () => ({
            elVisible: false,

            menu: {
                allow_nodes: [],
            },
            parentMenu: {},

            treeProps: {
                children: 'children',
                label: 'name',
            },

            nodeVersions: [],

            menuCheckedNodeIds: [],
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
            parentId: {
                type: Number,
                default: null,
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
                helpers.restoreDataToDefault(this, ['menu', 'parentMenu', 'nodeVersions', 'menuCheckedNodeIds']);
                this.fetchNode();
                if (!this.creating) {
                    this.fetchMenu(this.id).then((response) => {
                        this.menu = response.data;
                        this.menuCheckedNodeIds = _.map(this.menu.allow_nodes, 'id');
                    });
                    return;
                }
                if (this.parentId) {
                    this.fetchMenu(this.parentId).then((response) => {
                        this.parentMenu = response.data;
                    });
                } else {
                    this.parentMenu = {name: '根节点'};
                }
                this.menu.parent_id = this.parentId;
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            fetchNode() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.node_list), {group: this.group}).then((response) => {
                    this.nodeTree(response.data);
                });
            },
            nodeTree(nodes) {
                let versions = [];
                _.forIn(nodes, (node) => {
                    if (_.filter(versions, {type: node.type}).length) {
                        return true;
                    }
                    let version = {
                        name: node.type_name,
                        type: node.type,
                        nodeTree: [],
                    };
                    versions.push(version);
                });

                _.forIn(versions, (version) => {
                    let versionNodes = _.filter(nodes, {type: version.type});

                    let parentNodes = [], chileNodes = {}, moduleName = {};
                    _.forIn(versionNodes, (node) => {
                        if (!moduleName[node.module_name]) {
                            parentNodes.push({
                                id: 'p_' + node.id,
                                name: node.module_name,
                                children: [],
                            });
                            moduleName[node.module_name] = true;
                        }

                        if (!_.isArray(chileNodes[node.module_name])) {
                            chileNodes[node.module_name] = [];
                        }
                        chileNodes[node.module_name].push({
                            id: node.id,
                            name: node.function_name + '（' + node.sign + '）',
                        });
                    });

                    _.forIn(parentNodes, (node) => {
                        node.children = _.isEmpty(chileNodes[node.name]) ? [] : chileNodes[node.name];
                    });

                    version.nodeTree = parentNodes;
                });
                this.nodeVersions = versions;
            },
            fetchMenu(menuId) {
                return api.enterprise().get(helpers.convertURL(enterpriseURL.get_menu, {id: menuId}));
            },
            submitFunc() {
                let nodes = [];
                _.forIn(this.$refs.nodeTrees, (nodeTree) => {
                    nodes = _.concat(nodes, nodeTree.getCheckedNodes());
                });
                nodes = _.filter(nodes, (node) => {
                    return _.isNumber(node.id);
                });
                this.menu.allow_nodes = nodes;
                if (this.creating) {
                    this.submitCreate();
                } else {
                    this.submitUpdate();
                }
            },
            submitCreate() {
                this.menu.group = this.group;
                api.enterprise().post(helpers.convertURL(enterpriseURL.add_menu), this.menu).then(response => {
                    this.$message({type: 'success', message: '菜单创建成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                api.enterprise().patch(helpers.convertURL(enterpriseURL.update_menu, {id: this.id}), this.menu).then(response => {
                    this.$message({type: 'success', message: '菜单更新成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
<style scoped>
</style>