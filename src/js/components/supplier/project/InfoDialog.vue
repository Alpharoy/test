<template>
    <el-dialog title="项目详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off">
            <el-col :span="8">
                <el-form-item label="项目名称">
                    <el-input :value="project.project_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="企业名称">
                    <el-input :value="project.enterprise_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="供应商">
                    <el-input :value="project.supplier_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合约编号">
                    <el-input :value="project.contract_no" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合约名称">
                    <el-input :value="project.contract_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="行业类型">
                    <el-input :value="project.industry_type_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目负责人">
                    <el-input :value="project.charge_person_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人电话">
                    <el-input :value="project.charge_person_phone_number" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="用工类型">
                    <el-input :value="project.employment_type_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目地区">
                    <el-input :value="project.address_name" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目地址">
                    <el-input :value="project.address_detail" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="服务费率(%)">
                    <ql-input-number v-model="project.service_charge" :multiple="1/100"></ql-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="项目描述">
                    <el-input :value="project.introduce" type="textarea" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="">
                    <el-checkbox :value="project.is_auto_accept" disabled>自动接单</el-checkbox>
                    <el-checkbox :value="project.is_auto_complete" disabled>自动完成</el-checkbox>
                    <el-checkbox :value="project.is_open" disabled>是否启用</el-checkbox>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="project.attachment.length">
                <el-form-item label="附件">
                    <template v-for="attachment in project.attachment">
                        <a href="javascript:;" class="text-info"
                           @click="onFilePreview(attachment)">{{attachment.name}}</a>
                        <br/>
                    </template>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">关闭</el-button>
            <el-button type="primary" @click="auditPassedFunc" v-if="project.can_audit_passed">审核通过
            </el-button>
            <el-button type="danger" @click="auditFailedFunc" v-if="project.can_audit_failed">审核不通过
            </el-button>
            <el-button type="warning" @click="reverseAuditFunc" v-if="project.can_reverse_audit">撤销审核
            </el-button>
            <el-button type="primary" @click="updateServiceChargeFunc" v-if="project.can_update_service_charge">修改服务费率
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import helpers from '../../../extends/helpers';
    import QlInputNumber from '../../../components/QlInputNumber';

    export default {
        name: 'InfoDialog',
        components: {QlInputNumber},
        data: () => ({
            elVisible: false,
            project: {attachment: [], service_charge: 0},
        }),
        props: {
            projectUuid: {
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
                helpers.restoreDataToDefault(this, ['project']);
                api.supplier().get(helpers.convertURL(supplierURL.get_project, {projectUUID: this.projectUuid})).then(response => {
                    this.project = response.data;
                });
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            onFilePreview(file) {
                return helpers.downloadFile(file.code, file.name);
            },
            auditPassedFunc() {
                this.$confirm('将审核项目成功，审核完成后不能撤销', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(99);
                }).catch(() => {
                });
            },
            auditFailedFunc() {
                this.$confirm('将审核项目状态为失败，确定吗？', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(80);
                }).catch(() => {
                });
            },
            reverseAuditFunc() {
                this.$confirm('将撤销审核状态，撤销完成后可继续审核', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(10);
                }).catch(() => {
                });
            },
            auditFunc(auditStatus) {
                api.supplier().post(helpers.convertURL(supplierURL.project_audit_status, {projectUUID: this.projectUuid}), {
                    audit_status: auditStatus,
                    service_charge: this.project.service_charge
                }).then(() => {
                    this.$message({type: 'success', message: '审核项目完成'});
                    this.onClose(true);
                });
            },
            updateServiceChargeFunc() {
                api.supplier().put(helpers.convertURL(supplierURL.update_project, {projectUUID: this.projectUuid}), {
                    service_charge: this.project.service_charge
                }).then(() => {
                    this.$message({type: 'success', message: '修改服务费率成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
