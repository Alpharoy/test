<template>
    <el-dialog title="任务订单详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               top="60px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off" disabled>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="任务编号">
                        <el-input :value="task.task_uuid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务名称">
                        <el-input :value="task.task_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="录单时间">
                        <ql-date-picker type="datetime" :value="task.record_time" style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input :value="task.contact_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input :value="task.contact_phone_number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务地址">
                        <el-input :value="task.address_full"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始时间">
                        <ql-date-picker type="datetime" :value="task.start_time" style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间">
                        <ql-date-picker type="datetime" :value="task.end_time" style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务描述">
                        <el-input :value="task.introduce" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="项目">
                        <el-input :value="task.project_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商">
                        <el-input :value="task.supplier_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="企业">
                        <el-input :value="task.enterprise_name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="">
                        <el-checkbox :value="task.is_auto_accept">自动接单</el-checkbox>
                        <el-checkbox :value="task.is_auto_complete">自动完成</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行业类型">
                        <el-input :value="task.industry_type_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="科目">
                        <el-input :value="task.supplier_subject_name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="订单费用">
                        <ql-input-number :value="task.task_fees" :multiple="1/100" :precision="2"
                                         nullable></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务费用">
                        <ql-input-number :value="task.service_charge_fees" :multiple="1/100"
                                         :precision="2" nullable></ql-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="总费用">
                        <ql-input-number :value="task.total_fees" :multiple="1/100"
                                         :precision="2" nullable></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付状态">
                        <el-input :value="task.pay_status_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付时间">
                        <ql-date-picker type="datetime" :value="task.fee_pay_time"
                                        style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="接单费用">
                        <ql-input-number :value="task.task_fees" :multiple="1/100" :precision="2"
                                         nullable></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付状态">
                        <el-input :value="task.handler_pay_status_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付时间">
                        <ql-date-picker type="datetime" :value="task.handler_pay_time"
                                        style="width: 100%"></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="接单人">
                        <el-input :value="task.handler_object_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码">
                        <el-input :value="task.handler_object_phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="证件号码">
                        <el-input :value="task.handler_object_certificate_number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="银行卡号">
                        <el-input :value="task.handler_object_card_number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="银行名称">
                        <el-input :value="task.handler_object_bank_name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="状态">
                        <el-input :value="task.status_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来源">
                        <el-input :value="task.source_from_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来源单号">
                        <el-input :value="task.source_from_uuid"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="图片">
                        <picture-upload class="picture-upload" :file-list="taskPictures" disabled
                                        v-if="taskPictures.length"></picture-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <template v-for="attachment in task.attachment">
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
    import helpers from '../../../extends/helpers';

    import adminURL from '../../../api/url/admin';
    import QlDatePicker from '../../QlDatePicker';
    import QlInputNumber from '../../QlInputNumber';
    import PictureUpload from '../../PictureUpload';

    export default {
        name: 'InfoDialog',
        components: {PictureUpload, QlInputNumber, QlDatePicker},
        data: () => ({
            elVisible: false,
            task: {},
            taskPictures: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            taskUuid: {
                type: String,
                default: null,
            },
        },
        computed: {
            taskUUID() {
                return this.taskUuid;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                api.admin().get(helpers.convertURL(adminURL.get_task, {taskUUID: this.taskUUID})).then((response) => {
                    this.task = response.data;
                    this.taskPictures = _.map(this.task.pictures, (pictureCode) => {
                        return {
                            name: pictureCode,
                            code: pictureCode,
                            url: helpers.getImageURL(pictureCode)
                        }
                    });
                });
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['task', 'taskPictures']);
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
<style scoped>
</style>