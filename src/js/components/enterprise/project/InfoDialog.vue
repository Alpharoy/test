<template>
    <el-dialog title="项目详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="项目名称" required>
                        <el-input v-model="project.project_name" maxlength="32" placeholder="请输入项目名称"
                                  :disabled="isAuditPassed"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商" required>
                        <el-select :value="project.supplier_name" style="width: 100%" value-key="contract_uuid"
                                   @change="contractChange" v-if="creating">
                            <el-option v-for="item in contracts"
                                       :key="item.contract_uuid"
                                       :label="item.supplier_name"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <el-input :value="project.supplier_name" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行业类型" required>
                        <el-select v-model="project.industry_type_code" style="width: 100%" v-if="!isAuditPassed">
                            <el-option v-for="item in industryTypes"
                                       :key="item.code"
                                       :label="item.name"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                        <el-input :value="project.industry_type_name" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目负责人" required>
                        <el-input v-model="project.charge_person_name" maxlength="16" placeholder="请输入项目负责人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="负责人电话" required>
                        <el-input v-model="project.charge_person_phone_number" maxlength="11"
                                  placeholder="请输入项目负责人电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用工类型" required>
                        <el-select v-model="project.employment_type_code" style="width: 100%" :disabled="isAuditPassed">
                            <el-option v-for="item in employeeTypes"
                                       :key="item.code"
                                       :label="item.name"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目地区">
                        <ur-area-cascader v-model="project.address_code" select-any-level clearable></ur-area-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="详细地址">
                        <el-input v-model="project.address_detail" maxlength="255"
                                  placeholder="请输入项目地区详细地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务费率(%)">
                        <ql-input-number :value="project.service_charge" :multiple="1/100" disabled
                                         placeholder="由供应商设置" nullable></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同编号">
                        <el-input :value="project.contract_no" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同名称">
                        <el-input :value="project.contract_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目描述">
                        <el-input v-model="project.introduce" type="textarea" maxlength="255"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <ur-file-upload ref="upload" :file-list="fileList" :limit="5" @onRemove="onFileRemove"
                                        @onSuccess="onFileUploadSuccess" @onPreview="onFilePreview">
                            <el-button type="text" slot="trigger">添加附件</el-button>
                        </ur-file-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox v-model="project.is_auto_accept" :disabled="isAuditPassed">自动接单</el-checkbox>
                        <el-checkbox v-model="project.is_auto_complete" :disabled="isAuditPassed">自动完成</el-checkbox>
                        <el-checkbox v-model="project.is_open">是否启用</el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>


        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitCreate" v-if="creating">创建</el-button>
            <el-button type="primary" @click="submitUpdate" v-else>更新</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import helpers from '../../../extends/helpers';
    import UrFileUpload from '../../UrFileUpload';
    import UrAreaCascader from '../../../components/UrAreaCascader';
    import QlInputNumber from '../../QlInputNumber';

    export default {
        name: 'InfoDialog',
        components: {QlInputNumber, UrFileUpload, UrAreaCascader},
        data: () => ({
            elVisible: false,
            project: {
                contract_uuid: '',
                contract_no: '',
                contract_name: '',

                supplier_uuid: '',
                supplier_name: '',

                attachment: [],
                industry_type_code: '',
                employment_type_code: '',

                is_auto_accept: true,
                is_auto_complete: true,
                is_open: true,

                is_audit_passed: false,
            },

            industryTypes: [],
            employeeTypes: helpers.cons('common.employee_type'),

            fileList: [],
            contracts: [],
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
        computed: {
            creating() {
                return !this.projectUuid;
            },
            isAuditPassed() {
                return this.project.is_audit_passed;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                if (this.creating) {
                    this.fetchContract();
                    return;
                }
                this.fetchProject();
            },
            fetchProject() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_project, {projectUUID: this.projectUuid})).then(response => {
                    this.project = response.data;
                    if (this.project.attachment.length) {
                        this.fileList = _.map(this.project.attachment, (attachment) => {
                            return {
                                name: attachment.name,
                                code: attachment.code,
                                url: helpers.getFileURL(attachment.code),
                            };
                        });
                    }
                });
            },
            fetchContract() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.contract_list), {
                    audit_status: 99,
                    is_valid: 1,
                }).then(response => {
                    this.contracts = response.data;
                });
            },
            contractChange(contract) {
                const fillKey = ['contract_uuid', 'contract_no', 'contract_name', 'supplier_uuid', 'supplier_name'];
                _.forIn(fillKey, (key) => {
                    this.project[key] = _.get(contract, key, '');
                });
                this.fetchSupplierSubject(_.get(contract, 'supplier_uuid', null));
            },
            fetchSupplierSubject(supplierUUID) {
                this.industryTypes = [];
                if (!supplierUUID) {
                    return;
                }
                api.enterprise().get(helpers.convertURL(enterpriseURL.supplier_subject_list), {supplier_uuid: supplierUUID}).then((response) => {
                    this.industryTypes = _.uniqBy(_.map(response.data, (supplierSubject) => {
                        return {code: supplierSubject.industry_type_code, name: supplierSubject.industry_type_name}
                    }), 'code');
                });
            },
            onClose(refresh = false) {
                // 避免打开时，看到部分展示的动画，故还原数据在此进行
                helpers.restoreDataToDefault(this, ['project', 'fileList', 'contracts', 'industryTypes']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitCreate() {
                this.projectPermission();
                api.enterprise().post(helpers.convertURL(enterpriseURL.add_project), this.project).then(response => {
                    this.$message({type: 'success', message: '创建项目成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                this.projectPermission();
                api.enterprise().put(helpers.convertURL(enterpriseURL.update_project, {projectUUID: this.projectUuid}), this.project).then(response => {
                    this.$message({type: 'success', message: '项目更新成功'});
                    this.onClose(true);
                });
            },
            onFileRemove(file, fileList) {
                this.project.attachment = _.map(fileList, (file) => {
                    // 来自刚上传的文件
                    if (file.response) {
                        return {code: file.response[0]['file_code'], name: file.response[0]['file_name']}
                    }
                    return {name: file.name, code: file.code};
                });
            },
            onFileUploadSuccess(response, file, fileList) {
                this.project.attachment.push({code: response[0]['file_code'], name: response[0]['file_name']});
            },
            onFilePreview(file) {
                return helpers.downloadFile(file.code, file.name);
            },
            projectPermission() {
                let permission = 0;
                if (this.project.is_auto_accept) {
                    permission = permission | 1;
                }
                if (this.project.is_auto_complete) {
                    permission = permission | 2;
                }
                this.project.permission = permission;
            },
        },
    };
</script>
