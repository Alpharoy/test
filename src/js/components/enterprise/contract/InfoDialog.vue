<template>
    <el-dialog title="合约详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="900px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off" :disabled="!contract.can_update">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="供应商">
                        <el-input v-model="contract.supplier_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约名称" required>
                        <el-input v-model="contract.contract_name" placeholder="请输入合约名称" maxlength="32"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约编码" required>
                        <el-input v-model="contract.contract_no" placeholder="请输入合约编码" maxlength="32"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约申请人" required>
                        <el-input v-model="contract.applicant_name" placeholder="请输入合约申请人" maxlength="32"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约期限" required>
                        <ql-date-picker type="date" v-model="contract.valid_time" style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="合约描述">
                        <el-input v-model="contract.introduce" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <ur-file-upload ref="upload" :file-list="fileList" :limit="5" @onRemove="onFileRemove"
                                        @onSuccess="onFileUploadSuccess" @onPreview="onFilePreview"
                                        :disabled="!contract.can_update">
                            <el-button type="text" slot="trigger">添加附件</el-button>
                        </ur-file-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc" v-if="contract.can_update">签约</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import helpers from '../../../extends/helpers';
    import UrFileUpload from '../../UrFileUpload';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'InfoDialog',
        components: {UrFileUpload, QlDatePicker},
        data: () => ({
            elVisible: false,
            contract: {supplier_name: '', attachment: [], can_update: true},
            fileList: [],
        }),
        props: {
            contractUuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
            supplier: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        computed: {
            creating() {
                return !this.contractUuid;
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
                    // 获取合约信息
                    api.enterprise().get(helpers.convertURL(enterpriseURL.get_contract, {contractUUID: this.contractUuid})).then(response => {
                        this.contract = response.data;
                        if (this.contract.attachment.length) {
                            this.fileList = _.map(this.contract.attachment, (attachment) => {
                                return {
                                    name: attachment.name,
                                    code: attachment.code,
                                    url: helpers.getFileURL(attachment.code),
                                };
                            });
                        }
                    });
                } else {
                    // 如果有传过来的供应商信息，则合约就用传过来的供应商信息
                    if (!_.isEmpty(this.supplier)) {
                        this.contract.supplier_uuid = this.supplier.supplier_uuid;
                        this.contract.supplier_name = this.supplier.supplier_name;
                    }
                }
            },
            onFileRemove(file, fileList) {
                this.contract.attachment = _.map(fileList, (file) => {
                    // 来自刚上传的文件
                    if (file.response) {
                        return {code: file.response[0]['file_code'], name: file.response[0]['file_name']}
                    }
                    return {name: file.name, code: file.code};
                });
            },
            onFileUploadSuccess(response, file, fileList) {
                this.contract.attachment.push({code: response[0]['file_code'], name: response[0]['file_name']});
            },
            onFilePreview(file) {
                return helpers.downloadFile(file.code, file.name);
            },
            onClose(refresh = false) {
                // 避免打开时，看到部分展示的动画，故还原数据在此进行
                helpers.restoreDataToDefault(this, ['contract', 'fileList']);
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
                api.enterprise().post(helpers.convertURL(enterpriseURL.add_contract), this.contract).then(response => {
                    this.$message({type: 'success', message: '合约申请成功'});
                    this.onClose(true);
                });
            },
            submitUpdate() {
                api.enterprise().put(helpers.convertURL(enterpriseURL.update_contract, {contractUUID: this.contractUuid}), this.contract).then(response => {
                    this.$message({type: 'success', message: '合约更新成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
