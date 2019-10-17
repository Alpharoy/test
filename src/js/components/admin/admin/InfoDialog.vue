<template>
    <el-dialog title="编辑管理公司" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off">
            <el-form-item label="UUID">
                <el-input :value="admin.admin_uuid" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司名称">
                <el-input v-model="admin.admin_name" maxlength="32" placeholder="公司名称"></el-input>
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
    import adminURL from '../../../api/url/admin';
    import helpers from '../../../extends/helpers';

    export default {
        name: 'InfoDialog',
        components: {},
        data: () => ({
            elVisible: false,
            admin: {},
        }),
        props: {
            uuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        computed: {},
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['admin']);
                api.admin().get(helpers.convertURL(adminURL.get_admin, {adminUUID: this.uuid})).then(response => this.admin = response.data);
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                api.admin().put(helpers.convertURL(adminURL.update_admin, {adminUUID: this.uuid}), this.admin).then(response => {
                    this.$message({type: 'success', message: '管理公司信息更新成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
<style scoped>
</style>
