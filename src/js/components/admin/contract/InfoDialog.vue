<template>
    <el-dialog title="合约详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="900px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off" :disabled="true">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="供应商">
                        <el-input :value="contract.supplier_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="企业名称">
                        <el-input :value="contract.enterprise_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约名称">
                        <el-input :value="contract.contract_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约编码">
                        <el-input :value="contract.contract_no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约申请人">
                        <el-input :value="contract.applicant_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合约期限">
                        <ql-date-picker type="date" :value="contract.valid_time" style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="合约描述">
                        <el-input :value="contract.introduce" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="contract.attachment.length">
                    <el-form-item label="附件">
                        <template v-for="attachment in contract.attachment">
                            <a href="javascript:;" class="text-info" @click="onFilePreview(attachment)">{{attachment.name}}</a>
                            <br/>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import adminURL from '../../../api/url/admin';
    import helpers from '../../../extends/helpers';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'InfoDialog',
        components: {QlDatePicker},
        data: () => ({
            elVisible: false,
            contract: {attachment: []},
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
                api.admin().get(helpers.convertURL(adminURL.get_contract, {contractUUID: this.contractUuid})).then(response => {
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
        },
    };
</script>
