<template>
    <el-dialog title="新增/编辑科目" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off">
            <el-form-item label="行业类型" required>
                <el-select v-model="dialogSupplierSubject.industry_type_code" style="width: 100%" v-if="creating">
                    <el-option v-for="item in industryTypes"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                </el-select>
                <el-input :value="dialogSupplierSubject.industry_type_name" disabled v-else></el-input>
            </el-form-item>
            <el-form-item label="科目名称" required>
                <el-input v-model="dialogSupplierSubject.supplier_subject_name" placeholder="请输入科目名称" maxlength="32"
                          v-if="creating"></el-input>
                <el-input :value="dialogSupplierSubject.supplier_subject_name" disabled v-else></el-input>
            </el-form-item>
            <el-form-item label="科目描述">
                <el-input v-model="dialogSupplierSubject.introduce" type="textarea" placeholder="请输入科目描述"
                          maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-checkbox v-model="dialogSupplierSubject.is_open">是否启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../../api';
    import helpers from '../../../../extends/helpers';
    import supplierURL from '../../../../api/url/supplier';

    export default {
        name: 'InfoDialog',
        components: {},
        data: () => ({
            elVisible: false,
            dialogSupplierSubject: {industry_type_code: '', is_open: true},
            industryTypes: helpers.cons('common.industry_type'),
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            supplierSubject: {
                type: Object,
                default: () => {
                    return {};
                }
            },
        },
        computed: {
            creating() {
                return !_.get(this.supplierSubject, 'supplier_subject_uuid');
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                if (!this.creating) {
                    this.dialogSupplierSubject = _.cloneDeep(this.supplierSubject);
                }
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['dialogSupplierSubject']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                if (this.creating) {
                    api.supplier().post(helpers.convertURL(supplierURL.add_supplier_subject), this.dialogSupplierSubject).then(() => {
                        this.$message({type: 'success', message: '科目新增成功'});
                        this.onClose(true);
                    });
                } else {
                    api.supplier().patch(helpers.convertURL(supplierURL.update_supplier_subject, {supplierSubjectUUID: this.supplierSubject.supplier_subject_uuid}), this.dialogSupplierSubject).then(() => {
                        this.$message({type: 'success', message: '科目编辑成功'});
                        this.onClose(true);
                    });
                }
            },
        },
    };
</script>
<style scoped>
</style>