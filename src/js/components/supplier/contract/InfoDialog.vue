<template>
    <el-dialog title="合约详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="900px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off" :disabled="true">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>合约信息</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合约编码">
                            <el-input :value="contract.contract_no"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合约名称">
                            <el-input :value="contract.contract_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合约期限">
                            <ql-date-picker type="date" :value="contract.valid_time"
                                            style="width: 100%"></ql-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="contract.attachment.length">
                        <el-form-item label="附件">
                            <template v-for="attachment in contract.attachment">
                                <a href="javascript:;" class="text-info" @click="onFilePreview(attachment)">{{attachment.name}}</a>
                                <br/>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>企业信息</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业名称">
                            <el-input :value="contract.enterprise.enterprise_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="统一信用代码">
                            <el-input :value="contract.enterprise.usci_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法人">
                            <el-input :value="contract.enterprise.artificial_person_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业联系人">
                            <el-input :value="contract.enterprise.contact_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式">
                            <el-input :value="contract.enterprise.contact_phone_number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">关闭</el-button>
            <el-button type="primary" @click="auditPassedFunc" v-if="contract.can_audit_passed">审核通过
            </el-button>
            <el-button type="danger" @click="auditFailedFunc" v-if="contract.can_audit_failed">审核不通过
            </el-button>
            <el-button type="warning" @click="reverseAuditFunc" v-if="contract.can_reverse_audit">撤销审核
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import supplierURL from '../../../api/url/supplier';
    import helpers from '../../../extends/helpers';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'InfoDialog',
        components: {QlDatePicker},
        data: () => ({
            elVisible: false,
            contract: {attachment: [], enterprise: {}},
        }),
        props: {
            contractUuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                helpers.restoreDataToDefault(this, ['contract']);
                api.supplier().get(helpers.convertURL(supplierURL.get_contract, {contractUUID: this.contractUuid})).then(response => {
                    this.contract = response.data;
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
                this.$confirm('将审核合约成功，审核完成后不能撤销', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(99);
                }).catch(() => {
                });
            },
            auditFailedFunc() {
                this.$confirm('将审核合约状态为失败，确定吗？', '提示', {type: 'warning'}).then(() => {
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
                api.supplier().post(helpers.convertURL(supplierURL.contract_audit_status, {contractUUID: this.contractUuid}), {
                    audit_status: auditStatus
                }).then(() => {
                    this.$message({type: 'success', message: '审核合约完成'});
                    this.onClose(true);
                })
            },
        },
    };
</script>
