<template>
    <el-dialog title="项目详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <el-form label-width="110px" auto-complete="off" :disabled="true">
            <el-col :span="8">
                <el-form-item label="项目名称">
                    <el-input :value="project.project_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="企业名称">
                    <el-input :value="project.enterprise_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="供应商">
                    <el-input :value="project.supplier_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合约编号">
                    <el-input :value="project.contract_no"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合约名称">
                    <el-input :value="project.contract_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="行业类型">
                    <el-input :value="project.industry_type_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目负责人">
                    <el-input :value="project.charge_person_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人电话">
                    <el-input :value="project.charge_person_phone_number"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="用工类型">
                    <el-input :value="project.employment_type_name"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label="项目地区">
                    <el-input :value="project.address_name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目地址">
                    <el-input :value="project.address_detail"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="服务费率(%)">
                    <ql-input-number :value="project.service_charge" :multiple="1/100"></ql-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="项目描述">
                    <el-input :value="project.introduce" type="textarea"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="">
                    <el-checkbox :value="project.is_auto_accept">自动接单</el-checkbox>
                    <el-checkbox :value="project.is_auto_complete">自动完成</el-checkbox>
                    <el-checkbox :value="project.is_open">是否启用</el-checkbox>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="project.attachment.length">
                <el-form-item label="附件">
                    <template v-for="attachment in project.attachment">
                        <a href="javascript:;" class="text-info" @click="onFilePreview(attachment)">{{attachment.name}}</a>
                        <br/>
                    </template>
                </el-form-item>
            </el-col>
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
    import QlInputNumber from '../../../components/QlInputNumber';

    export default {
        name: 'InfoDialog',
        components: {QlInputNumber},
        data: () => ({
            elVisible: false,
            project: {attachment: []},
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
                api.admin().get(helpers.convertURL(adminURL.get_project, {projectUUID: this.projectUuid})).then(response => {
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
        },
    };
</script>
